export type LoopParameters={gain:number;frequency:number;numeratorDamping:number;denominatorDamping:number;lowpass:number};
export const hInfinityDefault:LoopParameters={gain:20,frequency:10,numeratorDamping:.05,denominatorDamping:.5,lowpass:.1};
type Complex=[number,number];
const mul=(a:Complex,b:Complex):Complex=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]];
const div=(a:Complex,b:Complex):Complex=>{const d=b[0]*b[0]+b[1]*b[1];return [(a[0]*b[0]+a[1]*b[1])/d,(a[1]*b[0]-a[0]*b[1])/d];};
const magnitude=(z:Complex)=>Math.hypot(...z);
function evaluate(p:number[],w:number):Complex{let z:Complex=[0,0];for(const c of p){z=mul(z,[0,w]);z[0]+=c;}return z;}
function convolve(a:number[],b:number[]){const c=Array(a.length+b.length-1).fill(0);a.forEach((v,i)=>b.forEach((x,j)=>c[i+j]+=v*x));return c;}
function add(a:number[],b:number[]){const n=Math.max(a.length,b.length),out=Array(n).fill(0);a.forEach((v,i)=>out[n-a.length+i]+=v);b.forEach((v,i)=>out[n-b.length+i]+=v);return out;}
export function hInfinityModel(p:LoopParameters){
 const {gain:K,frequency:f,numeratorDamping:zn,denominatorDamping:zd,lowpass:a}=p;
 let cn=[K,K*2*zn*f,K*f*f],cd=[1,2*zd*f,f*f];if(a>0){cn=cn.map(v=>v*a);cd=convolve(cd,[1,a]);}
 const ln=cn.map(v=>100*v),ld=convolve([1,1,100],cd),closed=add(ld,ln);
 const n=closed.length-1,columns=Math.ceil((n+1)/2),table=Array.from({length:n+1},()=>Array(columns).fill(0));
 for(let j=0;j<columns;j++){table[0][j]=closed[2*j]??0;table[1][j]=closed[2*j+1]??0;}
 let degenerate=false;
 for(let r=2;r<=n;r++){const pivot=table[r-1][0];if(Math.abs(pivot)<1e-12){degenerate=true;break;}for(let j=0;j<columns-1;j++)table[r][j]=(pivot*table[r-2][j+1]-table[r-2][0]*table[r-1][j+1])/pivot;}
 const first=table.map(row=>row[0]);const stable=!degenerate&&first.every(v=>v>1e-10),unstable=first.some(v=>v< -1e-10);
 return {cn,cd,ln,ld,closed,first,stable,unstable,degenerate};
}
export function hInfinityFrequency(p:LoopParameters,w:number){
 const m=hInfinityModel(p),L=div(evaluate(m.ln,w),evaluate(m.ld,w)),S=div([1,0],[1+L[0],L[1]]),T=mul(L,S);
 return {L:magnitude(L),S:magnitude(S),T:magnitude(T)};
}
export function hInfinityReadings(p:LoopParameters){
 const m=hInfinityModel(p),center=hInfinityFrequency(p,10);let scanPeak=0;
 for(let i=0;i<=2000;i++)scanPeak=Math.max(scanPeak,hInfinityFrequency(p,10**(-1+3.5*i/2000)).S);
 return {...m,scanPeak,T10:center.T,S10:center.S,DC:1/(1+p.gain),notchRatio:p.numeratorDamping/p.denominatorDamping};
}
