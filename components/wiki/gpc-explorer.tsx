"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {gpcPlan} from '@/lib/gpc';
export function GpcExplorer(){
 const [N1,setN1]=useState(3),[N2,setN2]=useState(10),[Nu,setNu]=useState(3),[level,setLevel]=useState(3),[delay,setDelay]=useState(3);
 const lambda=[0,.001,.01,.1,1,10][level],r=useMemo(()=>gpcPlan({N1,N2,Nu,lambda,delay}),[N1,N2,Nu,lambda,delay]);
 const option=useMemo<EChartsOption>(()=>({animation:false,legend:{data:['预测输出','参考','绝对输入']},tooltip:{trigger:'axis'},grid:{left:46,right:48,top:70,bottom:42},xAxis:{type:'value',min:0,max:30,interval:5,name:'未来拍'},yAxis:[{type:'value',min:-1,max:2.5,name:'输出'},{type:'value',min:-15,max:15,name:'输入'}],series:[{name:'预测输出',type:'line',data:r.solved?[[0,0],...r.prediction.map((v,i)=>[i+1,v])]:[]},{name:'参考',type:'line',symbol:'none',lineStyle:{type:'dashed'},data:[[0,1],[30,1]]},{name:'绝对输入',type:'line',step:'end',yAxisIndex:1,data:r.solved?r.inputs.map((v,i)=>[i,v]):[]}]}),[r]);
 const ref=useECharts(option);
 return <section aria-label="GPC预测实验" style={{border:'1px solid var(--border)',borderRadius:10,padding:16,margin:'24px 0'}}>
 <strong>加热指令要等几拍才能看见？</strong><p>零初始历史，a=0.9048、b=0.0952，未来参考恒为1；d 是 u(k) 首次影响 y(k+d) 的总离散延迟。增量尾部为0，绝对输入保持。下面是无约束计划，尚未检查设备限制。</p>
 {[{name:'费用起点 N₁',value:N1,set:setN1,min:1,max:5,step:1},{name:'预测终点 N₂',value:N2,set:setN2,min:5,max:30,step:1},{name:'控制时域 Nᵤ',value:Nu,set:setNu,min:1,max:10,step:1},{name:'总离散延迟 d',value:delay,set:setDelay,min:1,max:6,step:1}].map(p=><label key={p.name} style={{display:'block',margin:'12px 0'}}>{p.name}：{p.value}<input aria-label={p.name} type="range" min={p.min} max={p.max} step={p.step} value={p.value} onChange={e=>p.set(Number(e.target.value))} style={{width:'100%'}}/></label>)}
 <label style={{display:'block',margin:'12px 0'}}>增量权重 λ：{lambda}<input aria-label="增量权重档位" type="range" min={0} max={5} step={1} value={level} onChange={e=>setLevel(Number(e.target.value))} style={{width:'100%'}}/></label>
 <button style={{padding:8}} onClick={()=>{setN1(3);setN2(10);setNu(3);setLevel(3);setDelay(3);}}>恢复默认</button>
 <p data-testid="gpc-readout">G：{N2-N1+1}×{Nu}。{r.solved?`ΔU=[${r.du.map(v=>v.toFixed(6)).join(', ')}]；首输入=${r.inputs[0].toFixed(6)}；阶段目标J=${r.cost.toFixed(8)}；梯度残差=${r.residual.toExponential(2)}`:'λ=0时矩阵秩不足或数值分解失败，本实现未提供唯一动作；不等于约束不可行。'}</p>
 <div ref={ref} style={{width:'100%',height:350}}/>
 <p>费用只计 N₁..N₂，预测仍从第一拍演化；图不表示硬输出界。不同λ定义了不同费用，不能用J的大小跨λ排名。两纵轴范围固定，图线连接离散样本。</p>
 </section>;
}
