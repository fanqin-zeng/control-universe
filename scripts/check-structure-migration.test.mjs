import test from 'node:test';
import assert from 'node:assert/strict';
import {readStructure,validateStructure} from './check-structure-migration.mjs';
const base=await readStructure();
test('实际目录与205目标/56正文/9跳转一致',()=>assert.deepEqual(validateStructure(base).errors,[]));
function reject(name,mutate,pattern){test(name,()=>{const input={...base,catalog:structuredClone(base.catalog),redirects:structuredClone(base.redirects)};mutate(input);assert.match(validateStructure(input).errors.join('\n'),pattern);});}
reject('移动正文遗失',i=>i.readMdx=p=>p==='estimation/kalman-filter'?null:base.readMdx(p),/正文遗失/);
reject('正文悄悄改动',i=>i.readMdx=p=>p==='multi-agent/distributed-mpc'?base.readMdx(p)+'\nchanged':base.readMdx(p),/正文遗失\/漂移/);
reject('空课冒充交付',i=>i.catalog.find(c=>c.slug==='math').lessons[0].status='v1.3',/历史状态被改写/);
reject('旧入口丢失',i=>i.redirects=i.redirects.filter(r=>r.source!=='/modern/kalman-filter'),/旧URL无直接/);
reject('跳转成环',i=>i.redirects.push({source:'/estimation/kalman-filter',destination:'/modern/kalman-filter',permanent:true}),/成链\/环/);
reject('采样先修被删',i=>i.catalog.find(c=>c.slug==='discrete-sampled').lessons.find(l=>l.slug==='z-transform-analysis').prereq=[],/采样先修被删除/);
reject('悬空先修',i=>i.catalog.find(c=>c.slug==='math').lessons[0].prereq=['math/nonexistent'],/悬空/);
reject('迁移丢失原小节',i=>i.catalog.find(c=>c.slug==='estimation').lessons.find(l=>l.slug==='kalman-filter').subsections=[],/原小节元数据漂移/);
