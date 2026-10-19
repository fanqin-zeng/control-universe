import fs from 'node:fs';import assert from 'node:assert/strict';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),dir='.agent/semester-03/python-code-font/';
const before=read(dir+'before.json'),local=read(dir+'local.json'),actual=read('docs/deployment/python-code-font-public-browser.json');
assert.equal(local.length,13);assert(local.every(x=>x.font===before[0].font));assert.notEqual(before[0].font,before[1].font);
assert.equal(actual.fonts.filter(x=>x.tag==='TEXTAREA').length,7);assert(actual.fonts.every(x=>x.font===before[0].font));
assert.equal(actual.katexErrors,0);assert.equal(actual.errors.length,0);assert(actual.output.includes('net amplitude=.500000 at 5 Hz'));
const actions=read('docs/deployment/python-code-font-public-actions.json');assert.equal(actions.head_sha,'35464555d8263829b5daca2d3ce65541c323fa24');assert.equal(actions.conclusion,'success');assert(actions.jobs.every(j=>j.conclusion==='success'));
const http=read('docs/deployment/python-code-font-public-http.json');assert(http.pass);assert.equal(http.release.sourceCommit,actions.head_sha);assert.equal(http.release.sourceDirty,false);
const report={pass:true,release:actions.head_sha,fontFamily:before[0].font,elements:actual.fonts.length,originalSetupFontPreserved:true,editableAndOutputFontsMatch:true,pythonSmokePassed:true};fs.writeFileSync('docs/deployment/python-code-font-public-validation.json',JSON.stringify(report,null,2)+'\n');console.log(report);
