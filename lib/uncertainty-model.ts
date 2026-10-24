type Complex = [number, number];
const sub = (a:Complex,b:Complex):Complex => [a[0]-b[0],a[1]-b[1]];
const mul = (a:Complex,b:Complex):Complex => [a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]];
const div = (a:Complex,b:Complex):Complex => {
  const d=b[0]*b[0]+b[1]*b[1];
  return [(a[0]*b[0]+a[1]*b[1])/d,(a[1]*b[0]-a[0]*b[1])/d];
};
const abs = (a:Complex) => Math.hypot(a[0],a[1]);
/** Largest singular value of the triangular matrix [[a,b],[0,d]]. */
function singular(a:Complex,b:Complex,d:Complex){
  const trace=abs(a)**2+abs(b)**2+abs(d)**2;
  const determinant=abs(mul(a,d))**2;
  return Math.sqrt((trace+Math.sqrt(Math.max(0,trace*trace-4*determinant)))/2);
}
export function uncertaintyPoint(K:number,T:number,gain:number,w:number){
  const nominal=div([1,0],[1,w]);
  const plant=div([K,0],[1,T*w]);
  const error=sub(plant,nominal);
  const weight=Math.hypot(.5*w,.2)/Math.hypot(.8*w,1);
  // Actual closed forms for G=[[1/(s+1),2/(s+1)],[0,1/(s+2)]], Kc=diag(gain,1).
  const a=div([gain,0],[1+gain,w]),d=div([1,0],[3,w]);
  const b=div([4,2*w],mul([1+gain,w],[3,w]));
  const bi:Complex=[gain*b[0],gain*b[1]];
  return {w,absolute:abs(error),relative:abs(div(error,nominal)),weight,
    svOutput:singular(a,b,d),svInput:singular(a,bi,d),matrixDifference:Math.abs(gain-1)*abs(b)};
}
