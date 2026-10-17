/** Policy is attached at MDX compilation; lesson source stays unchanged. */
export function rehypePythonPolicy({lessonKey, policy = {lessons:{}}} = {}) {
  return tree => {
    let index = 0;
    function walk(node) {
      if (node.name === 'JupyterNotebook') {
        const entry = policy.lessons[lessonKey]?.notebooks[index++];
        node.attributes = (node.attributes || []).filter(a => !['browserMode','browserReason','browserWorkerVersion'].includes(a.name));
        node.attributes.push({type:'mdxJsxAttribute',name:'browserMode',value:entry?.status === 'enabled' ? 'enabled' : 'code'});
        node.attributes.push({type:'mdxJsxAttribute',name:'browserReason',value:entry?.reason || '本实验尚未完成浏览器兼容验收，请使用原生 Python/Jupyter 运行。'});
        node.attributes.push({type:'mdxJsxAttribute',name:'browserWorkerVersion',value:policy.workerHash || ''});
      }
      for (const child of node.children || []) walk(child);
    }
    walk(tree);
  };
}
