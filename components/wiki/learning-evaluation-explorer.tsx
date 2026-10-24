"use client";
import {useMemo,useState} from 'react';import type {EChartsOption} from 'echarts';import {useECharts} from './use-echarts';
import {EVALUATION_DEFAULT,evaluationStudy,type EvaluationConfig,type EvaluationScenario,type EvaluationPolicy} from '@/lib/learning-evaluation';
export function LearningEvaluationExplorer(){
 const [c,setC]=useState<EvaluationConfig>({...EVALUATION_DEFAULT});const r=useMemo(()=>evaluationStudy(c),[c]);const fmt=(x:number|null)=>x===null?'未定义':x.toFixed(6);
 const option=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},legend:{top:0,data:['候选验证损失','基线验证损失']},grid:{left:45,right:18,top:45,bottom:45},xAxis:{type:'value',min:.2,max:.8,interval:.2,name:'报警阈值',nameLocation:'middle',nameGap:28},yAxis:{type:'value',min:0,max:3,interval:1,name:'平均损失'},series:[{name:'候选验证损失',type:'line',itemStyle:{color:'#2563eb'},data:[...r.candidates].reverse().map(v=>[v.threshold,v.metrics.risk])},{name:'基线验证损失',type:'line',lineStyle:{type:'dashed'},itemStyle:{color:'#d97706'},data:[[.3,r.validationBaseline.risk],[.7,r.validationBaseline.risk]]}]}),[r]);const chart=useECharts(option),style={padding:7,background:'#fff',color:'#172033',border:'1px solid #94a3b8',borderRadius:5};
 return <section aria-label="学习实验评估" className="not-prose" style={{background:'#fff',color:'#172033',border:'1px solid #94a3b8',borderRadius:10,padding:16,margin:'20px 0',minWidth:0}}>
 <strong>先约定漏检代价，再决定是否报警</strong>
 <label style={{display:'block',marginTop:10}}>漏检代价 <select aria-label="漏检代价" value={c.cfn} onChange={e=>setC({...c,cfn:+e.target.value})} style={style}>{[1,5,10].map(v=><option key={v}>{v}</option>)}</select>；误报代价固定为1</label>
 <label style={{display:'block',marginTop:10}}>测试工况 <select aria-label="测试工况" value={c.scenario} onChange={e=>setC({...c,scenario:e.target.value as EvaluationScenario})} style={style}><option value="nominal">正常评分</option><option value="drift">缺陷评分下降</option><option value="tie">全部评分偏低</option></select></label>
 <label style={{display:'block',marginTop:10}}>阈值策略 <select aria-label="阈值策略" value={c.policy} onChange={e=>setC({...c,policy:e.target.value as EvaluationPolicy})} style={style}><option value="validation">仅验证集选择并锁定</option>{['0.3','0.5','0.7'].map(v=><option key={v} value={v}>诊断：固定{v}</option>)}</select></label>
 <button onClick={()=>setC({...EVALUATION_DEFAULT})} style={{...style,marginTop:12}}>恢复默认</button>
 <div aria-live="polite" data-evaluation-readout style={{overflowWrap:'anywhere'}}>
 <p>验证所选阈值={fmt(r.selectedThreshold)}；当前阈值={fmt(r.usedThreshold)}。</p>
 <p>TP={r.test.tp}；FP={r.test.fp}；FN={r.test.fn}；TN={r.test.tn}；测试条数={r.test.n}。</p>
 <p>准确率={fmt(r.test.accuracy)}；精确率={fmt(r.test.precision)}；召回率={fmt(r.test.recall)}；特异度={fmt(r.test.specificity)}；F1={fmt(r.test.f1)}；平衡准确率={fmt(r.test.balancedAccuracy)}。</p>
 <p>候选总代价={r.test.cost}；基线总代价={r.baseline.cost}；候选平均损失={fmt(r.test.risk)}；基线平均损失={fmt(r.baseline.risk)}；基线准确率={fmt(r.baseline.accuracy)}；基线精确率={fmt(r.baseline.precision)}。</p>
 <p>配对差={fmt(r.bootstrap.mean)}；经验区间下界={fmt(r.bootstrap.lower)}；上界={fmt(r.bootstrap.upper)}；重采样组合={r.bootstrap.count}。</p>
 </div>
 <div ref={chart} style={{width:'100%',height:300}}/>
 <p>图只画验证集平均损失；蓝线三个预先声明的候选点，连线仅作阅读辅助。橙虚线是永不报警基线。阈值只由验证数据和代价选择，切换测试工况不改变选择。</p>
 <p>{c.policy==='validation'?'当前为验证锁定路线。':'当前为回顾性阈值诊断，不能把反复查看测试后的选择再叫独立测试。'} 本教学页可重复操作；真实研究须在看测试结果前冻结协议。区间按四批次重采样；256组合不是256次独立实验，不能保证总体覆盖率。</p>
 </section>;
}
