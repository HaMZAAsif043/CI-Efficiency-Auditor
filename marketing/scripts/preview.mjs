import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root=resolve(process.argv[2]||'marketing/site');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png','.webm':'video/webm','.mp4':'video/mp4','.srt':'text/plain','.vtt':'text/vtt'};
const server=createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const path=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!path.startsWith(root+sep)){res.writeHead(403).end();return;}const data=await readFile(path);res.writeHead(200,{'content-type':mime[extname(path)]||'application/octet-stream'});res.end(data);}catch{res.writeHead(404).end('Not found');}});
server.listen(4179,'127.0.0.1',()=>console.log('Local preview: http://127.0.0.1:4179'));
process.on('SIGTERM',()=>server.close());
