// Общее ядро серии «А знаешь что...»: небо, луна, СОВЁНОК (стиль не менять!), субтитры, рендер.
// Выпуск подключает core.js, затем свой scenes.js, где определены const SC={...} и рисунки героев.
const W=1080,H=1920;
const cv=document.getElementById('c'),ctx=cv.getContext('2d');
function mk(){const c=document.createElement('canvas');c.width=W;c.height=H;return c;}
const LA=mk(),LB=mk();
// ---------- config (overridden from outside) ----------
window.CFG={
  scenes:[ // [name,start,end]
    ['sky',0,11],['autumn',10.5,19],['den',18.5,40],['frost',39.5,45],['goodnight',44.5,59]
  ],
  cues:[],
  duration:60
};
// ---------- utils ----------
let seed=7;function rnd(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646;}
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const ease=x=>{x=clamp(x,0,1);return x*x*(3-2*x);};
const lerp=(a,b,k)=>a+(b-a)*k;
function ell(c,x,y,rx,ry,rot=0){c.beginPath();c.ellipse(x,y,rx,ry,rot,0,Math.PI*2);}

function talk(t){const A=CFG.amp;if(!A)return 0;const f=t*30,i=Math.floor(f);if(i<0||i>=A.length-1)return 0;return A[i]+(A[i+1]-A[i])*(f-i);}
// ---------- precomputed ----------
const STARS=[];for(let i=0;i<260;i++)STARS.push({x:rnd()*W,y:rnd()*H*0.75,r:0.6+rnd()*rnd()*3.2,p:rnd()*6.28,s:0.6+rnd()*1.8});
const SPARK=[];for(let i=0;i<170;i++)SPARK.push({x:rnd()*W*1.4-W*0.2,y:rnd()*H,l:6+rnd()*26,p:rnd()*6.28,s:0.5+rnd()*1.5});
const DUST=[];for(let i=0;i<60;i++)DUST.push({x:rnd()*W,y:rnd()*H,r:1+rnd()*3,p:rnd()*6.28,v:4+rnd()*10});
const grain=document.createElement('canvas');grain.width=grain.height=256;
{const g=grain.getContext('2d'),d=g.createImageData(256,256);for(let i=0;i<d.data.length;i+=4){const v=rnd()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255;}g.putImageData(d,0,0);}

// ---------- sky ----------
function sky(c,t,cam=0){
  const g=c.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#070b24');g.addColorStop(0.45,'#141c4a');g.addColorStop(0.8,'#2b2f6b');g.addColorStop(1,'#4a3f7d');
  c.fillStyle=g;c.fillRect(0,0,W,H);
  for(const s of STARS){const a=0.45+0.55*Math.sin(t*s.s+s.p);c.globalAlpha=clamp(a,0.08,1);
    c.fillStyle='#fff6dc';ell(c,s.x,s.y+cam*0.3,s.r,s.r);c.fill();
    if(s.r>2.6){c.globalAlpha*=0.35;c.fillRect(s.x-s.r*4,s.y+cam*0.3-0.6,s.r*8,1.2);c.fillRect(s.x-0.6,s.y+cam*0.3-s.r*4,1.2,s.r*8);}}
  c.globalAlpha=1;
}
const moonC=document.createElement('canvas');moonC.width=moonC.height=700;
{const m=moonC.getContext('2d');const g=m.createRadialGradient(330,330,40,350,350,240);g.addColorStop(0,'#fff8dc');g.addColorStop(1,'#f3dc98');
 m.fillStyle=g;ell(m,350,350,240,240);m.fill();
 m.fillStyle='rgba(220,190,120,0.35)';[[300,450,30],[420,500,22],[250,380,16],[460,420,14]].forEach(([x,y,r])=>{ell(m,x,y,r,r);m.fill();});
 m.globalCompositeOperation='destination-out';ell(m,350,205,250,215);m.fill();}
