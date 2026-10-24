export type ExcitationMode = 'periodic' | 'constant' | 'alternating' | 'burst';
export function excitationExperiment(amplitude=1, window=8, forgetting=1, mode:ExcitationMode='periodic') {
  if(!Number.isFinite(amplitude)||amplitude<0||amplitude>1||![4,8,12,16].includes(window)||!Number.isFinite(forgetting)||forgetting<.9||forgetting>1||!['periodic','constant','alternating','burst'].includes(mode)) throw new RangeError('Invalid excitation experiment parameters');
  const input=(k:number):number=>mode==='constant'?amplitude:mode==='alternating'?(k%2===0?amplitude:-amplitude):(mode==='burst'&&(k<0||k>=8)?0:amplitude*[1,0,-1,0][((k%4)+4)%4]);
  let p=1,q=0,r=1,t1=0,t2=0;
  const rows=[{n:0,first:0,second:0,minEigen:null as number|null,input:input(-1),p11:1,p12:0,p22:1}];
  for(let k=0;k<64;k++){
    const x=input(k),z=input(k-1),y=.6*x+.2*z;
    const px=p*x+q*z,pz=q*x+r*z,den=forgetting+x*px+z*pz;
    const e=y-x*t1-z*t2;t1+=px/den*e;t2+=pz/den*e;
    p=(p-px*px/den)/forgetting;q=(q-px*pz/den)/forgetting;r=(r-pz*pz/den)/forgetting;
    let minEigen:number|null=null;
    if(k+1>=window){let a=0,b=0,c=0;for(let j=k+1-window;j<=k;j++){const v=input(j),w=input(j-1);a+=v*v;b+=v*w;c+=w*w;}minEigen=Math.max(0,(a+c-Math.hypot(a-c,2*b))/2);}
    rows.push({n:k+1,first:t1,second:t2,minEigen,input:x,p11:p,p12:q,p22:r});
  }
  const observedMinimum=Math.min(...rows.flatMap(row=>row.minEigen===null?[]:[row.minEigen]));
  return {rows,observedMinimum};
}
