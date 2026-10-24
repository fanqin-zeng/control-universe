/** Scalar, strictly proper LTI prediction. y(k) is measured before u(k). */
export function predictionModel(a=.5,h=1,m=8){
  if(!Number.isFinite(a)||a<.2||a>.9||!Number.isFinite(h)||h<0||h>1||!Number.isInteger(m)||m<2||m>12)throw new RangeError('Invalid prediction parameters');
  const b=1-a,current=.5+.5*a,delta=[h,0,-h/2],direct:number[]=[],augmented:number[]=[],carima:number[]=[],dmc:number[]=[],free:number[]=[];
  let x=current,u=.5,dx=current-1,ya=current,previous=1,yc=current;
  const step=(i:number)=>1-a**Math.min(i,m);
  for(let j=1;j<=4;j++){
    const du=delta[j-1]??0;u+=du;x=a*x+b*u;direct.push(x);
    dx=a*dx+b*du;ya+=dx;augmented.push(ya);
    const next=(1+a)*yc-a*previous+b*du;previous=yc;yc=next;carima.push(yc);
    free.push(.5+(current-.5)*a**j);
    let yd=current-.5*(step(j+1)-step(1));
    for(let l=0;l<Math.min(j,3);l++)yd+=step(j-l)*delta[l];
    dmc.push(yd);
  }
  return {a,b,h,m,current,delta,direct,augmented,carima,dmc,free,error:Math.max(...dmc.map((v,i)=>Math.abs(v-direct[i])))};
}
