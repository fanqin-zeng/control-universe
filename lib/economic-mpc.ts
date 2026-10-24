export type EconomicConfig={x0:number;capacity:number;limit:number;p0:number;p1:number;h:number};
export const economicDefaults:EconomicConfig={x0:0,capacity:2,limit:2,p0:1,p1:4,h:.2};
export function economicCost(c:EconomicConfig,u0:number){const u1=2-u0,x1=c.x0+u0-1;return c.p0*u0+c.p1*u1+.5*(u0*u0+u1*u1)+.5*c.h*(c.x0*c.x0+x1*x1);}
export function planEconomic(c:EconomicConfig=economicDefaults){
 if(!Object.values(c).every(Number.isFinite)||c.capacity<0||c.limit<0||c.h<0||c.p0<0||c.p1<0)throw new RangeError('Invalid economic teaching contract');
 if(c.x0<0||c.x0>c.capacity)return {feasible:false as const,reason:'初库存不在物理域'};
 const lower=Math.max(0,2-c.limit,1-c.x0),upper=Math.min(c.limit,2,c.capacity+1-c.x0);
 if(lower>upper)return {feasible:false as const,reason:'本周期供需与末库存约束不可行',lower,upper};
 const clip=(u:number)=>Math.max(lower,Math.min(upper,u));
 const u=clip((c.p1-c.p0+2+c.h*(1-c.x0))/(2+c.h));
 const baseline=clip((2+c.h*(1-c.x0))/(2+c.h));
 const g=c.p0-c.p1+2*(u-1)+c.h*(c.x0+u-1);
 const lambdaLower=u===lower?Math.max(0,g):0,lambdaUpper=u===upper?Math.max(0,-g):0;
 const residual=Math.max(0,lower-u,u-upper,Math.abs(g-lambdaLower+lambdaUpper),lambdaLower*Math.abs(u-lower),lambdaUpper*Math.abs(upper-u));
 return {feasible:true as const,lower,upper,economic:{u:[u,2-u],x:[c.x0,c.x0+u-1,c.x0],cost:economicCost(c,u)},tracking:{u:[baseline,2-baseline],x:[c.x0,c.x0+baseline-1,c.x0],cost:economicCost(c,baseline),objective:.5*c.h*(c.x0*c.x0+(c.x0+baseline-1)**2)+.5*((baseline-1)**2+(1-baseline)**2)},gradient:g,lambdaLower,lambdaUpper,residual};
}
