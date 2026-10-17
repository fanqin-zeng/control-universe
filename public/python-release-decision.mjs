/** Execution success alone does not pass a plot with missing mathematical glyphs. */
export function pythonReleaseDecision(result) {
  if(result.status!=='passed')return {status:'code',reason:result.reason};
  const missing=new Set();
  for(const cell of result.cells)for(const output of cell.outputs){
    if(output.name!=='stderr')continue;
    for(const match of (output.text||'').matchAll(/Glyph (\d+) .*?missing from current font/g))missing.add(Number(match[1]));
  }
  if(missing.size)return {status:'code',reason:'绘图字形未通过验收：'+[...missing].map(n=>String.fromCodePoint(n)+'（U+'+n.toString(16).toUpperCase()+')').join('、')+'；当前字体不能完整显示数学符号，保留代码待字体适配。'};
  return {status:'enabled',reason:''};
}