function moon(c,x,y,t){
  const gl=c.createRadialGradient(x,y,60,x,y,520);gl.addColorStop(0,'rgba(255,236,170,0.22)');gl.addColorStop(1,'rgba(255,236,170,0)');
  c.fillStyle=gl;c.fillRect(x-520,y-520,1040,1040);
  c.save();c.translate(x,y);c.rotate(Math.sin(t*0.5)*0.04);c.drawImage(moonC,-350,-350);c.restore();
}
// ---------- owl ----------
function owl(c,x,y,s,t,lid,cap,o={}){
  const tk=o.talk||0,sl=o.sleepy||0;
  const hop=Math.abs(Math.sin(t*2.2))*10*(1-sl)+tk*6;
  c.save();c.translate(x,y-hop);c.scale(s,s*(1+0.03*Math.sin(t*4.4)*(1-sl)));c.rotate(Math.sin(t*0.9)*0.06+Math.sin(t*1.7)*0.05*tk);
  // wings
  const fl=(0.35+0.65*Math.max(0,Math.sin(t*5)))*Math.max(tk*1.6,0.15*(1-sl))+Math.max(0,Math.sin(t*0.7))**8*0.9*(1-sl);
  c.fillStyle='#5e4436';
  c.save();c.translate(-62,-20);c.rotate(0.25+fl*0.9);ell(c,-18,35,32,72);c.fill();c.restore();
  c.save();c.translate(62,-20);c.rotate(-0.25-fl*0.9*(0.6+0.4*Math.sin(t*1.3)));ell(c,18,35,32,72);c.fill();c.restore();
  // body
  const bg=c.createRadialGradient(-20,-30,10,0,0,120);bg.addColorStop(0,'#9a765c');bg.addColorStop(1,'#715440');
  c.fillStyle=bg;ell(c,0,0,88,104);c.fill();
  c.save();c.translate(0,-30);c.rotate(Math.sin(t*0.8)*0.12*(1-sl)+Math.sin(t*2.3)*0.06*tk);c.translate(0,30);
  const tw=Math.sin(t*6)*0.08*(Math.sin(t*0.5)>0.7?1:0);
  // tufts
  c.beginPath();c.moveTo(-70,-60);c.quadraticCurveTo(-78,-118,-46,-104);c.lineTo(-30,-85);c.fill();
  c.beginPath();c.moveTo(70,-60);c.quadraticCurveTo(78+tw*60,-118,46,-104);c.lineTo(30,-85);c.fill();
  // belly
  c.fillStyle='#ecd9bb';ell(c,0,34,56,62);c.fill();
  c.strokeStyle='rgba(140,105,80,0.55)';c.lineWidth=4;c.lineCap='round';
  for(const [vx,vy] of [[-22,18],[0,30],[22,18],[-12,48],[12,48],[0,66]]){c.beginPath();c.moveTo(vx-8,vy);c.lineTo(vx,vy+7);c.lineTo(vx+8,vy);c.stroke();}
  // face disks
  c.fillStyle='#f3e4c9';ell(c,-33,-36,38,36);c.fill();ell(c,33,-36,38,36);c.fill();
  // eyes
  for(const ex of [-33,33]){
    if(lid>0.85){c.strokeStyle='#3a2a22';c.lineWidth=5;c.beginPath();c.arc(ex,-40,15,0.15*Math.PI,0.85*Math.PI);c.stroke();continue;}
    c.save();ell(c,ex,-36,24,24);c.clip();
    c.fillStyle='#fffaf0';c.fillRect(ex-30,-66,60,60);
    const lx=Math.sin(t*0.45)*6+Math.sin(t*1.9)*2,ly=Math.cos(t*0.6)*3;
    c.fillStyle='#e9a640';ell(c,ex+2+lx,-34+ly,15,15);c.fill();
    c.fillStyle='#24180f';ell(c,ex+2+lx,-34+ly,9+tk*1.5,9+tk*1.5);c.fill();
    c.fillStyle='#fff';ell(c,ex+6+lx,-39+ly,4,4);c.fill();
    c.fillStyle='#d8c3a2';c.fillRect(ex-30,-62,60,lid*50);
    c.restore();
  }
  // beak
  const mo=Math.min(1,tk*1.4)*12;
  if(mo>0.5){c.fillStyle='#7a2f2a';ell(c,0,-12+mo*0.4,8,mo*0.7+2);c.fill();}
  c.fillStyle='#d58a2c';c.beginPath();c.moveTo(-7,-14+mo*0.3);c.lineTo(7,-14+mo*0.3);c.lineTo(0,-4+mo);c.closePath();c.fill();
  c.fillStyle='#e7a23c';c.beginPath();c.moveTo(-9,-18);c.lineTo(9,-18);c.lineTo(0,-6);c.closePath();c.fill();
  // blush
  c.fillStyle='rgba(240,140,140,0.28)';ell(c,-58,-12,13,8);c.fill();ell(c,58,-12,13,8);c.fill();
  c.restore();
  // feet
  c.fillStyle='#e7a23c';for(const fx of [-28,28]){for(const d of [-9,0,9]){ell(c,fx+d,100,6,9);c.fill();}}
  if(cap){ // sleepy night cap
    c.fillStyle='#3d5a9e';c.beginPath();c.moveTo(-62,-82);c.quadraticCurveTo(0,-150,62,-82);c.quadraticCurveTo(70,-150,130,-120);c.quadraticCurveTo(60,-160,0,-160);c.quadraticCurveTo(-60,-150,-62,-82);c.fill();
    c.fillStyle='#f5f0e6';c.beginPath();c.ellipse(0,-84,66,14,0,0,Math.PI*2);c.fill();
    ell(c,132,-118,16,16);c.fill();
    c.fillStyle='rgba(255,255,255,0.5)';for(const [px,py] of [[-25,-115],[15,-135],[60,-125],[95,-130]]){ell(c,px,py,5,5);c.fill();}
  }
  c.restore();
}
function blink(t,base=0){const p=t%4.3;let l=base;if(p<0.22)l=Math.max(l,Math.sin(p/0.22*Math.PI));return l;}
function shooting(c,t){const per=7,p=(t%per)/1.1;if(p>1)return;const k=Math.floor(t/per);const x0=200+(k*373%600),y0=150+(k*211%400);
  const x=x0+p*420,y=y0+p*180;const g=c.createLinearGradient(x-160,y-70,x,y);g.addColorStop(0,'rgba(255,250,220,0)');g.addColorStop(1,`rgba(255,250,220,${0.9*(1-p)})`);
  c.strokeStyle=g;c.lineWidth=4;c.lineCap='round';c.beginPath();c.moveTo(x-160,y-70);c.lineTo(x,y);c.stroke();}
