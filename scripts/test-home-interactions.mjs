#!/usr/bin/env node

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(join(ROOT, "assets", "app.js"), "utf8");

class ClassList {
  #values = new Set();
  contains(value) { return this.#values.has(value); }
  toggle(value, force) {
    const enabled = force === undefined ? !this.#values.has(value) : force;
    if (enabled) this.#values.add(value);
    else this.#values.delete(value);
    return enabled;
  }
}

class Element {
  constructor() {
    this.attributes = new Map();
    this.listeners = new Map();
    this.classList = new ClassList();
    this.dataset = {};
    this.value = "";
    this.textContent = "";
    this.open = false;
    this.innerHTML = "";
    this.focused = false;
  }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.get(name); }
  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) ?? [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }
  dispatch(type, event = {}) {
    for (const listener of this.listeners.get(type) ?? []) listener({ currentTarget: this, target: this, ...event });
  }
  showModal() { this.open = true; }
  close() { this.open = false; }
  focus() { this.focused = true; }
  getBoundingClientRect() { return { left: 0, right: 400, top: 0, bottom: 400 }; }
}

const elements = Object.fromEntries([
  "#categoryFilters", "#mobileFilterToggle", "#articlesGrid", "#emptyState", "#resultText",
  "#clearFilters", "#articleTotal", "#searchDialog", "#siteSearch", "#searchResults",
  "#searchTrigger", "[data-dialog-close]", "#mainNav", "#menuToggle", "#themeToggle",
  "#sortSelect", "#emptyReset", "#year",
].map((selector) => [selector, new Element()]));
const navLinks = [new Element(), new Element()];
const documentListeners = new Map();
const categoryFilters = elements["#categoryFilters"];
let categoryButtons = [];
Object.defineProperty(categoryFilters, "innerHTML", {
  get() { return this._html ?? ""; },
  set(value) {
    this._html = value;
    categoryButtons = [...String(value).matchAll(/data-category="([^"]+)"/g)].map((match) => {
      const button = new Element();
      button.dataset.category = match[1].replaceAll("&amp;", "&");
      return button;
    });
  },
});
categoryFilters.querySelectorAll = (selector) => selector === "[data-category]" ? categoryButtons : [];

const document = {
  readyState: "loading",
  activeElement: { tagName: "MAIN" },
  documentElement: { dataset: {} },
  querySelector(selector) { return elements[selector] ?? null; },
  querySelectorAll(selector) { return selector === "#mainNav a" ? navLinks : []; },
  addEventListener(type, listener) {
    const listeners = documentListeners.get(type) ?? [];
    listeners.push(listener);
    documentListeners.set(type, listeners);
  },
  dispatch(type, event = {}) {
    for (const listener of documentListeners.get(type) ?? []) listener(event);
  },
};

const context = {
  window: {
    ITArticles: [
      { no: 1, slug: "iskenderiye", title: "İskenderiye", cardTitle: "İskenderiye", category: "Metin & İnanç", summary: "Kütüphane", tags: ["Mısır"], tagline: "", evidenceLabel: "", tone: "", evidenceIcon: "book" },
      { no: 2, slug: "babil", title: "Babil", cardTitle: "Babil", category: "Arkeoloji & Kentler", summary: "Kent", tags: ["Mezopotamya"], tagline: "", evidenceLabel: "", tone: "", evidenceIcon: "book" },
    ],
    ITFeaturedOrder: ["iskenderiye", "babil"],
  },
  document,
  matchMedia: () => ({ matches: true }),
  setTimeout: (callback) => callback(),
  localStorage: { getItem: () => null, setItem: () => {} },
  console,
};

const instrumented = source.replace(/\}\)\(\);\s*$/, "window.__homeTest = { normalize, openSearch, initSearch, initNavigation, renderFilters, setMenuOpen, setMobileFilterOpen }; })();\n");
vm.runInNewContext(instrumented, context, { filename: "assets/app.js" });
const app = context.window.__homeTest;

assert.equal(app.normalize("ISKENDERIYE"), "iskenderiye");
assert.equal(app.normalize("İSKENDERİYE"), "iskenderiye");

elements["#siteSearch"].value = "Babil";
app.openSearch();
assert.equal(elements["#siteSearch"].value, "", "arama yeniden açılırken eski sorgu temizlenmeli");
assert.match(elements["#searchResults"].innerHTML, /İskenderiye/);
assert.ok(elements["#siteSearch"].focused, "arama alanı odaklanmalı");

app.initNavigation();
app.initSearch();
elements["#menuToggle"].dispatch("click");
assert.equal(elements["#menuToggle"].getAttribute("aria-expanded"), "true");
assert.equal(elements["#menuToggle"].getAttribute("aria-label"), "Menüyü kapat");

app.renderFilters();
app.setMobileFilterOpen(true);
categoryButtons.find((button) => button.dataset.category === "Bilim & Teknoloji").dispatch("click");
assert.equal(elements["#mobileFilterToggle"].getAttribute("aria-expanded"), "false");
assert.equal(elements["#mobileFilterToggle"].textContent, "Konuları göster");

app.setMenuOpen(true);
app.setMobileFilterOpen(true);
document.dispatch("keydown", { key: "Escape" });
assert.equal(elements["#menuToggle"].getAttribute("aria-expanded"), "false");
assert.equal(elements["#menuToggle"].getAttribute("aria-label"), "Menüyü aç");
assert.equal(elements["#mobileFilterToggle"].getAttribute("aria-expanded"), "false");
assert.equal(elements["#mobileFilterToggle"].textContent, "Konuları göster");

console.log("ana sayfa etkileşimleri: tamam");
