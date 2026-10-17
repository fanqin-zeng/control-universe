import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {compareWarningSnapshot} from './check-warning-audit.mjs';
const warnings=JSON.parse(readFileSync('.agent/semester-03/s02-warnings.json','utf8')).warnings;
test('S02审计30项可复验',()=>assert.deepEqual(compareWarningSnapshot(warnings,warnings),{current:30,newOrChanged:0,resolvedCandidates:0}));
test('新警告不能被结构迁移豁免',()=>assert.equal(compareWarningSnapshot(warnings,[...warnings,{section:9,message:'新增悬空',details:[]}]).newOrChanged,1));
test('聚合成员变化仍检出',()=>{const changed=structuredClone(warnings);changed.find(w=>/已有 MDX 但无讨论日志/.test(w.message)).details[0]+=', math/new-course';assert.equal(compareWarningSnapshot(warnings,changed).newOrChanged,1);});
test('警告消失须复审',()=>assert.equal(compareWarningSnapshot(warnings,warnings.slice(1)).resolvedCandidates,1));
