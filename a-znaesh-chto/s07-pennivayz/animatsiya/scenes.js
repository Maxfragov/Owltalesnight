// Страшная арка s07: Пеннивайз («Оно»). Подключается после obshchee/core.js.
// Клоуна НЕ показываем: ни лица, ни грима, ни костюма, ни волос, ни зубов. Узнаём по символам:
// красный шарик на нитке, белые перчатки, две бледно-жёлтые точки глаз во тьме, которые смотрят в разные стороны.
// Ливнёвки (водостока с решёткой) нет: нитка уходит в лужу на мокром асфальте. Вспышек нет, хлопок — только голосом.
// Палитра: холодные сине-зелёные, почти чёрный (не полный), тусклый жёлтый свет фонаря, один красный акцент — шарик.
// Читаемость на телефоне: фон в жуткой части не темнее #0e2028, вокруг важного мягкий туман-подсвет.
const DEFK={dot:1.5,open:0.8,apart:2.86,lamp:0.8,ball:2.67,hide:0.2,sway:0.8,down:2.67,pop:5.59,fall:7.98,dim:0.8,glove:2.48,gone:4.56,eyes:1.7,one:3.4,you:5.76,back:0.8,fly2:3.43,light:1.1,far:3.32,door:5.32,rec:7.76,reel:0.8,fly:0.8,hand:2.74,sleep:1.2,box:5.0};
const DEFKA={hide:12.1,back:34.1};
const K=n=>CFG.k&&CFG.k[n]!=null?CFG.k[n]:DEFK[n];
const KA=n=>CFG.ka&&CFG.ka[n]!=null?CFG.ka[n]:DEFKA[n];
// мини-совёнок прячется на жути (строки 4–7) и возвращается на строке 8
const _miniOwl=miniOwl;
miniOwl=function(c,t,a){const h=ease((t-KA('hide'))/1.0)*(1-ease((t-KA('back'))/1.4));_miniOwl(c,t,a*(1-0.88*h));};
// ---------- helpers ----------
let sd2=71;function r2(){sd2=(sd2*16807)%2147483647;return (sd2-1)/2147483646;}
const FOG=[];for(let i=0;i<34;i++)FOG.push({x:r2()*1.4-0.2,y:r2(),r:160+r2()*260,v:6+r2()*14,p:r2()*6.28});
function fog(c,t,y0,y1,a,col='120,150,155'){c.save();c.globalCompositeOperation='screen';
  for(const f of FOG){const x=((f.x*W+t*f.v)%(W*1.4)+W*1.4)%(W*1.4)-W*0.2,y=lerp(y0,y1,f.y)+Math.sin(t*0.2+f.p)*20;
    const g=c.createRadialGradient(x,y,0,x,y,f.r);const al=a*(0.55+0.45*Math.sin(t*0.15+f.p));
    g.addColorStop(0,`rgba(${col},${al})`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.fillRect(x-f.r,y-f.r,f.r*2,f.r*2);}
  c.restore();}
function vignD(c,k=0.8){const g=c.createRadialGradient(W/2,H*0.42,H*0.18,W/2,H*0.45,H*0.72);g.addColorStop(0,'rgba(2,6,8,0)');g.addColorStop(1,`rgba(2,6,8,${k})`);c.fillStyle=g;c.fillRect(0,0,W,H);}
function grad(c,a,b,d){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,a);g.addColorStop(0.55,b);g.addColorStop(1,d);c.fillStyle=g;c.fillRect(0,0,W,H);}
function glow(c,x,y,r,col,a){if(a<=0)return;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
function zoomAt(c,x,y,z){c.translate(x,y);c.scale(z,z);c.translate(-x,-y);}
// красный шарик: x,y — центр, r — радиус; o.a — прозрачность, o.lit — подсветка 0..1, o.sq — сжатие (лопается)
function balloon(c,x,y,r,o={}){const a=o.a==null?1:o.a;if(a<=0)return;const lit=o.lit==null?1:o.lit,sq=o.sq==null?1:o.sq;
  c.save();c.translate(x,y);c.rotate(o.rot||0);c.scale(sq,sq);c.globalAlpha*=a;
  glow(c,0,0,r*1.9,'200,40,40',0.10*lit);
  c.beginPath();c.moveTo(0,-r*1.08);c.bezierCurveTo(r*0.98,-r*1.08,r*1.02,r*0.35,0,r*1.05);c.bezierCurveTo(-r*1.02,r*0.35,-r*0.98,-r*1.08,0,-r*1.08);c.closePath();
  const g=c.createRadialGradient(-r*0.35,-r*0.45,r*0.08,0,0,r*1.2);
  g.addColorStop(0,`rgb(${Math.round(240*lit+60*(1-lit))},${Math.round(90*lit+30*(1-lit))},${Math.round(80*lit+30*(1-lit))})`);
  g.addColorStop(0.5,`rgb(${Math.round(196*lit+70*(1-lit))},${Math.round(28*lit+18*(1-lit))},${Math.round(34*lit+22*(1-lit))})`);
  g.addColorStop(1,`rgb(${Math.round(92*lit+34*(1-lit))},${Math.round(10*lit+10*(1-lit))},${Math.round(22*lit+18*(1-lit))})`);
  c.fillStyle=g;c.fill();
  c.fillStyle=`rgba(255,235,225,${0.55*lit})`;ell(c,-r*0.38,-r*0.5,r*0.13,r*0.24,-0.5);c.fill();
  c.fillStyle=`rgba(255,235,225,${0.25*lit})`;ell(c,-r*0.2,-r*0.18,r*0.05,r*0.07,-0.5);c.fill();
  // завязка
  c.fillStyle=`rgb(${Math.round(150*lit+50*(1-lit))},20,28)`;c.beginPath();c.moveTo(0,r*1.0);c.lineTo(r*0.11,r*1.16);c.lineTo(-r*0.11,r*1.16);c.closePath();c.fill();
  c.restore();}
// нитка от (x0,y0) вниз к (x1,y1) с провисом/колебанием
function thread(c,x0,y0,x1,y1,bend,a=1,w=2.5){if(a<=0)return;c.save();c.globalAlpha*=a;c.strokeStyle='rgba(225,225,215,0.75)';c.lineWidth=w;c.beginPath();c.moveTo(x0,y0);
  c.bezierCurveTo(x0+bend,lerp(y0,y1,0.33),x1-bend,lerp(y0,y1,0.66),x1,y1);c.stroke();c.restore();}
// белая перчатка (общий предмет: перчатка с манжетой). x,y — запястье, s — масштаб, rot — поворот; пальцы вверх по умолчанию.
// o.curl — сгиб пальцев 0..1, o.shade — тень (ночь) 0..1, o.a — прозрачность
function glove(c,x,y,s,rot,o={}){const a=o.a==null?1:o.a;if(a<=0)return;const cu=o.curl||0,sh=o.shade==null?0.35:o.shade;
  c.save();c.translate(x,y);c.rotate(rot);c.scale(s,s);c.globalAlpha*=a;
  const base=[Math.round(236-80*sh),Math.round(238-70*sh),Math.round(240-55*sh)];const col=`rgb(${base.join(',')})`,dk=`rgb(${base.map(v=>Math.round(v*0.72)).join(',')})`;
  // манжета
  c.fillStyle=dk;c.beginPath();c.roundRect(-46,4,92,44,14);c.fill();c.fillStyle=col;c.beginPath();c.roundRect(-50,0,100,16,8);c.fill();
  // ладонь
  c.fillStyle=col;c.beginPath();c.moveTo(-42,6);c.quadraticCurveTo(-50,-60,-36,-96);c.lineTo(38,-96);c.quadraticCurveTo(50,-60,42,6);c.closePath();c.fill();
  // пальцы: длинные, сгибаются вперёд (укорачиваются)
  const F=[[-28,-92,62,0.10],[-8,-98,74,0.03],[13,-96,70,-0.03],[32,-88,56,-0.10]];
  c.lineCap='round';
  for(const [fx,fy,L,ang] of F){const l=L*(1-0.55*cu);c.save();c.translate(fx,fy);c.rotate(ang);
    c.strokeStyle=col;c.lineWidth=21;c.beginPath();c.moveTo(0,0);c.lineTo(0,-l);c.stroke();
    if(cu>0.05){c.strokeStyle=dk;c.lineWidth=20;c.beginPath();c.moveTo(0,-l);c.lineTo(0,-l+L*0.25*cu);c.stroke();}
    c.strokeStyle='rgba(60,70,80,0.25)';c.lineWidth=2;c.beginPath();c.moveTo(-10,-l*0.45);c.lineTo(10,-l*0.45);c.stroke();
    c.restore();}
  // большой палец
  c.strokeStyle=col;c.lineWidth=22;c.beginPath();c.moveTo(-38,-40);c.quadraticCurveTo(-70,-58,-78+18*cu,-90+20*cu);c.stroke();
  // три строчки на тыльной стороне
  c.strokeStyle='rgba(60,70,80,0.35)';c.lineWidth=3;for(const sx of [-14,0,14]){c.beginPath();c.moveTo(sx,-24);c.lineTo(sx*1.2,-74);c.stroke();}
  // контровой свет
  c.strokeStyle='rgba(255,255,255,0.35)';c.lineWidth=3;c.beginPath();c.moveTo(42,4);c.quadraticCurveTo(50,-60,38,-96);c.stroke();
  c.restore();}
// пара глаз во тьме: две бледно-жёлтые точки. o.open 0..1, o.L=[dx,dy] и o.R=[dx,dy] — куда смотрит каждый зрачок (−1..1), o.glowR — усиление правого
function eyes(c,x,y,s,o={}){const op=o.open==null?1:o.open;if(op<=0.01)return;const a=o.a==null?1:o.a;
  c.save();c.translate(x,y);c.scale(s,s);c.globalAlpha*=a;
  for(const [side,P] of [[-1,o.L||[0,0]],[1,o.R||[0,0]]]){const ex=side*82,gr=1+(side>0?(o.glowR||0):0);
    glow(c,ex,0,120*gr,'235,200,90',0.16*op*gr);
    c.save();c.beginPath();c.ellipse(ex,0,38,24*op,side*-0.12,0,Math.PI*2);c.clip();
    const g=c.createRadialGradient(ex,-4,2,ex,0,40);g.addColorStop(0,'#fff2b0');g.addColorStop(0.55,'#ead070');g.addColorStop(1,'#b08a2c');c.fillStyle=g;c.fillRect(ex-40,-30,80,60);
    c.fillStyle='#0b0f0c';ell(c,ex+P[0]*18,P[1]*10,9,13);c.fill();
    c.fillStyle='rgba(255,255,240,0.8)';ell(c,ex+P[0]*18+5,P[1]*10-6,3,3);c.fill();
    c.restore();}
  c.restore();}
// мокрый асфальт: блики фонаря тянутся вниз
function asphalt(c,y0,t,lamp,lx){const g=c.createLinearGradient(0,y0,0,H);g.addColorStop(0,'#16282e');g.addColorStop(0.5,'#0f1d22');g.addColorStop(1,'#0a1418');c.fillStyle=g;c.fillRect(0,y0,W,H-y0);
  c.save();c.globalCompositeOperation='screen';const rg=c.createLinearGradient(0,y0,0,y0+520);rg.addColorStop(0,`rgba(255,210,130,${0.20*lamp})`);rg.addColorStop(1,'rgba(255,210,130,0)');c.fillStyle=rg;
  c.beginPath();c.moveTo(lx-26,y0);c.lineTo(lx+26,y0);c.lineTo(lx+90,y0+520);c.lineTo(lx-90,y0+520);c.closePath();c.fill();c.restore();
  c.strokeStyle='rgba(150,180,185,0.10)';c.lineWidth=2;for(let i=0;i<16;i++){const yy=y0+20+i*i*2.4,w=40+i*12,xx=(i*211)%W;c.beginPath();c.moveTo(xx-w,yy);c.lineTo(xx+w,yy);c.stroke();}}
// лужа: эллипс с отражением неба и рябью
function puddle(c,x,y,rx,ry,t,o={}){c.save();c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.clip();
  const g=c.createLinearGradient(0,y-ry,0,y+ry);g.addColorStop(0,'#2a4650');g.addColorStop(1,'#0c1a20');c.fillStyle=g;c.fillRect(x-rx,y-ry,rx*2,ry*2);
  if(o.refl)o.refl(c);
  const rp=o.ripple||0;for(let i=0;i<3;i++){const p=((t*0.5+i/3)%1);c.strokeStyle=`rgba(200,220,225,${0.25*(1-p)*rp})`;c.lineWidth=2;c.beginPath();c.ellipse(o.rxp||x,y,20+p*rx*0.6,(20+p*rx*0.6)*ry/rx,0,0,Math.PI*2);c.stroke();}
  c.restore();
  c.strokeStyle='rgba(170,200,205,0.18)';c.lineWidth=3;c.beginPath();c.ellipse(x,y,rx,ry,0,Math.PI*1.05,Math.PI*1.95);c.stroke();}
// фонарь: столб x, верх y; lm — яркость
function lamppost(c,x,y,lm,o={}){c.fillStyle=o.col||'#07100f';c.fillRect(x-9,y,18,H);c.beginPath();c.moveTo(x,y+10);c.quadraticCurveTo(x,y-40,x-60,y-40);c.lineWidth=12;c.strokeStyle=o.col||'#07100f';c.stroke();
  c.fillStyle=o.col||'#07100f';c.beginPath();c.moveTo(x-96,y-30);c.lineTo(x-30,y-30);c.lineTo(x-46,y-56);c.lineTo(x-80,y-56);c.closePath();c.fill();
  if(lm>0){c.save();c.globalCompositeOperation='screen';const g=c.createLinearGradient(0,y-30,0,y+700);g.addColorStop(0,`rgba(255,210,130,${0.18*lm})`);g.addColorStop(1,'rgba(255,210,130,0)');c.fillStyle=g;
    c.beginPath();c.moveTo(x-90,y-28);c.lineTo(x-36,y-28);c.lineTo(x+170,y+720);c.lineTo(x-320,y+720);c.closePath();c.fill();c.restore();
    glow(c,x-63,y-24,140,'255,206,120',0.30*lm);glow(c,x-63,y-26,18,'255,240,200',0.95*lm);}}
// домики-силуэты по линии y
function houses(c,y,col,win,t){const HS=[[-20,180,220],[150,200,300],[340,160,240],[490,240,330],[720,190,260],[900,220,300]];
  c.fillStyle=col;c.fillRect(-20,y,W+40,H-y);for(const [x,w,h] of HS){c.fillStyle=col;c.fillRect(x,y-h,w,h+4);c.beginPath();c.moveTo(x-10,y-h);c.lineTo(x+w/2,y-h-w*0.35);c.lineTo(x+w+10,y-h);c.closePath();c.fill();}
  for(const [x,yy,on] of [[200,y-210,win],[560,y-250,0],[780,y-160,0],[560,y-150,0]]){c.fillStyle=on>0?`rgba(255,200,110,${0.55*on})`:'rgba(30,50,58,0.9)';c.fillRect(x,yy,36,46);if(on>0)glow(c,x+18,yy+23,90,'255,200,110',0.15*on);}}
// угол дома слева (кирпич), за ним прячется перчатка
function wallL(c,x1,col='#0d1a1f'){c.fillStyle=col;c.fillRect(-20,0,x1+20,1300);c.strokeStyle='rgba(120,150,150,0.10)';c.lineWidth=3;
  for(let y=40;y<1300;y+=56){c.beginPath();c.moveTo(0,y);c.lineTo(x1,y);c.stroke();for(let x=(y/56%2)*60;x<x1;x+=120){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+56);c.stroke();}}
  c.strokeStyle='rgba(150,185,190,0.22)';c.lineWidth=4;c.beginPath();c.moveTo(x1,0);c.lineTo(x1,1300);c.stroke();}
