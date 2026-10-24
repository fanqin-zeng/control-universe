from pathlib import Path
p=Path('components/wiki/persistent-excitation-explorer.tsx');s=p.read_text(encoding='utf8');s='\n'.join(l for l in s.split('\n') if 'const axis=' not in l);s=s.replace('xAxis:axis',"xAxis:{type:'value',min:0,max:64,interval:16,name:'已处理样本数',nameLocation:'middle',nameGap:26}");p.write_text(s,encoding='utf8')
p=Path('.agent/semester-03/id-04/prepare.py');s=p.read_text(encoding='utf8').replace("'习题与答案'","'习题','答案'");p.write_text(s,encoding='utf8')
p=Path('.agent/semester-03/id-04/page-audit.cjs');s=p.read_text(encoding='utf8').replace('dom.h2.length,10','dom.h2.length,11').replace('10 H2','11 H2');p.write_text(s,encoding='utf8')
print('Separate exercise/answer sections and explicit axis literals; no numeric changes')
