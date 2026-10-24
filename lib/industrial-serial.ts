/** Bounded teaching model; no serial port or hardware scheduling claims. */
export const serialBauds=[9600,19200,38400,115200] as const;
export function serialBudget(baud=19200,registers=2,stations=1,period=20){
 if(!Number.isInteger(baud)||baud<9600||baud>115200||!Number.isInteger(registers)||registers<1||registers>16||!Number.isInteger(stations)||stations<1||stations>4||!Number.isFinite(period)||period<1||period>100)throw new RangeError('Unsupported teaching parameters');
 const charMs=11000/baud,gapMs=baud<=19200?3.5*charMs:1.75,requestBytes=8,responseBytes=5+2*registers;
 const segments=[requestBytes*charMs,gapMs,1,responseBytes*charMs,gapMs],slotMs=segments.reduce((s,v)=>s+v,0),cycleMs=stations*slotMs;
 return {baud,registers,stations,period,charMs,gapMs,requestBytes,responseBytes,segments,slotMs,cycleMs,marginMs:period-cycleMs,ratio:cycleMs/period,fits:cycleMs<=period};
}
export function serialCrc(data:number[]){
 if(data.some(v=>!Number.isInteger(v)||v<0||v>255))throw new RangeError('Byte required');
 let crc=0xffff;for(const b of data){crc^=b;for(let k=0;k<8;k++)crc=(crc&1)?(crc>>>1)^0xa001:crc>>>1;}return crc;
}
export function serialFrame(data:number[]){const crc=serialCrc(data);return [...data,crc&255,crc>>>8];}
export function serialRequest(registers=2){if(!Number.isInteger(registers)||registers<1||registers>16)throw new RangeError('Unsupported teaching register count');return serialFrame([1,3,0,0,0,registers]);}
export function serialResponse(registers=2){
 if(!Number.isInteger(registers)||registers<1||registers>16)throw new RangeError('Unsupported teaching register count');
 return serialFrame([1,3,2*registers,...Array.from({length:registers},(_,i)=>{const v=i===0?0x1234:i===1?0xff9c:i;return [v>>>8,v&255];}).flat()]);
}
export function serialDecode(bytes:number[],count=2):{accepted:boolean;reason:string;registers:number[];temperature:number|null}{
 if(!Number.isInteger(count)||count<1||count>16)throw new RangeError('Unsupported teaching register count');
 const fail=(reason:string)=>({accepted:false,reason,registers:[],temperature:null});
 if(bytes.some(v=>!Number.isInteger(v)||v<0||v>255))return fail('byte');
 if(bytes.length<5)return fail('length');
 if(serialCrc(bytes)!==0)return fail('crc');
 if(bytes[0]!==1)return fail('unit');
 if(bytes[1]===0x83)return fail(bytes.length===5?'exception-'+bytes[2]:'length');
 if(bytes[1]!==3)return fail('function');
 if(bytes[2]!==count*2||bytes.length!==5+count*2)return fail('length');
 const registers=Array.from({length:count},(_,i)=>bytes[3+2*i]*256+bytes[4+2*i]);
 const raw=registers[1],temperature=count<2?null:(raw>=32768?raw-65536:raw)/10;
 return {accepted:true,reason:'accepted',registers,temperature};
}
export function serialFaults(){
 const normal=serialResponse(),bad=[...normal];bad[3]^=1;
 return [{name:'valid',bytes:normal},{name:'crc',bytes:bad},{name:'short',bytes:normal.slice(0,4)},{name:'unit',bytes:serialFrame([2,3,4,18,52,255,156])},{name:'function',bytes:serialFrame([1,4,4,18,52,255,156])},{name:'count',bytes:serialFrame([1,3,2,18,52])},{name:'exception',bytes:serialFrame([1,0x83,2])}].map(q=>({...q,...serialDecode(q.bytes)}));
}
export const serialHex=(data:number[])=>data.map(v=>v.toString(16).padStart(2,'0').toUpperCase()).join(' ');
