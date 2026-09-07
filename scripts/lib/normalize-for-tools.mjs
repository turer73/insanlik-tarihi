const SUPPORT_LABELS = {
  direct: "doğrudan",
  inference: "çıkarım",
  context: "bağlam",
  "claim-origin": "iddia kökeni",
  counter: "karşı kanıt",
};

function sourceLabel(source, fallback) {
  if (!source) return fallback;
  if (source.authors?.length) {
    return `${source.authors[0]}${source.year ? ` (${source.year})` : ""}`;
  }
  if (source.title) return `${source.title}${source.year ? ` (${source.year})` : ""}`;
  return fallback;
}

function normalizeEvidenceItem(item, sourcesById) {
  if (typeof item === "string") return item;
  if (!item || typeof item !== "object" || Array.isArray(item)) return String(item ?? "");

  const references = (item.citations ?? []).map((citation) => {
    const source = sourcesById.get(citation.source_ref);
    const label = sourceLabel(source, citation.source_ref);
    const support = SUPPORT_LABELS[citation.support_type] ?? citation.support_type;
    return `${label}, ${citation.locator} · ${support}`;
  });

  return references.length ? `${item.text} — Kaynak: ${references.join("; ")}` : item.text;
}

/**
 * Mevcut tek dosyalık araçlar v1'de düz metin kanıt dizileri bekliyor.
 * Kaynak JSON'u değiştirmeden v2 kanıt nesnelerini okunabilir metne çevirir.
 * Bu geçiş katmanı, araçlar doğal v2 bileşenlerine taşındığında kaldırılabilir.
 */
export function normalizeFindingForTools(record) {
  const sourcesById = new Map(
    (record.sources ?? [])
      .filter((source) => source?.id)
      .map((source) => [source.id, source]),
  );

  return {
    ...record,
    ...(record.evidence
      ? { evidence: record.evidence.map((item) => normalizeEvidenceItem(item, sourcesById)) }
      : {}),
    ...(record.counter_evidence
      ? { counter_evidence: record.counter_evidence.map((item) => normalizeEvidenceItem(item, sourcesById)) }
      : {}),
  };
}
