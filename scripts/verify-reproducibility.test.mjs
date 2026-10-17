import {test} from 'node:test';
import assert from 'node:assert/strict';
import {requireSuccess,maximumError,pageMetrics} from './verify-reproducibility.mjs';
test('HTTP200中的Python错误不能判成功',()=>assert.throws(()=>requireSuccess({status:200,json:{outputs:[{type:'error',ename:'RuntimeError',evalue:'bad setup'}]}},'setup'),/RuntimeError/));
test('HTTP失败和缺输出结构都被拒绝',()=>{
  assert.throws(()=>requireSuccess({status:422,json:{}},'setup'),/HTTP 422/);
  assert.throws(()=>requireSuccess({status:200,json:{}},'cell'),/缺outputs/);
});
test('数值误差检查整个数组而非只看终值',()=>assert.equal(maximumError([[0,0],[1,1]],[[.01,0],[1,1]]),.01));
test('非有限数和漏采样点不得通过数值对账',()=>{
  assert.throws(()=>maximumError([NaN],[0]),/非有限/);assert.throws(()=>maximumError([1],[1,2]),/长度不同/);
});
test('页面200不能代替H2和数学检查',()=>assert.deepEqual(pageMetrics('<h1>x</h1><h2 id="a">a</h2><span class="katex-error">bad</span>'),{h1:1,h2:1,katexElements:1}));
