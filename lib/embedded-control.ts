/** Teaching interface model, not a chip ADC/PWM driver. */
export type EmbeddedPoint = {t:number;y:number;ideal:number;read:number|null;code:number|null;pwm:number|null;duty:number|null};
const clip=(x:number,lo:number,hi:number)=>Math.min(hi,Math.max(lo,x));
export function adcCode(temperature:number,bits:number) {
  if(!Number.isFinite(temperature)||!Number.isInteger(bits)||bits<4||bits>12)throw new RangeError('Finite temperature, integer bits 4..12 required');
  return Math.floor(clip(temperature,0,100)*(2**bits-1)/100+.5);
}
export function pwmCount(command:number,slots:number) {
  if(!Number.isFinite(command)||!Number.isInteger(slots)||slots<1||slots>1000)throw new RangeError('Finite command, integer slots 1..1000 required');
  return Math.floor(clip(command,0,1)*slots+.5);
}
export function embeddedExperiment(bits=8,slots=100,target=60) {
  adcCode(0,bits);pwmCount(0,slots);
  if(!Number.isFinite(target)||target<0||target>120)throw new RangeError('Target 0..120 required');
  const a=Math.exp(-.1/2),points:EmbeddedPoint[]=[];let y=20,ideal=20,maxGap=0,saturated=0;
  for(let k=0;k<100;k++) {
    const code=adcCode(y,bits),read=100*code/(2**bits-1),raw=.03*(target-read),pwm=pwmCount(raw,slots),duty=pwm/slots;
    points.push({t:k/10,y,ideal,read,code,pwm,duty});saturated+=Number(raw<0||raw>1);
    y=a*y+(1-a)*(20+80*duty);
    ideal=a*ideal+(1-a)*(20+80*clip(.03*(target-ideal),0,1));
    maxGap=Math.max(maxGap,Math.abs(y-ideal));
  }
  points.push({t:10,y,ideal,read:null,code:null,pwm:null,duty:null});
  return {bits,slots,target,firstCode:points[0].code!,firstRead:points[0].read!,firstPWM:points[0].pwm!,firstY:points[1].y,finalY:y,finalIdeal:ideal,maxGap,saturated,points};
}
export type Sample = {seq:number;stamp:number;code:number};
/** Input is an already coherent snapshot. Delta wrap is uint32 microseconds. */
export function consumeSample(lastSeq:number,sample:Sample,now:number,target=60) {
  const uint=(n:number)=>Number.isInteger(n)&&n>=0&&n<=0xffffffff;
  if(!uint(lastSeq)||!uint(sample.seq)||!uint(sample.stamp)||!uint(now)||!Number.isInteger(sample.code)||sample.code<0||sample.code>255||!Number.isFinite(target))throw new RangeError('Malformed coherent sample');
  const age=(now-sample.stamp)>>>0,advance=(sample.seq-lastSeq)>>>0;
  const reason=advance===0||advance>=0x80000000?'duplicate-or-old':age>500?'stale':'accepted';
  return {age,reason,accepted:reason==='accepted',lastSeq:reason==='accepted'?sample.seq:lastSeq,pwm:reason==='accepted'?pwmCount(.03*(target-100*sample.code/255),100):0};
}
