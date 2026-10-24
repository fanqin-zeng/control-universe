import runpy,itertools,json,time
m=runpy.run_path('.agent/semester-03/intel-02/model.py'); sim=m['simulate']; report=m['report']
for key,vs in [('Ge',[1,2,3]),('Gce',[.2,.5,.8]),('Gu',[8,12,20])]:
 for v in vs: report(key+'='+str(v),sim(**{key:v}))
for Ki in [0,2,8]: report('Ki='+str(Ki),sim(Ki=Ki,disturbance=1))
for mode in ['PD','P','D']:report(mode,sim(mode=mode))
for method in ['COG','BIS','MOM']:report(method,sim(method=method))
fc=[(g,d,12.) for g,d in itertools.product([1.,2.,3.],[.25,.5,1.])]
pc=[(p,10.,d) for p,d in itertools.product([20.,40.,60.],[3.,6.,9.])]
score=lambda r:r['rms']+r['tail']+.02*r['tv']
ft=[(score(sim(Ge=g,Gce=d,Gu=u)),(g,d,u)) for g,d,u in fc]
pt=[(score(sim(pid=p)),p) for p in pc]
f=min(ft)[1];p=min(pt)[1]; print('selected',f,p)
for name,s in [('zero',dict(angle=0)),('small',dict(angle=10)),('large',dict(angle=35)),('gravity',dict(gravity=23.52)),('load',dict(disturbance=1)),('fall',dict(angle=170))]:
 report(name+' fuzzy',sim(Ge=f[0],Gce=f[1],Gu=f[2],**s));report(name+' PID',sim(pid=p,**s))
print('local',[(x,m['infer'](x,0)) for x in [.1,.0001,-.0001]])
