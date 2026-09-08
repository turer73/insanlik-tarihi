// Yazı sonu katmanları: arama sorusu, ilgili dosyalar ve yeniden yayım bloğu.
//
// wrapArticle bu modülün çıktılarını yazının kanıt dosyasıyla birlikte yerleştirir.
// İçerik veriden gelir; bu modül yalnız HTML kurar.

import { primaryHub } from './hubs.mjs';

const ORIGIN = 'https://kanitatlasi.com';

function escapeHTML(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/** Başlığın hemen altına giren, aranan soruyu açıkça söyleyen alt başlık. */
export function renderSearchQuestion(question) {
  if (!question) return '';
  return `<p class="ka-search-question">${escapeHTML(question)}</p>`;
}

/** Etiket örtüşmesine göre ilgili dosyalar; kendisi hariç, en fazla `count` adet. */
export function relatedSlugs(article, articles, count = 4) {
  const own = new Set(article.tags ?? []);
  return articles
    .filter(candidate => candidate.slug !== article.slug)
    .map(candidate => {
      const shared = (candidate.tags ?? []).filter(tag => own.has(tag)).length;
      return {
        slug: candidate.slug,
        score: shared * 3 + (candidate.category === article.category ? 2 : 0) + (candidate.featured ? 1 : 0),
      };
    })
    .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug, 'tr'))
    .slice(0, count)
    .map(entry => entry.slug);
}

export function renderRelated(article, articles, hubs, allArticles) {
  const slugs = relatedSlugs(article, allArticles);
  if (!slugs.length) return '';
  const hub = primaryHub(hubs, article.slug);
  const items = slugs
    .map(slug => articles.find(a => a.slug === slug))
    .filter(Boolean)
    .map(related => `<li><a href="${escapeHTML(related.slug)}.html"><b>${escapeHTML(related.cardTitle)}</b></a> <span>${escapeHTML(related.category)}</span></li>`)
    .join('');
  const hubLink = hub
    ? `<p class="ka-related-hub">Bu dosya <a href="../konular/${escapeHTML(hub.slug)}.html">${escapeHTML(hub.baslik)}</a> merkezinde.</p>`
    : '';
  return `<section class="ka-related" aria-labelledby="ilgili-dosyalar-baslik"><h2 class="ka-related-heading" id="ilgili-dosyalar-baslik">İlgili dosyalar</h2><ul>${items}</ul>${hubLink}</section>`;
}

/** CC BY 4.0 atıf bloğu: önerilen atıf, özet ve kapak bağlantısı. */
export function renderAttribution(article) {
  const url = `${ORIGIN}/articles/${article.slug}.html`;
  return `<section class="ka-attribution" aria-labelledby="yeniden-yayim-baslik">
  <h2 class="ka-related-heading" id="yeniden-yayim-baslik">Bu dosyayı yeniden yayımlayın</h2>
  <p>İçerik <a href="https://creativecommons.org/licenses/by/4.0/deed.tr" rel="license noopener" target="_blank">CC BY 4.0</a> lisanslıdır; atıf vererek ve kaynak bağlantılarını koruyarak çoğaltabilirsiniz. Önerilen atıf:</p>
  <blockquote class="ka-attribution-cite">Kanıt Atlası. «${escapeHTML(article.title)}.» Kanıt Atlası, <a href="${url}">${url}</a> (CC BY 4.0).</blockquote>
  <p class="ka-attribution-meta">Özet: ${escapeHTML(article.summary)} Kapak görseli temsili editoryal illüstrasyondur: <a href="${ORIGIN}/${article.cover}">${ORIGIN}/${article.cover}</a></p>
  <p><a class="ka-attribution-kit" href="../yeniden-yayin.html">Yeniden yayımlama kiti →</a></p>
</section>`;
}
