// Same redirect generation as scripts/build-pages.mjs, with an isolated export directory.
// Manual next build alone intentionally omits this normal build:pages postprocessing.
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {lessonRedirects} from '../../../lib/lesson-compat.mjs';
const root=resolve(process.argv[2]),base='/control-universe';
for(const [old,target] of lessonRedirects){
 const destination=base+'/'+target+'/',directory=resolve(root,old);mkdirSync(directory,{recursive:true});
 writeFileSync(resolve(directory,'index.html'),`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>课程地址已更新</title><link rel="canonical" href="${destination}"><meta http-equiv="refresh" content="0;url=${destination}"><script>location.replace(${JSON.stringify(destination)}+location.search+location.hash)</script><body><a href="${destination}">打开课程新地址</a></body></html>`);
}
writeFileSync(resolve(root,'.nojekyll'),'');
const old=readFileSync(resolve(root,'estimation/h-infinity-filter/index.html'),'utf8');
if(!old.includes('/control-universe/robust/h-infinity-filter/'))throw Error('Missing historical redirect');
console.log('PASS normal build:pages redirect postprocessing in private export directory',lessonRedirects.length);
