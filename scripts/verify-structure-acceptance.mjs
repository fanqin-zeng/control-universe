/** S04生产结构验收；不把既有widget/教学债务计成课程交付。 */
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import http from 'node:http';
import {readStructure,validateStructure} from './check-structure-migration.mjs';
import {renderedHeadings} from './rendered-headings.mjs';
import {assertHeadingTargets} from '../lib/mdx-headings.mjs';
import {legacyAnchors,lessonRedirects,normalizeMigrationSource} from '../lib/lesson-compat.mjs';
import {extractNotebooks} from './lib-mdx.mjs';
const get=path=>new Promise((resolve,reject)=>{
  const req=http.get({hostname:'127.0.0.1',port:8080,path,timeout:20000},r=>{let body='';r.setEncoding('utf8');r.on('data',s=>body+=s);r.on('end',()=>resolve({status:r.statusCode,location:r.headers.location,body}));});req.on('error',reject);req.on('timeout',()=>req.destroy(Error('timeout')));
});
const read=p=>readFileSync(p,'utf8');
const old=p=>execFileSync('git',['show','8c9b07c:'+p],{encoding:'utf8'});
const hash=s=>createHash('sha256').update(s.replace(/\r\n/g,'\n')).digest('hex');
const report={checks:[],pages:[],redirects:[],archives:[],dependencyReview:[]};
const check=(ok,label)=>report.checks.push({pass:Boolean(ok),label});
try{
  const input=await readStructure(),structure=validateStructure(input);check(!structure.errors.length,'结构与来源验证 '+structure.errors.join(';'));
  const all=new Map(input.catalog.flatMap(c=>c.lessons.map(l=>[c.slug+'/'+l.slug,l]))),cache=new Map();
  for(const [key,l]of all){
    const page=await get('/'+key);cache.set(key,page);check(page.status===200,'HTTP '+key);
    if(l.status==='empty'){report.pages.push({key,status:page.status,empty:true});continue;}
    const ids=[...page.body.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]),h2=[...page.body.matchAll(/<h2\b[^>]*\bid="([^"]+)"/g)].map(m=>({id:m[1]}));
    const errors=assertHeadingTargets(l.subsections,h2,ids),katexErrors=(page.body.match(/class="[^"]*\bkatex-error\b[^"]*"/g)||[]).length;
    check(!errors.length,'真实H2/侧栏目标 '+key+' '+errors.join(';'));check(katexErrors===0,'数学渲染 '+key);check(new Set(ids).size===ids.length,'DOM ID唯一 '+key);
    const prior=old('content/'+key+'.mdx'),current=read('content/'+key+'.mdx');
    check(hash(current)===hash(normalizeMigrationSource(prior,key)),'教学内容只含已登记URL/围栏修复 '+key);
    // Git对象LF与Windows工作树CRLF不能构成代码变更；JS模板换行语义为LF。
    const normalize=value=>typeof value==='string'?value.replace(/\r\n/g,'\n'):value;
    const codes=source=>extractNotebooks(source).map(n=>({setup:normalize(n.setup?.value),cells:n.cells.map(c=>normalize(c.value))}));
    check(JSON.stringify(codes(prior))===JSON.stringify(codes(current)),'实际求值notebook代码保留 '+key);
    const before=await renderedHeadings(prior,undefined),missingOld=before.ids.filter(id=>!ids.includes(id));check(!missingOld.length,'原有真实ID保留 '+key);
    const aliases=Object.entries(legacyAnchors[key]??{});for(const [alias,target]of aliases){check(ids.includes(alias)&&ids.includes(target),'旧ID兼容 '+key+'#'+alias);check(page.body.includes(`data-legacy-anchor="${target}"`),'旧ID归属 '+key+'#'+alias);}
    report.pages.push({key,status:page.status,h2:h2.length,expected:l.subsections.length,katexErrors,anchorErrors:errors,missingOld,aliases:aliases.length});
  }
  for(const [source,target]of lessonRedirects){const r=await get('/'+source+'?compat=s04');check(r.status===308&&r.location==='/'+target+'?compat=s04'&&cache.get(target)?.status===200,'直接跳转/查询 '+source);report.redirects.push({source,target,status:r.status,location:r.location,final:cache.get(target)?.status});}
  check((await get('/math/s04-not-in-catalog')).status===404,'未知路径404');
  for(const name of ['bode-margins-explorer','first-order-comparison-explorer']){const before=hash(old('components/wiki/'+name+'.tsx')),after=hash(read('archive/unreferenced-components/'+name+'.tsx.txt'));check(before===after,'归档代码未改 '+name);report.archives.push({name,before,after});}
  const inventory=JSON.parse(read('.agent/semester-03/s01-migration-inventory.json'));
  for(const source of inventory.isolated){const target=inventory.sources.find(s=>s.source===source.source).target,pre=all.get(target)?.prereq??[];check(pre.length>0,'原孤立课已核 '+source.source);report.dependencyReview.push({source:source.source,target,prereq:pre});}
  for(const chapter of inventory.zeroChapters){const targets=inventory.sources.filter(s=>s.source.startsWith(chapter+'/')).map(s=>s.target);check(targets.every(t=>all.get(t)?.prereq?.length),'原零边章逐课已核 '+chapter);}
  report.pass=report.checks.every(c=>c.pass);report.stats={routes:all.size,written:report.pages.filter(p=>!p.empty).length,empty:report.pages.filter(p=>p.empty).length,redirects:report.redirects.length,checks:report.checks.length};
}catch(error){report.pass=false;report.error=String(error.stack||error);}
writeFileSync('.agent/semester-03/s04-acceptance-results.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pass:report.pass,...report.stats,error:report.error}));
if(!report.pass){for(const c of report.checks.filter(c=>!c.pass))console.error('FAIL',c.label);process.exitCode=1;}
