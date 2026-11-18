import {mkdtempSync,mkdirSync,copyFileSync,writeFileSync,readFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('../../',import.meta.url));
const push=process.argv.includes('--push');
if(process.argv.slice(2).some(a=>a!=='--push'))throw Error('Usage: node marketing/scripts/publish-pages.mjs [--push]');
const origin='https://github.com/HaMZAAsif043/CI-Efficiency-Auditor.git';
const source=join(root,'marketing/site');
const names=['index.html','style.css','app.js','sample-complete.json','sample-partial.json','social-preview.png','demo-landscape.webm','demo-portrait.webm','demo-poster.png','demo-captions.vtt','demo-narrated.mp4','demo-narrated.png','demo-narrated.vtt'];
function git(cwd,args,allowFailure=false){
 const r=spawnSync('git',['-c','safe.directory='+cwd.replaceAll('\\','/'),'-c','http.version=HTTP/1.1','-c','http.postBuffer=12582912','-c','http.lowSpeedLimit=1024','-c','http.lowSpeedTime=30',...args],{cwd,encoding:'utf8',timeout:120000});
 if(r.error)throw r.error;
 if(r.status!==0&&!allowFailure)throw Error(r.stderr.trim()||'Git command failed');
 return r;
}
const sourceCommit=git(root,['rev-parse','HEAD']).stdout.trim();
if(push&&git(root,['status','--porcelain','--','marketing/site','marketing/scripts/publish-pages.mjs']).stdout.trim())throw Error('Commit the website source and publishing script before deploying.');
mkdirSync(join(root,'.tmp'),{recursive:true});
const directory=mkdtempSync(join(root,'.tmp/pages-publish-'));
if(push){
 git(directory,['init','-b','gh-pages']);
 git(directory,['config','core.autocrlf','false']);
 git(directory,['remote','add','origin',origin]);
 const existing=git(directory,['ls-remote','--exit-code','--heads','origin','refs/heads/gh-pages'],true);
 if(existing.status===0){git(directory,['fetch','--depth=1','origin','gh-pages']);git(directory,['switch','-C','gh-pages','FETCH_HEAD']);}
 else if(existing.status!==2)throw Error('Could not inspect existing publishing branch; no push attempted.');
}
for(const name of names)copyFileSync(join(source,name),join(directory,name));
copyFileSync(join(root,'LICENSE'),join(directory,'LICENSE'));
writeFileSync(join(directory,'.nojekyll'),'');
const files=Object.fromEntries(names.map(name=>[name,createHash('sha256').update(readFileSync(join(directory,name))).digest('hex')]));
writeFileSync(join(directory,'deployment.json'),JSON.stringify({sourceCommit,files},null,2)+'\n');
let commit=null;
if(push){
 git(directory,['add','--',...names,'LICENSE','.nojekyll','deployment.json']);
 git(directory,['commit','-m','Deploy landing page from '+sourceCommit.slice(0,12)]);
 commit=git(directory,['rev-parse','HEAD']).stdout.trim();
 git(directory,['push','origin','HEAD:refs/heads/gh-pages']);
 const remote=git(directory,['ls-remote','origin','refs/heads/gh-pages']).stdout.trim().split(/\s+/)[0];
 if(remote!==commit)throw Error('Remote publishing commit did not match.');
}
console.log(JSON.stringify({pushed:push,sourceCommit,commit,branch:'gh-pages',directory,files},null,2));
