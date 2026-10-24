/** Two fixed feature maps; QR fits training data only. No test-time refitting. */
export interface NonlinearConfig { amplitude:number; binary:boolean; noise:number; plant:'tanh'|'linear'; testAmplitude:number; seed:number }
export const nonlinearDefaults:NonlinearConfig={amplitude:1,binary:false,noise:0,plant:'tanh',testAmplitude:2,seed:20261024};
export function nonlinearRecord(amplitude:number,binary:boolean,noise:number,plant:'tanh'|'linear',seed:number){
 let state=seed>>>0;const next=()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return state/4294967296;};const u:number[]=[],y=[0],innovation:number[]=[];
 for(let k=0;k<128;k++){const r=next(),v=amplitude*(binary?(r<.5?-1:1):[-1,-.5,0,.5,1][Math.floor(5*r)]),e=noise*Math.sqrt(12)*(next()-.5);u.push(v);innovation.push(e);y.push(.7*y[k]+.3*(plant==='tanh'?Math.tanh(v):v)+e);}
 return {u,y,innovation};
}
function fit(record:ReturnType<typeof nonlinearRecord>,cubic:boolean){
 const p=cubic?3:2,cols=Array.from({length:p},(_,i)=>record.u.map((u,k)=>i===0?record.y[k]:i===1?u:u**3)),scale=Math.max(...cols.map(c=>Math.hypot(...c))),Q:number[][]=[],R=Array.from({length:p},()=>Array(p).fill(0) as number[]);let rank=0;
 for(let j=0;j<p;j++){const v=cols[j].slice();for(let pass=0;pass<2;pass++)for(let i=0;i<Q.length;i++){const dot=Q[i].reduce((s,q,k)=>s+q*v[k],0);R[i][j]+=dot;for(let k=0;k<v.length;k++)v[k]-=dot*Q[i][k];}const norm=Math.hypot(...v);if(norm<=1e-10*scale)continue;R[rank][j]=norm;Q.push(v.map(x=>x/norm));rank++;}
 if(rank!==p)return {rank,coefficients:null};
 const z=Q.map(q=>q.reduce((s,v,k)=>s+v*record.y[k+1],0)),coefficients=Array(p).fill(0) as number[];for(let i=p-1;i>=0;i--)coefficients[i]=(z[i]-R[i].reduce((s,r,j)=>s+(j>i?r*coefficients[j]:0),0))/R[i][i];return {rank,coefficients};
}
function assess(record:ReturnType<typeof nonlinearRecord>,coefficients:number[]|null){
 if(coefficients===null)return null;const [a,b,c=0]=coefficients,one:number[]=[],roll:number[]=[];let prev=record.y[0];
 for(let k=0;k<128;k++){one.push(a*record.y[k]+b*record.u[k]+c*record.u[k]**3);prev=a*prev+b*record.u[k]+c*record.u[k]**3;roll.push(prev);}
 const rmse=(v:number[])=>Math.sqrt(v.reduce((s,x,k)=>s+(x-record.y[k+1])**2,0)/128);return {one,roll,oneRMSE:rmse(one),rollRMSE:rmse(roll)};
}
export function nonlinearExperiment(config:NonlinearConfig=nonlinearDefaults){
 const {amplitude,binary,noise,plant,testAmplitude,seed}=config;if(![0,.5,1].includes(amplitude)||typeof binary!=='boolean'||![0,.03].includes(noise)||!['tanh','linear'].includes(plant)||![.5,1,2].includes(testAmplitude)||!Number.isInteger(seed)||seed<1||seed>4294960000)throw new RangeError('Unsupported nonlinear experiment');
 const train=nonlinearRecord(amplitude,binary,noise,plant,seed),validation=nonlinearRecord(1,false,noise,plant,seed+1000),test=nonlinearRecord(testAmplitude,false,noise,plant,seed+2000);
 const linear=fit(train,false),cubic=fit(train,true),models={linear:{...linear,train:assess(train,linear.coefficients),validation:assess(validation,linear.coefficients),test:assess(test,linear.coefficients)},cubic:{...cubic,train:assess(train,cubic.coefficients),validation:assess(validation,cubic.coefficients),test:assess(test,cubic.coefficients)}};
 const selected=models.cubic.validation!==null&&(models.linear.validation===null||models.cubic.validation.rollRMSE<models.linear.validation.rollRMSE-1e-12)?'cubic':models.linear.validation!==null?'linear':'unidentified';
 return {models,selected,train,validation,test};
}
