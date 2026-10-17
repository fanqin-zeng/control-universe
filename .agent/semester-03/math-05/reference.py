import json, numpy as np
cases=[]
for s in [0,.01,.05,.1,.2,1]:
    for delta in [-.02,0,.01]:
        for angle in [0,30,90]:
            t=np.deg2rad(angle)
            rotation=np.array([[np.cos(t),-np.sin(t)],[np.sin(t),np.cos(t)]])
            A=rotation@np.diag([1,s])
            U,values,Vt=np.linalg.svd(A)
            truth=np.ones(2); b=A@truth+rotation@np.array([0,delta])
            exact=np.linalg.pinv(A,rcond=1e-12)@b
            phi=np.linspace(0,2*np.pi,121)
            ellipse=(A@np.array([np.cos(phi),np.sin(phi)])).T
            for tau in [0,.05,.1,.2]:
                # Analytically known equality at the slider threshold must not
                # be turned into > by a few ulps of the SVD solver.
                rounded=np.where(np.abs(values-tau)<1e-12,tau,values)
                keep=rounded>tau
                reciprocal=np.zeros_like(values)
                reciprocal[keep]=1/values[keep]
                x=Vt.T@(reciprocal*(U.T@b))
                cases.append(dict(s=s,delta=delta,angle=angle,tau=tau,matrix=A.tolist(),singularValues=values.tolist(),rank=int(np.linalg.matrix_rank(A,tol=1e-12)),retained=int(keep.sum()),condition=float(values[0]/values[-1]) if s else None,trueOutput=(A@truth).tolist(),measured=b.tolist(),exact=exact.tolist(),truncated=x.tolist(),error=float(np.linalg.norm(x-truth)),residual=float(np.linalg.norm(b-A@x)),ellipse=ellipse.tolist()))
print(json.dumps(dict(cases=cases)))
