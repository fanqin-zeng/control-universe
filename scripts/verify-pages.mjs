import {readFileSync,existsSync,readdirSync,statSync} from 'node:fs';
import {resolve,join} from 'node:path';
import assert from 'node:assert/strict';
import {parseCatalog} from './lib-catalog.mjs';
import {lessonRedirects} from '../lib/lesson-compat.mjs';
const base=process.env.NEXT_PUBLIC_BASE_PATH||'/control-universe';
const catalog=parseCatalog(readFileSync('content/catalog.ts','utf8'));let count=0;
const pythonPolicy=JSON.parse(readFileSync('lib/python-support.json','utf8'));
for(const ch of catalog)for(const lesson of ch.lessons){const html=readFileSync(resolve('out',ch.slug,lesson.slug,'index.html'),'utf8');assert(!html.includes('class="katex-error"'),ch.slug+'/'+lesson.slug+' has KaTeX error');assert(html.includes('href="'+base+'/katex/katex.min.css"'));assert(!html.includes('Jupyter 连接失败'));if(lesson.status!=='empty'){assert.equal((html.match(/<h2[ >]/g)||[]).length,lesson.subsections.length,ch.slug+'/'+lesson.slug);if(html.includes('在线版展示实验代码'))assert(!html.includes('初始化中...'));}const entries=pythonPolicy.lessons[ch.slug+'/'+lesson.slug]?.notebooks||[];if(entries.some(n=>n.status==='enabled'))assert(html.includes(pythonPolicy.workerHash),'Missing worker version');assert.equal((html.match(/data-python-mode="browser"/g)||[]).length,entries.filter(n=>n.status==='enabled').length,'Browser notebook policy mismatch: '+ch.slug+'/'+lesson.slug);assert.equal((html.match(/data-python-mode="code"/g)||[]).length,entries.filter(n=>n.status==='code').length,'Code-only notebook policy mismatch: '+ch.slug+'/'+lesson.slug);count++;}
for(const [old,target]of lessonRedirects){const html=readFileSync(resolve('out',old,'index.html'),'utf8');assert(html.includes(base+'/'+target+'/'));assert(html.includes('location.search+location.hash'));}
const walk=d=>readdirSync(d).flatMap(f=>{const p=join(d,f);return statSync(p).isDirectory()?walk(p):[p];});let bytes=0;
for(const file of walk('out')){bytes+=statSync(file).size;if(!file.endsWith('.html'))continue;const html=readFileSync(file,'utf8');for(const m of html.matchAll(/(?:href|src)="(\/[^"#]*)"/g)){const path=m[1].split(/[?#]/)[0];assert(path===base||path.startsWith(base+'/'),'unprefixed URL '+path+' in '+file);const local=decodeURIComponent(path.slice(base.length));const abs=resolve('out','.'+local);assert(existsSync(abs),'missing local target '+path+' in '+file);}}
assert(bytes<1024**3,'Pages artifact exceeds 1GiB');console.log(JSON.stringify({pass:true,lessons:count,legacyRoutes:lessonRedirects.length,bytes,basePath:base}));
