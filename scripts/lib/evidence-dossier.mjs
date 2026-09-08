// Kanıt dosyası için saf HTML renderer.
//
// Bu modül veri yazmaz, DOM'a dokunmaz ve bulguların epistemik durumunu
// değiştirmez. build-site, yalnızca dönen HTML'i uygun yere yerleştirir.

const STATUS_LABELS = {
  established: "Yerleşik görüş",
  contested: "Tartışmalı",
  minority: "Azınlık görüşü",
  refuted: "Çürütülmüş",
  unknown: "Bilinmiyor",
  unmeasurable: "Ölçülemez",
};

const REVIEW_LABELS = {
  draft: "Taslak — henüz editoryal inceleme kaydı yok",
  "editor-reviewed": "Editoryal olarak incelendi",
  "expert-reviewed": "Alan uzmanı tarafından incelendi",
};

const SUPPORT_LABELS = {
  direct: "doğrudan",
  inference: "çıkarım",
  context: "bağlam",
  "claim-origin": "iddianın kökeni",
  counter: "karşı kanıt",
};

const CONFIDENCE_LABELS = { high: "yüksek", medium: "orta", low: "düşük" };
const DOI = /^10\.\d{4,9}\/\S+$/i;

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function anchorPart(value, fallback) {
  const cleaned = String(value ?? "")
    .trim()
    .replace(/[^A-Za-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || fallback;
}

function uniqueId(base, used) {
  let id = base;
  let suffix = 2;
  while (used.has(id)) id = `${base}-${suffix++}`;
  used.add(id);
  return id;
}

function safeURL(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const parsed = new URL(value);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : null;
  } catch {
    return null;
  }
}

function sourceURL(source) {
  const url = safeURL(source?.url);
  if (url) return url;
  return typeof source?.doi === "string" && DOI.test(source.doi)
    ? `https://doi.org/${source.doi}`
    : null;
}

function reviewInfo(finding) {
  const status = finding?.review?.status;
  return {
    status,
    label: REVIEW_LABELS[status] ?? "İnceleme kaydı belirtilmedi",
    reviewed: status === "editor-reviewed" || status === "expert-reviewed",
  };
}

function evidenceItems(finding, field) {
  const items = finding?.[field];
  return Array.isArray(items) ? items : [];
}

function sourceTitle(source, fallback) {
  return String(source?.title || `Kaynak ${fallback}`);
}

function prepareFinding(finding, index, usedIds) {
  const safeFindingId = anchorPart(finding?.id, `kayit-${index + 1}`);
  const findingAnchor = uniqueId(`bulgu-${safeFindingId}`, usedIds);
  const sources = Array.isArray(finding?.sources) ? finding.sources : [];
  const byReference = new Map();
  const sourceModels = sources.map((source, sourceIndex) => {
    const key = String(source?.id || `__source-${sourceIndex + 1}`);
    const sourceId = uniqueId(
      `kaynak-${safeFindingId}-${anchorPart(source?.id, String(sourceIndex + 1))}`,
      usedIds,
    );
    const model = { source, sourceIndex, key, sourceId, backLinks: [] };
    if (!byReference.has(key)) byReference.set(key, model);
    return model;
  });
  return { finding, index, findingAnchor, sourceModels, byReference };
}

function citationHTML(citation, model, paragraphId) {
  const sourceRef = String(citation?.source_ref || "");
  const locator = String(citation?.locator || "");
  const support = SUPPORT_LABELS[citation?.support_type] || "atıf türü belirtilmedi";
  const source = model.byReference.get(sourceRef);
  if (!source) {
    return `<span class="ka-citation ka-citation-missing">Kaynak eşlemesi eksik: ${escapeHTML(sourceRef || "belirtilmedi")}${locator ? `, ${escapeHTML(locator)}` : ""} (${escapeHTML(support)})</span>`;
  }
  source.backLinks.push(paragraphId);
  const title = sourceTitle(source.source, source.sourceIndex + 1);
  return `<a class="ka-citation" href="#${escapeHTML(source.sourceId)}">${escapeHTML(title)}${locator ? `, ${escapeHTML(locator)}` : ""} <span class="ka-citation-type">(${escapeHTML(support)})</span></a>`;
}

function renderEvidenceList(model, field, title, idPrefix) {
  const items = evidenceItems(model.finding, field);
  if (!items.length) return `<section class="ka-evidence-group ka-evidence-group-empty"><h4>${title}</h4><p>Kayıtlı ${title.toLocaleLowerCase("tr-TR")} yok.</p></section>`;

  const rows = items.map((item, itemIndex) => {
    const paragraphId = uniqueId(`${idPrefix}-${itemIndex + 1}`, model.usedIds);
    if (typeof item === "string") {
      return `<li id="${escapeHTML(paragraphId)}"><p>${escapeHTML(item)}</p><p class="ka-metadata-missing">Bu kanıt maddesi belirli bir kaynak ve sayfa/pasajla eşleştirilmemiş.</p></li>`;
    }
    const citations = Array.isArray(item?.citations) ? item.citations : [];
    const citationMarkup = citations.length
      ? `<p class="ka-citations">${citations.map((citation) => citationHTML(citation, model, paragraphId)).join("; ")}</p>`
      : `<p class="ka-metadata-missing">Bu kanıt maddesi belirli bir kaynak ve sayfa/pasajla eşleştirilmemiş.</p>`;
    const note = item?.note ? `<p class="ka-evidence-note">${escapeHTML(item.note)}</p>` : "";
    return `<li id="${escapeHTML(paragraphId)}"><p>${escapeHTML(item?.text || "Kanıt metni belirtilmedi.")}</p>${citationMarkup}${note}</li>`;
  }).join("");
  return `<section class="ka-evidence-group"><h4>${title}</h4><ol>${rows}</ol></section>`;
}

function renderQuestions(model) {
  const questions = Array.isArray(model.finding?.open_questions) ? model.finding.open_questions : [];
  if (!questions.length) return "";
  return `<section class="ka-evidence-group"><h4>Açık sorular</h4><ul>${questions.map((question) => `<li>${escapeHTML(question)}</li>`).join("")}</ul></section>`;
}

function renderSources(model) {
  if (!model.sourceModels.length) return `<section class="ka-sources"><h4>Kaynaklar</h4><p class="ka-metadata-missing">Bu bulgu için kaynak kaydı yok.</p></section>`;
  const entries = model.sourceModels.map(({ source, sourceIndex, sourceId, backLinks }) => {
    const title = escapeHTML(sourceTitle(source, sourceIndex + 1));
    const href = sourceURL(source);
    const linkedTitle = href ? `<a href="${escapeHTML(href)}" rel="noopener noreferrer">${title}</a>` : title;
    const parts = [Array.isArray(source?.authors) ? source.authors.join(", ") : "", source?.year, source?.institution, source?.container || source?.publisher, source?.pages]
      .filter(Boolean)
      .map(escapeHTML);
    const identifier = typeof source?.doi === "string" && DOI.test(source.doi)
      ? ` DOI: ${escapeHTML(source.doi)}`
      : "";
    const note = source?.note ? `<p class="ka-source-note">${escapeHTML(source.note)}</p>` : "";
    const back = [...new Set(backLinks)]
      .map((paragraphId, i) => `<a class="ka-source-backlink" href="#${escapeHTML(paragraphId)}">↩ Kanıt ${i + 1}</a>`)
      .join(" ");
    return `<li class="ka-source" id="${escapeHTML(sourceId)}"><span class="ka-source-title">${linkedTitle}</span>${parts.length ? `<span class="ka-source-meta">${parts.join(" · ")}${identifier}</span>` : identifier ? `<span class="ka-source-meta">${identifier.trim()}</span>` : ""}${note}${back ? `<p class="ka-source-backlinks">${back}</p>` : ""}</li>`;
  }).join("");
  return `<section class="ka-sources"><h4>Kaynaklar</h4><ol>${entries}</ol></section>`;
}

function renderFinding(model) {
  const finding = model.finding ?? {};
  const review = reviewInfo(finding);
  const status = STATUS_LABELS[finding.status] || "Durum belirtilmedi";
  const confidence = CONFIDENCE_LABELS[finding.confidence];
  model.usedIds = new Set([model.findingAnchor, ...model.sourceModels.map((source) => source.sourceId)]);
  const evidence = renderEvidenceList(model, "evidence", "Kanıt", `${model.findingAnchor}-kanit`);
  const counter = renderEvidenceList(model, "counter_evidence", "Karşı kanıt", `${model.findingAnchor}-karsi-kanit`);
  const questions = renderQuestions(model);
  const sources = renderSources(model);
  const reviewNote = finding?.review?.notes
    ? `<p class="ka-review-note"><strong>İnceleme notu:</strong> ${escapeHTML(finding.review.notes)}</p>`
    : "";
  return `<details class="ka-finding" id="${escapeHTML(model.findingAnchor)}"><summary class="ka-finding-summary"><span class="ka-finding-claim">${escapeHTML(finding.claim || "İddia metni belirtilmedi.")}</span><span class="ka-status ka-status-${escapeHTML(anchorPart(finding.status, "unknown"))}">${escapeHTML(status)}</span></summary><div class="ka-finding-body"><p class="ka-review-status">İnceleme: ${escapeHTML(review.label)}</p>${reviewNote}${confidence ? `<p class="ka-confidence">Sınıflandırma güveni: ${escapeHTML(confidence)}</p>` : ""}${evidence}${counter}${questions}${sources}</div></details>`;
}

function reviewCounts(findings) {
  const counts = { draft: 0, reviewed: 0, unrecorded: 0 };
  for (const finding of findings) {
    const review = reviewInfo(finding);
    if (review.status === "draft") counts.draft += 1;
    else if (review.reviewed) counts.reviewed += 1;
    else counts.unrecorded += 1;
  }
  return counts;
}

/** Kısa yanıt, sınır ve gerçek inceleme sayılarıyla yazı üstü giriş. */
export function renderEvidenceIntro(article, findings, summary = {}) {
  const list = Array.isArray(findings) ? findings : [];
  const counts = reviewCounts(list);
  const shortAnswer = summary?.summary
    ? escapeHTML(summary.summary)
    : "Bu yazı için kısa yanıt henüz belirtilmedi.";
  const limit = summary?.limit
    ? escapeHTML(summary.limit)
    : "Bu dosya, kayıtlı bulguların sınırlarıyla okunmalıdır.";
  const articleTitle = article?.title ? `: ${escapeHTML(article.title)}` : "";
  return `<aside class="ka-evidence-intro" aria-label="Kanıt okuma rehberi"><p class="ka-evidence-kicker">Kanıt dosyası${articleTitle}</p><p><strong>Kısa yanıt:</strong> ${shortAnswer}</p><p><strong>Sınır:</strong> ${limit}</p><p class="ka-review-counts">İnceleme kaydı: ${counts.draft} taslak, ${counts.reviewed} incelenmiş${counts.unrecorded ? `, ${counts.unrecorded} inceleme kaydı belirtilmemiş` : ""}.</p><nav class="ka-reading-nav" aria-label="Yazı içinde gezinme"><a href="#kanit-dosyasi">Kanıt dosyası</a><a href="#ka-anlati">Anlatı</a></nav></aside>`;
}

/** Bulguları ayrıntı/özet kartlarıyla ve kaynak geri bağlantılarıyla render eder. */
export function renderEvidenceDossier(article, findings) {
  const list = Array.isArray(findings) ? findings : [];
  const usedIds = new Set(["kanit-dosyasi"]);
  const models = list.map((finding, index) => prepareFinding(finding, index, usedIds));
  const title = article?.title ? `: ${escapeHTML(article.title)}` : "";
  const body = models.length
    ? models.map(renderFinding).join("")
    : "<p>Bu yazı için yayımlanmış bulgu kaydı yok.</p>";
  return `<section class="ka-evidence-dossier" id="kanit-dosyasi" aria-labelledby="kanit-dosyasi-baslik"><h2 class="ka-section-heading" id="kanit-dosyasi-baslik">Kanıt dosyası${title}</h2>${body}</section>`;
}
