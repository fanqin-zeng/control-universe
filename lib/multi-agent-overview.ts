export type MultiTopology = "chain" | "split" | "directed";
export function multiAgentExperiment(topology: MultiTopology, alpha: number, selected = 1) {
  if (!["chain", "split", "directed"].includes(topology) || !Number.isFinite(alpha) || alpha < .05 || alpha > .7 || !Number.isInteger(selected) || selected < 0 || selected > 20) throw new RangeError("Outside lesson domain");
  // a_ij: node i receives node j. Every update reads the entire old vector.
  const adjacency = topology === "chain" ? [[0,1,0],[1,0,1],[0,1,0]] : topology === "split" ? [[0,1,0],[1,0,0],[0,0,0]] : [[0,0,0],[1,0,0],[0,1,0]];
  const states: number[][] = [[0,1,5]];
  for (let k=0;k<20;k++) {
    const old=states[k];
    states.push(old.map((v,i)=>v+alpha*adjacency[i].reduce((s,a,j)=>s+a*(old[j]-v),0)));
  }
  const values=states[selected], mean=values.reduce((s,v)=>s+v,0)/3;
  const limit=topology==="split"?[.5,.5,5]:topology==="directed"?[0,0,0]:[2,2,2];
  const convergent=topology!=="chain"||alpha<2/3;
  return {adjacency,states,values,mean,spread:Math.max(...values)-Math.min(...values),time:selected*alpha,limit,convergent};
}
