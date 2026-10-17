/** 历史修复索引双向校验；保留旧详情格式，不把预留编号算成已完成修复。 */
import {readFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

function cells(line){return line.split(/(?<!\\)\|/).slice(1,-1).map(c=>c.trim());}
function section(text,name){
  const start=`<!-- ${name}-BEGIN -->`,end=`<!-- ${name}-END -->`;
  if(text.split(start).length!==2||text.split(end).length!==2)return null;
  return text.split(start)[1].split(end)[0];
}
function metadata(text,key){
  const patterns={date:[/^date:\s*(\d{4}-\d{2}-\d{2})\s*$/m,/^\| 日期 \| (\d{4}-\d{2}-\d{2}) \|/m,/^\*\*Date\*\*:\s*(\d{4}-\d{2}-\d{2})/m],type:[/^type:\s*(NEG|POS|BOTH|BUG)\s*$/m,/^\| 类型 \| (NEG|POS|BOTH|BUG) \|/m,/^\*\*Type\*\*:\s*(NEG|POS|BOTH|BUG)\b/m]};
  return patterns[key].map(p=>text.match(p)?.[1]).find(Boolean);
}
export function auditFixLogs({index,files,personas=''}){
  const errors=[],check=(ok,msg)=>{if(!ok)errors.push(msg);};
  const conflict=/^(?:<{7}|={7}|>{7}|\|{7})(?:\s.*)?$/m;
  for(const [name,text]of [['INDEX.md',index],...Object.entries(files)])check(!conflict.test(text),`冲突标记: ${name}`);
  const current=section(index,'FIX-INDEX');
  const reserved=section(index,'FIX-RESERVED');
  check(current!==null,'缺少/重复 FIX-INDEX 标记');check(reserved!==null,'缺少/重复 FIX-RESERVED 标记');
  const rows=(current??index.split(/\r?\n## /)[0]).split(/\r?\n/).filter(l=>/^\| (?:\[)?\d{3}/.test(l)).map(cells);
  const records=new Map(),seenFiles=new Set();
  const roleNames=personas.split('## 教授团队')[0].split(/\r?\n/).filter(l=>l.startsWith('|')).map(cells).filter(r=>/^\d+$/.test(r[1]??'')).flatMap(r=>(r[2]??'').split('、')).filter(Boolean);
  let previous=0;
  for(const row of rows){
    check(row.length===7,`索引列数错误: ${row[0]}`);
    const match=row[0]?.match(/^\[(\d{3})\]\((\d{4}-\d{2}-\d{2}-\d{3}\.md)\)$/);
    const id=match?.[1]??row[0];
    check(Boolean(match),`索引编号缺详情链接: ${id}`);
    check(!records.has(id),`索引编号重复: ${id}`);records.set(id,row);
    check(Number(id)>previous,`索引非正序: ${id}`);previous=Number(id);
    check(/^\d{4}-\d{2}-\d{2}$/.test(row[1]??''),`索引日期非法: ${id}`);
    check(['NEG','POS','BOTH','BUG'].includes(row[4]),`索引类型非法: ${id}`);
    check(Boolean(row[5]),`索引归因缺失: ${id}`);
    const expected=`${row[1]}-${id}.md`,filename=match?.[2]??expected;
    check(filename===expected,`索引日期/编号与链接不符: ${id}`);
    check(Object.hasOwn(files,filename),`缺详情文件: ${id} -> ${filename}`);
    if(!Object.hasOwn(files,filename))continue;
    seenFiles.add(filename);
    const text=files[filename],date=metadata(text,'date'),type=metadata(text,'type');
    if(date)check(date===row[1],`详情日期不一致: ${id}`);
    check(type===row[4],`详情类型不一致: ${id} (${type??'缺失'} / ${row[4]})`);
    const attribution=text.match(/^归因角色[：:]\s*(.+)$/m)?.[1]??text.match(/^\| 归因角色 \| (.+) \|/m)?.[1];
    if(attribution&&roleNames.length){
      const names=value=>roleNames.filter(n=>value.includes(n)).sort().join('、');
      check(names(attribution.split('。')[0])===names(row[5]??''),`详情归因角色不一致: ${id}`);
    }
    const doc=text.match(/^doc:\s*(\S+)\s*$/m)?.[1];
    if(doc)check(doc.replace(/^content\//,'')===(row[2]??'').replace(/^content\//,''),`详情主文档不一致: ${id}`);
    const heading=text.match(/^# (?:Fix[- ](?:Log )?)(\d{3})\b/m)?.[1];
    if(heading)check(heading===id,`详情标题编号不一致: ${id}`);
  }
  const reservations=new Set();
  for(const row of (reserved??'').split(/\r?\n/).filter(l=>/^\| \d{3} \|/.test(l)).map(cells)){
    const id=row[0];check(row.length===3&&row[1]==='预留待核'&&Boolean(row[2]),`预留格式错误: ${id}`);
    check(!reservations.has(id)&&!records.has(id),`预留编号重复/已占用: ${id}`);reservations.add(id);
  }
  const detailIds=new Set();
  for(const filename of Object.keys(files)){
    const match=filename.match(/^(\d{4}-\d{2}-\d{2})-(\d{3})\.md$/);
    check(Boolean(match),`非法详情文件名: ${filename}`);if(!match)continue;
    const id=match[2];check(!detailIds.has(id),`详情编号重复: ${id}`);detailIds.add(id);
    check(!reservations.has(id),`预留号已有详情: ${id}`);
    check(seenFiles.has(filename),`未入索引详情: ${filename}`);
  }
  const maximum=Math.max(0,...[...records.keys(),...reservations].map(Number));
  for(let n=1;n<=maximum;n++){const id=String(n).padStart(3,'0');check(records.has(id)||reservations.has(id),`未解释的编号空洞: ${id}`);}
  return {errors,stats:{indexed:records.size,details:Object.keys(files).length,reserved:reservations.size,nextId:String(maximum+1).padStart(3,'0')}};
}
export function readFixLogs(root=process.cwd()){
  const dir=resolve(root,'.agent/fix-logs');
  return {index:readFileSync(resolve(dir,'INDEX.md'),'utf8'),files:Object.fromEntries(readdirSync(dir).filter(n=>n.endsWith('.md')&&n!=='INDEX.md').map(n=>[n,readFileSync(resolve(dir,n),'utf8')])),personas:readFileSync(resolve(root,'.agent/skills/wiki-discussion/personas.md'),'utf8')};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  try{
    const result=auditFixLogs(readFixLogs());console.log(JSON.stringify(result.stats,null,2));
    if(result.errors.length){for(const err of result.errors)console.error('FAIL',err);process.exitCode=1;}else console.log('PASS fix-log index/details');
  }catch(err){console.error('FAIL',err.message);process.exitCode=1;}
}
