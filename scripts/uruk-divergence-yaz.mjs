#!/usr/bin/env node
// Uruk dosyasındaki 30 kaydın tamamına divergence ve divergence_type yazar.
//
// SORUN: dosyanın 30 kaydının hepsinde popular_claim vardı ama divergence
// YOKTU. Doğrulayıcı bunu 30 uyarıyla söylüyordu: "sapmanın mekanizması
// yazılmamış". Bu, bu projenin TEMEL AYRIMININ en yeni dosyada hiç
// kurulmamış olması demek - kayıt popüler iddiayı yazıp bırakıyor, neden
// ayrıldığını söylemiyor.
//
// DIVERGENCE NE DEĞİLDİR: iddianın tersini söylemek değil. Kayıtta zaten
// claim var. Divergence'ın işi MEKANİZMAYI göstermek: popüler anlatı hangi
// adımda kayıyor - tanım mı kayıyor, ölçüt mü gizleniyor, tek olay mı
// sanılıyor, benzerlik mi kanıt sayılıyor, geç metin mi çağdaş belge
// yerine konuyor.
//
// TEKRAR EDEN ALTI MEKANİZMA bu dosyada şunlar çıktı ve divergence_type
// buna göre verildi:
//   kategori-hatasi   : soru yanlış kurulmuş (tanıma bağlı sıralamayı
//                       olgu sanmak, model çıktısını ölçüm sanmak)
//   guncellenmemis    : eski uzlaşı sürüyor (tapınak devleti, tek merkez)
//   medya-abartisi    : bulgu duyuruda büyümüş (mezar, sur yazıtı)
//   eski-ceviri       : edebî metin tarih kaydı yerine konmuş
//   hayatta-kalma-yanliligi : elimize kalan kayıt türü, geçmişin kendisi
//                       sanılmış (idari arşiv -> "edebiyat yoktu")
//   ideolojik-secim   : sonucu önceden belli olan çerçeve (Nimrod,
//                       Anunnaki, "ilk demokrasi")
//
// SINIR: kayıtların kanıt ve karşı kanıt satırlarına DOKUNULMADI. Bu betik
// yalnızca divergence ve divergence_type yazıyor; kaynakları ve iddiaları
// denetlemedi. O ayrı bir iş.

import { readFileSync, writeFileSync } from "node:fs";

const PATH = "data/findings/uruk.json";

