import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const expected = [
  'olu-deniz-parsomenleri','tufan-bilmecesi','hatirlamadigimiz-felaketler','babil','ayni-cumlede','petra','shushtar','stonehenge','sumer','angkor','tas-tepeler','machu-picchu','chichen-itza','kapadokya','persepolis','iskenderiye','milankovic','roma-etki','roma-hristiyanlik','isa-tarihsellik','mit-ve-sicil','gokteki-ayi','gec-kalan-haberci','kendi-kaniti','calinan-ates','herkesin-saati','yilin-iki-kapisi'
];
const dir = path.join(ROOT, 'assets', 'covers-data');
const files = (await readdir(dir)).filter(name => name.endsWith('.js'));
for (const slug of expected) {
  const file = path.join(dir, `${slug}.js`);
  await access(file);
  const source = await readFile(file, 'utf8');
  if (!source.includes(`ITCoverData['${slug}']`) || !source.includes('data:image/webp;base64,')) throw new Error(`Geçersiz kapak verisi: ${slug}`);
}
const context={window:{}};
vm.runInNewContext(await readFile(path.join(ROOT,'assets','articles-data.js'),'utf8'),context);
if (context.window.ITArticles.length !== 27) throw new Error(`Yazı sayısı 27 değil: ${context.window.ITArticles.length}`);
for (const article of context.window.ITArticles) {
  const expectedPath=`assets/covers/${article.slug}.webp`;
  if (article.cover !== expectedPath) throw new Error(`Kapak yolu hatalı: ${article.slug} -> ${article.cover}`);
}
const index=await readFile(path.join(ROOT,'index.html'),'utf8');
for (const slug of expected) if (!index.includes(`assets/covers-data/${slug}.js`)) throw new Error(`index.html kapak betiği eksik: ${slug}`);
if (!index.includes('assets/logo-mark.svg')) throw new Error('Yeni logo index.html içinde kullanılmıyor');
console.log(`Editoryal kapak testi başarılı: ${expected.length} yazı, ${files.length} kapak betiği.`);
