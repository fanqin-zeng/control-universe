import {readFileSync,writeFileSync} from 'node:fs';
const dir=new URL('./',import.meta.url), root=new URL('../../../',dir);
const setup=readFileSync(new URL('model.py',dir),'utf8');
const cells=[
 [String.raw`for n in [5,7]:
    R=rules(n,'coverage')
    print('n=',n,'average rules=',R.tolist(),'symmetry error=',np.max(abs(R+R[::-1,::-1]-(n-1))))
print('sum rules n=5=',rules().tolist())
print('average[3,2]=',rules(design='coverage')[3,2], 'sum[3,2]=',rules()[3,2])
print('half-even round(2.5)=',round(2.5),'half-up=',math.floor(2.5+.5))
print('n7 half-up example=',math.floor(.5+.5)+math.floor(5.5+.5))
for old in [True,False]:
    print('old=',old,'coverage sum at .25=',sum(mf(.25,i,5,old) for i in range(5)))
print('Ge20=',.8/(20*DEG),'Ge30=',1/(30*DEG),'J=',1*.5**2,'gravity=',9.8/.5,'torque coefficient=',1/(1*.5**2))
print('proportional threshold=',19.6/4)
print('Phi(.1,0)=',infer(.1,0),'secant=',infer(.1,0)/.1,'axis h=.0001=',infer(.0001,0)/.0001)
print('physical axis difference quotient=',12*2*infer(.0001,0)/.0001)
assert sum(mf(.25,i,5,True) for i in range(5))==0`,
 String.raw`grid=np.linspace(-1,1,41)
fig,axes=plt.subplots(1,2,figsize=(9,4))
for ax,design in zip(axes,['legacy','repaired']):
    U=np.array([[infer(e,de,design=design) for de in grid] for e in grid])
    ax.imshow(U,origin='lower',extent=(-1,1,-1,1),vmin=-1,vmax=1,cmap='RdBu_r',aspect='auto')
    ax.set(xlabel='normalized de',ylabel='normalized e',title=design)
    print(design,'surface min/max=',U.min(),U.max(),'oddness=',np.max(abs(U+U[::-1,::-1])))
plt.tight_layout(); plt.show()`],
 [String.raw`for Ge in [1.,2.,3.]: report('Ge='+str(Ge),simulate(Ge=Ge))`,
 String.raw`for Gce in [.2,.5,.8]: report('Gce='+str(Gce),simulate(Gce=Gce))`,
 String.raw`for Gu in [8.,12.,20.]: report('Gu='+str(Gu),simulate(Gu=Gu))`,
 String.raw`plot_runs([(f'Ge={g}',simulate(Ge=g)) for g in [1.,2.,3.]])`],
 [String.raw`items=[]
for design in ['legacy','coverage','repaired']:
    r=simulate(design=design); report(design,r); items.append((design,r))
plot_runs(items)`,
 String.raw`for dt in [.004,.002,.001]: report('sample period='+str(dt),simulate(dt=dt))
print('These runs change the held-input sampling period; they are not a continuous-time certificate.')`],
 [String.raw`items=[]
for Ki in [0.,2.,8.]:
    r=simulate(Ki=Ki,disturbance=1.);report('load=1 Ki='+str(Ki),r);items.append((f'Ki={Ki}',r))
plot_runs(items)
report('saturation stress, Ki=8',simulate(Ki=8,Gu=30,angle=60,disturbance=1))
print('Conditional integration blocks only accumulation further into saturation; no claim of global stability.')`],
 [String.raw`import itertools
score=lambda r:r['rms']+r['tail']+.02*r['tv']
fuzzy_candidates=[(g,c,12.) for g,c in itertools.product([1.,2.,3.],[.25,.5,1.])]
pid_candidates=[(p,10.,d) for p,d in itertools.product([20.,40.,60.],[3.,6.,9.])]
fuzzy_scores=[]; pid_scores=[]
for g,c,u in fuzzy_candidates:
    r=simulate(Ge=g,Gce=c,Gu=u);fuzzy_scores.append((score(r),(g,c,u)));print('TRAIN fuzzy',g,c,u,'score=',score(r))
for p in pid_candidates:
    r=simulate(pid=p);pid_scores.append((score(r),p));print('TRAIN PID',p,'score=',score(r))
frozen_fuzzy=min(fuzzy_scores)[1]; frozen_pid=min(pid_scores)[1]
print('FROZEN fuzzy=',frozen_fuzzy,'PID=',frozen_pid)`,
 String.raw`tests=[('zero',dict(angle=0.)),('small',dict(angle=10.)),('large',dict(angle=35.)),
       ('gravity',dict(gravity=23.52)),('load',dict(disturbance=1.))]
for name,s in tests:
    a=simulate(Ge=frozen_fuzzy[0],Gce=frozen_fuzzy[1],Gu=frozen_fuzzy[2],**s)
    b=simulate(pid=frozen_pid,**s)
    report('TEST '+name+' fuzzy',a);report('TEST '+name+' PID',b)
    if name=='load': plot_runs([('fuzzy PD',a),('PID',b)])
print('Finite candidate sets, fixed window, ideal measurements; no universal method ranking.')`],
 [String.raw`items=[]
for mode in ['PD','P','D']:
    r=simulate(mode=mode);report(mode,r);items.append((mode,r))
plot_runs(items)`,
 String.raw`items=[]
for method in ['COG','BIS','MOM']:
    r=simulate(method=method);report(method,r);items.append((method,r))
    print('static asymmetric input (.37,-.12)',method,infer(.37,-.12,method=method))
plot_runs(items)`,
 String.raw`A1=np.array([[-1.,10.],[0.,-1.]])
A2=np.array([[-1.,0.],[10.,-1.]])
for label,A in [('A1',A1),('A2',A2),('average',(A1+A2)/2)]:print(label,'eigenvalues=',np.linalg.eigvals(A))
print('PD poles=',np.roots([1,24,140.4]))
print('TS identical consequents at e=-.2 de=.1 =',40*(-.2)+6*.1)
print('Positive gain on e=-theta gives restoring torque; local stable rules alone do not certify a blend.')`]
];
const titles=['规则库、覆盖与输入输出曲面','比例因子敏感性扫描','模糊PD闭环与采样复核','模糊PD加积分与限幅','有限候选整定及锁定测试','规则结构、解模糊与稳定性反例'];
const literal=x=>'`'+x.replaceAll('\\','\\\\').replaceAll('`','\\`').replaceAll('${','\\${')+'`';
let out=readFileSync(new URL('lesson-template.mdx',dir),'utf8');
for(let i=0;i<cells.length;i++)out=out.replace(`<<NB${i+1}>>`,`<JupyterNotebook\n  title="Notebook ${i+1}：${titles[i]}"\n  setupCode={${literal(setup)}}\n  cells={[\n${cells[i].map(code=>'    { code: '+literal(code)+' }').join(',\n')}\n  ]}\n/>`);
writeFileSync(new URL('content/intelligent/fuzzy-controller-design.mdx',root),out);
console.log('6 notebooks',cells.flat().length,'cells; setup embedded in full, no local imports');