function fireflies(c,t){for(const d of DUST){const x=d.x+Math.sin(t*0.4+d.p)*60,y=(d.y-t*d.v*2+H*4)%H;const a=0.5+0.5*Math.sin(t*2.5+d.p*3);
  const g=c.createRadialGradient(x,y,0,x,y,d.r*5);g.addColorStop(0,`rgba(255,235,170,${0.55*a})`);g.addColorStop(1,'rgba(255,235,170,0)');c.fillStyle=g;c.fillRect(x-d.r*5,y-d.r*5,d.r*10,d.r*10);}}
function miniOwl(c,t,a){if(a<=0)return;c.save();c.globalAlpha=a;const x=880,y=300+Math.sin(t*1.2)*14;
  const gl=c.createRadialGradient(x,y,20,x,y,200);gl.addColorStop(0,'rgba(255,236,170,0.28)');gl.addColorStop(1,'rgba(255,236,170,0)');c.fillStyle=gl;c.fillRect(x-200,y-200,400,400);
  c.save();c.translate(x,y+10);c.scale(0.42,0.42);c.drawImage(moonC,-350,-350);c.restore();
  owl(c,x,y-5,0.62,t,blink(t+1.3,0),false,{talk:talk(t)});c.restore();}
function glowHeart(c,x,y,a,t){ // soft glow where paws meet
  const g=c.createRadialGradient(x,y,0,x,y,90);g.addColorStop(0,`rgba(255,226,150,${0.55*a})`);g.addColorStop(1,'rgba(255,226,150,0)');
  c.fillStyle=g;c.fillRect(x-90,y-90,180,180);
}
function skyG(c,top,mid,bot){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,top);g.addColorStop(0.55,mid);g.addColorStop(1,bot);c.fillStyle=g;c.fillRect(0,0,W,H);}
function starsOnly(c,t,a){for(const s of STARS){const al=clamp(0.45+0.55*Math.sin(t*s.s+s.p),0.08,1)*a;c.globalAlpha=al;c.fillStyle='#fff6dc';ell(c,s.x,s.y,s.r,s.r);c.fill();}c.globalAlpha=1;}
function vign(c){const g=c.createRadialGradient(W/2,H/2,H*0.3,W/2,H/2,H*0.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,12,0.55)');c.fillStyle=g;c.fillRect(0,0,W,H);}
// ---------- text ----------
function wrap(c,text,maxW){const words=text.split(' ');const lines=[];let cur='';for(const w of words){const tt=cur?cur+' '+w:w;if(c.measureText(tt).width>maxW&&cur){lines.push(cur);cur=w;}else cur=tt;}if(cur)lines.push(cur);
  for(let i=0;i<lines.length-1;i++){const ws=lines[i].split(' ');const last=ws[ws.length-1];if(ws.length>1&&last.length<=1){lines[i]=ws.slice(0,-1).join(' ');lines[i+1]=last+' '+lines[i+1];}}
  return lines;}
function subtitles(c,t){
  for(const [a,b,txt] of CFG.cues){if(t<a-0.3||t>b+0.3)continue;
    const al=Math.min(ease((t-a+0.3)/0.4),ease((b+0.3-t)/0.4));
    const isTitle=txt.startsWith('А знаешь что');
    c.save();c.globalAlpha=al;c.textAlign='center';c.textBaseline='middle';
    if(isTitle){c.font='700 92px C';c.shadowColor='rgba(255,210,120,0.9)';c.shadowBlur=40;c.fillStyle='#ffe9b0';c.fillText(txt,W/2,1260);c.shadowBlur=18;c.fillText(txt,W/2,1260);}
    else{const bg=c.createLinearGradient(0,1230,0,1600);bg.addColorStop(0,'rgba(5,10,30,0)');bg.addColorStop(0.5,'rgba(5,10,30,0.45)');bg.addColorStop(1,'rgba(5,10,30,0)');c.fillStyle=bg;c.fillRect(0,1230,W,370);
      c.font='700 58px C';const lines=wrap(c,txt,880);const lh=78;const y0=1400-(lines.length-1)*lh/2;
      c.shadowColor='rgba(0,0,20,0.85)';c.shadowBlur=22;c.fillStyle='#fff7e6';
      lines.forEach((l,i)=>{c.fillText(l,W/2,y0+i*lh);});}
    c.restore();}
}
function endCard(c,t){const k=ease((t-(CFG.duration-3.2))/1.2);if(k<=0)return;
  c.save();c.globalAlpha=k;c.textAlign='center';c.font='700 64px C';c.fillStyle='#ffe9b0';c.shadowColor='rgba(255,210,120,0.8)';c.shadowBlur=30;
  c.fillText('А знаешь что...',W/2,260);c.font='700 34px C';c.shadowBlur=10;c.fillStyle='#cfd6ff';c.fillText(window.END_SUB||'истории перед сном',W/2,320);c.restore();}
// ---------- main ----------
function render(t){
  const active=CFG.scenes.filter(([n,a,b])=>t>=a&&t<b);
  ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  active.forEach(([n,a,b],i)=>{
    const L=i%2?LB:LA,lc=L.getContext('2d');lc.save();SC[n](lc,t,t-a);lc.restore();
    let al=1;if(i>0){al=ease((t-a)/(Math.min(b,active[0][2])-a));}
    ctx.globalAlpha=al;ctx.drawImage(L,0,0);ctx.globalAlpha=1;
  });
  // narrator owl in corner during otter scenes
  {const sc=CFG.scenes;const a0=sc[1][1],b0=sc[sc.length-1][1];miniOwl(ctx,t,Math.min(ease((t-a0-0.5)/0.8),ease((b0+0.3-t)/0.6)));}
  subtitles(ctx,t);endCard(ctx,t);
  // fade in/out
  const fi=CFG.fadeIn!=null?CFG.fadeIn:0.8;const f=Math.min(fi>0?ease(t/fi):1,ease((CFG.duration-t)/1.0));if(f<1){ctx.fillStyle=`rgba(0,0,0,${1-f})`;ctx.fillRect(0,0,W,H);}
  ctx.save();ctx.globalAlpha=0.045;ctx.globalCompositeOperation='overlay';
  const ox=Math.floor(Math.random()*256),oy=Math.floor(Math.random()*256);
  ctx.fillStyle=ctx.createPattern(grain,'repeat');ctx.translate(-ox,-oy);ctx.fillRect(0,0,W+256,H+256);ctx.restore();
}
window.render=render;
window.ready=document.fonts.load('700 50px C','Ая').then(()=>true);