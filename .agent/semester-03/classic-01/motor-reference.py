import mpmath as mp,numpy as np
mp.mp.dps=80
for L in ['.001','.01','.1']:
 ll=mp.mpf(L);A=mp.matrix([[-1/ll,-mp.mpf('.1')/ll],[10,-10]]);u=mp.matrix([1/ll,0]);ss=mp.lu_solve(-A,u)
 for t in ['0','.001','.1','.3166666666666667','1']:
  tt=mp.mpf(t);v=ss-mp.expm(A*tt)*ss
  af=np.array(A.tolist(),dtype=float);r1,r2=np.linalg.eigvals(af).astype(complex);g=10/11;tf=float(tt)
  w=g*(1+(r2*np.exp(r1*tf)-r1*np.exp(r2*tf))/(r1-r2));dw=g*r1*r2*(np.exp(r1*tf)-np.exp(r2*tf))/(r1-r2);cur=(.01*dw+.1*w)/.1
  error=max(abs(float(v[0])-cur.real),abs(float(v[1])-w.real));assert error<1e-12
  print('L/t/current/omega/reference error:',L,t,mp.nstr(v[0],16),mp.nstr(v[1],16),error)
print('PASS 15 80-digit matrix exponentials vs eliminated second-order pole formula')
