// Страшная арка s02: Майкл Майерс («Хэллоуин», 1978). Подключается после obshchee/core.js.
// Узнаём по символам жанра: белая безликая маска (своя форма: без волос, бровей, рта), тёмный комбинезон,
// силуэт в дверном проёме, фонарь через улицу, тыквы. Ножа и копии маски нет.
// Палитра: холодные сине-зелёные, почти чёрный (не полный), тусклый жёлтый свет фонаря/лампы.
const DEFK={glow:1.4,price:1.2,face:6,smooth:7.68,door:0.4,tilt:2.67,hide:0.2,stand:1.4,blink:0.95,hush:0.8,back:0.8,shop:1,paint:5.92,eyes:8.6,credits:0.8,shape:4.3,nick:6,other:7.87,look:0.8,flick:2.87,dim:0.8,sleep:1.2,end:3.4};
const DEFKA={hide:16.94,stand:18.14,blink:22.71,hush:27.06,back:31.64};
const K=n=>CFG.k&&CFG.k[n]!=null?CFG.k[n]:DEFK[n];
const KA=n=>CFG.ka&&CFG.ka[n]!=null?CFG.ka[n]:DEFKA[n];
// мини-совёнок прячется на жути (строки 5–7) и возвращается на строке 8
const _miniOwl=miniOwl;
miniOwl=function(c,t,a){const h=ease((t-KA('hide'))/1.0)*(1-ease((t-KA('back'))/1.4));_miniOwl(c,t,a*(1-0.88*h));};
// ---------- helpers ----------
let sd2=31;function r2(){sd2=(sd2*16807)%2147483647;return (sd2-1)/2147483646;}
const FOG=[];for(let i=0;i<34;i++)FOG.push({x:r2()*1.4-0.2,y:r2(),r:160+r2()*260,v:6+r2()*14,p:r2()*6.28});
function fog(c,t,y0,y1,a){c.save();c.globalCompositeOperation='screen';
  for(const f of FOG){const x=((f.x*W+t*f.v)%(W*1.4)+W*1.4)%(W*1.4)-W*0.2,y=lerp(y0,y1,f.y)+Math.sin(t*0.2+f.p)*20;
    const g=c.createRadialGradient(x,y,0,x,y,f.r);const al=a*(0.55+0.45*Math.sin(t*0.15+f.p));
    g.addColorStop(0,`rgba(120,150,155,${al})`);g.addColorStop(1,'rgba(120,150,155,0)');c.fillStyle=g;c.fillRect(x-f.r,y-f.r,f.r*2,f.r*2);}
  c.restore();}
