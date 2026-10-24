// Local acceptance adapter: serve exported HTML at clean URLs without a redirect.
// The official Pages preview remains on 9208 and keeps its /control-universe base.
import {createServer} from 'node:http';
import {createReadStream,existsSync,statSync} from 'node:fs';
import {resolve,sep,extname} from 'node:path';
const root=resolve(process.argv[2]||'out'),port=Number(process.argv[3]||8198);
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json','.wasm':'application/wasm','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2'};
createServer((req,res)=>{
 let path=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/control-universe(?=\/)/,'');
 let file=resolve(root,'.'+path);
 if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403);res.end();return;}
 if(existsSync(file)&&statSync(file).isDirectory())file=resolve(file,'index.html');
 if(!existsSync(file)){res.writeHead(404);res.end();return;}
 res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream'});createReadStream(file).pipe(res);
}).listen(port,'127.0.0.1',()=>console.log('RL-02 export acceptance adapter on '+port));
