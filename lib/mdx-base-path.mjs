/** Prefix static-site root URLs, including literal raw JSX which bypasses MDX img/a mapping. */
export function rehypeBasePath({basePath = ''} = {}) {
  const prefix = value => basePath && typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') && value !== basePath && !value.startsWith(basePath + '/') ? basePath + value : value;
  return tree => {
    function walk(node) {
      if (node.properties) for (const key of ['href', 'src']) if (node.properties[key]) node.properties[key] = prefix(node.properties[key]);
      for (const attr of node.attributes ?? []) {
        if (!['href', 'src'].includes(attr.name)) continue;
        if (typeof attr.value === 'string') attr.value = prefix(attr.value);
      }
      for (const child of node.children ?? []) walk(child);
    }
    walk(tree);
  };
}
