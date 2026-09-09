// Katkı formu arka ucu: form gönderimini herkese açık GitHub issue'suna çevirir.
//
// Neden GitHub Issues: kayıtlar herkese açık kalır, moderasyon deponun kendi
// akışında yapılır ve ek bir veri tabanı kurulmaz. E-posta toplanmaz; yanıt
// bildirimi isteyen okur issue'ya abone olur.
//
// Gerekli ortam değişkenleri (Vercel):
//   GITHUB_TOKEN — yalnızca public_repo yetkili kişisel erişim belirteci
//   KATKI_REPO   — varsayılan: turer73/insanlik-tarihi

const TURLER = new Set(["Soru sor", "Farklı görüş sun", "Kaynak paylaş", "Düzeltme öner"]);
const REPO = process.env.KATKI_REPO || "turer73/insanlik-tarihi";
const SUREC = ["Gönderildi", "İnceleniyor", "Yayımlandı / yanıtlandı", "Metne işlendi"];

const SINIR = { ad: 80, mesaj: 4000, iddia: 300, kaynak_url: 500, kaynak_etki: 300, yazi: 80 };

function temiz(value, ustSinir, altSinir = 0) {
  const metin = String(value ?? "").trim();
  if (metin.length > ustSinir) throw new Error("alan-uzun");
  if (metin.length < altSinir) throw new Error("alan-kisa");
  return metin;
}

function urlKontrol(value) {
  const adres = String(value ?? "").trim();
  if (!adres) return "";
  if (adres.length > SINIR.kaynak_url) throw new Error("alan-uzun");
  try {
    const parsed = new URL(adres);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("url-gecersiz");
  } catch {
    throw new Error("url-gecersiz");
  }
  return adres;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ ok: false, hata: "Yalnızca POST kabul edilir." });
    return;
  }

  try {
    const govde = typeof req.body === "string" ? JSON.parse(req.body) : (req.body ?? {});
    if (String(govde.website ?? "").trim()) throw new Error("bot-korumasi");
    const tur = temiz(govde.tur, 40, 3);
    if (!TURLER.has(tur)) throw new Error("tur-gecersiz");
    const yazi = temiz(govde.yazi, SINIR.yazi, 3);
    if (!/^[a-z0-9-]+$/.test(yazi)) throw new Error("yazi-gecersiz");
    const ad = temiz(govde.ad, SINIR.ad, 2);
    const mesaj = temiz(govde.mesaj, SINIR.mesaj, 15);
    const iddia = temiz(govde.iddia, SINIR.iddia, 0);
    const kaynakEtki = temiz(govde.kaynak_etki, SINIR.kaynak_etki, 0);
    const kaynakUrl = urlKontrol(govde.kaynak_url);

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      res.status(503).json({ ok: false, hata: "Form arka ucu henüz yapılandırılmadı." });
      return;
    }

    const gun = new Date().toISOString().slice(0, 10);
    const makaleUrl = `https://kanitatlasi.com/articles/${yazi}.html`;
    const satirlar = [
      `**Katkı türü:** ${tur}`,
      `**Yazı:** ${yazi} (${makaleUrl})`,
      iddia ? `**İlgili iddia/bulgu:** ${iddia}` : "",
      kaynakUrl ? `**Kaynak:** ${kaynakUrl}` : "",
      kaynakEtki ? `**Kaynak hangi cümleyi etkiliyor:** ${kaynakEtki}` : "",
      `**Gönderen:** ${ad}`,
      "",
      mesaj,
      "",
      "---",
      `Bu katkı kanitatlasi.com katkı formuyla gönderildi. Durum: Gönderildi (${gun}). Süreç: ${SUREC.join(" → ")}.`,
      "Yanıt bildirimi istiyorsanız bu issue'ya abone olun (e-posta toplanmaz)."
    ].filter(Boolean);

    const istek = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: `[Okur katkısı] ${tur} · ${yazi}`,
        body: satirlar.join("\n"),
        labels: ["okur-katkisi"]
      })
    });

    if (!istek.ok) {
      const detay = await istek.text().catch(() => "");
      console.error(`GitHub issue açılamadı: ${istek.status} ${detay.slice(0, 300)}`);
      res.status(502).json({ ok: false, hata: "Katkı iletilemedi; lütfen tekrar deneyin." });
      return;
    }

    const sonuc = await istek.json();
    res.status(201).json({ ok: true, issue_url: sonuc.html_url, surec: SUREC.join(" → ") });
  } catch (hata) {
    const kod = ["alan-uzun", "alan-kisa", "url-gecersiz", "tur-gecersiz", "yazi-gecersiz", "bot-korumasi"].includes(hata.message) ? 400 : 500;
    res.status(kod).json({ ok: false, hata: "Gönderim doğrulanamadı." });
  }
}
