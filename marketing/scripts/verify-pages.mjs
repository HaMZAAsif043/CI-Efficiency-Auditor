import {createRequire} from 'node:module';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const [url,modulePath,executablePath]=process.argv.slice(2);
const base=new URL(url);assert.equal(base.protocol,'https:');assert.ok(base.pathname.endsWith('/CI-Efficiency-Auditor/'));
const expected=JSON.parse(await readFile('evidence/M2/deployment.json','utf8'));
const {chromium}=createRequire(import.meta.url)(modulePath);
const browser=await chromium.launch({headless:true,executablePath});
try {
 const context=await browser.newContext({viewport:{width:1440,height:1000},permissions:['clipboard-read','clipboard-write'],reducedMotion:'reduce'});
 const page=await context.newPage();const errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
 const response=await page.goto(base.href,{waitUntil:'domcontentloaded',timeout:60000});assert.equal(response.status(),200);
 await page.waitForFunction(()=>window.demoReady);
 const manifestResponse=await page.request.get(new URL('deployment.json',base).href);assert.equal(manifestResponse.status(),200);
 const manifest=await manifestResponse.json();assert.deepEqual(manifest,expected);
 const files=[];
 for(const [name,hash] of Object.entries(expected.files)){
  const asset=await page.request.get(new URL(name,base).href);assert.equal(asset.status(),200,'Asset: '+name);
  const actual=createHash('sha256').update(await asset.body()).digest('hex');assert.equal(actual,hash,'Asset hash: '+name);
  files.push({name,status:asset.status(),sha256:actual,contentType:asset.headers()['content-type']});
 }
 assert.equal(await page.locator('#steps').textContent(),'6');await page.locator('#replay').click();
 await page.waitForFunction(()=>document.querySelector('#playback-status').textContent.startsWith('SAVED REPLAY COMPLETE'));
 assert.match(await page.locator('#terminal-output').textContent(),/Complete snapshot: 1 runs, 1 attempts, 1 jobs, 4 requests/);
 await page.locator('[data-sample="partial"]').click();assert.match(await page.locator('#coverage').textContent(),/EXIT 3/);
 await page.locator('#replay').click();await page.waitForFunction(()=>document.querySelector('#playback-status').textContent.startsWith('SAVED REPLAY COMPLETE'));
 assert.match(await page.locator('#terminal-output').textContent(),/Incomplete coverage: run_limit/);
 const pending=page.waitForEvent('download');await page.locator('#download').click();const downloaded=await pending;assert.match(downloaded.suggestedFilename(),/ci-audit-partial/);
 await page.locator('#copy').click();await page.waitForFunction(()=>document.querySelector('#copy-status').textContent.length>0);assert.match(await page.locator('#copy-status').textContent(),/copied/);
 await page.locator('video').evaluate(v=>{v.muted=true;return v.play();});await page.waitForFunction(()=>document.querySelector('video').currentTime>.3);
 const media=await page.locator('video').evaluate(v=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight,audioTracks:v.captureStream().getAudioTracks().length}));assert.equal(media.audioTracks,1);assert.ok(media.duration>32&&media.duration<35);
 await page.locator('video').evaluate(v=>v.pause());await page.locator('[data-sample="complete"]').click();await page.evaluate(()=>scrollTo(0,0));
 await page.screenshot({path:'evidence/M2/live-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'evidence/M2/live-mobile.png',fullPage:true});
 assert.deepEqual(errors,[]);assert.ok(!requests.some(u=>u.startsWith('https://api.github.com/')));
 const record={checkedAt:new Date().toISOString(),url:base.href,sourceCommit:expected.sourceCommit,files,media,checks:['HTTP 200','13 asset hashes match committed artifact','complete and partial replay','copy/download','narrated video and audio track','mobile no horizontal overflow','no page errors','no GitHub API requests from demo']};
 await writeFile('evidence/M2/live-checks.json',JSON.stringify(record,null,2)+'\n');console.log(JSON.stringify({url:base.href,assets:files.length,checks:'passed',media}));
} finally {await browser.close();}
