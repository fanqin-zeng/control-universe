from pathlib import Path
from html import escape
import re,json
out=Path('public/diagrams/transfer-function');out.mkdir(parents=True,exist_ok=True)
def text(x,y,s,size=19): return f'<text x="{x}" y="{y}" text-anchor="middle" font-size="{size}" fill="#0f172a">{escape(s)}</text>'
def box(x,y,w,h,s): return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>'+text(x+w/2,y+h/2+7,s)
def arrow(d):return f'<path d="{d}" fill="none" stroke="#334155" stroke-width="2.5" marker-end="url(#arrow)"/>'
def dot(x,y):return f'<circle cx="{x}" cy="{y}" r="4" fill="#334155"/>'
def save(name,title,desc,body,h=260):
 svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="800" height="{h}" viewBox="0 0 800 {h}" role="img" aria-labelledby="title desc"><title id="title">{escape(title)}</title><desc id="desc">{escape(desc)}</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#334155"/></marker></defs><rect width="800" height="{h}" rx="12" fill="#fff"/><g font-family="system-ui, Microsoft YaHei, sans-serif">{text(400,32,title,21)}{body}</g></svg>'''
 (out/f'{name}.svg').write_text(svg,encoding='utf-8')
save('series','串联：前一级输出进入后一级','U(s)依次经过G₁(s)、G₂(s)，得到Y(s)。',text(55,119,'U(s)')+arrow('M 100 112 H 190')+box(190,82,150,60,'G₁(s)')+arrow('M 340 112 H 440')+box(440,82,150,60,'G₂(s)')+arrow('M 590 112 H 700')+text(746,119,'Y(s)'),180)
save('parallel','并联：同一输入，两路输出相加','U(s)分成两路进入G₁和G₂，两路输出进入加法比较点，得到Y(s)。',text(52,144,'U(s)')+arrow('M 96 137 H 165')+dot(165,137)+arrow('M 165 137 V 82 H 265')+arrow('M 165 137 V 202 H 265')+box(265,52,150,60,'G₁(s)')+box(265,172,150,60,'G₂(s)')+arrow('M 415 82 H 590 V 113')+arrow('M 415 202 H 590 V 161')+'<circle cx="590" cy="137" r="23" stroke="#334155" stroke-width="2" fill="white"/>'+text(590,145,'+')+text(568,109,'+',16)+text(568,179,'+',16)+arrow('M 613 137 H 702')+text(747,144,'Y(s)'),270)
save('feedback','负反馈：比较目标与测量值','R(s)正向进入比较点，反馈H(s)Y(s)从负端进入；误差E(s)经过G(s)产生Y(s)。',text(48,112,'R(s)')+arrow('M 90 105 H 176')+'<circle cx="200" cy="105" r="23" stroke="#334155" stroke-width="2" fill="white"/>'+text(200,113,'Σ')+text(168,89,'+',18)+text(222,151,'−',22)+arrow('M 223 105 H 340')+text(281,87,'E(s)')+box(340,75,160,60,'G(s)')+arrow('M 500 105 H 700')+text(746,112,'Y(s)')+dot(620,105)+arrow('M 620 105 V 220 H 500')+box(340,190,160,60,'H(s)')+arrow('M 340 220 H 200 V 129')+text(275,203,'H(s)Y(s)',16),290)
save('pole-zero','零极点位置示意','共轭复极点位于实轴上下对称位置；实极点在实轴上；空心圆表示零点。图仅示意位置，不对应下方交互模型的参数。',arrow('M 100 175 H 720')+arrow('M 520 285 V 55')+text(748,182,'Re(s)')+text(520,49,'Im(s)',16)+text(537,196,'0',15)+text(220,183,'×',29)+text(370,110,'×',29)+text(370,255,'×',29)+'<circle cx="290" cy="175" r="8" fill="white" stroke="#2563eb" stroke-width="2.5"/>'+text(205,219,'实极点',17)+text(275,151,'零点',17)+text(260,80,'共轭复极点（上下对称）',17)+text(400,320,'定性示意；不对应下方交互模型的具体参数',16),345)
p=Path('content/classic/transfer-function.mdx');s=p.read_text(encoding='utf-8')
start=s.index('```',s.index('就是**零极点图'));end=s.index('```',start+3)+3
s=s[:start]+'![零极点定性示意：共轭极点在实轴两侧上下对称，实极点位于实轴，空心圆表示零点](/diagrams/transfer-function/pole-zero.svg)'+s[end:]
old='$$\nU(s) \\longrightarrow \\boxed{G_1(s)} \\longrightarrow \\boxed{G_2(s)} \\longrightarrow Y(s)\n$$'
assert old in s;s=s.replace(old,'![串联框图：输入依次经过两个传递环节，再得到输出](/diagrams/transfer-function/series.svg)')
pos=s.index('**并联**：两个环节接收同一输入，输出相加')+len('**并联**：两个环节接收同一输入，输出相加');s=s[:pos]+'\n\n![并联框图：输入分成两路，两路环节的输出相加](/diagrams/transfer-function/parallel.svg)'+s[pos:]
start=s.index('```',s.index('**反馈**：'));end=s.index('```',start+3)+3
s=s[:start]+'![负反馈框图：目标从正端进入比较点，输出经测量环节返回负端，误差驱动前向环节](/diagrams/transfer-function/feedback.svg)'+s[end:];p.write_text(s,encoding='utf-8')
# Candidate scan excludes Notebook template strings and actual fenced programming code.
rows=[]
for p in Path('content').rglob('*.mdx'):
 s=p.read_text(encoding='utf-8')
 for m in re.finditer(r'(?m)^```([^\n]*)\n(.*?)^```',s,re.S):
  if m.group(1).strip() in ('python','javascript','js','ts','typescript','c','cpp','bash','shell'):continue
  if re.search(r'[─┌└│]|-->|\[.*\].*[→←]|\|.*\n.*\|.*[×●]',m.group(2)):
   rows.append({'path':p.as_posix(),'line':s[:m.start()].count('\n')+1,'kind':'字符图候选，待逐项核图','source':m.group(0)})
 for m in re.finditer(r'(?m)^\$\$\n(.*?)^\$\$',s,re.S):
  if re.search(r'\\(?:longrightarrow|xrightarrow)',m.group(1)) and re.search(r'\\text\{|\\boxed\{',m.group(1)):
   rows.append({'path':p.as_posix(),'line':s[:m.start()].count('\n')+1,'kind':'公式流程图候选，须与普通推导区分','source':m.group(0)})
Path('.agent/semester-03/intro-proofreading/diagram-candidates.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
print('remaining candidates',len(rows),'lessons',len(set(r['path'] for r in rows)))
