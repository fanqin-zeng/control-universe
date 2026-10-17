/** 运行真实课程路由模块；隔离Next服务，真实MDX编译器负责生成语法错误。 */
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import ts from 'typescript';
import {compileMDX} from 'next-mdx-remote/rsc';

const require=createRequire(import.meta.url);
const source=readFileSync(new URL('../app/(wiki)/[chapter]/[lesson]/page.tsx',import.meta.url),'utf8');
const javascript=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
const params={chapter:'classic',lesson:'fixture'};
function loadRoute({node={key:'classic/fixture',title:'样本',chapterTitle:'经典控制',skeleton:false},getLesson=async()=>({meta:{title:'样本'},content:null})}={}){
  const notFoundError=new Error('NEXT_NOT_FOUND');
  let reads=0;
  const mocks={
    'next/navigation':{notFound(){throw notFoundError;}},
    'next/link':{default:()=>null},
    '@/lib/content':{getLesson(...args){reads++;return getLesson(...args);}},
    '@/components/wiki/table-of-contents':{TableOfContents:()=>null},
    '@/components/wiki/lesson-nav':{NextUpCard:()=>null,PrereqCard:()=>null},
    '@/lib/lesson-graph':{findLesson:()=>node,nextUp:()=>({sameChapter:null,nextChapter:null}),prereqItems:()=>[],suggestedStart:()=>null},
    '@/content/catalog':{catalog:[]},
  };
  const module={exports:{}};
  new Function('require','module','exports',javascript)(name=>Object.hasOwn(mocks,name)?mocks[name]:require(name),module,module.exports);
  return {...module.exports,notFoundError,reads:()=>reads};
}
test('真实MDX语法错误从页面和metadata原样上抛，不降级404或标题',async()=>{
  const invalid=readFileSync(new URL('./fixtures/mdx-errors/unclosed-template.mdx',import.meta.url),'utf8');
  let compileError;
  await assert.rejects(compileMDX({source:invalid}),err=>{compileError=err;return /error compiling MDX/.test(err.message);});
  const route=loadRoute({getLesson:async()=>{throw compileError;}});
  await assert.rejects(route.default({params}),err=>err===compileError);
  await assert.rejects(route.generateMetadata({params}),err=>err===compileError);
});
test('已登记但缺失MDX也必须失败',async()=>{
  const missing=Object.assign(new Error('ENOENT: missing lesson.mdx'),{code:'ENOENT'});
  const route=loadRoute({getLesson:async()=>{throw missing;}});
  await assert.rejects(route.default({params}),err=>err===missing);
  await assert.rejects(route.generateMetadata({params}),err=>err===missing);
});
test('目录外地址仍404，且不读磁盘',async()=>{
  const route=loadRoute({node:null});
  await assert.rejects(route.default({params}),err=>err===route.notFoundError);
  assert.equal(route.reads(),0);
  assert.deepEqual(await route.generateMetadata({params}),{title:'未找到 | 控制宇宙'});
});
test('empty占位页正常返回，不读取不存在的MDX',async()=>{
  const route=loadRoute({node:{title:'占位课程',skeleton:true}});
  assert.ok(await route.default({params}));
  assert.deepEqual(await route.generateMetadata({params}),{title:'占位课程 | 控制宇宙'});
  assert.equal(route.reads(),0);
});
test('正常课程仍渲染并生成正确标题',async()=>{
  const route=loadRoute();
  assert.ok(await route.default({params}));
  assert.deepEqual(await route.generateMetadata({params}),{title:'样本 | 控制宇宙'});
  assert.equal(route.reads(),2);
});
