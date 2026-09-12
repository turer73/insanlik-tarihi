/* Kaynakça sayfası araması.
 *
 * İLERLEMELİ: sayfa 345 künyeyi sunucuda üretir; bu dosya yalnız SÜZER.
 * JavaScript kapalıysa arama kutusu CSS ile gizli kalır ve liste tam hâliyle
 * okunur - araç sayfalarındaki hatanın (sunucuda 51 kelime, gerisi JS)
 * tekrarlanmaması için kasıtlı.
 */
(function () {
  "use strict";
  var alan = document.getElementById("kkArama");
  var cikti = document.getElementById("kkSonuc");
  if (!alan || !cikti) return;

  document.body.classList.add("kk-arama-acik");

  var girdiler = Array.prototype.slice.call(document.querySelectorAll(".kk-girdi"));
  var bolumler = Array.prototype.slice.call(document.querySelectorAll(".kk-bolum[id]"));
  var toplam = girdiler.length;

  /* Türkçe katlama: okur "gobekli" yazınca "Göbekli", "sanliurfa" yazınca
   * "Şanlıurfa" bulunmalı.
   *
   * SIRA ÖNEMLİ - harfler küçültmeden ÖNCE katlanıyor. Ters sırada
   * "İ".toLowerCase() JavaScript'te "i" + ayrı bir birleşen nokta üretir;
   * o zaman "ipcc" araması "İPCC" künyesini bulamaz. */
  function katla(metin) {
    return String(metin || "")
      .replace(/[ıİîÎ]/g, "i")
      .replace(/[şŞ]/g, "s")
      .replace(/[ğĞ]/g, "g")
      .replace(/[üÜûÛ]/g, "u")
      .replace(/[öÖ]/g, "o")
      .replace(/[çÇ]/g, "c")
      .replace(/[âÂ]/g, "a")
      .toLowerCase();
  }

  girdiler.forEach(function (li) {
    li.dataset.katli = katla(li.getAttribute("data-ara") || "");
  });

  bolumler.forEach(function (bolum) {
    var rozet = bolum.querySelector(".kk-sayi");
    bolum.dataset.ilkSayi = rozet ? rozet.textContent : "";
  });

  function suz(sorgu) {
    var q = katla(sorgu).trim();
    var bulunan = 0;

    girdiler.forEach(function (li) {
      var gorunur = !q || li.dataset.katli.indexOf(q) !== -1;
      li.hidden = !gorunur;
      if (gorunur) bulunan += 1;
    });

    bolumler.forEach(function (bolum) {
      var kalan = bolum.querySelectorAll(".kk-girdi:not([hidden])").length;
      var rozet = bolum.querySelector(".kk-sayi");
      if (rozet) rozet.textContent = q ? String(kalan) : bolum.dataset.ilkSayi;
      bolum.hidden = Boolean(q) && kalan === 0;
    });

    if (!q) {
      cikti.textContent = "";
    } else if (bulunan === 0) {
      cikti.textContent = "eşleşme yok";
    } else {
      cikti.textContent = bulunan + " / " + toplam + " künye";
    }
  }

  var bekle = null;
  alan.addEventListener("input", function () {
    window.clearTimeout(bekle);
    bekle = window.setTimeout(function () { suz(alan.value); }, 120);
  });

  alan.addEventListener("keydown", function (olay) {
    if (olay.key === "Escape" && alan.value) {
      alan.value = "";
      suz("");
    }
  });

  // Geri/ileri düğmesiyle dolu gelen kutu boş liste göstermesin.
  if (alan.value) suz(alan.value);
})();
