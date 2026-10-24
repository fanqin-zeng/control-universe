/** Periodic, open-loop teaching records. Direct DFT; no spectral smoothing. */
export const frequencyBins = [1,4,8,12,20,28];
export interface FrequencyConfig { a:number; outputNoise:number; inputNoise:number; periods:number; missing:boolean; seed:number }
export const frequencyDefaults:FrequencyConfig={a:.7,outputNoise:.2,inputNoise:0,periods:8,missing:false,seed:20261024};
export function frequencyExperiment(config:FrequencyConfig=frequencyDefaults){
 const {a,outputNoise,inputNoise,periods,missing,seed}=config;
 if(![.2,.7,.9].includes(a)||![0,.2,.8].includes(outputNoise)||![0,.3,.8].includes(inputNoise)||![1,4,8,16].includes(periods)||typeof missing!=='boolean'||!Number.isInteger(seed)||seed<1||seed>4294967295)throw new RangeError('Unsupported experiment configuration');
 const L=64,fs=20,b=1-a,bins=frequencyBins.filter(k=>!missing||k!==8);
 const u=Array.from({length:L},(_,n)=>bins.reduce((s,k)=>s+Math.sin(2*Math.PI*k*n/L),0));
 // Solve y[L-1]=y[-1] exactly for this periodic input, then recurse.
 let end=0;for(let n=0;n<L;n++)end=a*end+b*u[(n+L-1)%L];let prev=end/(1-a**L);
 const y=u.map((_,n)=>{prev=a*prev+b*u[(n+L-1)%L];return prev;});
 let state=seed>>>0;const noise=()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return Math.sqrt(12)*(state/4294967296-.5);};
 const records=Array.from({length:periods},()=>({u:u.map(v=>v+inputNoise*noise()),y:y.map(v=>v+outputNoise*noise())}));
 const dft=(v:number[],k:number)=>v.reduce((s,x,n)=>[s[0]+x*Math.cos(2*Math.PI*k*n/L),s[1]-x*Math.sin(2*Math.PI*k*n/L)],[0,0]);
 const rows=Array.from({length:31},(_,i)=>{const k=i+1,w=2*Math.PI*k/L;let suu=0,syy=0,re=0,im=0;
  for(const record of records){const U=dft(record.u,k),Y=dft(record.y,k);suu+=U[0]**2+U[1]**2;syy+=Y[0]**2+Y[1]**2;re+=U[0]*Y[0]+U[1]*Y[1];im+=U[0]*Y[1]-U[1]*Y[0];}
  suu/=periods*L;syy/=periods*L;re/=periods*L;im/=periods*L;
  const den=1+a*a-2*a*Math.cos(w),trueRe=b*(Math.cos(w)-a)/den,trueIm=-b*Math.sin(w)/den;
  // This designed experiment only declares its commanded lines excited.
  const valid=bins.includes(k)&&suu>1e-10&&syy>1e-10;
  return {k,hz:k*fs/L,trueGain:Math.hypot(trueRe,trueIm),truePhase:Math.atan2(trueIm,trueRe)*180/Math.PI,power:suu,gain:valid?Math.hypot(re,im)/suu:null,phase:valid?Math.atan2(im,re)*180/Math.PI:null,coherence:valid?Math.min(1,(re*re+im*im)/(suu*syy)):null};
 });return {rows,selected:rows[7],records};
}
