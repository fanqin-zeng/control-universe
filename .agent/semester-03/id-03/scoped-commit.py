"""Private index and compare-and-swap master; leave the shared index untouched."""
from pathlib import Path
import os,subprocess,sys,json
f=Path('.agent/semester-03/id-03');runtime=Path('D:/Workspace/control-universe-rank3-id03')
base=(f/'scope-base.txt').read_text().strip()
env={**os.environ,'GIT_INDEX_FILE':str(Path('.git/id03-private.index').resolve())}
def git(*args,data=None):return subprocess.check_output(['git',*args],input=data,env=env)
assert git('rev-parse','HEAD').decode().strip()==base,'HEAD moved; prepare scope again'
shared=['content/catalog.ts','.agent/semester-03-plan.md','.agent/semester-03-checklist.md','.agent/delivery-tracker.md','OUTLINE.md','lib/wiki-components.ts','docs/semester-02/03-glossary.md','lib/python-support.json','docs/deployment/python-expansion-local.json','content/nonlinear/adaptive-control-basics.mdx']
owned=['content/identification/least-squares-rls.mdx','lib/rls-identification.ts','components/wiki/rls-identification-explorer.tsx','public/diagrams/identification/least-squares-data.svg','docs/discuss-log/semester-03/09-identification/03-least-squares-rls.md']
owned += [p.as_posix() for p in f.rglob('*') if p.is_file() and p.name not in ['tree.txt','delivery-commit.txt','scope-diff.log','commit.log']]
git('read-tree',base)
for p in shared+owned:
 data=((runtime/p) if p in shared else Path(p)).read_bytes()
 if not p.endswith('.png'):data=data.replace(b'\r\n',b'\n')
 blob=git('hash-object','-w','--stdin',data=data).decode().strip()
 git('update-index','--add','--cacheinfo','100644',blob,p)
tree=git('write-tree').decode().strip();(f/'tree.txt').write_text(tree+'\n')
changed=git('diff','--cached','--name-only',base).decode().splitlines()
assert set(changed)<=set(shared+owned),'Unexpected staged paths'
diff=git('diff','--cached','--stat',base).decode();(f/'scope-diff.log').write_text(diff,encoding='utf8')
subprocess.run(['git','diff','--cached','--check','--','.',':(exclude)*.log'],env=env,check=True)
if '--commit' not in sys.argv:print(diff);sys.exit(0)
assert git('rev-parse','HEAD').decode().strip()==base,'HEAD moved; rebuild scope'
commit=git('commit-tree',tree,'-p',base,'-m','feat: deliver ID-03 least-squares identification with verified RLS').decode().strip()
git('update-ref','refs/heads/master',commit,base)
(f/'delivery-commit.txt').write_text(commit+'\n')
print(commit)
