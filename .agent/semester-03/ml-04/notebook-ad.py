import math
import json
class Value:
    def __init__(self,data,parents=(),pull=None):
        self.data=float(data);self.grad=0.;self.parents=parents;self.pull=pull or (lambda:None)
    def __add__(self,other):
        other=other if isinstance(other,Value) else Value(other)
        out=Value(self.data+other.data,(self,other))
        def pull():
            self.grad+=out.grad;other.grad+=out.grad
        out.pull=pull;return out
    __radd__=__add__
    def __mul__(self,other):
        other=other if isinstance(other,Value) else Value(other)
        out=Value(self.data*other.data,(self,other))
        def pull():
            self.grad+=other.data*out.grad;other.grad+=self.data*out.grad
        out.pull=pull;return out
    __rmul__=__mul__
    def tanh(self):
        out=Value(math.tanh(self.data),(self,))
        def pull():self.grad+=(1-out.data*out.data)*out.grad
        out.pull=pull;return out
    def backward(self):
        order=[];seen=set()
        def visit(node):
            if node in seen:return
            seen.add(node)
            for parent in node.parents:visit(parent)
            order.append(node)
        visit(self)
        for node in order:node.grad=0.
        self.grad=1.
        for node in reversed(order):node.pull()

def prediction(p,x):
    w,b,v,a=p;return v*math.tanh(w*x+b)+a
def mse(p,data):return sum((prediction(p,x)-y)**2 for x,y in data)/len(data)
def data_train(delta=.3):return [(x,math.tanh(2*x)+(delta if x==0 else 0)) for x in [-1.,-.5,0.,.5,1.]]
validation=[(x,math.tanh(2*x)) for x in [-.75,-.25,.25,.75]]
test=[(x,math.tanh(2*x)) for x in [-.9,-.4,.4,.9]]
def derivatives(p,data):
    w,b,v,a=[Value(v) for v in p];loss=Value(0)
    for x,y in data:
        r=v*(w*x+b).tanh()+a+(-y)
        loss=loss+r*r*(.5/len(data))
    loss.backward()
    return loss.data,[q.grad for q in [w,b,v,a]]
def fit(data,valid,eta=.2,budget=200,initial=(.5,0,.5,0)):
    p=list(initial);history=[];best_step=0;status='budget';rejected=None
    for k in range(budget+1):
        loss,grad=derivatives(p,data);norm=math.hypot(*grad);tr=2*loss;va=mse(p,valid)
        if not all(map(math.isfinite,[*p,tr,va,norm])) or max(tr,va,norm)>1e6:
            status='guard';rejected=dict(step=k,train=tr if math.isfinite(tr) else None,validation=va if math.isfinite(va) else None,norm=norm if math.isfinite(norm) else None);break
        row=dict(step=k,p=p.copy(),train=tr,validation=va,norm=norm);history.append(row)
        if va<history[best_step]['validation']:best_step=k
        if norm<=1e-8:status='gradient';break
        if k==budget:break
        p=[q-eta*g for q,g in zip(p,grad)]
    return dict(history=history,last=history[-1],best=history[best_step],updates=history[-1]['step'],status=status,rejected=rejected)
def summary(run):
    return dict(initial=run['history'][0],first=run['history'][min(1,len(run['history'])-1)],updates=run['updates'],status=run['status'],best=run['best'],last=run['last'],rejected=run['rejected'],test=mse(run['best']['p'],test),last_test=mse(run['last']['p'],test))
