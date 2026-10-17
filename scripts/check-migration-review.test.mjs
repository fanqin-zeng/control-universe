import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {rows,reviewGraph,collectReview} from './check-migration-review.mjs';
const lessons=rows(readFileSync('.agent/semester-03-plan.md','utf8'),'S3-LESSONS');
const dependencies=rows(readFileSync('.agent/semester-03/s01-dependency-review.md','utf8'),'S01-DEPENDENCIES');
test('205课审查和来源/正文/旧边解释均完整',()=>{const r=collectReview();assert.deepEqual(r.errors,[]);assert.equal(r.stats.sources,141);assert.equal(r.stats.mdx,56);assert.equal(r.stats.isolated,30);assert.equal(r.stats.zeroChapters,7);assert.equal(r.stats.targets,205);assert.ok(r.oldEdges.every(e=>e.reason));});
for(const [name,mutate,pattern] of [
  ['漏课',d=>d.pop(),/缺课/],
  ['重复课',d=>d.push(d[0]),/重复/],
  ['未知课程',d=>d.push(['UNKNOWN-01','theory','grad','—']),/未知课程/],
  ['非法课型',d=>d[0][1]='control',/非法type/],
  ['非法难度',d=>d[0][2]='easy',/非法level/],
  ['悬空边',d=>d[0][3]='UNKNOWN-01',/悬空/],
  ['前向边及环',d=>d[0][3]='MATH-06',/依赖环/],
  ['删除真实采样先修',d=>d.find(r=>r[0]==='DISCRETE-04')[3]='DISCRETE-03',/采样先修被删除/],
  ['重复先修',d=>d.find(r=>r[0]==='MATH-04')[3]='MATH-03;MATH-03',/重复先修/],
])test(name,()=>{const d=structuredClone(dependencies);mutate(d);assert.match(reviewGraph(lessons,d).join('\n'),pattern);});
