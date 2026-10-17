import sympy as s
import numpy as np
t=s.symbols('t',real=True)
x=s.cos(2*s.pi*t)+s.cos(6*s.pi*t)/2
print('real coefficients:',[s.integrate(2*x*s.cos(2*s.pi*k*t),(t,0,1)) for k in [1,3]])
ms=s.integrate(x*x,(t,0,1))
print('mean square/RMS:',ms,float(s.sqrt(ms)))
print('square at quarter:',4/s.pi,52/(15*s.pi),float(52/(15*s.pi)))
n=np.arange(64);X=np.fft.fft(np.cos(2*np.pi*n/64)+.5*np.cos(6*np.pi*n/64))
print('DFT positive bins:',np.abs(X[[1,3]]))
Y=np.fft.rfft(np.cos(2*np.pi*3.5*n/64));print('3.5Hz bins 3/4:',2*np.abs(Y[[3,4]])/64)
print('alias max difference:',np.max(np.abs(np.cos(2*np.pi*3*n/64)-np.cos(2*np.pi*61*n/64))))
print('response 1rad/s:',1/s.sqrt(2),-s.pi/4,float(1/s.sqrt(1+4*s.pi*s.pi)))
