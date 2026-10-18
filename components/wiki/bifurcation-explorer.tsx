"use client";
import{useMemo,useState}from"react";
import type{EChartsOption}from"echarts";
import{useECharts}from"./use-echarts";
import{logisticOrbit,logisticCloud}from"@/lib/bifurcation";
export function BifurcationExplorer(){
  const[r,setR]=useState(3.2),[seed,setSeed]=useState(.2);
  const run=useMemo(()=>logisticOrbit(r,seed),[r,seed]);
  const cloud=useMemo(()=>logisticCloud(seed),[seed]);
  const option=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:"item"},grid:[{left:48,right:18,top:35,height:145},{left:48,right:18,top:235,bottom:40}],xAxis:[{type:"value",min:2001,max:2256,name:"更新次数 n",nameLocation:"middle",nameGap:25},{type:"value",gridIndex:1,min:2.8,max:4,name:"参数 r",nameLocation:"middle",nameGap:25}],yAxis:[{type:"value",min:0,max:1,name:"xₙ"},{type:"value",gridIndex:1,min:0,max:1,name:"末段样本"}],series:[{type:"line",name:"当前轨迹",showSymbol:false,data:run.series},{type:"scatter",name:"逐参数样本",xAxisIndex:1,yAxisIndex:1,data:cloud,symbolSize:1.5,itemStyle:{color:"#475569"},markLine:{silent:true,symbol:"none",data:[{xAxis:r}],lineStyle:{color:"#2563eb"},label:{show:false}}}]}),[run,cloud,r]);
  const chart=useECharts(option),button={padding:"6px 9px",border:"1px solid #94a3b8",borderRadius:5,background:"#f1f5f9",color:"#1e293b",cursor:"pointer"};
  return <section aria-label="分岔迭代实验台" style={{border:"1px solid #cbd5e1",borderRadius:10,padding:16,margin:"24px 0",background:"#fff",color:"#334155",minWidth:0}}>
    <strong>从每步重复，到两步交替</strong>
    <p>xₙ₊₁=r xₙ(1−xₙ)，状态与参数归一化。每次从同一初态重新计算；没有随机数。</p>
    <label style={{display:"block"}}>参数 r={r.toFixed(2)} <input aria-label="增长参数" type="range" min={2.8} max={4} step={.01} value={r} onChange={e=>setR(Number(e.target.value))} style={{width:"min(260px,100%)"}}/></label>
    <label style={{display:"block"}}>初态 x₀={seed.toFixed(2)} <input aria-label="初始数量" type="range" min={.05} max={.95} step={.01} value={seed} onChange={e=>setSeed(Number(e.target.value))} style={{width:"min(260px,100%)"}}/></label>
    <div style={{display:"flex",gap:8,flexWrap:"wrap",margin:"12px 0"}}>
      <button style={button} onClick={()=>setR(2.8)}>周期1示例</button><button style={button} onClick={()=>setR(3.5)}>周期4示例</button><button style={button} onClick={()=>setR(3.83)}>周期窗口</button><button style={button} onClick={()=>setR(3.9)}>不规则示例</button><button style={button} onClick={()=>{setR(4);setSeed(.75);}}>不稳定不动点</button><button style={button} onClick={()=>{setR(3.2);setSeed(.2);}}>恢复默认</button>
    </div>
    <p aria-live="polite">先丢弃2000步，时序显示第2001–2256步；有限指数从第2000步的状态起统计8000次更新：{run.zeroDerivative?"−∞（窗口内导数为0）":run.lyapunov!.toFixed(6)} /步。正值也不能单独证明轨迹非周期。</p>
    {run.cycle.length>0&&<p>周期2候选：{run.cycle.map(x=>x.toFixed(6)).join(" / ")}；两步乘子 {run.cycleMultiplier.toFixed(6)}。{Math.abs(Math.abs(run.cycleMultiplier)-1)<1e-10?"处于线性判据边界。":Math.abs(run.cycleMultiplier)<1?"这条周期2分支局部渐近稳定。":"这条周期2分支不稳定；当前轨迹不必落在它上面。"}</p>}
    <p>时序前四值：{run.series.slice(0,4).map(row=>row[1].toFixed(6)).join(" / ")}。</p>
    <div ref={chart} style={{height:460,width:"100%",minWidth:0}}/>
    <p>下图每个r都独立从当前x₀出发，丢弃2000步、保留48步；蓝虚线标当前参数。点云不包含全部不稳定分支，不能保证找全共存吸引子。滑块靠近临界值时，请留意长暂态。</p>
  </section>;
}
