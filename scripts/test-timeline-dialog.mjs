#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const template = readFileSync(fileURLToPath(new URL('../tools/timeline.template.html', import.meta.url)), 'utf8');
const source = [...template.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1];
assert.match(template, /<dialog class="det" id="det" aria-labelledby="det-title">/);
assert.match(template, /<dialog class="det coincide" id="coincide" aria-labelledby="coincide-title">/);

class Element {
  constructor(dataset = {}) {
    this.dataset = dataset;
    this.listeners = new Map();
    this.style = { setProperty() {} };
    this.classes = new Set();
    this.classList = {
      add: value => this.classes.add(value),
      remove: value => this.classes.delete(value),
      toggle: (value, enabled) => enabled ? this.classes.add(value) : this.classes.delete(value),
    };
    this.open = false;
    this.hidden = false;
    this.innerHTML = '';
    this.textContent = '';
    this.isConnected = true;
  }
  addEventListener(type, listener) {
    this.listeners.set(type, [...(this.listeners.get(type) || []), listener]);
  }
  dispatch(type, event = {}) {
    for (const listener of this.listeners.get(type) || []) listener({ target: this, preventDefault() {}, ...event });
  }
  querySelectorAll() { return []; }
  querySelector() { return null; }
  setAttribute(name, value) { (this.attributes ||= {})[name] = String(value); }
  closest(selector) { return this.matches?.[selector] || null; }
  getBoundingClientRect() { return { left: 100, right: 860, top: 100, bottom: 600, width: 760 }; }
  focus() { document.activeElement = this; }
  showModal() { this.open = true; }
  close() {
    if (!this.open) return;
    this.open = false;
    this.dispatch('close');
  }
}

const ids = ['data', 'articles', 'det', 'rows', 'plot', 'axis', 'hist', 'count', 'scalewarn',
  'f-scale', 'f-sort', 'f-status', 'f-region', 'guide', 'guidelbl', 'coincide', 'guide-show'];
const elements = Object.fromEntries(ids.map(id => [id, new Element()]));
elements.data.textContent = JSON.stringify([{
  id: 'sample', claim: 'Örnek <iddia>', status: 'unknown', topic: ['iklim'],
  subject: { site: 'Milanković' }, period: { earliest: -1000000, latest: 2026, precision: 'range' },
  popular_claim: 'Popüler iddia', divergence: 'Kanıtın sınırı', used_in: ['milankovic'],
}]);
elements.articles.textContent = JSON.stringify({ milankovic: { no: 17, title: 'Milanković Döngüleri', url: '../articles/milankovic.html' } });
let renderedRows = [];
Object.defineProperty(elements.rows, 'innerHTML', {
  get() { return this.html || ''; },
  set(value) {
    this.html = value;
    for (const row of renderedRows) row.label.isConnected = row.bar.isConnected = false;
    renderedRows = [...value.matchAll(/class="row[^\"]*" data-id="([^\"]+)"/g)].map(match => {
      const row = new Element({ id: match[1] });
      row.label = new Element();
      row.bar = new Element({ bar: '1' });
      row.label.matches = { '.row': row, '.row__lbl': row.label };
      row.bar.matches = { '.row': row };
      row.querySelector = selector => selector === '.bar' ? row.bar : row.label;
      return row;
    });
  },
});
elements.rows.querySelectorAll = selector => selector === '.row' ? renderedRows : [];
const title = new Element();
elements.det.querySelector = selector => selector === '#det-title' ? title : null;
const modalClose = new Element();
const modalLinks = [new Element(), new Element()];
elements.det.querySelectorAll = selector => selector === 'button, a[href]' ? [modalClose, ...modalLinks] : [];
const guideDialog = elements.coincide;
const guideTitle = new Element();
const guideBody = new Element();
const guideClose = new Element({ closeGuide: '1' });
const guideRemove = new Element({ unguide: '1' });
guideClose.matches = { '[data-close-guide]': guideClose };
guideDialog.querySelector = selector => selector === '#coincide-title' ? guideTitle : selector === '.det__body' ? guideBody : null;
guideDialog.querySelectorAll = selector => selector === 'button, a[href]' ? [guideClose, guideRemove] : [];
const guideShow = elements['guide-show'];
guideShow.matches = { '[data-show-guide]': guideShow };
const scaleButton = new Element();
elements['f-scale'].querySelector = () => scaleButton;
const document = new Element();
document.body = new Element();
document.getElementById = id => elements[id];
vm.runInNewContext(source, {
  document, window: { addEventListener() {} }, setTimeout, clearTimeout, console,
}, { filename: 'timeline.template.html' });

