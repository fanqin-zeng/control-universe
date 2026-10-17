import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {parseCatalog} from './lib-catalog.mjs';
import {extractNotebooks} from './lib-mdx.mjs';
import {existsSync} from 'node:fs';
import assert from 'node:assert/strict';
export function pythonInventory() {
  return parseCatalog(readFileSync('content/catalog.ts','utf8')).flatMap(ch => ch.lessons.flatMap(lesson => {
    const key = ch.slug+'/'+lesson.slug, file = 'content/'+key+'.mdx';
    if (!existsSync(file)) return [];
    const source = readFileSync(file,'utf8').replace(/\r\n/g,'\n');
    const notebooks = extractNotebooks(source).map((nb,index) => {
      assert.equal(nb.parseErrors.length,0,'Unparsed notebook '+key+'#'+(index+1));
      assert.equal(nb.badCommas.length,0,'Invalid notebook attributes '+key+'#'+(index+1));
      const setup = nb.setup?.value || '', cells = nb.cells.map(c=>c.value);
      const code = [setup,...cells].join('\n');
      return {id:key+'#'+(index+1), index:index+1, line:nb.line, title:nb.title || '实验 '+(index+1), setup, cells,
        preflight: /\bipywidgets\b/.test(code) ? 'ipywidgets 交互需按课程计划迁移到 React Explorer，当前浏览器执行器不支持。' : /\b(import cvxpy|from cvxpy)\b/.test(code) ? 'cvxpy 与求解器尚未完成 Pyodide 适配，保留代码供原生 Python 执行。' : null};
    });
    return notebooks.length ? [{key,title:lesson.title,sourceHash:createHash('sha256').update(source).digest('hex'),notebooks}] : [];
  }));
}
