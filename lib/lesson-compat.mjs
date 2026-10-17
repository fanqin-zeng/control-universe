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
/** W05只允许两页已知损坏围栏的精确语法修正，不改数学项/数值/代码。 */
export function normalizeMigrationSource(source,lesson) {
  const linked=canonicalizeLessonLinks(source);
  return ['mpc/mpc-principle','mpc/receding-horizon'].includes(lesson)
    ? linked.replaceAll('$$\\boxed{\\begin{aligned}', () => '$$\n\\boxed{\\begin{aligned}')
        .replaceAll('\\end{aligned}}$$', () => '\\end{aligned}}\n$$') : linked;
}
import {legacyAnchors} from './legacy-anchors.mjs';
export {legacyAnchors};
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
