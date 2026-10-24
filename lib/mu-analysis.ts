export type MuStructure='diagonal'|'full';
export type MuParameters={b:number;c:number;d:number;frequency:number;structure:MuStructure};
export const muDefault:MuParameters={b:2,c:.125,d:.25,frequency:0,structure:'diagonal'};
export function muReadings(p:MuParameters){
 const factor=Math.hypot(1,p.frequency),diagonal=Math.sqrt(Math.abs(p.b*p.c)),full=Math.max(Math.abs(p.b),Math.abs(p.c));
 const value=p.structure==='diagonal'?diagonal:full;
 const upper=p.structure==='diagonal'?Math.max(Math.abs(p.d*p.b),Math.abs(p.c/p.d)):full;
 return {mu:value/factor,sigma:full/factor,upper:upper/factor,pointRadius:value>0?factor/value:null,radius:value>0?1/value:null,peak:value,alpha:value-1,certified:value<1};
}
