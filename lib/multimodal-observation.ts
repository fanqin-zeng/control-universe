/** Teaching model only: two scalar, same-target measurements in mm. */
export type MultimodalParams={age:number;speed:number;rho:number;vision:boolean;proprio:boolean};
export const multimodalDefaults:MultimodalParams={age:0,speed:20,rho:0,vision:true,proprio:true};
export function evaluateMultimodal(p:MultimodalParams){
  if(!Number.isFinite(p.age)||p.age<0||!Number.isFinite(p.speed)||!Number.isFinite(p.rho)||Math.abs(p.rho)>1)throw new Error("invalid observation contract");
  const w=p.vision?(p.proprio?.2:1):0;
  const q=p.proprio?1-w:0;
  const available=p.vision||p.proprio;
  const bias=-p.speed*p.age;
  const variance=w*w*16+q*q*4+2*w*q*p.rho*8;
  // Frame residuals +4 and -2 are illustrative, not a sample used to estimate variance.
  const visual=100+bias+4,proprioceptive=98;
  return {available,w,q,bias,visual,proprioceptive,estimate:available?w*visual+q*proprioceptive:null,
    variance:available?variance:null,mse:available?variance+(w*bias)**2:null,baseline:p.proprio?4:null};
}
