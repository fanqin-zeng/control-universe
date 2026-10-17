/** S02迁移后验收；S01快照保持迁移前证据。 */
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {parseCatalog} from './lib-catalog.mjs';
import {rows,reviewGraph} from './check-migration-review.mjs';
export function validateStructure({catalog,plan,inventory,readMdx,redirects,oldCatalog}){
  const errors=[],check=(ok,msg)=>{if(!ok)errors.push(msg);};
  const chapters=rows(plan,'S3-CHAPTERS').filter(c=>c[2]!=='slug').sort((a,b)=>+a[0]-b[0]);
  const lessons=rows(plan,'S3-LESSONS'),byId=new Map(lessons.map(l=>[l[0],l]));
  const actual=new Map(catalog.flatMap(c=>c.lessons.map(l=>[`${c.slug}/${l.slug}`,l])));
  check(JSON.stringify(catalog.map(c=>c.slug))===JSON.stringify(chapters.map(c=>c[2])),'章节顺序/覆盖不符');
  check(actual.size===205&&catalog.reduce((n,c)=>n+c.lessons.length,0)===205,'课程数或路径唯一性不符');
  const hash=s=>createHash('sha256').update(s.replace(/\r\n/g,'\n')).digest('hex');
  for(const [i,c]of catalog.entries()){
    check(c.order===i&&c.title===chapters[i]?.[3],`章节元数据不符 ${c.slug}`);
    check(JSON.stringify(c.lessons.map(l=>l.slug))===JSON.stringify(lessons.filter(l=>l[1].split('/')[0]===c.slug).map(l=>l[1].split('/')[1])),`章内顺序不符 ${c.slug}`);
  }
  for(const d of inventory.dependencies){
    const target=byId.get(d.id),l=actual.get(target[1]);if(!l){errors.push(`缺目标 ${d.id}`);continue;}
    check(l.title===target[2]&&l.type===d.type&&l.level===d.level,`课名/课型/难度不符 ${d.id}`);
    check(JSON.stringify(l.prereq||[])===JSON.stringify(d.prereq.map(p=>byId.get(p)[1])),`先修不符 ${d.id}`);
    const written=inventory.sources.filter(s=>s.target===target[1]&&s.hasMdx);
    check(l.status===(written[0]?.status||'empty'),`历史状态被改写 ${d.id}`);
    const source=readMdx(target[1]);
    if(written.length){
      check(source!==null&&hash(source)===written[0].currentNormalizedSha256,`正文遗失/漂移 ${d.id}`);
      const old=oldCatalog.flatMap(c=>c.lessons.map(l=>({...l,path:c.slug+'/'+l.slug}))).find(l=>l.path===written[0].source);
      check(JSON.stringify(l.subsections)===JSON.stringify(old?.subsections),`原小节元数据漂移 ${d.id}`);
    }
    else check(source===null&&!l.subsections?.length,`空课被预写 ${d.id}`);
  }
  for(const s of inventory.sources.filter(s=>s.source!==s.target)){
    check(!actual.has(s.source)&&readMdx(s.source)===null,`旧资产未撤 ${s.source}`);
    check(redirects.some(r=>r.source==='/'+s.source&&r.destination==='/'+s.target&&r.permanent===true),`旧URL无直接永久跳转 ${s.source}`);
  }
  for(const r of redirects){check(!redirects.some(t=>t.source===r.destination),`重定向成链/环 ${r.source}`);check(actual.has(r.destination.slice(1)),`跳转悬空 ${r.source}`);}
  check(redirects.some(r=>r.source==='/modern/linear-system-theory'&&r.destination==='/modern/lyapunov-modern'),'既有旧URL丢失');
  const pathId=new Map(lessons.map(l=>[l[1],l[0]]));
  errors.push(...reviewGraph(lessons,lessons.filter(l=>actual.has(l[1])).map(l=>{const a=actual.get(l[1]);return [l[0],a.type,a.level,(a.prereq||[]).map(p=>pathId.get(p)||p).join(';')||'—'];})));
  return {errors,stats:{chapters:catalog.length,lessons:actual.size,mdx:inventory.sources.filter(s=>s.hasMdx).length,empty:[...actual.values()].filter(l=>l.status==='empty').length,edges:[...actual.values()].reduce((n,l)=>n+(l.prereq||[]).length,0),redirects:redirects.length}};
}
export async function readStructure(){
  const read=p=>readFileSync(p,'utf8');const config=(await import('../next.config.mjs')).default;
  return {catalog:parseCatalog(read('content/catalog.ts')),oldCatalog:parseCatalog(execFileSync('git',['show','4c06e93:content/catalog.ts'],{encoding:'utf8'})),plan:read('.agent/semester-03-plan.md'),inventory:JSON.parse(read('.agent/semester-03/s01-migration-inventory.json')),redirects:await config.redirects(),readMdx:p=>existsSync('content/'+p+'.mdx')?read('content/'+p+'.mdx'):null};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){try{const r=validateStructure(await readStructure());console.log(JSON.stringify(r.stats));if(r.errors.length){r.errors.forEach(e=>console.error('FAIL',e));process.exitCode=1;}else console.log('PASS S02 structure migration');}catch(e){console.error(e);process.exitCode=1;}}
