"""Refresh only shared metadata from current HEAD, then add IMPL-02.
The build snapshot stays isolated from concurrent uncommitted lessons.
"""
from pathlib import Path
import subprocess,re,json,shutil
root=Path(__file__).resolve().parents[3];target=root.parent/'control-universe-rank1-impl02-validation'
base=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
assert json.loads((root/'.agent/semester-03/impl-02/refresh-base.json').read_text(encoding='utf-8'))['base']==base,'HEAD advanced during archive; refresh snapshot again'
shared=['content/catalog.ts','lib/wiki-components.ts','.agent/delivery-tracker.md','.agent/semester-03-checklist.md','.agent/semester-03-plan.md','.agent/fix-logs/INDEX.md','OUTLINE.md','lib/python-support.json','docs/deployment/python-expansion-local.json','docs/deployment/python-expansion-pending.json']
for rel in shared:
    data=subprocess.check_output(['git','show',base+':'+rel],cwd=root)
    (target/rel).write_bytes(data)
def edit(rel,fun):
    p=target/rel;p.write_text(fun(p.read_text(encoding='utf-8')),encoding='utf-8')
def catalog(s):
    start=s.index('"slug": "digital-pid"');end=s.index('"slug": "pid-engineering-tuning"',start)
    chunk=s[start:end];assert '"status": "draft"' in chunk or '"status": "v1.3"' in chunk
    return s[:start]+chunk.replace('"status": "draft"','"status": "v1.3"')+s[end:]
edit('content/catalog.ts',catalog)
def registry(s):
    if 'DigitalPidExplorer' in s:return s
    return 'import { DigitalPidExplorer } from "@/components/wiki/digital-pid-explorer";\n'+s.replace('  ControlArchitectureExplorer,','  ControlArchitectureExplorer,\n  DigitalPidExplorer,')
edit('lib/wiki-components.ts',registry)
edit('.agent/delivery-tracker.md',lambda s:re.sub(r'^\| \[ \] 数字PID \(digital-pid\).*$', '| [x] 数字PID (digital-pid) | IMPL-02学期3重构；八主题/四题、四Notebook八cell、单拍Explorer、级联SVG；独立对账与验收见.agent/semester-03/impl-02/acceptance.md；离散化工程材料已承接，来源保留 |',s,flags=re.M))
row=next(l for l in (root/'.agent/semester-03-checklist.md').read_text(encoding='utf-8').splitlines() if l.startswith('| IMPL-02 |'))
edit('.agent/semester-03-checklist.md',lambda s:re.sub(r'^\| IMPL-02 \|.*$',row,s,flags=re.M))
snippet=(root/'.agent/semester-03/impl-02/progress-snippet.md').read_text(encoding='utf-8')
edit('.agent/semester-03-plan.md',lambda s:s.rstrip()+'\n' if '### IMPL-02 数字PID本轮交付' in s else s.rstrip()+'\n\n'+snippet.rstrip()+'\n')
fixrow=next(l for l in (root/'.agent/fix-logs/INDEX.md').read_text(encoding='utf-8').splitlines() if l.startswith('| [074]'))
edit('.agent/fix-logs/INDEX.md',lambda s:s if '| [074]' in s else s.replace('<!-- FIX-INDEX-END -->',fixrow+'\n<!-- FIX-INDEX-END -->'))
def reserve_parallel(s):
    # A commit must not contain number gaps or uncommitted peer details.
    # Use the skill's explicit reservation table until each peer delivers.
    for num,lesson in [('072','MPC-01'),('073','ROBUST-01')]:
        if '| ['+num+']' not in s and '| '+num+' |' not in s:
            reservation=f'| {num} | 预留待核 | 2026-10-24并行{lesson}已分配但尚未随IMPL-02进入master；仅预留编号，待该课交付以真实详情替换；见semester-03/impl-02/parallel-number-allocation.md |'
            s=s.replace('<!-- FIX-RESERVED-END -->',reservation+'\n<!-- FIX-RESERVED-END -->')
    return s
edit('.agent/fix-logs/INDEX.md',reserve_parallel)
def normalize_committed_index(s):
    # MPC-01 entered master after ROBUST-01 reserved 072, but did not retire
    # that reservation or align its index fields. Only synchronize metadata;
    # keep the committed peer detail completely unchanged.
    if '| [072]' in s:
        detail=subprocess.check_output(['git','show',base+':.agent/fix-logs/2026-10-24-072.md'],cwd=root,text=True,encoding='utf-8')
        doc=re.search(r'^doc:\s*(\S+)',detail,re.M).group(1).removeprefix('content/')
        attribution=re.search(r'^归因角色[：:]\s*(.+)',detail,re.M).group(1).rstrip('。')
        def fixrow(m):
            cells=[v.strip() for v in m.group().split('|')[1:-1]];cells[2]=doc;cells[5]=attribution;return '| '+' | '.join(cells)+' |'
        s=re.sub(r'^\| \[072\].*$',fixrow,s,flags=re.M)
        s=re.sub(r'^\| 072 \| 预留待核 \|.*\n?','',s,flags=re.M)
    a=s.index('<!-- FIX-INDEX-BEGIN -->');b=s.index('<!-- FIX-INDEX-END -->')
    block=s[a:b].splitlines();rows=[l for l in block if re.match(r'^\| \[\d{3}\]',l)]
    if rows:
        first=next(i for i,l in enumerate(block) if re.match(r'^\| \[\d{3}\]',l))
        block=block[:first]+sorted(rows,key=lambda l:int(re.search(r'\[(\d+)\]',l).group(1)))
        s=s[:a]+'\n'.join(block)+'\n'+s[b:]
    # A lower-ranked peer may have reserved IMPL-02's 074 while delivering
    # its own later number. The actual index entry now retires that reservation.
    for number in re.findall(r'^\| \[(\d{3})\]',s,re.M):
        s=re.sub(r'^\| '+number+r' \| 预留待核 \|.*\n?','',s,flags=re.M)
    return s
edit('.agent/fix-logs/INDEX.md',normalize_committed_index)
fix='.agent/fix-logs/2026-10-24-074.md';(target/fix).parent.mkdir(exist_ok=True,parents=True);shutil.copy2(root/fix,target/fix)
ownlog='docs/discuss-log/semester-03/07-implementation/02-digital-pid.md';(target/ownlog).parent.mkdir(exist_ok=True,parents=True);shutil.copy2(root/ownlog,target/ownlog)
(root/'.agent/semester-03/impl-02/staging-base.json').write_text(json.dumps({'base':base,'shared':shared},indent=2),encoding='utf-8')
print(base)
