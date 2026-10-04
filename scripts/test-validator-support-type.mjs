import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const folder=mkdtempSync(join(tmpdir(),'kanit-support-type-'));
try{
 const record=JSON.parse(readFileSync(join(root,'examples/finding.v2.json'),'utf8'));
 record.counter_evidence=[{id:'cikarim-itirazi',text:'Kaynak verisinin kapsamı bu genellemeyi tek başına belirlemez.',citations:[{source_ref:record.sources[0].id,locator:'s. 1121, özet',support_type:'inference'}]}];
 const fixture=join(folder,'finding.json');
 writeFileSync(fixture,JSON.stringify(record));
 const output=execFileSync(process.execPath,[join(root,'scripts/validate.mjs'),fixture,'--strict'],{encoding:'utf8'});
 assert.doesNotMatch(output,/karşı kanıt için 'inference' beklenmedik/,'Karşı çıkarım kendi türüyle kabul edilmeli');
 record.counter_evidence[0].citations[0].support_type='direct';
 writeFileSync(fixture,JSON.stringify(record));
 const direct=execFileSync(process.execPath,[join(root,'scripts/validate.mjs'),fixture],{encoding:'utf8'});
 assert.match(direct,/karşı kanıt için 'direct' beklenmedik/,'Doğrudan destek uyarısı korunmalı');
 record.counter_evidence[0].citations[0].support_type='invented';
 writeFileSync(fixture,JSON.stringify(record));
 const invalid=spawnSync(process.execPath,[join(root,'scripts/validate.mjs'),fixture],{encoding:'utf8'});
 assert.notEqual(invalid.status,0,'Şemadaki geçersiz tür reddedilmeli');
 console.log('Karşı kanıt: çıkarım kabulü, direct uyarısı ve geçersiz tür reddi doğrulandı.');
}finally{
 // Yalnız bu testin oluşturduğu sabit önekli geçici klasör.
 assert.equal(dirname(resolve(folder)),resolve(tmpdir()));
 assert.ok(basename(folder).startsWith('kanit-support-type-'));
 rmSync(folder,{recursive:true,force:true});
}