const dialog = elements.det;
assert.equal(dialog.open, false, 'sayfa açılırken kart kapalı olmalı');
assert.equal(guideDialog.open, false, 'sayfa açılırken tarih listesi kapalı olmalı');
assert.equal(guideShow.disabled, true, 'tarih seçilmeden yeniden açma düğmesi pasif olmalı');
const click = target => document.dispatch('click', { target });
const open = kind => {
  const oldTrigger = renderedRows[0][kind];
  click(oldTrigger);
  assert.equal(dialog.open, true, 'hem kayıt hem çubuk modal açmalı');
  assert.equal(document.body.classes.has('detail-open'), true, 'arka sayfa kaydırması kilitlenmeli');
  assert.equal(document.activeElement, title, 'uzun kartın başlığı ilk odağı almalı');
  assert.equal(oldTrigger.isConnected, false, 'çizelge düğmeleri yeniden oluşturulur');
  assert.match(dialog.innerHTML, /Örnek &lt;iddia&gt;/, 'iddia metni HTML olarak çalışmamalı');
  assert.match(dialog.innerHTML, /href="\.\.\/articles\/milankovic.html" target="_blank" rel="noopener"/);
  return oldTrigger;
};
const expectClosed = kind => {
  assert.equal(dialog.open, false);
  assert.equal(document.body.classes.has('detail-open'), false, 'kaydırma kilidi kalkmalı');
  assert.equal(document.activeElement, renderedRows[0][kind], 'odak yeni oluşturulan doğru düğmeye dönmeli');
};

// Kılavuz varken Escape önce yalnızca kartı kapatmalı.
const track = new Element();
track.matches = { '.row__track, .hist__plot, .axis__scale': track };
document.dispatch('click', { target: track, clientX: 400 });
assert.equal(elements.guide.hidden, false);
assert.equal(guideDialog.open, true, 'çizelgeden tarih seçimi listeyi modal açmalı');
assert.equal(document.activeElement, guideTitle);
assert.match(guideDialog.innerHTML, /1 kayıt/);
assert.match(guideDialog.innerHTML, /Örnek &lt;iddia&gt;/);
document.dispatch('keydown', { key: 'Escape' });
assert.equal(elements.guide.hidden, false, 'liste açıkken Escape kılavuzu silmemeli');
guideDialog.dispatch('cancel');
assert.equal(guideDialog.open, false);
assert.equal(document.activeElement, guideShow, 'liste kapanınca yeniden açma düğmesi odaklanmalı');
assert.equal(document.body.classes.has('detail-open'), false);
open('label');
document.dispatch('keydown', { key: 'Escape' });
assert.equal(elements.guide.hidden, false, 'modal açıkken Escape kılavuzu silmemeli');
let cancelPrevented = false;
dialog.dispatch('cancel', { preventDefault() { cancelPrevented = true; } });
assert.equal(cancelPrevented, true);
expectClosed('label');
assert.equal(elements.guide.hidden, false);
document.dispatch('keydown', { key: 'Escape' });
assert.equal(elements.guide.hidden, true, 'modal kapalıyken Escape kılavuzu kaldırmalı');

open('bar');
let tabPrevented = false;
dialog.dispatch('keydown', { key: 'Tab', preventDefault() { tabPrevented = true; } });
assert.equal(document.activeElement, modalClose, 'başlıktan Tab kapatma düğmesine gitmeli');
assert.equal(tabPrevented, true);
dialog.dispatch('keydown', { key: 'Tab', shiftKey: true });
assert.equal(document.activeElement, modalLinks.at(-1), 'ilk düğmeden Shift+Tab son bağlantıya dönmeli');
dialog.dispatch('keydown', { key: 'Tab' });
assert.equal(document.activeElement, modalClose, 'son bağlantıdan Tab modal içinde kalmalı');
const closeButton = new Element({ close: '1' });
const closeIcon = new Element();
closeIcon.matches = { '[data-close]': closeButton };
click(closeIcon);
expectClosed('bar');

