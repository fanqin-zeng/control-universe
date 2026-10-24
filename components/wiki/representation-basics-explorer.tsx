"use client";
import {useMemo,useState} from 'react';import type {EChartsOption} from 'echarts';import {useECharts} from './use-echarts';import {study,amplitudes,signals,angles} from '@/lib/representation-basics';
export function RepresentationBasicsExplorer(){
 const [a,setA]=useState(2),[b,setB]=useState(.5),[standardized,setStandardized]=useState(false),[mode,setMode]=useState('pca'),[angle,setAngle]=useState(45);
 const s=useMemo(()=>study(a,b,standardized),[a,b,standardized]);const chosen=mode==='pca'?s.pca:mode==='selected'?s.selected:s.candidates.find(r=>r.angle===angle)!;
 const option=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'item'},grid:{left:45,right:20,top:20,bottom:45},xAxis:{type:'value',min:-4.5,max:4.5,interval:1.5,name:'亮度特征',nameLocation:'middle',nameGap:27},yAxis:{type:'value',min:-4.5,max:4.5,interval:1.5,name:'横向特征',nameLocation:'middle',nameGap:30},series:[...[-1,1].flatMap(y=>[{name:y<0?'左侧样本':'右侧样本',type:'scatter' as const,z:3,symbolSize:12,itemStyle:{color:y<0?'#2563eb':'#d97706'},data:s.points.filter(r=>r.y===y).map(r=>r.x)},{name:y<0?'左侧重构':'右侧重构',type:'scatter' as const,z:3,symbol:'diamond',symbolSize:y<0?15:8,itemStyle:{color:y<0?'#2563eb':'#d97706'},data:s.points.flatMap((r,i)=>r.y===y?[chosen.projected[i]]:[])}]),{name:'编码方向',type:'line',z:1,lineStyle:{color:'#64748b',type:'dashed'},showSymbol:false,data:[chosen.w.map(v=>-4*v),chosen.w.map(v=>4*v)]}]}),[s,chosen]);const chart=useECharts(option);const style={padding:7,background:'#fff',color:'#172033',border:'1px solid #94a3b8',borderRadius:5};
 const reset=()=>{setA(2);setB(.5);setStandardized(false);setMode('pca');setAngle(45);};
 return <section aria-label="表征目标实验" className="not-prose" style={{background:'#fff',color:'#172033',padding:16,margin:'20px 0',border:'1px solid #94a3b8',borderRadius:10,minWidth:0}}>
 <strong>重构保留的方向，是否还分得清左右？</strong>
 <label style={{display:'block',marginTop:10}}>亮度幅度 A <select aria-label="亮度幅度" value={a} onChange={e=>setA(+e.target.value)} style={style}>{amplitudes.map(v=><option key={v}>{v}</option>)}</select></label>
 <label style={{display:'block',marginTop:10}}>横向幅度 B <select aria-label="横向幅度" value={b} onChange={e=>setB(+e.target.value)} style={style}>{signals.map(v=><option key={v}>{v}</option>)}</select></label>
 <label style={{display:'block',marginTop:10}}><input aria-label="训练拟合标准化" type="checkbox" checked={standardized} onChange={e=>setStandardized(e.target.checked)}/> 用训练集拟合标准差缩放</label>
 <label style={{display:'block',marginTop:10}}>方向策略 <select aria-label="方向策略" value={mode} onChange={e=>setMode(e.target.value)} style={style}><option value="pca">PCA重构最优</option><option value="selected">验证选方向</option><option value="manual">手动候选</option></select></label>
 <label style={{display:'block',marginTop:10}}>手动角度 <select aria-label="编码角度" value={angle} onChange={e=>{setAngle(+e.target.value);setMode('manual');}} style={style}>{angles.map(v=><option key={v}>{v}</option>)}</select></label>
 <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:12}}><button style={style} onClick={()=>setMode('selected')}>验证选方向</button><button style={style} onClick={()=>{setA(1);setB(1);setStandardized(false);setMode('pca');}}>重根边界</button><button style={style} onClick={reset}>恢复默认</button></div>
 <p aria-live="polite">方向={chosen.angle.toFixed(0)}°；训练重构MSE={chosen.reconstruction.toFixed(8)}；验证标签MSE={chosen.validation.mse.toFixed(8)}；验证准确率={(100*chosen.validation.accuracy).toFixed(0)}%；探针斜率={chosen.head.slope.toFixed(8)}。</p>
 <p>PCA特征值：{s.pcaModel.eigenvalues.map(v=>v.toFixed(8)).join('，')}；{s.pcaModel.degenerate?'重根：方向不唯一，本实现选第一轴':'最大特征值单重'}。仅在训练/验证数据上选择，测试结果不在交互中显示。</p>
 <div ref={chart} style={{width:'100%',maxWidth:480,aspectRatio:'1 / 1',height:'auto',margin:'0 auto'}}/>
 <p>蓝色表示左侧，橙色表示右侧；圆点为训练特征，菱形为正交重构；异类重合表示该方向丢失了任务信息。标准化开启后图与重构MSE均在变换坐标中；不能与原坐标MSE直接比大小。候选固定七角，不代表全域监督最优。</p>
 </section>;
}
