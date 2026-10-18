/** First-lobe ZOH phase budget. A screening calculation, not a stability proof. */
export function samplingBudget(TsMs=3, delayMs=1, omega=100, pm=60, required=45, workMs=.7) {
 const values=[TsMs,delayMs,omega,pm,required,workMs];
 if(values.some(v=>!Number.isFinite(v))||TsMs<=0||delayMs<0||omega<=0||required<0||pm>180||pm<=required||workMs<0)throw new RangeError('Invalid sampling budget');
 const Ts=TsMs/1000,d=delayMs/1000,x=omega*Ts/2;
 const upperMs=2000*((pm-required)*Math.PI/(180*omega)-d);
 const loss=(Ts/2+d)*omega*180/Math.PI;
 return {upperMs,loss,estimatedPM:pm-loss,holdAmplitude:Math.abs(Math.sin(x)/x),ratio:2*Math.PI/(Ts*omega),deadlineOK:TsMs>=workMs,phaseOK:TsMs<=upperMs,feasible:upperMs>=workMs};
}