function streetBase(c,t,lm,o={}){
  grad(c,'#10222b','#16303a','#0d1b21');starsOnly(c,t,0.12);
  glow(c,560,720,560,'140,170,180',0.14);
  fog(c,t,560,820,0.16);
  houses(c,800,'#0a161b',o.win==null?0.8:o.win,t);
  asphalt(c,800,t,lm,840);
  fog(c,t,760,900,0.12);
}
const SC={
  sky(c,t,lt){
    sky(c,t,0);c.fillStyle='rgba(2,14,18,0.5)';c.fillRect(0,0,W,H);
    const z=1+lt*0.006;c.save();zoomAt(c,W/2,H/2,z);
    const ent=ease(lt/1.6);moon(c,540,700,t);owl(c,540,760+(1-ent)*500,1.15*(0.6+0.4*ent),t,blink(t,0),false,{talk:talk(t)});c.restore();
    fog(c,t,1000,1160,0.14);
    houses(c,1180,'#050c0f',0.8,t);
    lamppost(c,900,1060,0.7,{col:'#050c0f'});
    // далеко под фонарём проступает красная точка — шарик
    const d=ease((lt-K('dot'))/1.4);balloon(c,836,1110,12,{a:d,lit:0.8});thread(c,836,1123,836,1170,2,d,1.5);
    fog(c,t,1120,1260,0.12);vignD(c,0.7);
  },
  eyes(c,t,lt){
    // почти темно, но не чёрный: туман и подсвет. Две жёлтые точки открываются и расходятся взглядом
    grad(c,'#0e2129','#132a33','#0b171c');
    glow(c,540,760,520,'130,165,175',0.16);
    fog(c,t,500,1100,0.18);
    const op=ease((lt-K('open'))/1.6),ap=ease((lt-K('apart'))/2.2);
    const dr=Math.sin(t*0.7)*4;
    eyes(c,540,780+dr,0.95,{open:op,L:[-0.9*ap,-0.6*ap],R:[0.9*ap,0.3*ap]});
    fog(c,t,900,1200,0.12);vignD(c,0.8);
  },
  street(c,t,lt){
    const lm=ease((lt-K('lamp'))/1.6)*(0.85+0.1*Math.sin(t*1.3)+0.05*Math.sin(t*4.1));
    streetBase(c,t,lm);
    wallL(c,170);
    lamppost(c,900,480,lm);
    const ba=ease((lt-K('ball'))/1.8),sw=Math.sin(t*0.9)*10;
    puddle(c,540,1060,280,58,t,{ripple:0.5*ba,refl:cc=>{balloon(cc,540-sw*0.3,1120,46,{a:ba*0.45,lit:0.6,rot:Math.PI});}});
    thread(c,540+sw,700,540,1060,sw*0.5,ba,2.5);
    balloon(c,540+sw,640,54,{a:ba,lit:0.55+0.45*lm});
    fog(c,t,1000,1220,0.10);vignD(c,0.8);
  },
  string(c,t,lt){
    // ближе: шарик качается, взгляд медленно опускается по нитке к луже (панорама вниз, без наезда)
    const lm=0.85+0.1*Math.sin(t*1.3);
    const dn=ease((lt-K('down'))/3.0),cam=-260*dn;
    c.save();c.translate(0,cam);
    grad(c,'#10232b','#16303a','#0e1c22');
    glow(c,700,400,560,'255,206,120',0.10*lm);
    fog(c,t,300,900,0.16);
    houses(c,1000,'#0b171c',0,t);
    wallL(c,120);
    asphalt(c,1000,t,lm,780);c.fillStyle='#0a1418';c.fillRect(0,H-2,W,420);
    const P=K('pop'),pp=ease((lt-P)/0.18),sw=Math.sin(t*0.9)*(18+10*Math.sin(t*0.37));
    const bx=540+sw,by=520;
    // лужа
    const slack=ease((lt-P-0.1)/1.6);
    puddle(c,540,1180,340,70,t,{ripple:0.7+0.6*ease((lt-P-0.8)/0.6)*(1-ease((lt-P-4)/2)),refl:cc=>{balloon(cc,540-sw*0.3,1250,70,{a:0.4*(1-pp),lit:0.5,rot:Math.PI});}});
    // нитка: до хлопка натянута от шарика в лужу, после — падает и уходит в воду
    const tx=lerp(bx,540+sw*0.2,slack),ty=lerp(by+80,1180,slack);
    thread(c,tx,ty,540,1180,sw*0.6*(1-slack)+30*slack*Math.sin(t*2),1-ease((lt-P-2.4)/1.0),3);
    balloon(c,bx,by,80*(1-0.85*pp),{a:1-pp,lit:0.85,sq:1});
    // обрывки шарика медленно падают в лужу
    if(pp>0){const q=lt-P;for(let i=0;i<6;i++){const fx=bx+(i-2.5)*26+Math.sin(q*2+i)*20,fy=by+q*q*12*(1+i*0.15)+q*40;if(fy>1180)continue;
      c.save();c.translate(fx,fy);c.rotate(q*1.5+i);c.globalAlpha=clamp(1-(q-3)/2,0,1);c.fillStyle=i%2?'#a8202a':'#7a1820';c.beginPath();c.moveTo(-12,-6);c.lineTo(10,-9);c.lineTo(8,6);c.lineTo(-6,9);c.closePath();c.fill();c.restore();}}
    c.restore();
    fog(c,t,1000,1250,0.12);vignD(c,0.8);
  },
  empty(c,t,lt){
    // тишина: пустая улица, лужа, фонарь медленно тускнеет. Из-за угла дома — белые пальцы
    const dm=ease((lt-K('dim'))/3),lm=(0.85+0.08*Math.sin(t*1.3))*(1-0.4*dm);
    streetBase(c,t,lm,{win:0.8*(1-dm)});
    lamppost(c,900,480,lm);
    puddle(c,540,1060,280,58,t,{ripple:0.25});
    // обрывок нитки лежит на воде
    c.strokeStyle='rgba(225,225,215,0.5)';c.lineWidth=2.5;c.beginPath();c.moveTo(470,1062);c.quadraticCurveTo(520,1050,580,1066);c.stroke();
    c.fillStyle='#8a1a24';c.beginPath();c.moveTo(600,1058);c.lineTo(622,1054);c.lineTo(618,1068);c.lineTo(602,1070);c.closePath();c.fill();
    wallL(c,230);
    // пальцы перчатки медленно обхватывают угол и так же медленно уходят
    const g=ease((lt-K('glove'))/1.6)*(1-ease((lt-K('gone'))/1.2));
    if(g>0){c.save();c.beginPath();c.rect(230,0,W,H);c.clip();
      glove(c,200+70*g,720,0.95,Math.PI/2,{curl:0.55,shade:0.45,a:g});c.restore();}
    fog(c,t,1000,1220,0.10);vignD(c,0.82);
  },
  below(c,t,lt){
    // под лужей: сверху светлая изнанка воды, в ней обрывки шарика; вниз уходит нитка — к белой перчатке.
    // Над перчаткой открываются глаза: левый смотрит вверх на шарик, правый — прямо на зрителя. Камера стоит.
    grad(c,'#173540','#11262e','#0d1c22');
    // изнанка поверхности
    {const g=c.createLinearGradient(0,0,0,420);g.addColorStop(0,'rgba(150,185,190,0.22)');g.addColorStop(0.55,'rgba(150,185,190,0.36)');g.addColorStop(1,'rgba(150,185,190,0)');c.fillStyle=g;c.fillRect(0,0,W,420);}
    c.strokeStyle='rgba(190,215,220,0.30)';c.lineWidth=3;c.beginPath();for(let x=0;x<=W;x+=20){const y=230+Math.sin(x*0.012+t*0.8)*8;x?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();
    // обрывки шарика на воде (вид снизу)
    for(const [x,y,r] of [[330,236,0.3],[372,232,-0.4],[300,240,1.1]]){c.save();c.translate(x+Math.sin(t*0.8+x)*4,y+Math.sin(t*0.8+x)*3);c.rotate(r);c.fillStyle='#9a2430';c.beginPath();c.moveTo(-16,-6);c.lineTo(14,-8);c.lineTo(10,7);c.lineTo(-10,9);c.closePath();c.fill();c.restore();}
    glow(c,340,240,140,'200,40,40',0.10);
    fog(c,t,350,1150,0.20,'110,145,150');
    glow(c,540,760,440,'130,165,170',0.16);
    // нитка: от обрывков вниз к перчатке
    const sw=Math.sin(t*0.6)*14;thread(c,340,240,430,1010,sw,0.9,2.5);
    // перчатка держит нитку
    glove(c,452,1110,0.75,-0.25,{curl:0.85,shade:0.5,a:ease((lt-0.2)/2)});
    // глаза
    const op=ease((lt-K('eyes'))/1.8),one=ease((lt-K('one'))/1.6),you=ease((lt-K('you'))/2.0);
    eyes(c,560,760,1.12,{open:op,L:[lerp(0,-0.85,one),lerp(0.2,-0.85,one)],R:[lerp(0,0.15,one)*(1-you),lerp(0.2,0.25,one)*(1-you)],glowR:0.5*you});
    fog(c,t,950,1250,0.12);vignD(c,0.78);
  },
  wind(c,t,lt){
    // выдох: вечернее небо, два шарика из одной точки разлетаются в разные стороны
    {const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1e3a4c');g.addColorStop(0.5,'#3d5e6a');g.addColorStop(0.62,'#6c7c78');g.addColorStop(1,'#1c2c32');c.fillStyle=g;c.fillRect(0,0,W,H);}
    starsOnly(c,t,0.18);
    for(const [x,y,w] of [[200,420,300],[760,560,360],[420,700,280]]){c.fillStyle='rgba(200,215,220,0.08)';ell(c,x+Math.sin(t*0.1)*30,y,w,40);c.fill();}
    houses(c,1180,'#16252b',0.6,t);
    const f=ease((lt-K('fly2'))/3.2),f0=ease((lt-0.4)/1.4);
    const P0=[540,900];
    const L=[lerp(P0[0]-24,250,f),lerp(P0[1],520,f)],R=[lerp(P0[0]+24,700,f),lerp(P0[1],520,f)];
    const sw=Math.sin(t*1.1)*8;
    thread(c,L[0],L[1]+64,lerp(540,330,f),lerp(1060,720,f)+20*f,sw,f0,2.5);
    thread(c,R[0],R[1]+64,lerp(540,780,f),lerp(1060,760,f)+20*f,-sw,f0,2.5);
    balloon(c,L[0]+sw,L[1],48,{a:f0,lit:1,rot:-0.15*f});
    balloon(c,R[0]-sw,R[1],48,{a:f0,lit:1,rot:0.15*f});
    fog(c,t,1000,1200,0.10,'200,210,210');vignD(c,0.55);
  },
  set(c,t,lt){
    // съёмочная площадка ночью: слева велосипеды детей, справа далеко вагончик актёра. Между ними — расстояние.
    const z=1.02+lt*0.003;c.save();zoomAt(c,540,700,z);
    grad(c,'#132730','#1a323b','#0d1a1f');starsOnly(c,t,0.15);
    const on=ease((lt-K('light'))/1.4);
    houses(c,820,'#0d1b20',0.5,t);
    c.fillStyle='#14252b';c.fillRect(0,820,W,H);
    // прожектор слева
    c.strokeStyle='#071013';c.lineWidth=10;c.lineCap='round';c.beginPath();c.moveTo(80,1060);c.lineTo(120,640);c.moveTo(160,1060);c.lineTo(120,640);c.stroke();
    c.save();c.translate(130,600);c.rotate(0.5);c.fillStyle='#0a1316';c.beginPath();c.roundRect(-60,-50,130,100,14);c.fill();c.fillStyle=`rgba(255,226,160,${0.15+0.8*on})`;ell(c,70,0,12,44);c.fill();c.restore();
    c.save();c.globalCompositeOperation='screen';c.fillStyle=`rgba(255,214,140,${0.09*on})`;c.beginPath();c.moveTo(190,600);c.lineTo(200,690);c.lineTo(520,1080);c.lineTo(160,1100);c.closePath();c.fill();c.restore();
    glow(c,300,960,300,'255,214,140',0.14*on);
    // три детских велосипеда
    const bike=(x,y,s)=>{c.save();c.translate(x,y);c.scale(s,s);c.strokeStyle='#cbd6d4';c.globalAlpha=0.55+0.35*on;c.lineWidth=5;
      ell(c,-50,0,38,38);c.stroke();ell(c,50,0,38,38);c.stroke();c.beginPath();c.moveTo(-50,0);c.lineTo(-10,-46);c.lineTo(36,-46);c.lineTo(50,0);c.moveTo(-10,-46);c.lineTo(4,0);c.lineTo(-50,0);c.moveTo(36,-46);c.lineTo(30,-70);c.lineTo(50,-74);c.moveTo(-14,-52);c.lineTo(-26,-58);c.stroke();c.restore();};
    bike(250,1040,0.9);bike(380,1060,0.95);bike(300,1110,1.0);
    // вагончик справа далеко
    const dp=ease((lt-K('door'))/2.4);
    c.fillStyle='#0b161a';c.beginPath();c.roundRect(700,780,300,200,18);c.fill();c.fillRect(720,975,40,24);c.fillRect(940,975,40,24);
    c.strokeStyle='rgba(150,185,190,0.18)';c.lineWidth=3;c.beginPath();c.roundRect(700,780,300,200,18);c.stroke();
    // дверь открывается: внутри тёплый свет, выплывает красный шарик
    c.fillStyle=`rgba(255,206,130,${0.65*dp})`;c.fillRect(760,830,70,140);glow(c,795,900,170,'255,206,130',0.22*dp);
    c.fillStyle='#08110f';c.beginPath();c.moveTo(760,830);c.lineTo(760+70*(1-dp*0.8),830+8*dp);c.lineTo(760+70*(1-dp*0.8),970-8*dp);c.lineTo(760,970);c.closePath();c.fill();
    c.fillStyle='rgba(220,220,200,0.6)';c.font='700 34px C';c.textAlign='center';c.fillText('★',900,880);
    const bb=ease((lt-K('door')-1.0)/2.5);if(bb>0){thread(c,800,870-80*bb+40,800,960,6*Math.sin(t),bb,2);balloon(c,800+Math.sin(t*0.9)*6,800-80*bb,26,{a:bb,lit:0.9});}
    // «подальше от детей»: пунктирная линия расстояния растёт между велосипедами и вагончиком
    const fr=ease((lt-K('far'))/1.8);
    if(fr>0){c.save();c.strokeStyle=`rgba(230,225,200,${0.6*fr})`;c.lineWidth=4;c.setLineDash([16,14]);c.lineDashOffset=-t*10;c.beginPath();c.moveTo(450,1000);c.lineTo(450+230*fr,1000-10*fr);c.stroke();c.setLineDash([]);c.restore();}
    // камера на штативе по центру, лампочка записи
    c.strokeStyle='#060c0e';c.lineWidth=8;c.beginPath();c.moveTo(500,1160);c.lineTo(560,900);c.moveTo(620,1160);c.lineTo(560,900);c.moveTo(560,1160);c.lineTo(560,900);c.stroke();
    c.fillStyle='#071012';c.beginPath();c.roundRect(470,800,190,110,12);c.fill();ell(c,500,790,40,40);c.fill();ell(c,600,790,40,40);c.fill();c.fillRect(650,830,70,46);
    c.strokeStyle='rgba(150,185,190,0.2)';c.lineWidth=3;ell(c,500,790,40,40);c.stroke();ell(c,600,790,40,40);c.stroke();
    const rec=ease((lt-K('rec'))/0.8);glow(c,490,830,36,'255,60,50',0.5*rec);c.fillStyle=`rgba(255,70,60,${0.25+0.7*rec})`;ell(c,490,830,7,7);c.fill();
    c.restore();
    fog(c,t,980,1250,0.08);vignD(c,0.75);
  },
  film(c,t,lt){
    grad(c,'#0b1215','#0d1518','#080d0f');
    const fl=1+0.03*Math.sin(t*19)+0.02*Math.sin(t*7.3);
    c.fillStyle='#121a1c';c.fillRect(150,420,780,820);
    c.fillStyle='#060a0c';for(let y=440-((lt*70)%70);y<1220;y+=70){if(y<425)continue;c.beginPath();c.roundRect(165,y,36,30,6);c.fill();c.beginPath();c.roundRect(879,y,36,30,6);c.fill();}
    // кадр плёнки: дети на велосипедах со спины на мокрой улице, вдали — красная точка
    const fx=230,fy=500,fw=620,fh=680;c.save();c.beginPath();c.rect(fx,fy,fw,fh);c.clip();
    {const g=c.createLinearGradient(0,fy,0,fy+fh);g.addColorStop(0,'#4a5d62');g.addColorStop(0.5,'#5e706e');g.addColorStop(0.52,'#3d4d50');g.addColorStop(1,'#26343a');c.fillStyle=g;c.fillRect(fx,fy,fw,fh);}
    // улица в перспективе
    c.fillStyle='#2c3a3e';c.beginPath();c.moveTo(fx,fy+fh);c.lineTo(520,fy+330);c.lineTo(560,fy+330);c.lineTo(fx+fw,fy+fh);c.closePath();c.fill();
    c.fillStyle='#1f2b2f';for(const [x,w,h] of [[fx,120,260],[fx+110,90,200],[fx+fw-120,120,280],[fx+fw-210,90,190]])c.fillRect(x,fy+330-h,w,h*0.8);
    balloon(c,540,fy+300,9,{lit:0.7});
    // три ребёнка на велосипедах со спины (простые силуэты)
    for(const [x,y,s] of [[420,fy+560,1],[560,fy+590,1.1],[690,fy+550,0.95]]){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle='#141c1f';ell(c,0,-120,24,26);c.fill();c.beginPath();c.roundRect(-30,-96,60,80,16);c.fill();
      c.strokeStyle='#141c1f';c.lineWidth=6;ell(c,0,20,8,34);c.stroke();c.beginPath();c.moveTo(-40,-60);c.lineTo(40,-60);c.stroke();c.restore();}
    c.fillStyle=`rgba(0,0,0,${0.12+0.6*(fl-1)})`;c.fillRect(fx,fy,fw,fh);
    c.strokeStyle='rgba(220,220,210,0.10)';c.lineWidth=2;for(let i=0;i<3;i++){const xx=fx+((Math.floor(t*6)*137+i*251)%fw);c.beginPath();c.moveTo(xx,fy);c.lineTo(xx+6,fy+fh);c.stroke();}
    c.restore();
    c.font='700 40px C';c.fillStyle=`rgba(200,196,180,${0.55*ease((lt-K('reel'))/1)})`;c.textAlign='left';c.fillText('дубль 1',fx,fy-30);
    vignD(c,0.8);
  },
  offer(c,t,lt){
    // шарики улетают в ночное небо; снизу поднимается белая перчатка и протягивает нитку
    grad(c,'#14303b','#1b3a44','#0e1d23');starsOnly(c,t,0.3);
    glow(c,540,640,560,'150,180,190',0.14);
    fog(c,t,800,1050,0.14);
    houses(c,1200,'#0b171c',0.7,t);
    const fl=lt-K('fly');
    for(const [x0,y0,r,v,ph] of [[260,900,26,70,0],[420,1000,20,90,1],[700,940,22,80,2],[850,1040,16,95,3],[560,1080,14,110,4]]){const y=y0-Math.max(0,fl)*v,x=x0+Math.sin(t*0.8+ph)*16;if(y<-60)continue;
      const a=ease(fl/1)*clamp((y+40)/300,0,1);thread(c,x,y+r*1.15,x+6,y+r*4,4*Math.sin(t+ph),a,1.5);balloon(c,x,y,r,{a,lit:0.85});}
    // протянутая нитка
    const hd=ease((lt-K('hand'))/2.2);
    const gx=640,gy=lerp(1380,1080,hd);
    const bx=700+Math.sin(t*0.8)*12,by=560+Math.sin(t*0.6)*8;
    thread(c,bx,by+64,gx-6,gy-80,Math.sin(t*0.9)*18,1,2.5);
    balloon(c,bx,by,58,{lit:0.95});
    glove(c,gx,gy,0.8,0.08,{curl:0.8,shade:0.35,a:hd});
    fog(c,t,1050,1250,0.10);vignD(c,0.78);
  },
  goodnight(c,t,lt){
    sky(c,t,0);c.fillStyle='rgba(2,14,18,0.5)';c.fillRect(0,0,W,H);
    c.save();const z=1.12-lt*0.006;zoomAt(c,W/2,H/2,z);
    const sl=ease((lt-K('sleep'))/2.5);
    moon(c,540,700,t);owl(c,540,760,1.15,t,clamp(blink(t,0)+sl,0,1),true,{talk:talk(t),sleepy:sl});
    c.restore();
    if(sl>0){c.save();c.font='700 64px C';c.fillStyle='#b8c4cc';for(let i=0;i<3;i++){const p=((t*0.35+i/3)%1);c.globalAlpha=sl*Math.sin(p*Math.PI)*0.6;c.fillText('z',640+p*120+Math.sin(p*9)*15,560-p*260);}c.restore();}
    // далеко-далеко улетает один красный шарик
    {const y=1150-lt*55;if(y>-40){thread(c,180+Math.sin(t)*6,y+14,186,y+50,3,0.7,1.3);balloon(c,180+Math.sin(t)*6,y,12,{lit:0.7,a:0.85});}}
    fog(c,t,1000,1160,0.14);
    houses(c,1180,'#050c0f',0.8*(1-ease((lt-K('box'))/2)),t);
    lamppost(c,900,1060,0.6,{col:'#050c0f'});
    fog(c,t,1120,1260,0.12);vignD(c,0.72);
  }
};
