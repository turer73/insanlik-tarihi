"""Compare the same 730 half-daily 2021 RAPID records in five official releases.

Usage: python scripts/audit-rapid-release-chain.py OLD.ascii 2023.1.ascii \
       2023.1a.nc 2024.1.ascii 2024.1a.ascii

The v2023.1a NetCDF and v2024.1 ASCII files come from the BODC DOI archives.
Requires h5py; this research script is not part of the site build.
"""

from datetime import datetime, timedelta
from hashlib import sha256
from math import fsum
from pathlib import Path
import sys

try:
    import h5py
except ImportError as error:
    raise SystemExit("h5py is required to read the v2023.1a NetCDF file") from error


NAMES = ("t_gs10", "t_ek10", "t_umo10", "moc_mar_hc10")
RELEASES = (
    ("v2022.1", "619313d25295d4f1f492cd163904fa1a9fb6627c37b561978ec0638b807cc41b"),
    ("v2023.1", "fff4022d10b0239b482a99fd7b46bdb3db1d57b3e1d0b73a4456dea1184dd8a0"),
    ("v2023.1a", "1927f0e4b558f3bd15b272b8315737cbf415360c4e89cdfd0e9cbeb74aec23e0"),
    ("v2024.1", "847c169cba6b2461a2ca33870b7c06d6c9073ac389b333006abc6709437b08ac"),
    ("v2024.1a", "847c169cba6b2461a2ca33870b7c06d6c9073ac389b333006abc6709437b08ac"),
)


def read_ascii(path):
    rows = {}
    for line in path.read_text("ascii").splitlines():
        fields = list(map(float, line.split()))
        if len(fields) != 14 or int(fields[1]) != 2021:
            continue
        key = fields[0]
        values = tuple(fields[index] for index in range(10, 14))
        if key in rows or -99999 in values:
            raise ValueError(f"Duplicate or missing 2021 ASCII sample: {key}")
        rows[key] = values
    return rows


def read_netcdf(path):
    rows = {}
    with h5py.File(path) as file:
        if file.attrs["version"] != b"v2023.1a":
            raise ValueError("Unexpected NetCDF version")
        if b"33826d6e-801c-b0a7-e063-7086abc0b9db" not in file.attrs["DOI"]:
            raise ValueError("Unexpected NetCDF DOI")
        if file["time"].attrs["units"] != b"days since 2004-4-1 00:00:00":
            raise ValueError("Unexpected NetCDF time coordinate")
        times = file["time"][:]
        columns = [file[name][:] for name in NAMES]
        if any(len(column) != len(times) for column in columns):
            raise ValueError("NetCDF column length mismatch")
        origin = datetime(2004, 4, 1)
        for index, day in enumerate(times):
            if (origin + timedelta(days=float(day))).year != 2021:
                continue
            key = float(day)
            values = tuple(float(column[index]) for column in columns)
            if key in rows or -99999 in values:
                raise ValueError(f"Duplicate or missing 2021 NetCDF sample: {key}")
            rows[key] = values
    return rows


def main(paths):
    if len(paths) != len(RELEASES):
        raise SystemExit(__doc__)
    paths = tuple(map(Path, paths))
    series = {}
    for (label, expected), path in zip(RELEASES, paths):
        actual = sha256(path.read_bytes()).hexdigest()
        if actual != expected:
            raise ValueError(f"{label} SHA-256 mismatch: {actual}")
        rows = read_netcdf(path) if label == "v2023.1a" else read_ascii(path)
        if len(rows) != 730:
            raise ValueError(f"{label} has {len(rows)} valid 2021 samples; expected 730")
        series[label] = rows
        print(label, "MOC", f"{fsum(row[3] for row in rows.values()) / 730:.6f}", "Sv")

    labels = [label for label, _ in RELEASES]
    if any(series[labels[0]].keys() != series[label].keys() for label in labels[1:]):
        raise ValueError("2021 timestamps do not match across all releases")
    if paths[3].read_bytes() != paths[4].read_bytes():
        raise ValueError("v2024.1 and v2024.1a transport ASCII files differ")

    for older, newer in zip(labels, labels[1:]):
        print(f"{older} -> {newer}")
        for index, name in enumerate(NAMES):
            differences = [series[newer][key][index] - old[index]
                           for key, old in series[older].items()]
            maximum = max(map(abs, differences))
            if older == "v2023.1" and maximum > 5.1e-7:
                raise ValueError(f"{name} changed beyond ASCII rounding at v2023.1a")
            print(" ", name, f"{fsum(differences) / 730:+.6f}",
                  "Sv; maximum sample difference", f"{maximum:.9f}", "Sv")
    print("Calendar-year sample means only; no trend or causal attribution computed.")


if __name__ == "__main__":
    main(sys.argv[1:])
