import json,sys
from fractions import Fraction as F
rows=json.load(open(sys.argv[1],encoding='utf-8'));err=0
for row in rows:
    p,g,a=map(lambda x:F(str(x)),row['params'])
    paths=[((1-a)*p,[6]),((1-a)*(1-p),[-4]),(a,[-1,6])]
    expected=sum(weight*sum(g**i*r for i,r in enumerate(rs)) for weight,rs in paths)
    success=sum(weight for weight,rs in paths if rs[-1]==6)
    steps=sum(weight*len(rs) for weight,rs in paths)
    values={'direct':p*6+(1-p)*-4,'charge':-1+g*6,'expected':expected,'success':success,'steps':steps,'threshold':(3+6*g)/10}
    for k,v in values.items():
        diff=abs(float(v)-row['result'][k]);err=max(err,diff)
        assert diff<1e-10,(row,k,v)
print(json.dumps({'pass':True,'configs':len(rows),'maxError':err,'reference':'Fraction path enumeration, no imported TS functions'}))
