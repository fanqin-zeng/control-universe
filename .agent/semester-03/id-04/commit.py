"""Commit only the accepted scope using a private Git index and atomic master CAS."""
from pathlib import Path
import subprocess,os,json,sys
f=Path('.agent/semester-03/id-04');m=json.loads((f/'manifest.json').read_text());base=m['base'];runtime=Path(m['runtime']);env={**os.environ,'GIT_INDEX_FILE':str(Path('.git/id04-private.index').resolve())}
def git(*args,data=None):return subprocess.check_output(['git',*args],env=env,input=data)
assert git('rev-parse','HEAD').decode().strip()==base,'HEAD moved; prepare and check again'
git('read-tree',base)
owned=m['owned']+[p.as_posix() for p in f.rglob('*') if p.is_file() and p.name not in ['delivery-commit.txt','scope-diff.log','tree.txt']]
git('add','-f','--',*owned)
for p in m['shared']:
 data=(runtime/p).read_bytes().replace(b'\r\n',b'\n');blob=git('hash-object','-w','--stdin',data=data).decode().strip();git('update-index','--add','--cacheinfo','100644',blob,p)
changed=git('diff','--cached','--name-only',base).decode().splitlines();assert set(changed)<=set(owned+m['shared'])
diff=git('diff','--cached','--stat',base).decode();(f/'scope-diff.log').write_text(diff,encoding='utf8');subprocess.run(['git','diff','--cached','--check','--','.',':(exclude)*.log'],env=env,check=True)
tree=git('write-tree').decode().strip()
if '--commit' not in sys.argv:print(diff);sys.exit()
result=git('commit-tree',tree,'-p',base,'-m','feat: deliver ID-04 persistent excitation with verified information windows').decode().strip();git('update-ref','refs/heads/master',result,base);(f/'delivery-commit.txt').write_text(result+'\n');print(result)
