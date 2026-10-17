import sympy as s, numpy as np, json
x,y=s.symbols('x y',real=True); h=10-x*x-2*y*y
grad=s.Matrix([s.diff(h,x),s.diff(h,y)]); H=s.hessian(h,(x,y))
hf=s.lambdify((x,y),h,'numpy'); gf=s.lambdify((x,y),grad,'numpy')
cases=[]
for a in [-1.5,0,1,1.5]:
    for b in [-1.5,0,1,1.5]:
        for angle in [0,45,90,180,270,360]:
            d=np.array([np.cos(np.deg2rad(angle)),np.sin(np.deg2rad(angle))])
            g=np.array(gf(a,b),float).reshape(2); base=float(hf(a,b)); slope=float(g@d)
            t=np.linspace(-.5,.5,41)
            profile=np.column_stack((t,hf(a+t*d[0],b+t*d[1]),base+t*slope))
            for step in [0,.1,.5]:
                p=np.array([a,b])+step*d; actual=float(hf(*p)); predicted=base+float(g@(p-np.array([a,b])))
                cases.append(dict(x=a,y=b,angle=angle,step=step,base=base,gradient=g.tolist(),direction=d.tolist(),slope=slope,next=p.tolist(),predicted=predicted,actual=actual,remainder=actual-predicted,gradientNorm=float(np.linalg.norm(g)),gradientTip=(np.array([a,b])+.15*g).tolist(),profile=profile.tolist()))
values,vectors=np.linalg.eigh(np.array(-H/2,dtype=float))
phi=np.linspace(0,2*np.pi,121); circle=np.array([np.cos(phi),np.sin(phi)])
contours=[dict(level=level,points=(vectors@np.diag(np.sqrt((10-level)/values))@circle).T.tolist()) for level in [6,8,9]]
print(json.dumps(dict(cases=cases,contours=contours)))
