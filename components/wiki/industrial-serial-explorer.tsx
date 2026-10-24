"use client";
import {useMemo,useState} from 'react';import type {EChartsOption} from 'echarts';import {useECharts} from './use-echarts';
import {serialBauds,serialBudget,serialRequest,serialResponse,serialDecode,serialHex} from '@/lib/industrial-serial';
const names=['请求','静默','额外处理预留','响应','末尾静默'];
export function IndustrialSerialExplorer(){
 const [baud,setBaud]=useState(19200),[registers,setRegisters]=useState(2),[stations,setStations]=useState(1),[period,setPeriod]=useState(20),[corrupt,setCorrupt]=useState(false);
 const v=useMemo(()=>serialBudget(baud,registers,stations,period),[baud,registers,stations,period]);
 const bytes=serialResponse(registers);if(corrupt)bytes[bytes.length-1]^=1;const decoded=serialDecode(bytes,registers);
 const table=useMemo(()=>serialBauds.map(b=>serialBudget(b,registers,stations,period)),[registers,stations,period]),maxCycle=Math.max(period,...table.map(q=>q.cycleMs))*1.1;
 const option=useMemo<EChartsOption>(()=>({animation: false,tooltip:{trigger:'axis'},grid:{left:55,right:12,top:35,bottom:40},legend:{data:names,top:0,textStyle:{fontSize:10}},xAxis:{type:'value',min:0,max:Math.max(1,v.slotMs)*1.1,name:'事务预留 (ms)'},yAxis:{type:'category',min:0,max:0,data:['一事务']},series:v.segments.map((d,i)=>({name:names[i],type:'bar',stack:'slot',data:[d]}))}),[v]);
 const comparison=useMemo<EChartsOption>(()=>({animation: false,tooltip:{trigger:'axis'},grid:{left:55,right:12,top:25,bottom:45},xAxis:{type:'category',min:0,max:3,data:serialBauds.map(String),name:'bit/s'},yAxis:{type:'value',min:0,max:maxCycle,name:'整轮时间 (ms)'},series:[{name:'整轮预算',type:'bar',data:table.map(q=>q.cycleMs)},{name:'周期',type:'line',data:table.map(()=>period),showSymbol:false}]}),[table,period,maxCycle]);
 const chart=useECharts(option),roundChart=useECharts(comparison);
 return <section className="not-prose" aria-label="工业串行实验" style={{padding:14,margin:'20px 0',border:'1px solid #cbd5e1',borderRadius:10,minWidth:0,color:'#172033'}}>
 <strong>读取正确，还要来得及</strong><p>8E1、单主半双工、无错误重试；额外处理预留1 ms，两个静默分别计一次。高于19200时采用固定1.75 ms静默；这不是设备实测时延。</p>
 <label style={{display:'block'}}>波特率 <select aria-label="波特率" value={baud} onChange={e=>setBaud(+e.target.value)} style={{padding:6}}>{serialBauds.map(b=><option key={b} value={b}>{b}</option>)}</select></label>
 <label style={{display:'block'}}>寄存器数={registers}<input aria-label="寄存器数" type="range" min={1} max={16} step={1} value={registers} onChange={e=>setRegisters(+e.target.value)} style={{width:'100%'}}/></label>
 <label style={{display:'block'}}>从站数={stations}<input aria-label="从站数" type="range" min={1} max={4} step={1} value={stations} onChange={e=>setStations(+e.target.value)} style={{width:'100%'}}/></label>
 <label style={{display:'block'}}>轮询周期={period} ms<input aria-label="轮询周期" type="range" min={10} max={100} step={10} value={period} onChange={e=>setPeriod(+e.target.value)} style={{width:'100%'}}/></label>
 <label style={{display:'block',marginTop:10}}><input aria-label="翻转响应CRC一位" type="checkbox" checked={corrupt} onChange={e=>setCorrupt(e.target.checked)}/> 翻转响应CRC一位（仅模拟损坏）</label>
 <div ref={chart} style={{width:'100%',height:190}}/><div ref={roundChart} style={{width:'100%',height:250}}/>
 <p data-serial-metrics aria-live="polite">字符={v.charMs.toFixed(6)} ms；静默={v.gapMs.toFixed(6)} ms；请求={v.requestBytes} byte；响应={v.responseBytes} byte；事务={v.slotMs.toFixed(6)} ms；整轮={v.cycleMs.toFixed(6)} ms；余量={v.marginMs.toFixed(6)} ms；占周期比例={v.ratio.toFixed(6)}。</p>
 <p data-serial-status>{v.fits?'预算算术可容纳；仍需验证设备响应和调度上界。':'预算已超期；仅提高程序调用频率不能补回线路时间。'}</p>
 <p data-serial-request style={{overflowWrap:'anywhere'}}>请求：{serialHex(serialRequest(registers))}</p><p data-serial-response style={{overflowWrap:'anywhere'}}>响应：{serialHex(bytes)}</p>
 <p data-serial-decode aria-live="polite">{decoded.accepted?`接受；寄存器=${decoded.registers.join(' / ')}；温度=${decoded.temperature===null?'未读取第二寄存器':decoded.temperature+' °C'}`:`拒收（${decoded.reason}），不更新工程量。`}</p>
 <div role="region" aria-label="波特率预算对照" tabIndex={0} style={{overflowX:'auto',maxWidth:'100%'}}><table style={{minWidth:500,width:'100%',borderCollapse:'collapse',fontSize:13}}><thead><tr>{['bit/s','事务(ms)','整轮(ms)','余量(ms)','预算容纳'].map(t=><th key={t} style={{padding:6,textAlign:'left'}}>{t}</th>)}</tr></thead><tbody>{table.map(q=><tr key={q.baud}>{[q.baud,q.slotMs.toFixed(6),q.cycleMs.toFixed(6),q.marginMs.toFixed(6),q.fits?'是':'否'].map((x,i)=><td key={i} style={{padding:6,borderTop:'1px solid #dbe2ea'}}>{x}</td>)}</tr>)}</tbody></table></div>
 <button onClick={()=>{setBaud(19200);setRegisters(2);setStations(1);setPeriod(20);setCorrupt(false);}} style={{padding:8,border:'1px solid #cbd5e1',borderRadius:6,marginTop:12}}>恢复默认</button>
 </section>;
}
