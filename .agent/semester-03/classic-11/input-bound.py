from model import *
for n,C in controllers.items():
 r,p=expansion(ct.feedback(C,G));print(n,'alltime absU upper',sum(abs(r)))
