export type ClosedLoopInstrument='reference'|'input';
export function closedLoopMoments(feedback=.5,color=.5,amplitude=.5,instrument:ClosedLoopInstrument='reference'){
 if(![0,.5,.8].includes(feedback)||!Number.isFinite(color)||color<0||color>.8||![0,.5,1].includes(amplitude)||!['reference','input'].includes(instrument))throw new RangeError('Invalid closed-loop teaching parameters');
 const b=.8,c=-b*feedback,varianceV=.25/(1-color*color),covarianceYV=varianceV/(1-c*color);
 const varianceY=(b*b*amplitude*amplitude+varianceV+2*c*color*covarianceYV)/(1-c*c);
 const varianceU=amplitude*amplitude+feedback*feedback*varianceY,covarianceUV=-feedback*color*covarianceYV;
 const momentZU=instrument==='reference'?amplitude*amplitude:varianceU,momentZV=instrument==='reference'?0:covarianceUV;
 const lsTarget=varianceU>1e-14?b+covarianceUV/varianceU:null;
 const ivTarget=momentZU>1e-14?b+momentZV/momentZU:null;
 return {varianceV,covarianceYV,varianceY,varianceU,covarianceUV,momentZU,momentZV,lsTarget,ivTarget,admissible:momentZU>1e-14&&Math.abs(momentZV)<1e-14};
}
export function closedLoopCurve(feedback=.5,amplitude=.5,instrument:ClosedLoopInstrument='reference'){
 return Array.from({length:17},(_,i)=>({rho:i/20,...closedLoopMoments(feedback,i/20,amplitude,instrument)}));
}
