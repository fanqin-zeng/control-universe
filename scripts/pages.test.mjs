import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createRequire} from 'node:module';import ts from 'typescript';import {renderToStaticMarkup} from 'react-dom/server';import React from 'react';
const require=createRequire(import.meta.url);
function load(file,mock={}){const module={exports:{}};const js=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;new Function('require','exports','module',js)(n=>mock[n]??require(n),module.exports,module);return module.exports;}

test('Pages execution is per-notebook and defaults to code-only',()=>{
 const old=process.env.NEXT_PUBLIC_STATIC_EXPORT;
 try {
  process.env.NEXT_PUBLIC_STATIC_EXPORT='true';
  const {JupyterNotebook}=load('components/wiki/jupyter-notebook.tsx',{'./browser-notebook':{BrowserNotebook:()=>React.createElement('div',{'data-python-browser':'yes'})}});
  for(const mode of ['enabled','code',undefined]) {
   const html=renderToStaticMarkup(React.createElement(JupyterNotebook,{browserMode:mode,browserReason:'Slycot <not available>',cells:[{code:'print(1)'}]}));
   assert.equal(html.includes('data-python-browser'),mode==='enabled');
   if(mode!=='enabled'){assert(html.includes('Slycot &lt;not available&gt;'));assert(!html.includes('全部运行'));}
  }
 } finally {if(old===undefined)delete process.env.NEXT_PUBLIC_STATIC_EXPORT;else process.env.NEXT_PUBLIC_STATIC_EXPORT=old;}
});

test('MDX policy supports mixed lessons, preserves code, and fails closed for unknown lessons',async()=>{
 const {compileMDX}=await import('next-mdx-remote/rsc');const {rehypePythonPolicy}=await import('../lib/mdx-python-policy.mjs');
 const policy={lessons:{'classic/example':{notebooks:[{status:'enabled'},{status:'code',reason:'needs Slycot'}]}}};
 const source='<JupyterNotebook cells={[]} />\n\n<JupyterNotebook cells={[]} />';
 for(const lessonKey of ['classic/example','unknown/example']){
  const {content}=await compileMDX({source,options:{mdxOptions:{rehypePlugins:[[rehypePythonPolicy,{lessonKey,policy}]]}},components:{JupyterNotebook:props=>React.createElement('div',{'data-mode':props.browserMode},props.browserReason)}});
  const html=renderToStaticMarkup(content);assert.equal((html.match(/data-mode="enabled"/g)||[]).length,lessonKey==='classic/example'?1:0);if(lessonKey==='classic/example')assert(html.includes('needs Slycot'));
 }
});

test('project prefix only changes site-root URLs and never doubles prefix',()=>{const previous=process.env.NEXT_PUBLIC_BASE_PATH;try{process.env.NEXT_PUBLIC_BASE_PATH='/control-universe';const {withBasePath:f}=load('lib/deployment.ts');assert.equal(f('/math/test#x'),'/control-universe/math/test#x');assert.equal(f('/katex/katex.min.css'),'/control-universe/katex/katex.min.css');for(const v of ['https://example.com','//example.com/a','#x','relative.png','/control-universe/math/test'])assert.equal(f(v),v);delete process.env.NEXT_PUBLIC_BASE_PATH;assert.equal(f('/math/test'),'/math/test');}finally{if(previous===undefined)delete process.env.NEXT_PUBLIC_BASE_PATH;else process.env.NEXT_PUBLIC_BASE_PATH=previous;}});
test('actual static notebook renders escaped source and its initialization effect makes no request',()=>{const old=process.env.NEXT_PUBLIC_STATIC_EXPORT;let calls=0;const original=globalThis.fetch;try{process.env.NEXT_PUBLIC_STATIC_EXPORT='true';globalThis.fetch=()=>{calls++;throw Error('unexpected fetch');};const {JupyterNotebook}=load('components/wiki/jupyter-notebook.tsx',{'react':{...React,useEffect:fn=>fn()},'next/navigation':{usePathname:()=>'/classic/test'},'./browser-notebook':{BrowserNotebook:()=>null}});const html=renderToStaticMarkup(React.createElement(JupyterNotebook,{title:'离线示例',setupCode:'import math',cells:[{code:'print("<script>")'}]}));assert.equal(calls,0);assert(html.includes('在线版展示实验代码'));assert(html.includes('import math'));assert(html.includes('&lt;script&gt;'));assert(!html.includes('初始化中'));}finally{globalThis.fetch=original;if(old===undefined)delete process.env.NEXT_PUBLIC_STATIC_EXPORT;else process.env.NEXT_PUBLIC_STATIC_EXPORT=old;}});
test('publishing is exclusively gated by gh-pages, including manual dispatch',()=>{const y=readFileSync('.github/workflows/pages.yml','utf8');assert(y.includes('branches: [gh-pages]'));assert.equal((y.match(/if: github.ref == 'refs\/heads\/gh-pages'/g)||[]).length,2);assert(!y.includes('pull_request_target'));});

test('raw JSX image/link paths get the project prefix without rewriting code examples',async()=>{
 const {compileMDX}=await import('next-mdx-remote/rsc');const {rehypeBasePath}=await import('../lib/mdx-base-path.mjs');
 const {content}=await compileMDX({source:'<img src="/images/example.png" alt="例子" />\n\n<a href="/math/example#目标">课程</a>\n\n`/images/do-not-change.png`',options:{mdxOptions:{rehypePlugins:[[rehypeBasePath,{basePath:'/control-universe'}]]}}});const html=renderToStaticMarkup(content);assert(html.includes('src="/control-universe/images/example.png"'));assert(html.includes('href="/control-universe/math/example#目标"'));assert(html.includes('<code>/images/do-not-change.png</code>'));
});

test('sidebar identity ignores Pages prefix and trailing slash but preserves other repository names',()=>{const old=process.env.NEXT_PUBLIC_BASE_PATH;try{process.env.NEXT_PUBLIC_BASE_PATH='/control-universe';const {lessonPath:p}=load('lib/deployment.ts');assert.equal(p('/control-universe/math/complex-numbers/'),'/math/complex-numbers');assert.equal(p('/math/complex-numbers/'),'/math/complex-numbers');assert.equal(p('/control-universe/'),'/');assert.equal(p('/control-universe-other/math/'),'/control-universe-other/math');}finally{if(old===undefined)delete process.env.NEXT_PUBLIC_BASE_PATH;else process.env.NEXT_PUBLIC_BASE_PATH=old;}});