const D = {
  "uruk-gec-dorduncu-binyil-metropol": [
    "‘İlk şehir’ bir ölçüm değil, bir SIRALAMADIR - ve sıralama hangi tanımı kullandığınıza göre değişir. Ölçek mi, anıtsal mimari mi, yazı mı, idari uzmanlaşma mı? Uruk bu ölçütlerin çoğunda güçlüdür ama Tell Brak daha erken ve eşzamanlı bir kentsel odaktır. Kaydın söylediği şey ‘Uruk büyük ve karmaşık bir kenttir’; söylemediği şey ‘bu yüzden birincidir’. Popüler anlatı ikisini tek cümlede birleştiriyor.",
    ["kategori-hatasi"],
  ],
  "uruk-dunyanin-ilk-sehri": [
    "Soru yanlış kurulmuş: ‘ilk şehir hangisi’ diye sormak, şehir olmanın keskin bir eşiği varmış gibi davranmak demek. Oysa eşiği araştırmacı seçiyor. Tell Brak’ta geç 5. ve erken 4. binyılda 130 hektarlık kentsel gelişim var; Uruk’un üstünlüğü büyüklükte değil, YAZIYI VE BÜROKRASİYİ aynı düğümde birleştirmesinde. Bu gerçek bir fark ama ‘önce/sonra’ değil, ‘farklı bileşim’ demek.",
    ["kategori-hatasi"],
  ],
  "uruk-nufusu": [
    "Verilen sayılar sayım değil MODEL ÇIKTISIDIR: alan × yapı yoğunluğu × hane büyüklüğü × boş alan oranı. Dört varsayımın her biri değiştiğinde sonuç iki katına çıkabilir ya da yarıya inebilir. ‘40 bin’ ile ‘80 bin’ arasındaki fark yeni bir buluntudan değil, farklı varsayım setlerinden geliyor. Popüler anlatı model çıktısını ölçüm gibi aktarıyor - ve genellikle tek bir sayı seçip aralığı gizliyor.",
    ["kategori-hatasi", "medya-abartisi"],
  ],
  "uruk-su-peyzaji": [
    "Bugünkü manzara geçmişin manzarası değil. Bölge bugün kurak; ama jeoarkeolojik çekirdekler erken Holosen’den itibaren tatlı su etkisini gösteriyor ve insan kanalları doğal akarsu kollarının ÜZERİNE bindirilmiş. ‘Çölün ortasında mucize’ anlatısı, bugünkü iklimi geçmişe geri yansıtıyor. Ama ters yöne de düşmemek gerekiyor: elverişli su kendiliğinden kent üretmez - bakım, emek ve koordinasyon yine gerekir.",
    ["guncellenmemis", "kategori-hatasi"],
  ],
  "uruk-eanna-anu": [
    "Yapıların adları KAZI SONRASI verilmiştir: ‘tapınak’, ‘saray’, ‘idare binası’ nitelemeleri çoğu kez sonraki dönemlerin kült bilgisinden ve mimari benzetmeden türetilir, çağdaş bir yazıttan değil. Yani elimizde kesin olan şey terası, salonu, avlusu ve nişli cephesi belgelenmiş anıtsal yapılardır; onların NE İÇİN kullanıldığı çıkarımdır. Adın kesinliği, işlevin kesinliği sanılıyor.",
    ["kategori-hatasi"],
  ],
  "uruk-beyaz-tapinak": [
    "‘İlk ziggurat’ nitelemesi yine tanıma bağlı: yapı yükseltilmiş bir teras üzerinde duruyor ama sonraki tam gelişmiş, basamaklı zigguratlardan farklı. Dahası bugün gördüğümüz üst yapı KISMİ KALINTILARA dayanan bir rekonstrüksiyon - yani çizimlerdeki kesinlik, kalıntılardaki kesinlik değil. Popüler anlatı hem sıralamayı hem de rekonstrüksiyonu olgu gibi aktarıyor.",
    ["kategori-hatasi", "medya-abartisi"],
  ],
  "uruk-yazi": [
    "Yazı bir ANDA değil, bir DİZİDE ortaya çıktı: sayaçlar, sayısal tabletler, mühürleme ve işaret standartlaşması. ‘İcat’ kelimesi bu kademeli süreci tek bir sahneye indiriyor. Üstelik en erken işaretlerin hangi konuşma dilini ne ölçüde kodladığı her zaman belirlenemez - yani elimizdeki şey ‘yazılı Sümerce’ değil, sayı ve mal kaydıdır. Uruk’un yaptığı, yazıyı icat etmek değil, bu sistemi büyük ölçekte KULLANIR hale getirmekti.",
    ["kategori-hatasi", "guncellenmemis"],
  ],
  "uruk-ilk-edebiyat": [
    "Elimize kalan kayıt türü, geçmişin kendisi sanılıyor. Arkaik tabletler idari ve listesel kayıtlardır; Gilgameş anlatılarının bilinen nüshaları çok daha geçtir. Bu, 4. binyılda anlatı olmadığını göstermez - sözlü anlatı pekâlâ daha eski olabilir. Gösterdiği şey şu: KORUNMUŞ 4. binyıl destan tableti YOKTUR. ‘Yazılmadı’ ile ‘yazıldıysa da kalmadı’ ayrı cümlelerdir ve popüler anlatı ikisini de atlayıp doğrudan ‘Uruk IV’te yazıldı’ diyor.",
    ["hayatta-kalma-yanliligi", "kategori-hatasi"],
  ],
  "enmerkar-yaziyi-icat-etti": [
    "Bir KÖKEN ANLATISI, tarih kaydı yerine konuyor. Enmerkar ve Aratta metninin korunmuş tanıkları Eski Babil dönemindendir - yani anlattığı olaydan yüzlerce yıl sonra. Ve yazının arkeolojik gelişimi anlatıdaki tek seferlik icattan hem daha eski hem daha kademelidir. Metnin değeri yalancı olmasında değil, NE GÖSTERDİĞİNDE: Mezopotamyalılar yazıyı Uruk’un siyasal ve ticari gücüyle ilişkilendiriyordu. Bu bir kültürel gerçektir, bir icat kaydı değil.",
    ["eski-ceviri", "kategori-hatasi"],
  ],
  "uruk-tapinak-devleti": [
    "ARŞİVİN TÜRÜ, EKONOMİNİN TAMAMI SANILIYOR. Elimizdeki tabletler kurumsaldır çünkü yazan ve saklayan kurumdu; hane üretimi kayıt tutmaz. Bu yüzden ‘bütün üretim tapınak tarafından yönetiliyordu’ sonucu, kaynağın kendi seçiciliğinden doğuyor. Yakın dönem araştırmalar hane üretiminin ve yerel örgütlenmenin de önemli olduğunu gösteriyor. Kurumların belirleyici olması ayrı, her şeyin kurum olması ayrı.",
    ["hayatta-kalma-yanliligi", "guncellenmemis"],
  ],
  "egimli-agizli-kase-erzak": [
    "Tek bir işlev, çok sayıda bağlama genelleniyor. Kaseler gerçekten seri üretilmiş ve çok yaygın; ama boyutları DEĞİŞKEN ve organik kalıntılar tahıl dışında et ve olası süt ürünlerini de gösteriyor. ‘Her kase bir günlük tahıl payı’ cümlesi, standart bir ölçü birimi varsayıyor - oysa değişken hacim tam da bunu zorlaştırıyor. Bazı bağlamlarda porsiyonlama için kullanılmış olabilirler; ‘bazı’ ile ‘hepsi’ arasındaki fark burada bütün iddiayı taşıyor.",
    ["kategori-hatasi", "guncellenmemis"],
  ],
  "uruk-imparatorlugu": [
    "MADDİ BENZERLİK, SİYASİ EGEMENLİK SAYILIYOR. Uruk tarzı çanak çömlek ve mimari geniş bir coğrafyada görünüyor - ama bazı yerlerde planlı güney kolonileri, başka yerlerde yerel geleneğin sürdüğü ve Uruk unsurlarının SEÇİLEREK uyarlandığı bir tablo var. İkinci durum merkezden yönetimle bağdaşmaz. Kanıtın gösterdiği şey bir imparatorluk değil, mal, insan, teknik ve sembolün dolaştığı geniş bir ağ.",
    ["kategori-hatasi", "medya-abartisi"],
  ],
  "uruk-kolonileri": [
    "Önceki kaydın tersi hata: ‘imparatorluk yoktu’ demek ‘koloni de yoktu’ demek değil. Habuba Kabira gibi planlı güney tarzı yerleşimler koloni yorumunu gerçekten destekler. Ama Tell Brak ve başka alanlarda yerel malzeme kültürüyle YAN YANA varoluş görülür. Yani tek bir etiket bütün ağa yetmiyor: bazı düğümler koloni, bazıları ticari enklav, bazıları yalnızca etkilenmiş yerel yerleşim.",
    ["kategori-hatasi"],
  ],
  "inanna-uruk": [
    "Bağın kendisi sağlam, ama KAPSAMI abartılıyor. Kamış demeti simgeleri, mühürler, sunu sahneleri ve sonraki kült geleneği İnanna bağını destekliyor. Buna karşılık tek tek erken yapıların ve adsız figürlerin kimliği çoğu kez yazıtla belirtilmez. ‘Eanna’daki her şey İnanna’ cümlesi, doğrulanmış bir ilişkiyi doğrulanmamış bir envantere genişletiyor.",
    ["kategori-hatasi"],
  ],
  "warka-vazo-kutsal-evlilik": [
    "Bir SAHNE, bir OLAY KAYDI gibi okunuyor. Vazoda su, bitki, hayvan ve sunu taşıyan insanlar, üstte İnanna simgeleriyle ilişkili bir sahne var - bu bir sunu/ritüel düzenidir. Ama figürlerin adları ve ritüelin adı YAZILI DEĞİLDİR. ‘Kutsal evlilik’ okuması olasıdır ve savunulabilir; ‘belirli bir kral ile İnanna’nın evliliğini fotoğraf gibi kaydeder’ cümlesi ise ikonografiden kimlik ve olay üretiyor.",
    ["kategori-hatasi"],
  ],
  "warka-maskesi-inanna": [
    "Kimliği veren yazıt KORUNMAMIŞTIR - iddianın tamamı buna dayanıyor. Eanna çevresinde bulunması, anıtsal ölçeği ve kadın ilahi imgesi yorumu İnanna kimliğini güçlü bir aday yapıyor; ama güçlü aday ile yazılı kesinlik aynı şey değil. Popüler anlatı ‘kesin olarak yazılıdır’ diyerek, tam da elimizde olmayan şeyi elimizdeymiş gibi gösteriyor.",
    ["provenans-yoklugu", "kategori-hatasi"],
  ],
  "uruk-rahip-kral": [
    "‘Rahip-kral’ MODERN BİR TANIMLAMADIR, antik bir unvan değil. Mühürlerde baş bantlı ve ağ desenli etekli bir erkek tipi tekrar tekrar görünüyor - ritüel, tarım, sürü ve İnanna simgeleriyle birlikte. Ama figürün adı ve tam unvanı erken sahnelerde yazılı değil; TEK BİR KİŞİ mi yoksa bir MAKAM TİPİ mi olduğu bile açık değil. Modern etiketin kesinliği, antik kaydın kesinliği sanılıyor.",
    ["kategori-hatasi"],
  ],
  "uruk-ilk-demokrasi": [
    "Edebî bir sahne, anayasal bir belge yerine konuyor. Gilgameş ve Aga anlatısında yaşlılar ve savaşabilir erkekler topluluğu görünüyor - ve bu, kolektif danışma fikrinin Mezopotamya siyasal hayalinde yer aldığını gerçekten gösteriyor. Ama metnin kendisinde kral, istemediği görüşü bırakıp desteklediği gruba gidiyor; eşit yurttaşlık, seçim ve hesap verme yok. Üstelik korunan nüshalar olaylardan yüzyıllar sonra. ‘Danışma vardı’ ile ‘demokrasi icat edildi’ arasındaki mesafeyi popüler anlatı tek adımda atlıyor.",
    ["ideolojik-secim", "eski-ceviri"],
  ],
  "gilgames-tarihsel": [
    "Varlık sorusu ile biyografi sorusu karıştırılıyor. Gilgameş’in tarihsel bir kral olması mümkündür ve bu, alanda dışlanan bir ihtimal değil. Ama mevcut kanıt onun BİYOGRAFİSİNİ - ne yaptığını, ne zaman yaşadığını, hangi yapıları diktiğini - doğrulamaya yetmiyor. Kaydın durumu bu yüzden ‘unknown’: ‘yaşamadı’ demiyor, ‘anlatılanları doğrulayamıyoruz’ diyor.",
    ["kategori-hatasi"],
  ],
  "gilgames-126-yil": [
    "Sayı bir KRONOLOJİ değil, bir TÜRÜN parçası. Sümer Krallar Listesi olağanüstü uzun saltanatları ve krallığın gökten inişi gibi teolojik şemaları birlikte taşır; 126 yıl bu şemanın içinde anlamlıdır, takvim içinde değil. Listeyi tarih cetveli gibi okumak, türünü yanlış anlamak demek. Bu, listeyi değersiz yapmaz - siyasal hafıza ve hanedan sıralaması için değerlidir, sadece başka bir şey için.",
    ["kategori-hatasi"],
  ],
  "gilgames-sur": [
    "Yapı gerçek, ATIF doğrulanmamış. Jeofizik ve kazı verileri geniş bir sur devresini gösteriyor ve Mezopotamya edebiyatı suru Gilgameş’le özdeşleştiriyor. Ama surun evreleri ve onarımları var, ve kişisel atfı doğrulayan ÇAĞDAŞ YAPI YAZITI yok. ‘Kazılar Gilgameş yaptı yazıtını buldu’ cümlesi, var olmayan bir belgeyi var sayıyor - edebî özdeşleştirmeyi epigrafik kanıta terfi ettiriyor.",
    ["medya-abartisi", "eski-ceviri"],
  ],
  "gilgames-mezari": [
    "Araştırmanın KENDİ ÇEKİNCESİ duyuruda kayboluyor. 2003 jeofizik çalışması bir yapı anomalisi saptadı ve özeti, yapının mezar olarak yorumlanabileceğini ama Gilgameş bağlantısının SPEKÜLATİF kaldığını açıkça söylüyor. Popüler aktarımda ‘yorumlanabilir’ ve ‘spekülatif’ düşüyor, ‘kesin keşif’ kalıyor. Kalıp tanıdık: ölçüm bir anomali bildirir, haber onu bir nesneye dönüştürür.",
    ["medya-abartisi"],
  ],
  "aratta-gercek-kent": [
    "Edebî bir coğrafya, haritaya oturtulmaya çalışılıyor. Metin Aratta’yı dağlık, değerli taş ve zanaatla ilişkili bir rakip olarak anlatıyor - bu ipuçları İran’a da, Anadolu’ya da, daha doğuya da uyabilir. Ve ADINI TAŞIYAN bağımsız bir buluntu yok. Birden çok bölgeye uyan bir tarif, hiçbirini kanıtlamaz; önerilerin çokluğu kesinliğin değil, belirsizliğin işareti.",
    ["kategori-hatasi"],
  ],
  "uruk-erech": [
    "Eşleştirme sağlam, ÇIKARILAN SONUÇ değil. Ad biçimi ve coğrafi sıra Erech–Uruk özdeşliğini destekliyor ve bu yaygın akademik görüş. Ama bir adın doğru eşleşmesi, o adın geçtiği metni çağdaş tarih belgesine dönüştürmez: Nimrod anlatısı edebî-soybilimsel bir çerçevedir. ‘Kutsal Kitap Uruk’u doğruluyor’ cümlesi, bir kent adının tanınmasından bütün bir kuruluş anlatısının onayını üretiyor.",
    ["kategori-hatasi", "ideolojik-secim"],
  ],
  "uruk-babil-kulesi": [
    "İki ayrı kent tek kente indiriliyor - ve bunu METNİN KENDİSİ yalanlıyor: Yaratılış listesinde Babel ve Erech AYRI adlar olarak geçer. Yani iddia, dayandığını söylediği kaynağa aykırı. Uruk’un anıtsal terasları sonraki ziggurat geleneğini anlamak için değerlidir; ama bu, onu Babil Kulesi yapmaz.",
    ["kategori-hatasi", "eski-ceviri"],
  ],
  "nimrod-uruku-kurdu": [
    "Edebî bir soybilim, kuruluş kaydı yerine konuyor. Nimrod İncil’deki soy listelerinin çerçevesinde görünür; Uruk’un oluşumu ise ondan binyıllar önceye uzanan arkeolojik evrelerle açıklanır. Çağdaş bir Mezopotamya kaydı Nimrod’u Uruk’un kurucusu olarak anmaz. Erech adının Uruk’u işaret etmesi, kentin sonraki gelenekteki güçlü hafızasını gösterir - kuruluşunu değil.",
    ["ideolojik-secim", "eski-ceviri"],
  ],
  "uruk-anunnaki-uzaylilar": [
    "İki ayrı hata üst üste biniyor. Birincisi: kentin oluşumu arkeolojik bir DİZİDE izlenebiliyor - yapı evreleri, kerpiç üretimi, idari araçlar, mühürler, yazı sisteminin kademeli gelişimi. Yani açıklanamayan bir sıçrama yok. İkincisi: ‘Anunnaki’ gerçek bir Mezopotamya terimidir ve tanrılar topluluğunu karşılar; modern dünya dışı okuma metnin anlamı değil, ona sonradan giydirilen bir çerçevedir. Gerçek bir kelimenin anlamını değiştirmek, uydurmaktan daha ikna edici görünür - iddianın gücü buradan geliyor.",
    ["ideolojik-secim", "medya-abartisi"],
  ],
  "uruk-bir-gecede-coktu": [
    "DÖNÜŞÜM, YOK OLUŞ sanılıyor. Geç 4. binyıl ağlarında gerçek bir daralma ve bölgesel yeniden yapılanma var - bu inkâr edilmiyor. Ama kent erken hanedanlık, Babil, Seleukos ve Helenistik dönemlerde yaşamayı sürdürdü ve çivi yazılı bilimsel ve kült metinleri çok daha geç tarihlere kadar Uruk’ta üretildi. ‘Bir gecede yok oldu’ anlatısı, bir düzenin değişmesini bir yerleşimin bitmesiyle karıştırıyor.",
    ["medya-abartisi", "kategori-hatasi"],
  ],
  "uruk-sadece-tarihoncesi": [
    "Kent, kendisiyle ilgili EN İLGİNÇ ANIN içine hapsediliyor. Uruk popüler anlatıda yazının doğduğu ve Gilgameş’in yaşadığı varsayılan çağa ait bir tarihöncesi yerleşim olarak duruyor. Oysa Helenistik dönemde bile Anu ve İştar/Nanaya tapınak çevreleri ve çivi yazısı bilginliği sürüyordu - yani kent, ‘ünlü’ olduğu dönemden sonra binyıllar boyunca yaşadı. Büyüklüğü ve bölgesel ağırlığı her dönemde aynı değildi; ama terk edilmedi.",
    ["guncellenmemis", "medya-abartisi"],
  ],
  "uruk-irak-adi": [
    "Ses benzerliği, ETİMOLOJİ sanılıyor. ‘Uruk’ ile ‘Irak’ kulağa yakın geliyor ve coğrafi süreklilik bu izlenimi güçlendiriyor - ama etimoloji kulakla değil, kesintisiz bir dil zinciriyle kurulur ve o zincir gösterilmiş değil. Arapça ve Orta Farsça kökenli başka açıklamalar da var. Bu, Uruk türevi olma ihtimalini ortadan kaldırmaz; ‘tartışmasız’ ifadesini ortadan kaldırır.",
    ["kategori-hatasi"],
  ],
};

/* --- uygula -------------------------------------------------------- */

const list = JSON.parse(readFileSync(PATH, "utf8"));
let yazilan = 0;
const eksik = [];

for (const r of list) {
  const d = D[r.id];
  if (!d) { eksik.push(r.id); continue; }
  if (r.divergence) { console.log(`  ATLANDI (zaten var): ${r.id}`); continue; }
  r.divergence = d[0];
  r.divergence_type = d[1];
  yazilan += 1;
}

if (eksik.length) {
  console.error(`\nKARŞILIĞI YAZILMAMIŞ KAYIT (${eksik.length}): ${eksik.join(", ")}`);
  process.exit(1);
}

writeFileSync(PATH, `${JSON.stringify(list, null, 2)}\n`, "utf8");
const kalan = list.filter((r) => r.popular_claim && !r.divergence).length;
console.log(`${PATH}: ${list.length} kayıt, ${yazilan} divergence yazıldı`);
console.log(`divergence'sız kalan: ${kalan}`);

const tip = {};
for (const r of list) for (const t of r.divergence_type ?? []) tip[t] = (tip[t] ?? 0) + 1;
console.log("\nmekanizma dağılımı:");
for (const [k, v] of Object.entries(tip).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(2)}  ${k}`);
