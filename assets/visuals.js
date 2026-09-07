(() => {
  'use strict';

  const palettes = {
    'Metin & İnanç': { bg:'#4B2538', bg2:'#702F4E', paper:'#F1DFC1', accent:'#D3A35D', ink:'#1E1720' },
    'İklim & Felaket': { bg:'#173F4F', bg2:'#286879', paper:'#EAD8B9', accent:'#D66A4A', ink:'#102B35' },
    'Arkeoloji & Kentler': { bg:'#49362A', bg2:'#79513A', paper:'#E9D9BD', accent:'#C58B50', ink:'#231B17' },
    'Bilim & Teknoloji': { bg:'#0F4E4D', bg2:'#197170', paper:'#D8E7DA', accent:'#E4A448', ink:'#0B2827' },
    'Yöntem & Tarihyazımı': { bg:'#283230', bg2:'#46544F', paper:'#E3DACA', accent:'#91B19E', ink:'#171D1B' }
  };

  const meta = {
    'olu-deniz-parsomenleri': { no:1, category:'Metin & İnanç', label:'Parşömen · mağara · tarihleme' },
    'tufan-bilmecesi': { no:2, category:'İklim & Felaket', label:'Su · jeoloji · anlatı' },
    'hatirlamadigimiz-felaketler': { no:3, category:'İklim & Felaket', label:'Hafıza · afet · kayıp' },
    'babil': { no:4, category:'Arkeoloji & Kentler', label:'Kent · ziggurat · sembol' },
    'ayni-cumlede': { no:5, category:'Yöntem & Tarihyazımı', label:'Benzerlik · zaman · yöntem' },
    'petra': { no:6, category:'Arkeoloji & Kentler', label:'Kaya · su · ticaret' },
    'shushtar': { no:7, category:'Bilim & Teknoloji', label:'Hidrolik · aktarım · mühendislik' },
    'stonehenge': { no:8, category:'Arkeoloji & Kentler', label:'Taş · provenans · rota' },
    'sumer': { no:9, category:'Metin & İnanç', label:'Kil · arşiv · çivi yazısı' },
    'angkor': { no:10, category:'Arkeoloji & Kentler', label:'LiDAR · su · dönüşüm' },
    'tas-tepeler': { no:11, category:'Arkeoloji & Kentler', label:'Neolitik · örneklem · kazı' },
    'machu-picchu': { no:12, category:'Arkeoloji & Kentler', label:'Andlar · teras · keşif' },
    'chichen-itza': { no:13, category:'Arkeoloji & Kentler', label:'Akustik · astronomi · test' },
    'kapadokya': { no:14, category:'Arkeoloji & Kentler', label:'Yeraltı · ölçek · ölçüm' },
    'persepolis': { no:15, category:'Metin & İnanç', label:'Arşiv · sütun · imparatorluk' },
    'iskenderiye': { no:16, category:'Metin & İnanç', label:'Kütüphane · aktarım · kayıp' },
    'milankovic': { no:17, category:'Bilim & Teknoloji', label:'Yörünge · eksen · iklim' },
    'roma-etki': { no:18, category:'Yöntem & Tarihyazımı', label:'Miras · seçme · bakış' },
    'roma-hristiyanlik': { no:19, category:'Metin & İnanç', label:'Roma · kurum · dönüşüm' },
    'isa-tarihsellik': { no:20, category:'Metin & İnanç', label:'Metin · mesafe · kronoloji' },
    'mit-ve-sicil': { no:21, category:'Yöntem & Tarihyazımı', label:'Mit · kayıt · sınır' },
    'gokteki-ayi': { no:22, category:'Metin & İnanç', label:'Gökyüzü · mit · benzerlik' },
    'gec-kalan-haberci': { no:23, category:'Yöntem & Tarihyazımı', label:'Tanıklık · gecikme · aktarım' },
    'kendi-kaniti': { no:24, category:'Yöntem & Tarihyazımı', label:'Döngü · mantık · kanıt' },
    'calinan-ates': { no:25, category:'Metin & İnanç', label:'Ateş · kültür kahramanı · motif' },
    'herkesin-saati': { no:26, category:'Bilim & Teknoloji', label:'Ülker · tarım · takvim' },
    'yilin-iki-kapisi': { no:27, category:'Bilim & Teknoloji', label:'Mevsim · halk takvimi · gökyüzü' }
  };

  const scene = window.ITVisualScenes || {};

  function safeId(slug) {
    return String(slug || 'generic').replace(/[^a-z0-9-]/gi, '-');
  }

  function genericScene() {
    return `<circle class="line" cx="400" cy="250" r="145"/><circle class="line" cx="400" cy="250" r="88" opacity=".55"/><path class="accent" d="M378 109h44v282h-44zM259 228h282v44H259z" opacity=".65"/>`;
  }

  function render(slug, options = {}) {
    const item = meta[slug] || { no:'—', category:'Yöntem & Tarihyazımı', label:'Araştırma · kanıt · bağlam' };
    const p = palettes[item.category] || palettes['Yöntem & Tarihyazımı'];
    const id = safeId(`${slug}-${options.instance || Math.random().toString(36).slice(2, 7)}`);
    const title = options.title || item.label;
    const decorative = options.decorative !== false;
    const aria = decorative ? 'aria-hidden="true" focusable="false"' : `role="img" aria-label="${String(title).replace(/"/g, '&quot;')} için editoryal illüstrasyon"`;
    return `<svg class="it-art-svg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" ${aria} style="--art-bg:${p.bg};--art-bg2:${p.bg2};--art-paper:${p.paper};--art-accent:${p.accent};--art-ink:${p.ink}">
      <defs>
        <linearGradient id="${id}-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--art-bg)"/><stop offset="1" stop-color="var(--art-bg2)"/></linearGradient>
        <radialGradient id="${id}-glow" cx="72%" cy="20%" r="70%"><stop offset="0" stop-color="var(--art-paper)" stop-opacity=".18"/><stop offset="1" stop-color="var(--art-paper)" stop-opacity="0"/></radialGradient>
        <pattern id="${id}-grain" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r=".7" fill="var(--art-paper)" opacity=".12"/><circle cx="13" cy="10" r=".45" fill="var(--art-paper)" opacity=".1"/><path d="M0 17 17 0" stroke="var(--art-paper)" stroke-opacity=".035"/></pattern>
      </defs>
      <style>
        .paper{fill:var(--art-paper)}.accent{fill:var(--art-accent)}.dark{fill:var(--art-ink)}.bgcut{fill:var(--art-bg)}
        .line{fill:none;stroke:var(--art-paper);stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
        .inkline{fill:none;stroke:var(--art-ink);stroke-width:4;stroke-linecap:round;stroke-linejoin:round;opacity:.62}
      </style>
      <rect width="800" height="500" fill="url(#${id}-bg)"/>
      <rect width="800" height="500" fill="url(#${id}-glow)"/>
      <path d="M-40 96C134 8 267 6 420 68s271 64 420-18v-90H-40v136Z" fill="var(--art-paper)" opacity=".05"/>
      <path d="M-90 447c178-100 330-89 456-18s282 75 524-38v149H-90V447Z" fill="var(--art-ink)" opacity=".14"/>
      <g>${scene[slug] || genericScene()}</g>
      <rect width="800" height="500" fill="url(#${id}-grain)"/>
      <g opacity=".72"><path d="M47 52h88" stroke="var(--art-paper)" stroke-width="2"/><path d="M47 63h52" stroke="var(--art-paper)" stroke-width="2"/></g>
      <text x="752" y="63" text-anchor="end" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="24" font-weight="700" fill="var(--art-paper)" opacity=".78">${String(item.no).padStart(2,'0')}</text>
    </svg>`;
  }

  window.ITVisuals = Object.freeze({ render, meta, palettes });
})();
