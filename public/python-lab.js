let worker, sequence = 0, current, report;
const status = document.getElementById('status'), results = document.getElementById('results');
function request(namespace, setup, code, action = 'execute') {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => {worker.terminate(); reject(Error('180 秒超时，内核已终止'));}, 180000);
    current = {id, resolve, reject, timer};
    worker.postMessage({id, namespace, setup, code, action});
  });
}
function equivalent(actual, expected) {
  const number = /[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi;
  const a = actual.match(number) || [], b = expected.match(number) || [];
  return actual.replace(number, '#').replace(/\s/g, '') === expected.replace(number, '#').replace(/\s/g, '') && a.length === b.length && a.every((n,i) => Math.abs(Number(n)-Number(b[i])) <= 1e-9 * Math.max(1, Math.abs(Number(b[i]))));
}
async function test(name, code, expectedFailure = false) {
  const outputs = await request('control-test', '', code);
  const errors = outputs.filter(o => o.type === 'error');
  const pass = expectedFailure ? errors.length > 0 && errors.some(e => /slycot|sb10ad|sb02md/i.test(e.evalue + e.traceback.join(' '))) : errors.length === 0;
  report.tests.push({name, pass, expectedFailure, outputs});
  results.textContent += `${pass ? 'PASS' : 'FAIL'} ${name}\n`;
}
document.getElementById('run').onclick = async () => {
  document.getElementById('run').disabled = true; document.getElementById('stop').disabled = false; document.getElementById('save').disabled = true;
  results.textContent = ''; document.getElementById('plots').replaceChildren();
  report = {testedAt: new Date().toISOString(), url: location.href, userAgent: navigator.userAgent, tests: []};
  worker = new Worker('./python-worker.js');
  worker.onmessage = ({data}) => {if (current?.id !== data.id) return; clearTimeout(current.timer); data.error ? current.reject(Error(data.error)) : current.resolve(data.outputs);};
  worker.onerror = error => current?.reject(Error(error.message));
  try {
    status.textContent = '正在初始化浏览器 Python…';
    const fixture = await (await fetch('./python-trial.json')).json();
    for (const lesson of fixture.lessons) for (let i = 0; i < lesson.notebooks.length; i++) {
      const nb = lesson.notebooks[i];
      for (let j = 0; j < nb.cells.length; j++) {
        const name = `${lesson.key} / ${i+1}.${j+1}`; status.textContent = name;
        const outputs = await request(`${lesson.key}-${i}`, nb.setup, nb.cells[j]);
        const text = outputs.filter(o => o.type === 'stream' && o.name === 'stdout').map(o => o.text).join('');
        const pass = !outputs.some(o => o.type === 'error') && equivalent(text, fixture.reference[lesson.key][i][j]);
        report.tests.push({name, pass, referenceMatch: pass, outputs}); results.textContent += `${pass ? 'PASS' : 'FAIL'} ${name}\n`;
      }
    }
    status.textContent = '正在测试控制库…';
    for (const probe of fixture.controlTests) await test(probe.name, probe.code, probe.expectedFailure);
    const plot = await request('plot', '', "plt.plot([0,1,2],[0,1,4]); plt.title('Browser Python'); plt.show()");
    const images = plot.filter(o => o.type === 'image');
    report.tests.push({name: 'Matplotlib PNG', pass: images.length === 1 && !plot.some(o => o.type === 'error'), outputs: plot.map(o => o.type === 'image' ? {...o, data: `[PNG base64: ${o.data.length} characters]`} : o)});
    for (const output of images) {const image = document.createElement('img'); image.src = 'data:image/png;base64,' + output.data; image.alt = '浏览器 Python 绘图'; image.style.maxWidth = '100%'; document.getElementById('plots').append(image);}
    await request('isolation-a', '', 'x=123');
    const isolated = await request('isolation-b', '', "assert 'x' not in globals(); print('separate namespace')");
    await request('isolation-a', '', '', 'reset');
    const reset = await request('isolation-a', '', "assert 'x' not in globals(); print('reset cleared namespace')");
    report.tests.push({name: 'Notebook namespace isolation and reset', pass: ![...isolated,...reset].some(o => o.type === 'error'), outputs: [...isolated,...reset]});
    status.textContent = '正在探测 Slycot wheel 安装…';
    try {const outputs = await request('slycot-install', '', '', 'install-slycot'); report.slycotInstall = {supported: true, outputs};}
    catch (error) {report.slycotInstall = {supported: false, error: String(error)};}
    report.pass = report.tests.every(t => t.pass);
    status.textContent = `${report.pass ? '验收通过' : '验收失败'}：${report.tests.filter(t => t.pass).length}/${report.tests.length}；Slycot 安装${report.slycotInstall.supported ? '成功' : '失败（见记录）'}`;
    results.textContent = JSON.stringify(report, null, 2);
  } catch (error) {report.pass = false; report.error = String(error); status.textContent = '验收失败：' + error; results.textContent = JSON.stringify(report, null, 2);}
  finally {worker.terminate(); document.getElementById('run').disabled = false; document.getElementById('stop').disabled = true; document.getElementById('save').disabled = false;}
};
document.getElementById('stop').onclick = () => {worker?.terminate(); if (current) {clearTimeout(current.timer); current.reject(Error('用户已停止内核'));}};
document.getElementById('save').onclick = () => {const url = URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'})); const link = document.createElement('a'); link.href = url; link.download = 'pyodide-acceptance.json'; link.click(); URL.revokeObjectURL(url);};
