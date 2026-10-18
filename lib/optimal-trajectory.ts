export function optimalTrajectory(T:number,t:number){
 if(!Number.isFinite(T)||T<.5||T>5||!Number.isFinite(t)||t<0||t>T+1e-12)throw Error('optimal trajectory domain');
 const D=Math.expm1(2*T),J=1/D,lambda0=2/D,c=-1/Math.expm1(T),Jconstant=.5*T*c*c;
 return {x:(Math.exp(2*T-t)-Math.exp(t))/D,u:-2*Math.exp(t)/D,lambda:2*Math.exp(t)/D,J,lambda0,c,Jconstant,saving:100*(1-J/Jconstant),peak:2*Math.exp(T)/D};
}
