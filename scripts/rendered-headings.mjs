import {compileMDX} from 'next-mdx-remote/rsc';
import {headingRemarkPlugins,headingRehypePlugins} from '../lib/mdx-headings.mjs';
const cache=new Map();
export function renderedHeadings(source,lesson){
  const key=lesson+'\n'+source;if(cache.has(key))return cache.get(key);
  const promise=(async()=>{
    const headings=[],ids=[];
    function collect(){return tree=>{
      const text=n=>n.type==='text'?n.value:(n.children??[]).map(text).join('');
      function walk(n){if(n.properties?.id)ids.push(n.properties.id);if(/^h[1-6]$/.test(n.tagName??''))headings.push({level:Number(n.tagName[1]),id:n.properties?.id,text:text(n)});for(const c of n.children??[])walk(c);}walk(tree);
    };}
    await compileMDX({source,options:{parseFrontmatter:true,mdxOptions:{remarkPlugins:headingRemarkPlugins,rehypePlugins:[...headingRehypePlugins(lesson),collect]}}});
    return {headings,h2:headings.filter(h=>h.level===2),ids};
  })();cache.set(key,promise);return promise;
}
