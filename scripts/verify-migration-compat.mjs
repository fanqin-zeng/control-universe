/** S03真实HTTP/DOM回归；覆盖旧入口、片段、活跃引用和历史台账保留。 */
import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import http from 'node:http';
import {parseCatalog} from './lib-catalog.mjs';
import {lessonRedirects,legacyAnchors,canonicalizeLessonLinks,resolveHistoricalLesson} from '../lib/lesson-compat.mjs';
import {compileMDX} from 'next-mdx-remote/rsc';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
const get=path=>new Promise((resolve,reject)=>{
  const request=http.get({hostname:'127.0.0.1',port:8080,path,timeout:20000},r=>{let body='';r.setEncoding('utf8');r.on('data',s=>body+=s);r.on('end',()=>resolve({status:r.statusCode,location:r.headers.location,body}));});
  request.on('error',reject);request.on('timeout',()=>request.destroy(Error('HTTP timeout')));
});
const report={checks:[],redirects:[],anchors:[],references:[],history:[]};
const check=(ok,label)=>{report.checks.push({label,pass:Boolean(ok)});};
const ids=html=>new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
const headings=html=>[...html.matchAll(/<h2\b[^>]*\bid="([^"]+)"/g)].map(m=>m[1]);
const read=p=>readFileSync(p,'utf8');
const old=p=>execFileSync('git',['show','bfe7de9:'+p],{encoding:'utf8'});
try{
  const catalog=parseCatalog(read('content/catalog.ts')),keys=new Set(catalog.flatMap(c=>c.lessons.map(l=>c.slug+'/'+l.slug))),cache=new Map();
  const page=async key=>{if(!cache.has(key))cache.set(key,await get('/'+key));return cache.get(key);};
  for(const [source,target]of lessonRedirects){
    const r=await get('/'+source),dest=await page(target),query=await get('/'+source+'?compat=s03');
    check(r.status===308&&r.location==='/'+target&&dest.status===200,'直接308→200 '+source);
    check(query.status===308&&query.location==='/'+target+'?compat=s03','查询参数保留 '+source);
    check(keys.has(target)&&!lessonRedirects.some(r=>r[0]===target),'跳转目标无链/环 '+source);
    report.redirects.push({source,target,http:r.status,location:r.location,final:dest.status,queryLocation:query.location});
  }
  for(const target of ['modern/lyapunov-modern','estimation/kalman-filter','multi-agent/distributed-mpc']){
    const source=old('content/'+target+'.mdx'),components={};
    for(const m of source.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g))components[m[1]]=()=>React.createElement('div');
    const {content}=await compileMDX({source,options:{parseFrontmatter:true,mdxOptions:{remarkPlugins:[remarkGfm,remarkMath],rehypePlugins:[rehypeKatex,rehypeSlug]}},components});
    const before=renderToStaticMarkup(content),live=await page(target),liveIds=ids(live.body),oldIds=ids(before);
    check(JSON.stringify(headings(before))===JSON.stringify(headings(live.body)),'H2 ID序列不变 '+target);
    const missing=[...oldIds].filter(id=>!liveIds.has(id));check(!missing.length,'所有迁移前渲染ID保留 '+target);
    const aliases=Object.entries(legacyAnchors[target]??{});for(const [alias,dest]of aliases){check(liveIds.has(alias)&&liveIds.has(dest),'旧片段与目标存在 '+target+'#'+alias);check(live.body.includes(`data-legacy-anchor="${dest}"`),'旧片段归属 '+target+'#'+alias);}
    report.anchors.push({target,oldRenderedIds:oldIds.size,missing,oldH2:headings(before),currentH2:headings(live.body),aliases});
  }
  const files=[];function walk(dir){for(const e of readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())walk(p);else if(p.endsWith('.mdx'))files.push(p);}}walk('content');
  for(const file of files){const source=read(file),prior=old(file);check(source===canonicalizeLessonLinks(prior)||source.replace(/\r\n/g,'\n')===canonicalizeLessonLinks(prior).replace(/\r\n/g,'\n'),'仅URL规范化 '+file);
    for(const [historical]of lessonRedirects)check(!source.includes('](/'+historical+')')&&!source.includes('](/'+historical+'#'),'无活跃旧URL '+file+' '+historical);
    for(const match of source.matchAll(/\]\(\/(estimation\/kalman-filter|multi-agent\/distributed-mpc)(#[^)]*)?\)/g)){
      const target=match[1],p=await page(target);check(p.status===200,'引用可达 '+file+' → '+target);if(match[2])check(ids(p.body).has(decodeURIComponent(match[2].slice(1))),'引用片段存在 '+file);
      report.references.push({file,target,fragment:match[2]??null,http:p.status});
    }
  }
  for(const file of ['.agent/semester-03-baseline.json','.agent/semester-03/s01-migration-inventory.json','.agent/semester-03/s02-delivery-tracker-before.md']){
    const unchanged=read(file).replace(/\r\n/g,'\n')===old(file).replace(/\r\n/g,'\n');check(unchanged,'历史证据未改 '+file);report.history.push({file,unchanged});
  }
  const oldTracker=read('.agent/semester-03/s02-delivery-tracker-before.md'),tracker=read('.agent/delivery-tracker.md');
  check((oldTracker.match(/^\| \[x\]/gm)||[]).length===29&&(tracker.match(/^\| \[x\]/gm)||[]).length===29,'旧v1.3勾选保留29');
  check(resolveHistoricalLesson('modern/kalman-filter')==='estimation/kalman-filter','历史日志source映射');
  report.pass=report.checks.every(c=>c.pass);
}catch(error){report.pass=false;report.error=String(error.stack||error);}
writeFileSync('.agent/semester-03/s03-compat-results.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pass:report.pass,checks:report.checks.length,redirects:report.redirects.length,anchorPages:report.anchors.length,references:report.references.length,error:report.error}));
if(!report.pass){for(const c of report.checks.filter(c=>!c.pass))console.error('FAIL',c.label);process.exitCode=1;}
