/** 标题契约与页面共用：Math→KaTeX→Slug（全级标题去重）→旧ID兼容。 */
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import {rehypeLegacyAnchors} from './lesson-compat.mjs';
export const headingRemarkPlugins=[remarkGfm,remarkMath];
export function headingRehypePlugins(lesson){return [rehypeKatex,rehypeSlug,[rehypeLegacyAnchors,{lesson}]];}
export function assertHeadingTargets(subsections,headings,ids){
  const errors=[];
  if(subsections.length!==headings.length)errors.push(`H2数量 ${headings.length}/${subsections.length}`);
  subsections.forEach((s,i)=>{if(s.slug!==headings[i]?.id)errors.push(`H2[${i}] ${s.slug} ≠ ${headings[i]?.id}`);if(!ids.includes(s.slug))errors.push(`DOM缺少目标 ${s.slug}`);});
  return errors;
}
