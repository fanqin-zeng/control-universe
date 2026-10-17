import {createServer} from 'node:http';
import {createReadStream,existsSync,statSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
const root=resolve('out'),base='/control-universe';
const mime={'.wasm':'application/wasm','.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json','.txt':'text/plain; charset=utf-8','.woff2':'font/woff2','.woff':'font/woff','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon'};
createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname===base){res.writeHead(301,{Location:base+'/'+url.search});res.end();return;}
 if(!url.pathname.startsWith(base+'/')){res.writeHead(404);res.end();return;}
 let file;try{file=resolve(root,'.'+decodeURIComponent(url.pathname.slice(base.length)));}catch{res.writeHead(400);res.end();return;}
 if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403);res.end();return;}
 if(existsSync(file)&&statSync(file).isDirectory()){if(!url.pathname.endsWith('/')){res.writeHead(301,{Location:url.pathname+'/'+url.search});res.end();return;}file=resolve(file,'index.html');}
 if(!existsSync(file)){res.writeHead(404,{'Content-Type':'text/html'});createReadStream(resolve(root,'404.html')).pipe(res);return;}
 res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream'});createReadStream(file).pipe(res);
}).listen(8081,'127.0.0.1',()=>console.log('Pages preview: http://localhost:8081/control-universe/'));
