from model import *
import json
print('versions',np.__version__,scipy.__version__,ct.__version__)
print_metrics()
for fs in [500,5000]:print('discrete',discrete_metrics(fs))
for aw in [False,True]:
 t,w,u,xi=saturated(100,aw);print('saturation',aw,'peak_y',max(w),'last_y',w[-1],'peak_xi',max(abs(xi)),'max_u',max(abs(u)))
