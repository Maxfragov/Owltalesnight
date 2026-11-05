// node karusel.js 01-kak-spyat.json  ->  папка 01-kak-spyat/ со слайдами 01.png, 02.png ... (1080x1350)
// В json пути scene указываются относительно этой папки (brend/karuseli/).
const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
(async()=>{const f=path.resolve(process.argv[2]);const spec=JSON.parse(fs.readFileSync(f,'utf8'));
const out=f.replace(/\.json$/,'');fs.mkdirSync(out,{recursive:true});
const only=process.argv[3]?+process.argv[3]:0;
const b=await chromium.launch({args:['--allow-file-access-from-files']});
for(let i=0;i<spec.slides.length;i++){if(only&&only!==i+1)continue;
  const p=await b.newPage({viewport:{width:1080,height:1350}});
  p.on('pageerror',e=>console.log('ERR',i+1,e.message));
  await p.goto('file://'+__dirname+'/karusel.html');await p.evaluate(s=>draw(s),spec.slides[i]);
  await p.screenshot({path:path.join(out,String(i+1).padStart(2,'0')+'.png')});await p.close();console.log('slide',i+1);}
await b.close();})();