function vignD(c,k=0.8){const g=c.createRadialGradient(W/2,H*0.42,H*0.18,W/2,H*0.45,H*0.72);g.addColorStop(0,'rgba(2,6,8,0)');g.addColorStop(1,`rgba(2,6,8,${k})`);c.fillStyle=g;c.fillRect(0,0,W,H);}
function grad(c,a,b,d){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,a);g.addColorStop(0.55,b);g.addColorStop(1,d);c.fillStyle=g;c.fillRect(0,0,W,H);}
function glow(c,x,y,r,col,a){if(a<=0)return;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
// тыква со светящимся вырезом (общий символ Хэллоуина), мерцание мягкое
function pumpkin(c,x,y,r,t,lit=1){c.save();c.translate(x,y);
  const fl=lit*(0.82+0.1*Math.sin(t*2.7)+0.06*Math.sin(t*6.1+1));
  glow(c,0,-r*0.2,r*3.2,'255,170,70',0.16*fl);
  for(const [dx,rx] of [[-r*0.55,r*0.55],[r*0.55,r*0.55],[0,r*0.62]]){const g=c.createRadialGradient(dx-r*0.2,-r*0.9,r*0.1,dx,-r*0.6,r*1.1);g.addColorStop(0,'#7a4318');g.addColorStop(1,'#3a1d0c');c.fillStyle=g;ell(c,dx,-r*0.68,rx,r*0.7);c.fill();}
  c.strokeStyle='#2a3a20';c.lineWidth=r*0.14;c.lineCap='round';c.beginPath();c.moveTo(0,-r*1.32);c.quadraticCurveTo(r*0.05,-r*1.6,r*0.22,-r*1.68);c.stroke();
  c.fillStyle=`rgba(255,${Math.round(150+50*fl)},70,${0.25+0.7*fl})`;
  const tri=(ax,ay,bx,by,cx_,cy_)=>{c.beginPath();c.moveTo(ax,ay);c.lineTo(bx,by);c.lineTo(cx_,cy_);c.closePath();c.fill();};
  tri(-r*0.5,-r*0.72,-r*0.18,-r*0.72,-r*0.34,-r*0.98);tri(r*0.5,-r*0.72,r*0.18,-r*0.72,r*0.34,-r*0.98);
  c.beginPath();c.moveTo(-r*0.55,-r*0.48);c.quadraticCurveTo(0,-r*0.1,r*0.55,-r*0.48);c.lineTo(r*0.3,-r*0.4);c.lineTo(r*0.18,-r*0.5);c.lineTo(0,-r*0.36);c.lineTo(-r*0.18,-r*0.5);c.lineTo(-r*0.3,-r*0.4);c.closePath();c.fill();
  c.restore();}
// уличный фонарь: on 0..1
function lamp(c,x,y,h,t,on=1,s=1){c.save();
  const hx=x-34*s,hy=y-h;
  c.fillStyle='rgba(255,214,130,'+(0.09*on)+')';c.beginPath();c.moveTo(hx-14*s,hy+10*s);c.lineTo(hx+14*s,hy+10*s);c.lineTo(hx+150*s,y);c.lineTo(hx-150*s,y);c.closePath();c.fill();
  c.save();c.translate(hx,y);c.scale(1,0.18);glow(c,0,0,190*s,'255,214,130',0.28*on);c.restore();
  c.strokeStyle='#05090b';c.lineWidth=9*s;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.lineTo(x,hy-18*s);c.quadraticCurveTo(x,hy-34*s,hx,hy-24*s);c.stroke();
  c.fillStyle='#05090b';c.beginPath();c.moveTo(hx-22*s,hy);c.lineTo(hx+22*s,hy);c.lineTo(hx+10*s,hy-24*s);c.lineTo(hx-10*s,hy-24*s);c.closePath();c.fill();
  glow(c,hx,hy+4*s,120*s,'255,214,130',0.5*on);glow(c,hx,hy+4*s,22*s,'255,236,190',0.9*on);
  c.restore();}
// дома напротив: силуэты крыш, одно тусклое окно
function houses(c,y,t,col='#060c10',win=0.6){c.fillStyle=col;c.beginPath();c.moveTo(0,H);c.lineTo(0,y+40);
  const R=[[0,40],[90,-60],[200,30],[260,30],[360,-90],[470,20],[560,20],[640,-40],[720,30],[800,30],[900,-70],[1000,30],[1080,10]];
  for(const [x,dy] of R)c.lineTo(x,y+dy);c.lineTo(W,H);c.fill();
  c.fillStyle=`rgba(255,200,110,${0.22*win*(0.9+0.1*Math.sin(t*0.7))})`;c.fillRect(372,y-10,26,34);
  c.fillStyle=`rgba(150,190,200,${0.08*win})`;c.fillRect(900,y+0,24,30);}
// маска: своя форма — гладкий овал, две прорези, без волос, бровей и рта
function maskFace(c,x,y,s,o={}){const col=o.col||[214,220,214],ho=o.holes==null?1:o.holes,a=o.a==null?1:o.a;
  c.save();c.translate(x,y);c.scale(s,s);c.globalAlpha*=a;
  const path=()=>{c.beginPath();c.moveTo(0,-170);c.bezierCurveTo(78,-170,122,-112,122,-30);c.bezierCurveTo(122,60,80,150,0,168);c.bezierCurveTo(-80,150,-122,60,-122,-30);c.bezierCurveTo(-122,-112,-78,-170,0,-170);c.closePath();};
  path();const g=c.createRadialGradient(-30,-70,20,0,-10,200);g.addColorStop(0,`rgb(${col.map(v=>Math.min(255,v+22)).join(',')})`);g.addColorStop(0.6,`rgb(${col.join(',')})`);g.addColorStop(1,`rgb(${col.map(v=>Math.round(v*0.55)).join(',')})`);c.fillStyle=g;c.fill();
  c.save();path();c.clip();
  // холодная тень снизу и сбоку, едва заметный нос
  const sh=c.createLinearGradient(-120,0,140,40);sh.addColorStop(0,'rgba(20,40,50,0)');sh.addColorStop(1,'rgba(20,40,50,0.42)');c.fillStyle=sh;c.fillRect(-130,-180,260,360);
  c.fillStyle='rgba(30,50,60,0.12)';ell(c,10,28,12,40);c.fill();
  c.fillStyle='rgba(255,255,255,0.08)';ell(c,-6,18,6,34);c.fill();
  c.restore();
  // прорези для глаз
  for(const ex of [-46,46]){const gg=c.createRadialGradient(ex,-28,2,ex,-28,30*ho);gg.addColorStop(0,'#020506');gg.addColorStop(0.7,'#061014');gg.addColorStop(1,'rgba(6,16,20,0)');
    c.fillStyle=gg;c.beginPath();c.ellipse(ex,-28,30*ho,13*ho,ex<0?0.08:-0.08,0,Math.PI*2);c.fill();
    c.fillStyle='#020506';c.beginPath();c.ellipse(ex,-28,21*ho,8*ho,ex<0?0.08:-0.08,0,Math.PI*2);c.fill();}
  c.restore();}
// фигура: тёмный комбинезон, белое лицо-маска без черт. y — ступни, рост ~820*s
function figure(c,x,y,s,o={}){const fa=o.face==null?1:o.face,tilt=o.tilt||0,a=o.a==null?1:o.a;
  c.save();c.translate(x,y);c.scale(s,s);c.globalAlpha*=a;
  c.fillStyle=o.col||'#0a1216';c.beginPath();
  c.moveTo(-58,0);c.lineTo(-70,-380);c.lineTo(-92,-400);c.quadraticCurveTo(-120,-560,-112,-690);c.quadraticCurveTo(-90,-722,-36,-728);c.lineTo(36,-728);c.quadraticCurveTo(90,-722,112,-690);c.quadraticCurveTo(120,-560,92,-400);c.lineTo(70,-380);c.lineTo(58,0);c.lineTo(10,0);c.lineTo(0,-330);c.lineTo(-10,0);c.closePath();c.fill();
  // руки висят вдоль тела
  c.beginPath();c.moveTo(-112,-690);c.quadraticCurveTo(-140,-560,-126,-360);c.lineTo(-100,-360);c.quadraticCurveTo(-104,-540,-92,-640);c.fill();
  c.beginPath();c.moveTo(112,-690);c.quadraticCurveTo(140,-560,126,-360);c.lineTo(100,-360);c.quadraticCurveTo(104,-540,92,-640);c.fill();
  if(o.rim){c.strokeStyle=`rgba(140,175,180,${0.22*o.rim})`;c.lineWidth=4;c.beginPath();c.moveTo(-112,-690);c.quadraticCurveTo(-140,-560,-126,-360);c.stroke();c.beginPath();c.moveTo(-90,-722);c.quadraticCurveTo(-112,-700,-112,-690);c.stroke();}
  c.fillRect(-26,-760,52,40);
  c.translate(0,-748);c.rotate(tilt);
  c.fillStyle=o.col||'#0a1216';ell(c,0,-62,66,84);c.fill();
  if(fa>0)maskFace(c,0,-58,0.5,{a:fa,col:o.mcol||[196,204,200],holes:1.05});
  c.restore();}
// окно в комнате: z — камера, fig — фигура у фонаря, lids — «моргание», lampOn, pend — маятник идёт
function room(c,t,o){const z=o.z||1;
  c.save();c.translate(540,690);c.scale(z,z);c.translate(-540,-690);
  {const g=c.createLinearGradient(0,-200,0,H);g.addColorStop(0,'#091317');g.addColorStop(0.55,'#0b171b');g.addColorStop(1,'#070e11');c.fillStyle=g;c.fillRect(-300,-300,W+600,H+600);}
  // за окном
  c.save();c.beginPath();c.rect(250,300,580,760);c.clip();
  grad(c,'#0a161d','#10232a','#0c1a1f');starsOnly(c,t,0.18);
  houses(c,700,t,'#071014',0.7);
  c.fillStyle='#0b1519';c.fillRect(250,930,580,140);c.fillStyle='rgba(120,150,155,0.06)';c.fillRect(250,930,580,6);
  lamp(c,668,960,360,t,o.lamp==null?1:o.lamp,0.95);
  if(o.fig>0)figure(c,630,958,0.088,{face:1,a:o.fig,col:'#05090b',mcol:[226,230,224]});
  fog(c,t,820,1060,0.13);
  // отражение в стекле
  const rf=c.createLinearGradient(250,300,830,1060);rf.addColorStop(0,'rgba(160,190,200,0.06)');rf.addColorStop(0.45,'rgba(160,190,200,0)');rf.addColorStop(0.55,'rgba(160,190,200,0.04)');rf.addColorStop(1,'rgba(160,190,200,0)');c.fillStyle=rf;c.fillRect(250,300,580,760);
  c.restore();
  // рама
  c.strokeStyle='#121b1e';c.lineWidth=26;c.strokeRect(250,300,580,760);c.lineWidth=14;c.beginPath();c.moveTo(540,300);c.lineTo(540,1060);c.moveTo(250,640);c.lineTo(830,640);c.stroke();
  c.fillStyle='#141d20';c.fillRect(220,1060,640,30);c.fillStyle='rgba(255,214,130,0.05)';c.fillRect(220,1060,640,4);
  // шторы
  for(const [x0,sd] of [[170,-1],[910,1]]){const sw=Math.sin(t*0.35+(sd>0?1:0))*8;c.fillStyle='#0b1418';c.beginPath();c.moveTo(x0-110,240);c.lineTo(x0+110,240);c.quadraticCurveTo(x0+70*-sd+sw,700,x0+40*-sd+sw*1.5,1180);c.lineTo(x0-120*-sd,1180);c.closePath();c.fill();
    c.strokeStyle='rgba(120,150,155,0.07)';c.lineWidth=3;for(let i=0;i<3;i++){c.beginPath();c.moveTo(x0-60+i*40,250);c.quadraticCurveTo(x0-60+i*40+sw,700,x0-60+i*40+sw*1.4,1170);c.stroke();}}
  // тыква на подоконнике
  pumpkin(c,350,1062,46,t,o.pump==null?0.55:o.pump);
  // часы на стене слева
  {const cx=20,cy=560;c.fillStyle='#0f181b';c.fillRect(cx-58,cy-70,116,470);c.fillStyle='#1b2427';ell(c,cx,cy,52,52);c.fill();c.fillStyle='#8f9a94';ell(c,cx,cy,42,42);c.fill();
    c.strokeStyle='#1a2225';c.lineWidth=5;c.lineCap='round';c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+4,cy-30);c.moveTo(cx,cy);c.lineTo(cx+24,cy+10);c.stroke();
    const ang=o.pend===false?0.11:0.2*Math.sin(Math.PI*(t-0.4));c.save();c.translate(cx,cy+80);c.rotate(ang);c.strokeStyle='#6f6a52';c.lineWidth=4;c.beginPath();c.moveTo(0,0);c.lineTo(0,240);c.stroke();c.fillStyle='#7d7656';ell(c,0,252,20,20);c.fill();c.restore();}
  c.restore();
  vignD(c,0.85);
  const L=o.lids||0;if(L>0){c.fillStyle='rgb(3,7,9)';const hh=H*0.52*L;c.beginPath();c.moveTo(0,0);c.lineTo(W,0);c.lineTo(W,hh);c.quadraticCurveTo(W/2,hh+90*L,0,hh);c.fill();
    c.beginPath();c.moveTo(0,H);c.lineTo(W,H);c.lineTo(W,H-hh);c.quadraticCurveTo(W/2,H-hh-90*L,0,H-hh);c.fill();}
}
function winState(t){const b=KA('blink');
  const z=lerp(1.3+0.1*ease((t-KA('hide'))/9),0.88,ease((t-KA('hush'))/4));
  const fig=ease((t-KA('stand')+1.0)/1.8)*(t<b+0.4?1:0);
  const lids=Math.min(ease((t-b)/0.4),1-ease((t-b-0.75)/0.7))*0.93;
  return {z,fig,lids};}
