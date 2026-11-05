// node cover.js vypusk-01.json [--guides]  ->  рядом: <имя>.png (1080x1920) и <имя>-kvadrat.png (1080x1080, как в сетке профиля)
const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
(async()=>{const f=path.resolve(process.argv[2]);const cfg=JSON.parse(fs.readFileSync(f,'utf8'));
cfg.scene=path.relative(__dirname,path.resolve(path.dirname(f),cfg.scene));if(process.argv[3]==='--guides')cfg.guides=true;
const b=await chromium.launch({args:['--allow-file-access-from-files']});const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>console.log(m.text()));
await p.goto('file://'+__dirname+'/cover.html');await p.evaluate(c=>draw(c),cfg);
const out=f.replace(/\.json$/,'')+(cfg.guides?'-guides':'');
await p.screenshot({path:out+'.png'});await p.screenshot({path:out+'-kvadrat.png',clip:{x:0,y:420,width:1080,height:1080}});
await b.close();})();
