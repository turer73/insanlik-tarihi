#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function replaceRequired(source, before, after, label) {
  if (!source.includes(before)) {
    throw new Error(`${label}: beklenen kaynak parçası bulunamadı`);
  }
  return source.replace(before, after);
}

function wrapDocument(source, title, description) {
  if (/^<!doctype html>/i.test(source)) return source;

  source = replaceRequired(
    source,
    `<title>${title}</title>`,
    `<!doctype html>\n<html lang="tr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="description" content="${description}">\n<title>${title}</title>`,
    `${title} belge başı`,
  );
  source = replaceRequired(source, "</style>\n\n", "</style>\n</head>\n<body>\n\n", `${title} head kapanışı`);
  return `${source.trimEnd()}\n</body>\n</html>\n`;
}

const browserPath = join(ROOT, "tools", "browser.template.html");
let browser = readFileSync(browserPath, "utf8");
browser = wrapDocument(
  browser,
  "Bulgu Veri Tabanı",
  "İnsanlık Tarihi bulgularını durum, disiplin, bölge ve kaynak katmanına göre tarayın.",
);
if (browser.includes("--accent-ink:#1E3purple; --accent-ink:#1E344A;")) {
  browser = browser.replace(
    "--accent-ink:#1E3purple; --accent-ink:#1E344A;",
    "--accent-ink:#1E344A;",
  );
}
if (!browser.includes("body{margin:0;")) {
  browser = replaceRequired(browser, "body{background:", "body{margin:0;background:", "tarayıcı body sıfırlaması");
}
writeFileSync(browserPath, browser);

const timelinePath = join(ROOT, "tools", "timeline.template.html");
let timeline = readFileSync(timelinePath, "utf8");
timeline = wrapDocument(
  timeline,
  "Ölçekli Zaman Çizelgesi",
  "İnsanlık Tarihi bulgularını uygarlık, insan ve derin zaman ölçeklerinde karşılaştırın.",
);
if (!timeline.includes("body{margin:0;")) {
  timeline = replaceRequired(timeline, "body{background:", "body{margin:0;background:", "zaman çizelgesi body sıfırlaması");
}
if (timeline.includes("var NOW = 2026;")) {
  timeline = timeline.replace("var NOW = 2026;", "var NOW = new Date().getFullYear();");
} else if (!timeline.includes("var NOW = new Date().getFullYear();")) {
  throw new Error("zaman çizelgesi: NOW tanımı bulunamadı");
}

const oldPointTolerance = `    if(lo === hi){ // nokta olay: ölçeğin binde beşi kadar tolerans
      var s = SCALES[S.scale], tol = Math.abs(s.max - s.min) * 0.005;
      return Math.abs(y - lo) <= tol;
    }`;
const newPointTolerance = `    if(lo === hi){
      // Nokta olaylarda tarih aralığını yapay biçimde büyütme. Eşleşme,
      // veri ölçeğine göre değil ekrandaki altı piksellik seçme alanına göre yapılır.
      var plot = document.getElementById('plot');
      var trackWidth = plot ? Math.max(1, plot.getBoundingClientRect().width - 230) : 820;
      return Math.abs(pos(y, S.scale) - pos(lo, S.scale)) <= 6 / trackWidth;
    }`;
if (timeline.includes(oldPointTolerance)) {
  timeline = timeline.replace(oldPointTolerance, newPointTolerance);
} else if (!timeline.includes("6 / trackWidth")) {
  throw new Error("zaman çizelgesi: nokta olay tolerans bloğu bulunamadı");
}

if (timeline.includes(".row__lbl{border-right:1px solid var(--rule);padding:.38rem .7rem;display:flex;flex-direction:column;gap:.05rem;min-width:0}")) {
  timeline = timeline.replace(
    ".row__lbl{border-right:1px solid var(--rule);padding:.38rem .7rem;display:flex;flex-direction:column;gap:.05rem;min-width:0}",
    ".row__lbl{border-right:1px solid var(--rule);padding:.38rem .7rem;display:flex;flex-direction:column;gap:.05rem;min-width:0;text-align:left;width:100%}",
  );
}
if (timeline.includes(".bar{position:absolute;top:9px;height:16px;min-width:4px;border-radius:1px}")) {
  timeline = timeline.replace(
    ".bar{position:absolute;top:9px;height:16px;min-width:4px;border-radius:1px}",
    ".bar{position:absolute;top:9px;height:16px;min-width:4px;border-radius:1px;padding:0;cursor:pointer}",
  );
}
if (!timeline.includes(".row__lbl[aria-pressed=\"true\"]")) {
  timeline = replaceRequired(
    timeline,
    ".bar.fuzzy{opacity:.55;background-image:repeating-linear-gradient(90deg,rgba(255,255,255,.45) 0 3px,transparent 3px 6px)}",
    ".bar.fuzzy{opacity:.55;background-image:repeating-linear-gradient(90deg,rgba(255,255,255,.45) 0 3px,transparent 3px 6px)}\n.row__lbl[aria-pressed=\"true\"],.bar[aria-pressed=\"true\"]{box-shadow:inset 0 0 0 2px var(--accent)}",
    "zaman çizelgesi seçili öğe stili",
  );
}

if (!timeline.includes("var ariaLabel = esc('Bulgu ayrıntısı:")) {
  timeline = replaceRequired(
    timeline,
    "      var dateTxt = fmtY(e) + (l!==e? ' – '+fmtY(l) : '');",
    "      var dateTxt = fmtY(e) + (l!==e? ' – '+fmtY(l) : '');\n      var ariaLabel = esc('Bulgu ayrıntısı: '+r.claim+' · '+dateTxt);",
    "zaman çizelgesi aria etiketi",
  );
}

const oldRows = `      return '<div class="row'+(S.sel===r.id?' sel':'')+dim+'" data-id="'+esc(r.id)+'">'
        + '<div class="row__lbl"><b title="'+esc(r.claim)+'">'+esc((r.subject&&r.subject.site)||r.topic[0])
        + (hasArt?' <span class="art">↗</span>':'')+'</b>'
        + '<span>'+esc(r.period.era_label||r.id)+'</span></div>'
        + '<div class="row__track"><div class="'+cls+'" data-bar="1" style="'+style+'"></div>'
        + '<div class="rowdate" style="'+dstyle+'">'+esc(dateTxt)+'</div></div></div>';`;
const newRows = `      return '<div class="row'+(S.sel===r.id?' sel':'')+dim+'" data-id="'+esc(r.id)+'">'
        + '<button type="button" class="row__lbl" aria-pressed="'+(S.sel===r.id)+'"><b title="'+esc(r.claim)+'">'+esc((r.subject&&r.subject.site)||r.topic[0])
        + (hasArt?' <span class="art">↗</span>':'')+'</b>'
        + '<span>'+esc(r.period.era_label||r.id)+'</span></button>'
        + '<div class="row__track"><button type="button" class="'+cls+'" data-bar="1" aria-pressed="'+(S.sel===r.id)+'" aria-label="'+ariaLabel+'" style="'+style+'"></button>'
        + '<div class="rowdate" style="'+dstyle+'">'+esc(dateTxt)+'</div></div></div>';`;
if (timeline.includes(oldRows)) {
  timeline = timeline.replace(oldRows, newRows);
} else if (!timeline.includes('<button type="button" class="row__lbl"')) {
  throw new Error("zaman çizelgesi: satır erişilebilirlik bloğu bulunamadı");
}

writeFileSync(timelinePath, timeline);
console.log("statik araç göçü: tamam");
