export type Pair = [number,number];
export function bellmanExperiment(p=.6,gamma=.9,alpha=.25,steps=20,optimal=false){
  if(p<0||p>1||gamma<0||gamma>=1||alpha<0||alpha>1||!Number.isInteger(steps)||steps<0)throw Error('Invalid finite discounted MDP parameters');
  const d=10*p-4;
  const direct=d/(1-gamma),charge=(-1+6*gamma)/(1-gamma*gamma);
  const exactL=optimal?Math.max(direct,charge):((1-alpha)*d+alpha*(-1+6*gamma))/((1-gamma)*(1+alpha*gamma));
  const exact:Pair=[exactL,6+gamma*exactL];
  const backup=(v:Pair):Pair=>[optimal?Math.max(d+gamma*v[0],-1+gamma*v[1]):(1-alpha)*(d+gamma*v[0])+alpha*(-1+gamma*v[1]),6+gamma*v[0]];
  let v:Pair=[0,0];const history:Pair[]=[[0,0]];
  for(let k=0;k<steps;k++){v=backup(v);history.push(v);}
  const next=backup(v),residual=Math.max(Math.abs(next[0]-v[0]),Math.abs(next[1]-v[1]));
  return {history,v,exact,exactQ:[d+gamma*exact[0],-1+gamma*exact[1]] as Pair,
    q:[d+gamma*v[0],-1+gamma*v[1]] as Pair,residual,bound:residual/(1-gamma),
    error:Math.max(Math.abs(v[0]-exact[0]),Math.abs(v[1]-exact[1])),threshold:(3+10*gamma)/(10*(1+gamma)),direct,charge};
}
