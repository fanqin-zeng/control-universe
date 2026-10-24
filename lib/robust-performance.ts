/** Exact DC formulas for the stated first-order model and its weight envelope. */
export function performancePoint(k:number,delta:number,wb:number){
 const A=.01,M=2;
 return {nominal:1/(1+k),actual:1/(1+k*(1+.5*delta)),worst:1/(1+.5*k),pole:-(1+k*(1+.5*delta)),
  rs:.5*Math.abs(k)/(1+k),weightDC:1/A,weightInf:1/M,weightAtWb:Math.sqrt(1+1/(M*M))/Math.sqrt(1+A*A),
  weightPole:A*wb,weightZero:M*wb,unity:wb*Math.sqrt((1-A*A)/(1-1/(M*M))),
  robustDC:k>18,nominalDC:k>9};
}
export function weightEnvelope(w:number,wb:number){return Math.sqrt(w*w+(.01*wb)**2)/Math.sqrt((w/2)**2+wb*wb);}
