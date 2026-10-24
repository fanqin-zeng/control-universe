export type Sample={id:string;x:number[];y:number};
export const amplitudes=[1,2,4],signals=[.25,.5,1],angles=[0,15,30,45,60,75,90];
export function records(a:number,b:number,split:'train'|'validation'|'test'):Sample[]{
 const f=split==='train'?[1,1]:split==='validation'?[1.5,.75]:[.75,1.5];
 return [-1,1].flatMap((u,i)=>[-1,1].map((v,j)=>({id:split+'-'+i+j,x:[u*a*f[0],v*b*f[1]],y:v})));
}
export function fitPreprocess(rows:Sample[],standardized:boolean){
 if(!rows.length||rows.some(r=>r.x.length!==2||r.x.some(v=>!Number.isFinite(v))))throw new RangeError('two finite features required');
 const mean=[0,1].map(j=>rows.reduce((s,r)=>s+r.x[j],0)/rows.length);
 const sd=[0,1].map(j=>Math.sqrt(rows.reduce((s,r)=>s+(r.x[j]-mean[j])**2,0)/rows.length));
 return {mean,scale:sd.map(v=>standardized&&v>0?v:1),constant:sd.map(v=>v===0)};
}
export function transform(rows:Sample[],prep:ReturnType<typeof fitPreprocess>){return rows.map(r=>({...r,x:r.x.map((v,j)=>(v-prep.mean[j])/prep.scale[j])}));}
export function fitPca(points:number[][]){
 if(points.length<2||points.some(r=>r.length!==2||r.some(v=>!Number.isFinite(v))))throw new RangeError('PCA input');
 const center=[0,1].map(j=>points.reduce((s,r)=>s+r[j],0)/points.length),c=[0,1].map(i=>[0,1].map(j=>points.reduce((s,r)=>s+(r[i]-center[i])*(r[j]-center[j]),0)/points.length));
 const gap=Math.hypot(c[0][0]-c[1][1],2*c[0][1]),degenerate=gap<=1e-12,theta=degenerate?0:.5*Math.atan2(2*c[0][1],c[0][0]-c[1][1]);
 const w=[Math.cos(theta),Math.sin(theta)].map(v=>Math.abs(v)<1e-15?0:v);
 return {center,covariance:c,eigenvalues:[(c[0][0]+c[1][1]+gap)/2,(c[0][0]+c[1][1]-gap)/2],degenerate,w,angle:theta*180/Math.PI};
}
export function unit(deg:number){if(!angles.includes(deg))throw new RangeError('candidate angle');return [deg===90?0:Math.cos(deg*Math.PI/180),deg===0?0:Math.sin(deg*Math.PI/180)];}
const dot=(a:number[],b:number[])=>a.reduce((s,x,i)=>s+x*b[i],0);
function metrics(rows:Sample[],w:number[],head:{slope:number;intercept:number}){const scores=rows.map(r=>head.slope*dot(w,r.x)+head.intercept),pred=scores.map(v=>Math.abs(v)<=1e-12||v>0?1:-1);return {mse:scores.reduce((s,v,i)=>s+(v-rows[i].y)**2,0)/rows.length,accuracy:pred.filter((v,i)=>v===rows[i].y).length/rows.length,scores,pred};}
function evaluate(train:Sample[],validation:Sample[],w:number[],angle:number){
 const z=train.map(r=>dot(w,r.x)),mz=z.reduce((s,v)=>s+v,0)/z.length,my=train.reduce((s,r)=>s+r.y,0)/train.length,den=z.reduce((s,v)=>s+(v-mz)**2,0),slope=den===0?0:z.reduce((s,v,i)=>s+(v-mz)*(train[i].y-my),0)/den,head={slope,intercept:my-slope*mz},projected=z.map(v=>w.map(x=>v*x));
 const reconstruction=train.reduce((s,r,i)=>s+r.x.reduce((t,v,j)=>t+(v-projected[i][j])**2,0),0)/(2*train.length);
 return {angle,w,head,z,projected,reconstruction,train:metrics(train,w,head),validation:metrics(validation,w,head)};
}
export function study(a=2,b=.5,standardized=false){
 if(!amplitudes.includes(a)||!signals.includes(b))throw new RangeError('experiment domain');
 const raw=records(a,b,'train'),prep=fitPreprocess(raw,standardized),train=transform(raw,prep),validation=transform(records(a,b,'validation'),prep),pcaModel=fitPca(train.map(r=>r.x)),pca=evaluate(train,validation,pcaModel.w,pcaModel.angle),candidates=angles.map(deg=>evaluate(train,validation,unit(deg),deg));
 let selected=candidates[0];for(const row of candidates)if(row.validation.mse<selected.validation.mse)selected=row;
 return {a,b,standardized,preprocess:prep,points:train,pcaModel,pca,candidates,selected};
}
export function audit(a=2,b=.5,standardized=false){const s=study(a,b,standardized),raw=records(a,b,'test'),test=transform(raw,s.preprocess),flipped=transform(raw.map(r=>({...r,x:[r.x[0],-r.x[1]]})),s.preprocess);return {pcaTest:metrics(test,s.pca.w,s.pca.head),selectedTest:metrics(test,s.selected.w,s.selected.head),polarityPcaTest:metrics(flipped,s.pca.w,s.pca.head),polaritySelectedTest:metrics(flipped,s.selected.w,s.selected.head)};}
export function contrastive(a=2,b=.5,temperature=.5){if(a<=0||b<=0||temperature<=0||![a,b,temperature].every(Number.isFinite))throw new RangeError('positive finite parameters');const cosPositive=(b*b-a*a)/(a*a+b*b),cosWrong=-cosPositive,loss=(positive:number,negative:number)=>{const x=(negative-positive)/temperature;return Math.max(x,0)+Math.log1p(Math.exp(-Math.abs(x)));};return {cosPositive,cosWrong,informative:loss(1,-1),collapsed:loss(1,1),wrongPositive:loss(-1,-1),falseNegative:loss(1,1)};}
