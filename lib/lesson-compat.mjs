/** 迁移兼容信息：仅旧地址/锚点，不存课程目录或交付状态。 */
export const lessonRedirects = [
  ['modern/linear-system-theory', 'modern/lyapunov-modern'],
  ['modern/kalman-filter', 'estimation/kalman-filter'],
  ['estimation/h-infinity-filter', 'robust/h-infinity-filter'],
  ['estimation/mhe-fusion', 'mpc/mhe-fusion'],
  ['mpc/distributed-mpc', 'multi-agent/distributed-mpc'],
  ['rl-control/safe-rl', 'safety-ftc/safe-rl'],
  ['rl-control/multi-agent-rl', 'multi-agent/multi-agent-rl'],
  ['applications/auto-driving-control', 'autonomous-driving/vehicle-control'],
  ['applications/robotics-control', 'robotics/robotics-case-study'],
];
/** @param {string} key */
export function resolveHistoricalLesson(key) {
  return lessonRedirects.find(([old]) => old === key)?.[1] ?? key;
}
/** 只规范Markdown课程URL；不替换正文词句、代码或历史日志。 */
export function canonicalizeLessonLinks(source) {
  const replace = (text) => {
    for (const [old, target] of lessonRedirects) text = text.replace(new RegExp('(\\]\\(/)' + old + '(?=[#?)])', 'g'), (_, prefix) => prefix + target);
    return text;
  };
  // 保留行内代码、围栏及MDX模板字符串；本次规范化不触及其中的URL示例。
  let result = '', start = 0;
  for (const match of source.matchAll(/(`+|~{3,})[\s\S]*?\1/g)) {
    result += replace(source.slice(start, match.index)) + match[0];start = match.index + match[0].length;
  }
  return result + replace(source.slice(start));
}
// S03仅修迁移页的旧fragment兼容；W01/W04仍负责全站锚点契约。
export const legacyAnchors = {
  'multi-agent/distributed-mpc': {
    '为什么需要分布式MPC': '为什么需要分布式mpc',
    'ADMM分解算法': 'admm分解算法',
    '数值例子': '数值例子5车编队仿真',
  },
};
/** rehypeSlug之后执行，别名不参与标题文本/ID计算。 */
export function rehypeLegacyAnchors(options = {}) {
  return (tree) => {
    const aliases = legacyAnchors[options.lesson] ?? {};
    const ids = new Map();
    const walk = (node) => { if (node.properties?.id) ids.set(node.properties.id, node); for (const child of node.children ?? []) walk(child); };
    walk(tree);
    for (const [alias, target] of Object.entries(aliases)) {
      const heading = ids.get(target);
      if (!heading || !/^h[1-6]$/.test(heading.tagName)) throw Error(`旧锚点目标缺失 ${options.lesson}#${target}`);
      if (ids.has(alias)) throw Error(`旧锚点冲突 ${options.lesson}#${alias}`);
      const anchor = {type:'element',tagName:'span',properties:{id:alias,'aria-hidden':'true','data-legacy-anchor':target},children:[]};
      heading.children.unshift(anchor);ids.set(alias,anchor);
    }
  };
}
