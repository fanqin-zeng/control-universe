/* One lazily loaded runtime per page; notebook variables use separate dictionaries.
 * This is execution isolation for teaching, not an adversarial security boundary.
 * All runtime assets are pinned and served from this site's own Pages path.
 */
let runtime;
let queue = Promise.resolve();
async function initialize() {
  const indexURL = new URL('./pyodide/', self.location.href).href;
  importScripts(indexURL + 'pyodide.js');
  const py = await loadPyodide({indexURL});
  await py.loadPackage(['numpy', 'scipy', 'sympy', 'matplotlib', 'micropip']);
  await py.runPythonAsync(`import micropip
await micropip.install(${JSON.stringify(indexURL + 'control-0.10.2-py3-none-any.whl')}, deps=False)`);
  await py.runPythonAsync(`
import ast, base64, contextlib, io, json, traceback
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
_cu_namespaces = {}
def _cu_execute(key, setup, source, action):
    if action == 'reset':
        _cu_namespaces.pop(key, None)
        return '[]'
    outputs = []
    def capture_figures(*args, **kwargs):
        for number in plt.get_fignums():
            figure = plt.figure(number)
            image = io.BytesIO()
            figure.savefig(image, format='png', dpi=100)
            outputs.append(dict(type='image', mime='image/png', data=base64.b64encode(image.getvalue()).decode()))
        plt.close('all')
    stdout, stderr = io.StringIO(), io.StringIO()
    try:
        with contextlib.redirect_stdout(stdout), contextlib.redirect_stderr(stderr):
            plt.show = capture_figures
            if key not in _cu_namespaces:
                scope = dict(__name__='__main__', np=np, plt=plt)
                exec(setup, scope)
                _cu_namespaces[key] = scope
            scope = _cu_namespaces[key]
            tree = ast.parse(source)
            if tree.body and isinstance(tree.body[-1], ast.Expr):
                expression = tree.body.pop()
                exec(compile(tree, '<cell>', 'exec'), scope)
                value = eval(compile(ast.Expression(expression.value), '<cell>', 'eval'), scope)
                if value is not None:
                    print(repr(value))
            else:
                exec(compile(tree, '<cell>', 'exec'), scope)
            capture_figures()
    except Exception as error:
        outputs.append(dict(type='error', ename=type(error).__name__, evalue=str(error), traceback=traceback.format_exc().splitlines()))
        plt.close('all')
    if stdout.getvalue(): outputs.insert(0, dict(type='stream', name='stdout', text=stdout.getvalue()))
    if stderr.getvalue(): outputs.append(dict(type='stream', name='stderr', text=stderr.getvalue()))
    return json.dumps(outputs)
`);
  return py;
}
self.onmessage = ({data}) => {
  queue = queue.then(async () => {
    try {
      runtime ??= initialize().catch(error => {runtime = null; throw error;});
      const py = await runtime;
      if (data.action === 'install-slycot') {
        await py.runPythonAsync("await micropip.install('slycot==0.7.1')");
        self.postMessage({id: data.id, outputs: [{type: 'text', text: 'Slycot installation succeeded'}]});
        return;
      }
      const args = JSON.stringify([data.namespace, data.setup, data.code, data.action]);
      const result = await py.runPythonAsync(`_cu_execute(*json.loads(${JSON.stringify(args)}))`);
      self.postMessage({id: data.id, outputs: JSON.parse(result)});
    } catch (error) {
      self.postMessage({id: data.id, error: String(error)});
    }
  });
};
