import {chromium} from 'playwright';
const D='C:/Users/pvenegas/AppData/Local/Temp/claude/c--Users-pvenegas-Documents-GitHub-lacalita-web/bc703168-3b4d-4260-85d0-34f9190e462d/scratchpad/';
const b = await chromium.launch({channel:'chrome'});
const p = await b.newPage({viewport:{width:1280,height:900}});
await p.goto('http://localhost:3002/es', {waitUntil:'networkidle'});
await p.addStyleTag({content:'[class*="cookie"],[data-cookie]{display:none!important}'});
// Recorrer la página para disparar los Reveal antes de la captura completa.
for (let y=0;y<20;y++){ await p.mouse.wheel(0,900); await p.waitForTimeout(180); }
await p.waitForTimeout(1200);
await p.screenshot({path:D+'full.png', fullPage:true});
const s = await p.$$eval('main section', els => els.map(e => [e.className.slice(0,40), getComputedStyle(e).backgroundColor]));
console.log(s);
await b.close();
