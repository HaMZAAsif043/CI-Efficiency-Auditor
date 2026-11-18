import {createRequire} from 'node:module';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)(process.argv[2]);
const browser=await chromium.launch({headless:true,executablePath:process.argv[3]});
const page=await browser.newPage({viewport:{width:1080,height:1350}});
await mkdir('marketing/voiced',{recursive:true});
await page.setContent(await readFile('marketing/linkedin/render.html','utf8'));
const c=JSON.parse(await readFile('marketing/site/sample-complete.json','utf8')),p=JSON.parse(await readFile('marketing/site/sample-partial.json','utf8'));
await page.evaluate(({c,p})=>{
 const scene=document.querySelector('[data-scene="0"]');
 scene.querySelector('.eyebrow').textContent='FOR DEVELOPERS INVESTIGATING CI';
 scene.querySelector('h1').innerHTML='Slow GitHub<br><em>Actions?</em>';
 scene.querySelector('.subtitle').innerHTML='Collect workflow evidence.<br>Investigate with local data.';
 scene.querySelector('.quote').innerHTML='Runs. Reruns.<br>Jobs. Step timings.';
 scene.querySelector('.tiny').textContent='CI Efficiency Auditor · an open-source metadata collector.';
 const format=s=>(s.coverage.complete?'Complete':'Partial')+' snapshot: '+s.runs.length+' runs, '+s.attempts.length+' attempts, '+s.jobs.length+' jobs, '+s.coverage.requestCount+' requests.';
 document.querySelector('#complete-output').textContent=format(c);
 document.querySelector('#partial-output').textContent=format(p)+String.fromCharCode(10)+'Incomplete coverage: '+p.coverage.reasons.join(', ')+'.';
 document.querySelector('[data-scene="3"] h2').innerHTML='Collection today.<br>Analysis next.';
 document.querySelector('.footer>span').innerHTML='Narrated replay of saved evidence.<br>No live API calls in this video.';
},{c,p});
for(let i=0;i<5;i++){
 await page.evaluate(n=>window.showScene(n),i);
 assert.ok(await page.evaluate(()=>{const s=document.querySelector('.scene.active').getBoundingClientRect(),f=document.querySelector('.footer').getBoundingClientRect();return s.bottom<f.top;}),'Scene overlaps footer');
 await page.screenshot({path:'marketing/voiced/scene-'+(i+1)+'.png'});
}
await page.evaluate(()=>window.showScene(0));await page.screenshot({path:'marketing/assets/linkedin-voiced-thumbnail.png'});
await browser.close();console.log('PASS: five clearer explanatory scenes rendered without footer overlap.');
