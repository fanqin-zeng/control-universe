/** ML-04 scalar reverse mode: gradients add once per edge, topology once per node. */
export class Scalar {
  grad = 0;
  constructor(public data: number, private parents: Scalar[] = [], private pullback: () => void = () => {}) {}
  add(other: Scalar | number): Scalar {
    const b = other instanceof Scalar ? other : new Scalar(other);
    const out = new Scalar(this.data + b.data, [this,b], () => { this.grad += out.grad; b.grad += out.grad; });
    return out;
  }
  mul(other: Scalar | number): Scalar {
    const b = other instanceof Scalar ? other : new Scalar(other);
    const out = new Scalar(this.data * b.data, [this,b], () => { this.grad += b.data*out.grad; b.grad += this.data*out.grad; });
    return out;
  }
  tanh(): Scalar {
    const t = Math.tanh(this.data);
    const out = new Scalar(t,[this],()=>{this.grad += (1-t*t)*out.grad;});return out;
  }
  backward(): void {
    const visited = new Set<Scalar>(), topo: Scalar[] = [];
    const visit = (v: Scalar) => {if(visited.has(v))return;visited.add(v);v.parents.forEach(visit);topo.push(v);};
    visit(this);topo.forEach(v=>{v.grad=0;});this.grad=1;
    topo.reverse().forEach(v=>v.pullback());
  }
}
export type Params = [number,number,number,number]; // w,b,v,a
export type Samples = {x: number[]; y: number[]};
export const learningRates=[0,.05,.2,1,4];
export const budgets=[1,10,50,200];
export const initializations: Record<string,Params>={positive:[.5,0,.5,0],zero:[0,0,0,0],asymmetric:[-.5,.2,.5,-.1]};
export const validationData: Samples={x:[-.75,-.25,.25,.75],y:[-.75,-.25,.25,.75].map(x=>Math.tanh(2*x))};
export const testData: Samples={x:[-.9,-.4,.4,.9],y:[-.9,-.4,.4,.9].map(x=>Math.tanh(2*x))};
export function trainingData(noise=.3): Samples {const x=[-1,-.5,0,.5,1];return {x,y:x.map(v=>Math.tanh(2*v)+(v===0?noise:0))};}
export function predict(p: Params,x: number): number{return p[2]*Math.tanh(p[0]*x+p[1])+p[3];}
export function mse(p: Params,s: Samples): number {return s.x.reduce((sum,x,i)=>sum+(predict(p,x)-s.y[i])**2,0)/s.x.length;}
export function gradient(p: Params,s: Samples) {
  const nodes=p.map(v=>new Scalar(v));let loss=new Scalar(0);
  for(let i=0;i<s.x.length;i++){
    const h=nodes[0].mul(s.x[i]).add(nodes[1]).tanh();
    const r=nodes[2].mul(h).add(nodes[3]).add(-s.y[i]);
    loss=loss.add(r.mul(r).mul(.5/s.x.length));
  }
  loss.backward();return {loss:loss.data,grad:nodes.map(v=>v.grad) as Params};
}
export type Row={step:number;p:Params;train:number;validation:number;norm:number};
export function fit(train: Samples,validation: Samples,eta: number,budget: number,initial: Params) {
  if(!Number.isFinite(eta)||eta<0||!Number.isInteger(budget)||budget<0||budget>200)throw new RangeError('invalid update contract');
  const history: Row[]=[];let p:Params=[...initial],bestStep=0,status='budget',rejected: {step:number;train:number|null;validation:number|null;norm:number|null}|null=null;
  for(let k=0;k<=budget;k++){
    const g=gradient(p,train),norm=Math.hypot(...g.grad),tr=2*g.loss,va=mse(p,validation);
    if(![...p,tr,va,norm].every(Number.isFinite)||Math.max(tr,va,norm)>1e6){
      status='guard';rejected={step:k,train:Number.isFinite(tr)?tr:null,validation:Number.isFinite(va)?va:null,norm:Number.isFinite(norm)?norm:null};break;
    }
    history.push({step:k,p:[...p],train:tr,validation:va,norm});
    if(va<history[bestStep].validation)bestStep=k;
    if(norm<=1e-8){status='gradient';break;}
    if(k===budget)break;
    p=p.map((v,i)=>v-eta*g.grad[i]) as Params;
  }
  if(!history.length)throw new RangeError('initial state rejected');
  const last=history[history.length-1],best=history[bestStep];
  return {history,last,best,updates:last.step,status,rejected};
}
