from pathlib import Path
import subprocess,json,os
f=Path('.agent/semester-03/id-06');ports=json.loads((f/'ports.json').read_text());subprocess.run(['python',str(f/'cleanup-kernels.py')],check=True)
# Verify PID and expected command line before stopping this task's two persistent services.
closed=[]
for key,needle in [('kernelPid','jupyter_server.py'),('fixturePid','id-06\\static-server.cjs')]:
 pid=ports[key]
 script=f"$p = Get-CimInstance Win32_Process -Filter 'ProcessId = {pid}'; if ($null -ne $p) {{ if (-not $p.CommandLine.Contains('{needle}')) {{ throw 'PID command mismatch' }}; Stop-Process -Id {pid} -ErrorAction Stop }}"
 r=subprocess.run(['pwsh','-NoProfile','-Command',script],capture_output=True);assert r.returncode==0,r.stderr.decode(errors='replace');closed.append(pid)
(f/'resources-closed.json').write_text(json.dumps({'pass':True,'closedPersistentPids':closed,'nativeAndPages':'final-ui.py and pages-audit.py terminate own Popen in finally; browser.close in both audits','otherProcessesUntouched':True},indent=2));print('Closed own kernel and fixture services')
