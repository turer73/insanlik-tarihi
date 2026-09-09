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

/** Tartışma pilotu: kaynak isteyen, ön moderasyonlu katkı formu. */
export function renderContribution(article, findings, pilot) {
  if (!pilot) return '';
  if (pilot.aktif !== true) {
    return `<section class="ka-contribution" aria-labelledby="katki-baslik">
  <h2 class="ka-related-heading" id="katki-baslik">Bu dosyaya katkı verin</h2>
  <p class="ka-contribution-intro">Site içi katkı formu moderasyon ve kötüye kullanım koruması tamamlanana kadar kapalıdır. Bu sırada soru, kaynak ve düzeltme önerilerinizi <a href="https://github.com/${escapeHTML(pilot.repo)}/issues" rel="noopener" target="_blank">GitHub issue izleyicisinden</a> iletebilirsiniz.</p>
</section>`;
  }
  const claims = (findings ?? [])
    .map(finding => finding?.claim)
    .filter(claim => claim && claim.trim().length <= 220);
  const options = claims
    .map((claim, index) => `<option value="${escapeHTML(claim.slice(0, 220))}">${escapeHTML(claim.slice(0, 140))}${claim.length > 140 ? '…' : ''}</option>`)
    .join('');
  const surec = (pilot.durum_akisi ?? []).join(' → ');
  return `<section class="ka-contribution" aria-labelledby="katki-baslik">
  <h2 class="ka-related-heading" id="katki-baslik">Bu dosyaya katkı verin</h2>
  <p class="ka-contribution-intro">Soru sorabilir, farklı bir görüş sunabilir, kaynak paylaşabilir veya düzeltme önerebilirsiniz. Katkılar herkese açık biçimde <a href="https://github.com/${escapeHTML(pilot.repo)}/issues" rel="noopener" target="_blank">GitHub issue izleyicisinde</a> görünür; editör orada yanıtlar. E-posta toplanmaz.</p>
  <form class="ka-contribution-form" data-contribution-form novalidate>
    <input type="text" name="website" class="ka-contribution-hp" tabindex="-1" autocomplete="off" aria-hidden="true">
    <fieldset class="ka-contribution-kind">
      <legend>Katkı türü</legend>
      ${['Soru sor', 'Farklı görüş sun', 'Kaynak paylaş', 'Düzeltme öner'].map((tur, index) => `<label><input type="radio" name="tur" value="${escapeHTML(tur)}"${index === 0 ? ' checked' : ''}> ${escapeHTML(tur)}</label>`).join('')}
    </fieldset>
    <label class="ka-contribution-field"><span>İlgili iddia veya bulgu</span>
      <select name="iddia">
        <option value="">Metindeki başka bir cümle (aşağıda belirtin)</option>
        ${options}
      </select>
    </label>
    <div class="ka-contribution-grid">
      <label class="ka-contribution-field"><span>Adınız veya rumuzunuz <b aria-hidden="true">*</b></span><input type="text" name="ad" maxlength="80" required placeholder="Görünür olacak"></label>
      <label class="ka-contribution-field"><span>Kaynak bağlantısı (isteğe bağlı)</span><input type="url" name="kaynak_url" maxlength="500" placeholder="https://…"></label>
    </div>
    <label class="ka-contribution-field"><span>Bu kaynak hangi cümleyi etkiliyor? (isteğe bağlı)</span><input type="text" name="kaynak_etki" maxlength="300" placeholder="Ör: 'Taşlar buzullarla taşındı' cümlesini"></label>
    <label class="ka-contribution-field"><span>Katkınız <b aria-hidden="true">*</b></span><textarea name="mesaj" rows="5" maxlength="4000" required placeholder="İddianızı ve mümkünse dayandığı kanıtı yazın"></textarea></label>
    <div class="ka-contribution-actions">
      <button type="submit" class="ka-contribution-submit">Katkıyı gönder</button>
      <p class="ka-contribution-process">Süreç: ${escapeHTML(surec)} — durum değişiklikleri GitHub kaydında güncellenir.</p>
    </div>
    <p class="ka-contribution-status" role="status" aria-live="polite" hidden></p>
  </form>
</section>`;
}

/** Bülten çağrısı: Buttondown yapılandırıldıysa kayıt formu, değilse RSS çağrısı. */
export function renderNewsletter(bulten, yol = '') {
  const baslik = escapeHTML(bulten?.baslik ?? 'Bir iddia · iki kanıt · bir açık soru');
  const aciklama = escapeHTML(bulten?.aciklama ?? '');
  if (bulten?.provider === 'buttondown' && bulten.username?.trim()) {
    const formUrl = `https://buttondown.com/api/emails/embed-subscribe/${encodeURIComponent(bulten.username.trim())}`;
    return `<section class="ka-newsletter" aria-labelledby="bulten-baslik">
  <h2 class="ka-related-heading" id="bulten-baslik">${baslik}</h2>
  <p>${aciklama}</p>
  <form action="${formUrl}" method="post" target="_blank" class="ka-newsletter-form" data-newsletter-form>
    <label class="ka-contribution-field"><span>E-posta adresiniz</span><input type="email" name="email" required placeholder="ornek@eposta.com"></label>
    <input type="hidden" name="tag" value="kanit-atlasi">
    <button type="submit" class="ka-contribution-submit">Bültene kaydol</button>
  </form>
  <p class="ka-newsletter-note">${escapeHTML(bulten?.not ?? '')}</p>
</section>`;
  }
  return `<section class="ka-newsletter" aria-labelledby="bulten-baslik">
  <h2 class="ka-related-heading" id="bulten-baslik">${baslik}</h2>
  <p>${aciklama} Yeni yazılar ve güncellemeler için <a href="${yol}feed.xml">RSS</a> akışını izleyin.</p>
  <p class="ka-newsletter-note">E-posta bülteni hazırlandığında kayıt alanı burada açılacak.</p>
</section>`;
}
