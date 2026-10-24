const fs=require('node:fs'),assert=require('node:assert/strict');
const dir=__dirname+'/',expected=JSON.parse(fs.readFileSync('D:/Workspace/control-universe-rank2-ml-pages/.agent/semester-03/ml-09/expected-notebooks.json','utf8'));
const proof=JSON.parse(fs.readFileSync(dir+'public-courses.json','utf8'));assert.equal(proof.pass,true);
const row=proof.rows.find(r=>r.key==='machine-learning/learning-evaluation');assert(row);let numeric=0,maxError=0;
function check(actual,expected,path){
 if(typeof expected==='number'){assert.equal(typeof actual,'number',path);const error=Math.abs(actual-expected);maxError=Math.max(maxError,error);assert(error<=1e-12*Math.max(1,Math.abs(expected)),path+': '+actual+' != '+expected);numeric++;return}
 if(expected===null||typeof expected!=='object'){assert.equal(actual,expected,path);return}
 assert.deepEqual(Object.keys(actual),Object.keys(expected),path+' keys');for(const key of Object.keys(expected))check(actual[key],expected[key],path+'.'+key);
}
row.outputs.forEach((nb,i)=>nb.cells.forEach((text,j)=>check(JSON.parse(text),expected[i][j],i+'.'+j)));
const result={pass:true,lesson:row.key,notebooks:row.outputs.length,cells:row.outputs.reduce((n,b)=>n+b.cells.length,0),numeric,maxError,tolerance:1e-12};
fs.writeFileSync(dir+'public-ml09-numeric.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