const SC={
  sky(c,t,lt){
    sky(c,t,0);c.fillStyle='rgba(2,14,18,0.55)';c.fillRect(0,0,W,H);
    const z=1+lt*0.006;c.save();c.translate(W/2,H/2);c.scale(z,z);c.translate(-W/2,-H/2);
    const ent=ease(lt/1.6);moon(c,540,700,t);owl(c,540,760+(1-ent)*500,1.15*(0.6+0.4*ent),t,blink(t,0),false,{talk:talk(t)});c.restore();
    houses(c,1060,t,'#050a0d',ease((lt-K('glow'))/1.5));
    lamp(c,900,1190,300,t,0.9,0.9);
    for(const [x,r] of [[250,30],[318,22]])pumpkin(c,x,1150,r,t,ease((lt-K('glow'))/1.5));
    fog(c,t,1000,1250,0.16);vignD(c,0.7);
  },
  mask(c,t,lt){
    const fz=ease((lt-K('face'))/4.5),z=1+0.55*fz;
    c.save();c.translate(520,640);c.scale(z,z);c.translate(-520,-640);
    grad(c,'#0b1418','#0a1215','#070c0e');
    // перфорированная стена магазина
    c.fillStyle='rgba(0,0,0,0.35)';for(let y=150;y<1250;y+=46)for(let x=40;x<1060;x+=46){ell(c,x,y,4,4);c.fill();}
    // свет сверху
    c.fillStyle='rgba(255,214,130,0.05)';c.beginPath();c.moveTo(440,0);c.lineTo(600,0);c.lineTo(820,1250);c.lineTo(220,1250);c.closePath();c.fill();
    glow(c,520,600,420,'255,214,130',0.07);
    // крючок, пакет, маска
    c.strokeStyle='#2a3235';c.lineWidth=7;c.lineCap='round';c.beginPath();c.moveTo(520,300);c.lineTo(520,350);c.quadraticCurveTo(520,372,500,366);c.stroke();
    const sw=Math.sin(t*0.6)*0.012;c.save();c.translate(520,350);c.rotate(sw);c.translate(-520,-350);
    maskFace(c,520,650,1,{col:[200,206,200]});
    const bag=1-ease((lt-K('face'))/2);
    if(bag>0){c.save();c.globalAlpha=bag;c.strokeStyle='rgba(190,215,220,0.22)';c.lineWidth=3;c.fillStyle='rgba(150,180,190,0.06)';
      c.beginPath();c.roundRect(370,370,300,520,26);c.fill();c.stroke();
      c.fillStyle='rgba(220,240,245,0.10)';c.beginPath();c.moveTo(395,400);c.lineTo(430,400);c.lineTo(410,860);c.lineTo(392,860);c.closePath();c.fill();
      c.fillStyle='#1d2629';c.fillRect(480,372,80,26);c.restore();}
    c.restore();
    // ценник
    const pa=ease((lt-K('price'))/1.2)*(1-ease((lt-K('face')-0.6)/1.5));
    if(pa>0){c.save();c.globalAlpha=pa;c.translate(560,380);c.rotate(0.18+Math.sin(t*0.9)*0.06);
      c.strokeStyle='rgba(180,170,140,0.6)';c.lineWidth=2;c.beginPath();c.moveTo(0,0);c.lineTo(110,40);c.stroke();
      c.translate(110,40);c.rotate(0.12);c.fillStyle='#b9ae8c';c.beginPath();c.moveTo(0,-8);c.lineTo(30,-34);c.lineTo(170,-34);c.lineTo(170,34);c.lineTo(30,34);c.closePath();c.fill();
      c.fillStyle='#1a1a14';ell(c,22,0,6,6);c.fill();c.font='700 40px C';c.textBaseline='middle';c.fillStyle='#3a2a1a';c.fillText('1,98 $',46,2);c.restore();}
    c.restore();
    fog(c,t,800,1300,0.08+0.08*fz);
    c.fillStyle=`rgba(2,6,8,${0.25*fz})`;c.fillRect(0,0,W,H);
    // маска остаётся единственным светлым пятном
    if(fz>0){c.save();c.translate(520,640);c.scale(z,z);c.translate(-520,-640);c.globalAlpha=0.25*fz;maskFace(c,520,650,1,{col:[200,206,200]});c.restore();}
    vignD(c,0.8+0.1*fz);
  },
  door(c,t,lt){
    const z=1+lt*0.008;c.save();c.translate(540,760);c.scale(z,z);c.translate(-540,-760);
    grad(c,'#0a1316','#0b1619','#070d10');
    // пол
    c.fillStyle='#080f12';c.fillRect(0,1150,W,H-1150);c.strokeStyle='rgba(120,150,155,0.06)';c.lineWidth=3;
    for(let i=-6;i<=6;i++){c.beginPath();c.moveTo(540+i*60,1150);c.lineTo(540+i*260,H);c.stroke();}
    // свет слева
    glow(c,120,700,700,'255,214,130',0.06);
    // дверной проём
    c.fillStyle='#121b1e';c.fillRect(330,300,420,860);
    const dg=c.createLinearGradient(0,330,0,1150);dg.addColorStop(0,'#03070a');dg.addColorStop(1,'#060c0f');c.fillStyle=dg;c.fillRect(360,330,360,820);
    c.fillStyle='rgba(255,214,130,0.07)';c.fillRect(330,300,30,860);
    const ap=ease((lt-K('door'))/3),tl=ease((lt-K('tilt'))/3)*0.13;
    c.save();c.beginPath();c.rect(360,330,360,820);c.clip();
    figure(c,540,1150,0.9,{face:ap*0.95,a:0.35+0.65*ap,tilt:tl,rim:ap,col:'#0c1519'});
    fog(c,t,900,1150,0.05);c.restore();
    pumpkin(c,215,1200,62,t,0.85);
    c.restore();
    fog(c,t,1050,1350,0.1);vignD(c,0.85);
  },
  window(c,t,lt){room(c,t,winState(t));},
  gone(c,t,lt){room(c,t,winState(t));},
  house(c,t,lt){room(c,t,winState(t));},
  work(c,t,lt){
    const z=1.02+lt*0.004;c.save();c.translate(540,700);c.scale(z,z);c.translate(-540,-700);
    grad(c,'#0b1417','#0c1619','#080e10');
    // настольная лампа слева сверху
    c.strokeStyle='#05090b';c.lineWidth=12;c.lineCap='round';c.beginPath();c.moveTo(120,1000);c.lineTo(170,560);c.lineTo(330,380);c.stroke();
    c.fillStyle='#05090b';c.beginPath();c.moveTo(290,330);c.lineTo(400,400);c.lineTo(360,460);c.lineTo(250,390);c.closePath();c.fill();
    c.fillStyle='rgba(255,214,130,0.07)';c.beginPath();c.moveTo(330,430);c.lineTo(370,450);c.lineTo(900,1000);c.lineTo(180,1000);c.closePath();c.fill();
    glow(c,520,820,520,'255,214,130',0.12);glow(c,350,440,60,'255,236,190',0.7);
    // стол
    c.fillStyle='#120d0a';c.fillRect(0,1000,W,260);c.fillStyle='rgba(255,214,130,0.08)';c.fillRect(0,1000,W,5);
    c.save();c.translate(540,1000);c.scale(1,0.15);glow(c,0,0,420,'255,214,130',0.18);c.restore();
    // подставка-голова
    c.fillStyle='#0d1112';c.fillRect(505,880,70,125);c.fillRect(440,990,200,16);ell(c,540,700,132,182);c.fill();
    // маска: бежевая -> белая
    const p=ease((lt-K('paint'))/2.6),eh=lerp(0.62,1.12,ease((lt-K('eyes'))/1.6));
    maskFace(c,540,700,0.98,{col:[178,146,118],holes:eh});
    if(p>0){c.save();c.beginPath();c.rect(380,500,320,lerp(0,420,p));c.clip();maskFace(c,540,700,0.98,{col:[212,218,212],holes:eh});c.restore();
      if(p<1){const fy=500+lerp(0,420,p);c.save();c.globalCompositeOperation='screen';for(let i=0;i<26;i++){const q=(i*0.37+t*0.8)%1,x=410+((i*97)%260),y=fy-20+Math.sin(i+t*3)*14-q*40;c.fillStyle=`rgba(230,236,232,${0.25*(1-q)})`;ell(c,x,y,3+i%3,3+i%3);c.fill();}c.restore();}}
    // баллончик краски
    c.fillStyle='#1a2124';c.beginPath();c.roundRect(760,830,70,172,10);c.fill();c.fillStyle='#d6dad4';c.fillRect(768,880,54,36);c.fillStyle='#262e31';c.fillRect(775,808,40,26);
    // ценник на столе
    c.save();c.translate(240,975);c.rotate(-0.12);c.fillStyle='#8f876c';c.fillRect(0,-18,120,36);c.font='700 26px C';c.textBaseline='middle';c.fillStyle='#2a2216';c.fillText('1,98 $',14,1);c.restore();
    c.restore();
    fog(c,t,1000,1300,0.07);vignD(c,0.8);
  },
  titles(c,t,lt){
    grad(c,'#07090b','#080b0d','#060809');
    const fl=1+0.025*Math.sin(t*19)+0.015*Math.sin(t*7.3);
    // кадр плёнки
    c.fillStyle=`rgba(40,48,50,${0.18*fl})`;c.fillRect(60,200,960,1000);
    const st=K('shape'),T=st+0.8,u=lt-T;
    const off=u<0?50*lt:50*T+50*(1-Math.exp(-u));
    c.save();c.beginPath();c.rect(60,200,960,1000);c.clip();
    let s3=5;const r=()=>{s3=(s3*16807)%2147483647;return (s3-1)/2147483646;};
    for(let i=0;i<26;i++){const y=688+i*78-off;const w1=120+r()*180,w2=110+r()*170;if(i===4)continue;
      const fa=clamp(Math.min((y-430)/110,(1170-y)/110),0,1)*(1-0.6*ease((lt-K('other'))/2));
      c.fillStyle=`rgba(150,156,150,${0.32*fa*fl})`;c.beginPath();c.roundRect(470-w1,y-11,w1,22,11);c.fill();c.beginPath();c.roundRect(610,y-11,w2,22,11);c.fill();}
    // строка «Фигура … Ник Касл»
    const ry=688+4*78-off;
    const fa=ease((lt-st)/1.6)*(1-0.55*ease((lt-K('other'))/2.5)),na=ease((lt-K('nick'))/1.6)*(1-0.55*ease((lt-K('other'))/2.5));
    c.font='700 58px C';c.textBaseline='middle';
    if(fa>0){c.textAlign='right';c.globalAlpha=fa*fl;c.shadowColor='rgba(230,130,50,0.6)';c.shadowBlur=18;c.fillStyle='#d98a3a';c.fillText('Фигура',490,ry);c.shadowBlur=0;
      c.fillStyle='rgba(217,138,58,0.5)';for(let x=510;x<590;x+=16){ell(c,x,ry+14,3,3);c.fill();}}
    if(na>0){c.textAlign='left';c.globalAlpha=na*fl;c.fillStyle='#b9bdb6';c.fillText('Ник Касл',610,ry);}
    c.globalAlpha=1;c.restore();
    // чужое лицо проступает из темноты
    const oa=ease((lt-K('other'))/3);
    if(oa>0){c.save();c.globalCompositeOperation='screen';maskFace(c,540,720,2.1,{a:0.3*oa,col:[170,180,176],holes:1.15});c.restore();}
    pumpkin(c,190,1150,64,t,0.7);
    c.fillStyle=`rgba(0,0,0,${0.04*(fl-1)*20})`;c.fillRect(0,0,W,H);
    vignD(c,0.9);
  },
  window2(c,t,lt){
    const f=K('flick'),dn=ease((lt-f)/0.7),up=ease((lt-f-0.9)/1.1),on=1-0.82*dn*(1-up);
    room(c,t,{z:0.9+0.16*ease(lt/6),fig:0,lids:0,lamp:on,pend:false,pump:0.4});
  },
  goodnight(c,t,lt){
    sky(c,t,0);c.fillStyle='rgba(2,14,18,0.55)';c.fillRect(0,0,W,H);
    const dim=ease((lt-K('dim'))/2);
    c.save();const z=1.12-lt*0.006;c.translate(W/2,H/2);c.scale(z,z);c.translate(-W/2,-H/2);
    const SL=K('sleep');const sl=ease((lt-SL)/2.5);
    moon(c,540,700,t);owl(c,540,760,1.15,t,clamp(blink(t,0)+sl,0,1),true,{talk:talk(t),sleepy:sl});
    c.restore();
    if(sl>0){c.save();c.font='700 64px C';c.fillStyle='#b8c4cc';for(let i=0;i<3;i++){const p=((t*0.35+i/3)%1);c.globalAlpha=sl*Math.sin(p*Math.PI)*0.6;c.fillText('z',640+p*120+Math.sin(p*9)*15,560-p*260);}c.restore();}
    houses(c,1070,t,'#050a0d',0.8-0.5*dim);
    lamp(c,830,1190,320,t,0.85,0.9);
    // под фонарём в самом конце: белое пятно, мельче ногтя
    const ap=ease((lt-SL-2.6)/2.4);if(ap>0)figure(c,790,1188,0.075,{face:1,a:0.75*ap,col:'#04080a',mcol:[226,230,224]});
    pumpkin(c,250,1170,30,t,0.7-0.3*dim);
    fog(c,t,1020,1260,0.16);
    c.fillStyle=`rgba(0,6,10,${0.18*dim})`;c.fillRect(0,0,W,H);vignD(c,0.75);
  }
};
