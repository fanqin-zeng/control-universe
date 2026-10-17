import test from 'node:test';
import assert from 'node:assert/strict';
import {lessonRedirects,resolveHistoricalLesson,canonicalizeLessonLinks,legacyAnchors,rehypeLegacyAnchors} from '../lib/lesson-compat.mjs';
import {readFileSync,mkdtempSync,mkdirSync,writeFileSync,unlinkSync,rmdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {compileMDX} from 'next-mdx-remote/rsc';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';

test('9旧URL和历史日志身份映射到唯一终点',()=>{
  assert.equal(lessonRedirects.length,9);assert.equal(new Set(lessonRedirects.map(r=>r[0])).size,9);
  for(const [old,target]of lessonRedirects){assert.equal(resolveHistoricalLesson(old),target);assert.equal(resolveHistoricalLesson(target),target);}
  assert.equal(resolveHistoricalLesson('unknown/lesson'),'unknown/lesson');
});
test('只改Markdown链接URL，保留fragment/查询/文本',()=>{
  assert.equal(canonicalizeLessonLinks('[旧](/modern/kalman-filter#测试) 与 modern/kalman-filter'), '[旧](/estimation/kalman-filter#测试) 与 modern/kalman-filter');
  assert.equal(canonicalizeLessonLinks('[旧](/mpc/distributed-mpc?x=1#测试)'), '[旧](/multi-agent/distributed-mpc?x=1#测试)');
});
test('代码中的旧URL示例保留',()=>{
  const source='`[示例](/modern/kalman-filter)`\n```python\ntext="[旧](/mpc/distributed-mpc)"\n```';
  assert.equal(canonicalizeLessonLinks(source),source);
});
const heading=(id)=>({type:'element',tagName:'h2',properties:{id},children:[{type:'text',value:'标题'}]});
test('旧别名插入目标标题内，保持标题ID和文本',()=>{
  const tree={children:Object.values(legacyAnchors['multi-agent/distributed-mpc']).map(heading)};
  rehypeLegacyAnchors({lesson:'multi-agent/distributed-mpc'})(tree);
  assert.equal(tree.children[0].children[0].properties.id,'为什么需要分布式MPC');
  assert.equal(tree.children[0].properties.id,'为什么需要分布式mpc');assert.equal(tree.children[0].children[1].value,'标题');
});
test('目标缺失不能静默忽略',()=>assert.throws(()=>rehypeLegacyAnchors({lesson:'multi-agent/distributed-mpc'})({children:[]}),/目标缺失/));
test('旧ID占用不能静默覆盖',()=>assert.throws(()=>rehypeLegacyAnchors({lesson:'multi-agent/distributed-mpc'})({children:[...Object.values(legacyAnchors['multi-agent/distributed-mpc']).map(heading),heading('数值例子')]}),/冲突/));
test('其它课程不注入锚点',()=>{const tree={children:[heading('test')]},old=structuredClone(tree);rehypeLegacyAnchors({lesson:'modern/state-space'})(tree);assert.deepEqual(tree,old);});
test('真实verify CLI能把旧章日志归到迁移后课程，未知日志不冒充已有记录',()=>{
  const root=mkdtempSync(join(tmpdir(),'s03-log-fixture-'));
  const dirs=['content','content/estimation','docs','docs/discuss-log','docs/discuss-log/semester-02','docs/discuss-log/semester-02/01-modern'];
  const files=['content/catalog.ts','content/estimation/kalman-filter.mdx','docs/discuss-log/semester-02/01-modern/01-kalman-filter.md'];
  try{
    for(const dir of dirs)mkdirSync(join(root,dir));
    writeFileSync(join(root,files[0]),'export const catalog = [{slug:"estimation",title:"状态估计",lessons:[{slug:"kalman-filter",title:"测试",status:"draft"}]}];');
    writeFileSync(join(root,files[1]),'# 测试\n\n## 习题\n1. 测试\n\n## 答案\n1. 测试');
    writeFileSync(join(root,files[2]),'# Synthetic log fixture; not a course delivery');
    const run=spawnSync(process.execPath,['scripts/verify-lesson.mjs','estimation/kalman-filter','--root',root,'--no-http'],{encoding:'utf8'});
    assert.match(run.stdout,/01-modern\/01-kalman-filter.md/);
    assert.doesNotMatch(run.stdout,/没有讨论日志/);
  }finally{for(const file of files)try{unlinkSync(join(root,file));}catch{}for(const dir of dirs.reverse())rmdirSync(join(root,dir));rmdirSync(root);}
});
test('真实MDX/Katex/Slug流水线渲染迁移页三个旧ID，标题文本不变',async()=>{
  const source=readFileSync('content/multi-agent/distributed-mpc.mdx','utf8');
  const compile=async withAliases=>{
    const {content}=await compileMDX({source,options:{parseFrontmatter:true,mdxOptions:{remarkPlugins:[remarkGfm,remarkMath],rehypePlugins:[rehypeKatex,rehypeSlug,...(withAliases?[[rehypeLegacyAnchors,{lesson:'multi-agent/distributed-mpc'}]]:[])]}},components:{JupyterNotebook:()=>React.createElement('div')}});
    return renderToStaticMarkup(content);
  };
  const old=await compile(false),html=await compile(true);
  assert.equal(html.replace(/<span[^>]*data-legacy-anchor="[^"]*"[^>]*><\/span>/g,''),old);
  for(const [alias,target]of Object.entries(legacyAnchors['multi-agent/distributed-mpc'])){
    assert.ok(html.includes(`id="${alias}"`));assert.ok(html.includes(`data-legacy-anchor="${target}"`));
  }
});
