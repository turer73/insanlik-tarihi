// Katkı formu ve bülten kaydı için istemci davranışı.
//
// - Katkı formu: /api/katki üzerinden GitHub issue'suna dönüşür; başarı ve hata
//   durumu form içinde, olay Plausible'a 'Katkı Gönderimi' olarak gider.
// - Bülten formu: Buttondown'a yeni sekmede gönderilir; denemeler 'Bülten Kaydı'
//   olarak ölçülür (başarı sağlayıcı tarafında gerçekleşir).
// - Ana sayfada tracking.js yüklenmez; kaTrack burada güvenli biçimde tanımlanır.
(() => {
  'use strict';

  window.kaTrack = window.kaTrack || function (event, props) {
    try {
      if (typeof window.plausible === 'function') window.plausible(event, { props });
    } catch (_) { /* ölçüm okumayı bozmasın */ }
  };

  function articleSlug() {
    return document.documentElement.dataset.articleSlug || '';
  }

  function formuYakala(form) {
    const veri = new FormData(form);
    return {
      tur: String(veri.get('tur') || ''),
      yazi: articleSlug(),
      iddia: String(veri.get('iddia') || ''),
      kaynak_url: String(veri.get('kaynak_url') || ''),
      kaynak_etki: String(veri.get('kaynak_etki') || ''),
      ad: String(veri.get('ad') || ''),
      mesaj: String(veri.get('mesaj') || ''),
      website: String(veri.get('website') || '')
    };
  }

  function durumGoster(form, metin, hata) {
    const kutu = form.querySelector('.ka-contribution-status');
    if (!kutu) return;
    kutu.textContent = metin;
    kutu.classList.toggle('is-error', Boolean(hata));
    kutu.hidden = false;
  }

  function initContribution() {
    for (const form of document.querySelectorAll('[data-contribution-form]')) {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const gonder = form.querySelector('.ka-contribution-submit');
        if (gonder) gonder.disabled = true;
        try {
          const yanit = await fetch('/api/katki', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formuYakala(form))
          });
          const sonuc = await yanit.json().catch(() => ({}));
          if (yanit.ok && sonuc.ok) {
            durumGoster(form, `Katkınız alındı. Kayıt herkese açık: ${sonuc.issue_url} — süreç: ${sonuc.surec}`, false);
            window.kaTrack('Katkı Gönderimi', { tur: formuYakala(form).tur, slug: articleSlug() });
            form.reset();
          } else {
            durumGoster(form, sonuc.hata || 'Gönderim doğrulanamadı. Kısa ve kaynaklı bir katkı deneyin.', true);
          }
        } catch (_) {
          durumGoster(form, 'Bağlantı kurulamadı. Lütfen tekrar deneyin.', true);
        } finally {
          if (gonder) gonder.disabled = false;
        }
      });
    }
  }

  function initNewsletter() {
    for (const form of document.querySelectorAll('[data-newsletter-form]')) {
      form.addEventListener('submit', () => {
        window.kaTrack('Bülten Kaydı', { kaynak: articleSlug() || 'ana-sayfa' });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { initContribution(); initNewsletter(); }, { once: true });
  } else {
    initContribution();
    initNewsletter();
  }
})();
