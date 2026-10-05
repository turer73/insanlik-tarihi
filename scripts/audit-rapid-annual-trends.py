"""Audit annual RAPID trend point estimates and two HAC sensitivity intervals.

Usage: python scripts/audit-rapid-annual-trends.py v2022.1.ascii v2024.1a.ascii
Requires numpy, scipy and statsmodels. This research script is not a site build
dependency. Output is JSON; redirect it to retain the complete calculation.

Annual means are equally weighted in an intercept-plus-year OLS regression.
HAC uses Bartlett lags 1 and 2, n/(n-2) correction and Student t with n-2 df.
These diagnostic intervals do not include sensor, infill or release uncertainty
and are not a reproduction of Lee et al.'s climate-model attribution analysis.
"""

import calendar
from datetime import datetime, timedelta
from hashlib import sha256
import json
from math import fsum, isclose, isfinite, sqrt
from pathlib import Path
import sys

import numpy as np
import scipy
from scipy.stats import t
import statsmodels
from statsmodels.regression.linear_model import OLS


RELEASES = (
    ("v2022.1", 2021, "619313d25295d4f1f492cd163904fa1a9fb6627c37b561978ec0638b807cc41b"),
    ("v2024.1a", 2023, "847c169cba6b2461a2ca33870b7c06d6c9073ac389b333006abc6709437b08ac"),
)
ORIGIN = datetime(2004, 4, 1)
WINDOWS = ((2005, 2021), (2007, 2021), (2011, 2021), (2011, 2023))


def read_release(path, last_year, expected_hash):
    raw = path.read_bytes()
    actual_hash = sha256(raw).hexdigest()
    if actual_hash != expected_hash:
        raise ValueError(f"Unexpected release SHA-256: {actual_hash}")
    rows = {}
    previous = None
    for line in raw.decode("ascii").splitlines():
        values = list(map(float, line.split()))
        if len(values) != 14 or not all(map(isfinite, values)):
            raise ValueError("Invalid ASCII row")
        stamp = datetime(*(int(value) for value in values[1:5]))
        if any(value != int(value) for value in values[1:5]):
            raise ValueError("Non-integer calendar coordinate")
        if ORIGIN + timedelta(days=values[0]) != stamp:
            raise ValueError("Calendar and serial time coordinates disagree")
        if previous is not None and stamp - previous != timedelta(hours=12):
            raise ValueError("Series is not a strictly increasing half-daily grid")
        previous = stamp
        if not 2005 <= stamp.year <= last_year:
            continue
        if stamp in rows or values[13] == -99999:
            raise ValueError("Duplicate or missing MOC sample in a complete year")
        rows[stamp] = values[13]
    annual = {}
    for year in range(2005, last_year + 1):
        count = 732 if calendar.isleap(year) else 730
        stamps = [datetime(year, 1, 1) + timedelta(hours=12 * i) for i in range(count)]
        if any(stamp not in rows for stamp in stamps):
            raise ValueError(f"Incomplete calendar year: {year}")
        annual[year] = {"samples": count, "mean_sv": fsum(rows[stamp] for stamp in stamps) / count}
    return rows, annual


def annual_fit(annual, start, end):
    years = list(range(start, end + 1))
    x = np.array(years, dtype=float)
    x -= x.mean()
    y = np.array([annual[year]["mean_sv"] for year in years])
    fit = OLS(y, np.column_stack((np.ones(len(x)), x))).fit()
    ssx = fsum(value * value for value in x)
    manual_slope = fsum(dx * (value - fsum(y) / len(y)) for dx, value in zip(x, y)) / ssx
    if not isclose(manual_slope, float(fit.params[1]), abs_tol=1e-12):
        raise ValueError("Centered-sum and statsmodels OLS slopes disagree")
    result = {
        "start": start,
        "end": end,
        "annual_samples": len(x),
        "slope_sv_per_decade": float(fit.params[1]) * 10,
        "ols_iid_interval_95_sv_per_decade": (fit.conf_int(alpha=0.05)[1] * 10).tolist(),
        "ols_iid_p_two_sided": float(fit.pvalues[1]),
        "hac": {},
    }
    for lag in (1, 2):
        robust = fit.get_robustcov_results(cov_type="HAC", maxlags=lag,
                                          kernel="bartlett", use_correction=True, use_t=True)
        z = x * fit.resid
        meat = fsum(value * value for value in z)
        for distance in range(1, lag + 1):
            weight = 1 - distance / (lag + 1)
            meat += 2 * weight * fsum(z[i] * z[i - distance] for i in range(distance, len(z)))
        manual_se = sqrt(meat * len(x) / (len(x) - 2)) / ssx
        if not isclose(manual_se, float(robust.bse[1]), rel_tol=1e-10, abs_tol=1e-12):
            raise ValueError("Manual Bartlett HAC and statsmodels standard errors disagree")
        critical = float(t.ppf(0.975, len(x) - 2))
        manual_interval = np.array([manual_slope - critical * manual_se,
                                    manual_slope + critical * manual_se])
        if not np.allclose(manual_interval, robust.conf_int(alpha=0.05)[1], rtol=1e-10, atol=1e-12):
            raise ValueError("Manual Student-t and statsmodels intervals disagree")
        result["hac"][str(lag)] = {
            "standard_error_sv_per_decade": float(robust.bse[1]) * 10,
            "interval_95_sv_per_decade": (robust.conf_int(alpha=0.05)[1] * 10).tolist(),
            "p_two_sided": float(robust.pvalues[1]),
        }
    return result


def main(paths):
    if len(paths) != 2:
        raise SystemExit(__doc__)
    output = {
        "method": "equal-calendar-year means; intercept-plus-year OLS; Bartlett HAC lags 1/2; small-sample correction; Student t, n-2 df",
        "limitations": "HAC intervals are small-sample diagnostics, not total measurement/release uncertainty or attribution; 2004/2024 partial years excluded",
        "software": {"numpy": np.__version__, "scipy": scipy.__version__, "statsmodels": statsmodels.__version__},
        "releases": {},
    }
    time_series = []
    for (name, last_year, digest), filename in zip(RELEASES, paths):
        rows, annual = read_release(Path(filename), last_year, digest)
        time_series.append(rows)
        output["releases"][name] = {
            "sha256": digest,
            "calendar_years": annual,
            "trends": [annual_fit(annual, start, end) for start, end in WINDOWS if end <= last_year],
        }
    old, current = time_series
    if not set(old).issubset(current):
        raise ValueError("Old-release calendar timestamps absent from current release")
    output["matching_2005_2021_timestamps"] = len(old)
    for fit, expected in zip(output["releases"]["v2022.1"]["trends"], (-1.1, -0.2, -0.1)):
        if round(fit["slope_sv_per_decade"], 1) != expected:
            raise ValueError("Calculated old-release trend does not reproduce Lee's one-decimal point estimate")
    print(json.dumps(output, indent=2, allow_nan=False))


if __name__ == "__main__":
    main(sys.argv[1:])
