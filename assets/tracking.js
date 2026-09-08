// Kanıt Atlası — Plausible özel olayları.
//
// Sayfa görüntüleme, sayfaya build aşamasında eklenen Plausible betiğiyle
// otomatik ölçülür. Bu dosya yalnızca ürün davranışlarını ölçer:
//   Kaynak Tıklama — kanıt dosyasındaki dış kaynak bağlantısı açılması
//   Kanıt Açma    — bir bulgu kartının (details) açılması
//   Paylaşma      — paylaş düğmesiyle yerel paylaşım veya bağlantı kopyalama
// Hazır yardımcı: window.kaTrack(olay, { ...öznitelikler })
// Bülten ve katkı formları eklendiğinde aynı yardımcı kullanılmalıdır.
(() => {
  'use strict';

  function track(event, props) {
    try {
      if (typeof window.plausible === 'function') window.plausible(event, { props });
    } catch (_) { /* ölçüm hiçbir zaman okumayı bozmasın */ }
  }

  window.kaTrack = track;

  function articleSlug() {
    return document.documentElement.dataset.articleSlug || '';
  }

  document.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('.ka-sources a[href^="http"], .ka-sources a[href^="https"]') : null;
    if (!link) return;
    const label = (link.textContent || '').trim().slice(0, 120);
    track('Kaynak Tıklama', { kaynak: label, slug: articleSlug() });
  });

  document.addEventListener('toggle', (event) => {
    const details = event.target;
    if (!(details instanceof HTMLDetailsElement)) return;
    if (!details.classList.contains('ka-finding') || !details.open) return;
    track('Kanıt Açma', { bulgu: details.id || 'bulgusuz', slug: articleSlug() });
  }, true);

  function initShare() {
    const buttons = document.querySelectorAll('.ka-share');
    for (const button of buttons) {
      button.addEventListener('click', async () => {
        const url = location.href;
        const title = document.title.replace(/\s*—\s*Kanıt Atlası\s*$/, '');
        let method = 'kopyalama';
        try {
          if (navigator.share) {
            await navigator.share({ title, url });
            method = 'native';
          } else {
            await navigator.clipboard.writeText(url);
          }
        } catch (_) {
          try { await navigator.clipboard.writeText(url); } catch (_) { /* pano kapalıysa olay yine de kaydedilir */ }
        }
        track('Paylaşma', { yontem: method, slug: articleSlug() });
        const label = button.querySelector('[data-share-label]');
        if (label) {
          label.textContent = method === 'native' ? 'Paylaşıldı' : 'Bağlantı kopyalandı';
          window.setTimeout(() => { label.textContent = 'Paylaş'; }, 2500);
        }
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initShare, { once: true });
  else initShare();
})();