open('label');
dialog.dispatch('pointerdown', { clientX: 150, clientY: 150 });
dialog.dispatch('click', { clientX: 150, clientY: 150 });
assert.equal(dialog.open, true, 'kartın boş alanına tıklamak kapatmamalı');
dialog.dispatch('pointerdown', { clientX: 150, clientY: 150 });
dialog.dispatch('click', { clientX: 5, clientY: 5 });
assert.equal(dialog.open, true, 'kart içinden dışına sürüklemek kapatmamalı');
dialog.dispatch('pointerdown', { clientX: 5, clientY: 5 });
dialog.dispatch('click', { clientX: 5, clientY: 5 });
expectClosed('label');
open('bar');
dialog.close();
expectClosed('bar');

// Liste kapanınca çizelgeyi yeniden çizmek pencereyi kendiliğinden açmamalı.
document.dispatch('click', { target: track, clientX: 420 });
click(guideClose);
assert.equal(guideDialog.open, false);
open('label');
dialog.close();
assert.equal(guideDialog.open, false, 'bilgi kartı kapanırken tarih listesi yeniden açılmamalı');
assert.equal(elements.guide.hidden, false);
guideBody.scrollTop = 500;
click(guideShow);
assert.equal(guideDialog.open, true, 'seçili tarihin listesi tekrar açılabilmeli');
assert.equal(guideBody.scrollTop, 0, 'yeniden açılan uzun liste başlangıçtan okunmalı');
assert.equal(document.body.classes.has('detail-open'), true);
guideDialog.dispatch('keydown', { key: 'Tab' });
assert.equal(document.activeElement, guideClose);
guideDialog.dispatch('keydown', { key: 'Tab', shiftKey: true });
assert.equal(document.activeElement, guideRemove);
guideDialog.dispatch('keydown', { key: 'Tab' });
assert.equal(document.activeElement, guideClose, 'liste de klavye odağını içinde tutmalı');
guideDialog.dispatch('pointerdown', { clientX: 150, clientY: 150 });
guideDialog.dispatch('click', { clientX: 150, clientY: 150 });
assert.equal(guideDialog.open, true, 'liste içine tıklama kapatmamalı');
guideDialog.dispatch('pointerdown', { clientX: 5, clientY: 5 });
guideDialog.dispatch('click', { clientX: 5, clientY: 5 });
assert.equal(guideDialog.open, false, 'dışarı tıklama listeyi kapatmalı');
assert.equal(elements.guide.hidden, false, 'dışarı tıklama tarih seçimini korumalı');
assert.equal(document.body.classes.has('detail-open'), false);

// Filtrelerden sonra eşleşmeyen tarih için boş durum gösterilmeli.
const filter = new Element({ k: 'status', v: 'established' });
filter.matches = { '.chip': filter };
click(filter);
assert.equal(guideDialog.open, false, 'filtre değişimi kapalı listeyi açmamalı');
click(guideShow);
assert.match(guideDialog.innerHTML, /0 kayıt/);
assert.match(guideDialog.innerHTML, /Bu tarihte aktif bulgu yok/);
click(guideRemove);
assert.equal(guideDialog.open, false, 'Kılavuzu kaldır pencereyi de kapatmalı');
assert.equal(elements.guide.hidden, true);
assert.equal(guideShow.disabled, true);
assert.equal(document.activeElement, elements.plot, 'kılavuz kalkınca odak çizelgeye dönmeli');
assert.equal(document.body.classes.has('detail-open'), false);
click(guideShow);
assert.equal(guideDialog.open, false, 'seçim kaldırıldıktan sonra boş pencere açılmamalı');
console.log('zaman çizelgesi modalları: açma, kapatma, kılavuz, filtre ve odak dönüşü tamam');
