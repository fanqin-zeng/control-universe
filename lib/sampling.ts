export function adc(value:number,bits=8,range=2){if(!Number.isFinite(value)||!Number.isInteger(bits)||bits<1||bits>24||!Number.isFinite(range)||range<=0)throw new RangeError("invalid ADC argument");const levels=2**bits,q=2*range/levels,index=Math.max(0,Math.min(levels-1,Math.floor((value+range)/q)));return -range+(index+.5)*q;}
export function samplingRun(fs=100,bits=8){
 if(!Number.isInteger(fs)||fs<50||fs>250||!Number.isInteger(bits)||bits<3||bits>12)throw new RangeError('outside lesson domain');
 const signal=(t:number)=>Math.sin(2*Math.PI*5*t)+.5*Math.sin(2*Math.PI*95*t);
 const alias=((95+fs/2)%fs)-fs/2,rows:number[][]=[];
 for(let n=0;n<=Math.round(.4*fs);n++){const t=n/fs,x=signal(t),equivalent=Math.sin(2*Math.PI*5*t)+.5*Math.sin(2*Math.PI*alias*t);rows.push([t,x,adc(x,bits),equivalent]);}
 const curve=Array.from({length:2001},(_,i)=>{const t=i*.4/2000;return[t,signal(t)];});
 return{fs,bits,alias,q:4/2**bits,levels:2**bits,rows,curve,maxError:Math.max(...rows.map(r=>Math.abs(r[2]-r[1])))};
}
