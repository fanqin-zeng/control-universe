import test from 'node:test';
import assert from 'node:assert/strict';
import {renderedHeadings} from './rendered-headings.mjs';
import {assertHeadingTargets} from '../lib/mdx-headings.mjs';
import {normalizeMigrationSource} from '../lib/lesson-compat.mjs';
import {compileMDX} from 'next-mdx-remote/rsc';
import {headingRemarkPlugins,headingRehypePlugins} from '../lib/mdx-headings.mjs';
import {renderToStaticMarkup} from 'react-dom/server';
const source='# 标题\n\n### 数值例子\n\n## 数值例子\n\n## $H_\\infty$ 范数\n\n## 数值例子';
test('共享Math/KaTeX/全级Slug与真实React渲染ID一致',async()=>{
  const r=await renderedHeadings(source,'fixture/heading');
  const {content}=await compileMDX({source,options:{mdxOptions:{remarkPlugins:headingRemarkPlugins,rehypePlugins:headingRehypePlugins('fixture/heading')}}});
  const html=renderToStaticMarkup(content),actual=[...html.matchAll(/<h2\b[^>]*id="([^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(r.h2.map(h=>h.id),actual);assert.equal(actual[0],'数值例子-1');assert.equal(actual[2],'数值例子-2');assert.notEqual(actual[1],'h_infty-范数');
});
test('数量相同但链接错误也必须失败',async()=>{
  const r=await renderedHeadings(source,'fixture/heading'),correct=r.h2.map(h=>({slug:h.id}));
  assert.deepEqual(assertHeadingTargets(correct,r.h2,r.ids),[]);
  const bad=structuredClone(correct);bad[0].slug='不存在';assert.match(assertHeadingTargets(bad,r.h2,r.ids).join('\n'),/DOM缺少目标/);
});
test('同名H3占用原ID不能冒充H2已对齐',async()=>{
  const r=await renderedHeadings(source,'fixture/heading'),bad=r.h2.map(h=>({slug:h.id}));bad[0].slug='数值例子';
  assert.ok(r.ids.includes('数值例子'));assert.match(assertHeadingTargets(bad,r.h2,r.ids).join('\n'),/H2\[0\]/);
});
test('坏MDX不能降级为空标题成功',async()=>assert.rejects(renderedHeadings('<Broken value={','fixture/bad')));
test('W05只增加换行，保留boxed闭合花括号和双美元',()=>{
  const old='$$\\boxed{\\begin{aligned}\nx=1\n\\end{aligned}}$$';const fixed=normalizeMigrationSource(old,'mpc/mpc-principle');
  assert.equal(fixed,'$$\n\\boxed{\\begin{aligned}\nx=1\n\\end{aligned}}\n$$');assert.equal(fixed.replaceAll('\n',''),old.replaceAll('\n',''));
  assert.equal(normalizeMigrationSource(old,'other/lesson'),old);
});
