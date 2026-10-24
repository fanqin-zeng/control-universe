"""Refresh concurrent HEAD, run gates, then commit by CAS; never touch shared index."""
from pathlib import Path
import subprocess,sys,json
f=Path('.agent/semester-03/id-07')
for attempt in range(5):
 print('Integration attempt',attempt+1,flush=True)
 for command in [['python',str(f/'prepare.py')],['python',str(f/'run.py'),'check']]:subprocess.run(command,check=True)
 with (f/'validation.log').open('wb') as log:subprocess.run(['node',str(f/'validate.mjs')],stdout=log,stderr=subprocess.STDOUT,check=True)
 base=json.loads((f/'manifest.json').read_text())['base'];head=subprocess.check_output(['git','rev-parse','HEAD']).decode().strip()
 if head!=base:print('HEAD advanced; preserve it and refresh',flush=True);continue
 with (f/'commit-attempt.log').open('wb') as log:result=subprocess.run(['python',str(f/'commit.py'),'--commit'],stdout=log,stderr=subprocess.STDOUT)
 if result.returncode==0:print((f/'delivery-commit.txt').read_text().strip());sys.exit(0)
 print('CAS/index attempt failed, see commit-attempt.log',flush=True)
raise RuntimeError('Concurrent HEAD kept advancing; no shared index changes or force push performed')
