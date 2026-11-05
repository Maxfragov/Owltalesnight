const {chromium}=require('playwright');const {spawn}=require('child_process');
const [out,fps,cfgPath]=[process.argv[2],+(process.argv[3]||30),process.argv[4]];
(async()=>{const b=await chromium.launch({args:['--allow-file-access-from-files']});const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+(process.argv[5]?require('path').resolve(process.argv[5]):__dirname+'/scene.html'));await p.evaluate(()=>window.ready);
if(cfgPath){const cfg=require(require('path').resolve(cfgPath));await p.evaluate(c=>Object.assign(CFG,c),cfg);}
const dur=await p.evaluate(()=>CFG.duration);const N=Math.round(dur*fps);
const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',String(fps),'-i','-','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p',out],{stdio:['pipe','inherit','inherit']});
const t0=Date.now();
for(let i=0;i<N;i++){const d=await p.evaluate(t=>{render(t);return document.getElementById('c').toDataURL('image/jpeg',0.93).slice(23);},i/fps);
 if(!ff.stdin.write(Buffer.from(d,'base64')))await new Promise(r=>ff.stdin.once('drain',r));
 if(i%300==0)console.log(i,N,((Date.now()-t0)/1000).toFixed(0)+'s');}
ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log('done',((Date.now()-t0)/1000).toFixed(0)+'s');})();
