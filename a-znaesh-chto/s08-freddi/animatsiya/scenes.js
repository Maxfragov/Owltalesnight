// Страшная арка s08: Фредди Крюгер («Кошмар на улице Вязов», 1984). Подключается после obshchee/core.js.
window.END_SUB='страшные истории';
// Узнаём только по тени: силуэт в шляпе-федоре и свитер в красно-зелёную полоску на стене, клубки красной и зелёной пряжи.
// Нельзя: лицо в ожогах, перчатка с лезвиями (перчатка — тёмный силуэт руки с круглыми пальцами, без лезвий).
// Полосы НЕ мигают (светочувствительность): каждая проявляется плавно и остаётся; «рябит» — медленная волна формы, не яркость.
// Без крови, без оружия, без скримеров. Палитра: холодные сине-зелёные, тусклый жёлтый свет ночника/фонаря, туман, зерно.
// Стены держим заметно светлее чёрного, силуэты всегда на светлом фоне — чтобы читалось на телефоне.
const DEFK={glow:1.4,klubki:0.8,niti:3.05,raz:5.9,dva:8.74,tri:11.58,ryab:12.28,otvern:13.74,hide:0.4,son:0.8,prihodit:1.4,prosn:3.16,
  chetyre:0.8,perch:1.6,pyat:3.09,oborval:3.68,back:0.8,zhurnal:0.8,cveta:2.0,net:4.01,vyros:0.8,ten:2.67,vniz:5.74,neznak:7.96,golovu:11.48,glaza:14.5,
  okno2:0.8,zadern:1.7,shchel:4.04,dim:0.8,sleep:1.2,end:3.4};
const DEFKA={hide:18.28,back:28.32};
const K=n=>CFG.k&&CFG.k[n]!=null?CFG.k[n]:DEFK[n];
const KA=n=>CFG.ka&&CFG.ka[n]!=null?CFG.ka[n]:DEFKA[n];
// мини-совёнок прячется на жути (строки 6–7) и возвращается на строке 8
const _miniOwl=miniOwl;
miniOwl=function(c,t,a){const h=ease((t-KA('hide'))/1.0)*(1-ease((t-KA('back'))/1.4));_miniOwl(c,t,a*(1-0.88*h));};
// ---------- helpers ----------
let sd8=83;function r8(){sd8=(sd8*16807)%2147483647;return (sd8-1)/2147483646;}
const FOG=[];for(let i=0;i<34;i++)FOG.push({x:r8()*1.4-0.2,y:r8(),r:160+r8()*260,v:6+r8()*14,p:r8()*6.28});
function fog(c,t,y0,y1,a,col='120,150,155'){c.save();c.globalCompositeOperation='screen';
  for(const f of FOG){const x=((f.x*W+t*f.v)%(W*1.4)+W*1.4)%(W*1.4)-W*0.2,y=lerp(y0,y1,f.y)+Math.sin(t*0.2+f.p)*20;
    const g=c.createRadialGradient(x,y,0,x,y,f.r);const al=a*(0.55+0.45*Math.sin(t*0.15+f.p));
    g.addColorStop(0,`rgba(${col},${al})`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.fillRect(x-f.r,y-f.r,f.r*2,f.r*2);}
  c.restore();}
function vignD(c,k=0.7){const g=c.createRadialGradient(W/2,H*0.4,H*0.22,W/2,H*0.45,H*0.76);g.addColorStop(0,'rgba(2,6,8,0)');g.addColorStop(1,`rgba(2,6,8,${k})`);c.fillStyle=g;c.fillRect(0,0,W,H);}
function grad(c,a,b,d){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,a);g.addColorStop(0.55,b);g.addColorStop(1,d);c.fillStyle=g;c.fillRect(-600,-600,W+1200,H+1200);}
function glow(c,x,y,r,col,a){if(a<=0)return;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
function zoomAt(c,x,y,z){c.translate(x,y);c.scale(z,z);c.translate(-x,-y);}
// мягкое «дыхание» ночника, без вспышек
function flick(t,k=1){return 1+k*(0.035*Math.sin(t*2.1)+0.02*Math.sin(t*3.7+1));}
const RED='150,40,36',GRN='40,108,62';
// ---------- тень человека в шляпе (анфас), пояс в (0,0), шляпа до -780 ----------
function hatPath(c){c.beginPath();
  c.moveTo(-215,60);c.bezierCurveTo(-222,-150,-238,-330,-205,-400);
  c.bezierCurveTo(-180,-445,-110,-455,-62,-468);c.lineTo(-50,-505);
  c.bezierCurveTo(-78,-522,-82,-580,-74,-600);
  c.bezierCurveTo(-120,-600,-172,-598,-182,-614);c.bezierCurveTo(-172,-636,-122,-641,-92,-641);
  c.bezierCurveTo(-97,-690,-88,-742,-66,-766);c.bezierCurveTo(-30,-781,-12,-753,0,-751);
  c.bezierCurveTo(14,-753,36,-783,70,-766);c.bezierCurveTo(90,-742,97,-690,92,-641);
  c.bezierCurveTo(122,-641,172,-636,182,-614);c.bezierCurveTo(172,-598,120,-600,74,-600);
  c.bezierCurveTo(82,-580,78,-522,50,-505);c.lineTo(62,-468);
  c.bezierCurveTo(110,-455,180,-445,205,-400);c.bezierCurveTo(238,-330,222,-150,215,60);c.closePath();}
// o: a (непрозрачность тени), st (функция i->альфа полосы 0..1), rip (амплитуда ряби), t, blur
function hatShadow(c,x,y,s,o={}){const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.translate(x,y);c.scale(s*(o.sx||1),s);
  c.globalAlpha*=a;c.filter=`blur(${o.blur==null?3:o.blur}px)`;c.fillStyle=o.col||'rgba(5,9,11,0.86)';hatPath(c);c.fill();c.filter='none';
  if(o.st){c.save();hatPath(c);c.clip();const bh=48,t=o.t||0,rip=o.rip||0;
    for(let i=0;i<10;i++){const al=o.st(i);if(al<=0)continue;const y0=-446+i*bh;
      c.fillStyle=`rgba(${i%2?GRN:RED},${0.62*al})`;c.beginPath();
      const wv=(xx,yy)=>yy+rip*Math.sin(xx*0.016+t*0.8+i*0.7);
      c.moveTo(-260,wv(-260,y0));for(let xx=-260;xx<=260;xx+=20)c.lineTo(xx,wv(xx,y0));
      for(let xx=260;xx>=-260;xx-=20)c.lineTo(xx,wv(xx,y0+bh*0.62));c.closePath();c.fill();}
    c.restore();}
  c.restore();}
// ---------- рука-силуэт: круглые пальцы, БЕЗ лезвий. Ладонь в (0,0), пальцы влево ----------
function handSil(c,x,y,s,rot,col='rgba(5,8,10,0.9)'){c.save();c.translate(x,y);c.rotate(rot);c.scale(s,s);c.filter='blur(2px)';
  c.fillStyle=col;c.strokeStyle=col;c.lineCap='round';c.lineJoin='round';
  c.lineWidth=96;c.beginPath();c.moveTo(60,10);c.lineTo(900,40);c.stroke();// предплечье уходит за край
  ell(c,0,0,82,70);c.fill();
  const F=[[-0.42,180],[-0.14,205],[0.12,196],[0.38,165]];
  for(const [an,L] of F){c.lineWidth=34;c.beginPath();c.moveTo(-40,0);const ex=-40-Math.cos(an)*L,ey=Math.sin(an)*L;
    c.quadraticCurveTo(-40-Math.cos(an)*L*0.55,Math.sin(an)*L*0.5-14,ex,ey);c.stroke();}
  c.lineWidth=36;c.beginPath();c.moveTo(10,40);c.quadraticCurveTo(-30,110,-90,120);c.stroke();// большой палец
  c.filter='none';c.restore();}
// ---------- клубок пряжи ----------
function yarn(c,x,y,r,col,rot=0){c.save();c.translate(x,y);c.rotate(rot);
  const g=c.createRadialGradient(-r*0.35,-r*0.4,r*0.1,0,0,r);g.addColorStop(0,`rgba(${col.map(v=>Math.min(255,v+70)).join(',')},1)`);g.addColorStop(0.7,`rgb(${col.join(',')})`);g.addColorStop(1,`rgb(${col.map(v=>Math.round(v*0.45)).join(',')})`);
  c.fillStyle=g;ell(c,0,0,r,r);c.fill();
  c.save();ell(c,0,0,r,r);c.clip();c.strokeStyle=`rgba(${col.map(v=>Math.round(v*0.5)).join(',')},0.8)`;c.lineWidth=r*0.07;
  for(let i=0;i<7;i++){c.beginPath();c.ellipse(0,0,r*1.02,r*(0.25+i*0.1),0.5+i*0.45,0,Math.PI*2);c.stroke();}
  c.strokeStyle=`rgba(${col.map(v=>Math.min(255,v+60)).join(',')},0.35)`;c.lineWidth=r*0.04;for(let i=0;i<5;i++){c.beginPath();c.ellipse(0,0,r*0.98,r*(0.3+i*0.13),-0.6+i*0.4,3.6,5.6);c.stroke();}
  c.restore();c.restore();}
// нить от клубка, p — доля пройденного пути
function thread(c,pts,p,col,w=4){if(p<=0)return;const [a,b,d,e]=pts;c.save();c.strokeStyle=`rgba(${col},0.85)`;c.lineWidth=w;c.lineCap='round';c.beginPath();
  const N=40;for(let i=0;i<=N*p;i++){const u=i/N,v=1-u;const x=v*v*v*a[0]+3*v*v*u*b[0]+3*v*u*u*d[0]+u*u*u*e[0],y=v*v*v*a[1]+3*v*v*u*b[1]+3*v*u*u*d[1]+u*u*u*e[1];i?c.lineTo(x,y):c.moveTo(x,y);}
  c.stroke();c.restore();}
// ---------- настенные часы с маятником; stop — время остановки (маятник замирает на полувзмахе) ----------
function wallClock(c,x,y,r,t,stop=1e9){const tt=Math.min(t,stop);c.save();c.translate(x,y);
  c.fillStyle='#1c140e';c.fillRect(-r*0.55,r*0.9,r*1.1,r*2.1);c.strokeStyle='rgba(255,210,150,0.22)';c.lineWidth=3;c.strokeRect(-r*0.55,r*0.9,r*1.1,r*2.1);
  c.fillStyle='#2a3a38';c.fillRect(-r*0.42,r*1.0,r*0.84,r*1.9);
  const sw=0.32*Math.sin(tt*Math.PI);c.save();c.translate(0,r*1.02);c.rotate(sw);c.strokeStyle='#b39a62';c.lineWidth=5;c.beginPath();c.moveTo(0,0);c.lineTo(0,r*1.45);c.stroke();
  c.fillStyle='#c4a96a';ell(c,0,r*1.55,r*0.2,r*0.2);c.fill();c.restore();
  c.fillStyle='#1c140e';ell(c,0,0,r*1.12,r*1.12);c.fill();
  const g=c.createRadialGradient(-r*0.3,-r*0.3,r*0.1,0,0,r);g.addColorStop(0,'#c9c6b2');g.addColorStop(1,'#7f8577');c.fillStyle=g;ell(c,0,0,r,r);c.fill();
  c.strokeStyle='#2a2a24';for(let i=0;i<12;i++){const an=i/12*Math.PI*2;c.lineWidth=i%3?3:6;c.beginPath();c.moveTo(Math.cos(an)*r*0.8,Math.sin(an)*r*0.8);c.lineTo(Math.cos(an)*r*0.92,Math.sin(an)*r*0.92);c.stroke();}
  const mn=-Math.PI/2+(tt/60)*Math.PI*2*0.6+1.2,hr=-Math.PI/2+2.9;
  c.lineCap='round';c.lineWidth=8;c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(hr)*r*0.5,Math.sin(hr)*r*0.5);c.stroke();
  c.lineWidth=5;c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(mn)*r*0.78,Math.sin(mn)*r*0.78);c.stroke();
  c.fillStyle='#2a2a24';ell(c,0,0,8,8);c.fill();c.restore();}
// ---------- уличный фонарь ----------
function lamp(c,x,y,h,t,on=1,s=1){c.save();const hx=x-34*s,hy=y-h;
  c.fillStyle=`rgba(255,214,130,${0.10*on})`;c.beginPath();c.moveTo(hx-14*s,hy+10*s);c.lineTo(hx+14*s,hy+10*s);c.lineTo(hx+170*s,y);c.lineTo(hx-170*s,y);c.closePath();c.fill();
  c.save();c.translate(hx,y);c.scale(1,0.22);glow(c,0,0,220*s,'255,214,130',0.32*on);c.restore();
  c.strokeStyle='#05090b';c.lineWidth=9*s;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.lineTo(x,hy-18*s);c.quadraticCurveTo(x,hy-34*s,hx,hy-24*s);c.stroke();
  c.fillStyle='#05090b';c.beginPath();c.moveTo(hx-22*s,hy);c.lineTo(hx+22*s,hy);c.lineTo(hx+10*s,hy-24*s);c.lineTo(hx-10*s,hy-24*s);c.closePath();c.fill();
  glow(c,hx,hy+4*s,130*s,'255,214,130',0.5*on);glow(c,hx,hy+4*s,22*s,'255,236,190',0.9*on);c.restore();}
// ---------- вяз-силуэт ----------
function elm(c,x,y,s,col){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle=col;c.strokeStyle=col;c.lineCap='round';
  c.lineWidth=26;c.beginPath();c.moveTo(0,0);c.lineTo(0,-150);c.stroke();
  c.lineWidth=14;for(const [dx,dy] of [[-90,-300],[-30,-330],[40,-320],[100,-290]]){c.beginPath();c.moveTo(0,-140);c.quadraticCurveTo(dx*0.3,-220,dx,dy);c.stroke();}
  for(const [bx,by,br] of [[-120,-320,80],[-60,-380,90],[20,-400,95],[95,-360,85],[140,-300,70],[-150,-260,60],[60,-300,80],[-20,-320,80]]){ell(c,bx,by,br,br*0.8);c.fill();}
  c.restore();}
// ---------- улица Вязов: дома, вязы, фонарь; fig — силуэт в шляпе под фонарём ----------
function street(c,t,o={}){const y=1190;
  for(const [x,s] of [[110,0.95],[330,0.8],[990,0.9]])elm(c,x,y+20,s,'#071015');
  c.fillStyle='#060d11';c.beginPath();c.moveTo(0,H);c.lineTo(0,y+30);
  for(const [x,dy] of [[0,30],[60,-110],[140,-170],[220,-110],[250,30],[420,30],[440,-80],[520,-150],[600,-80],[620,30],[1080,30]])c.lineTo(x,y+dy);c.lineTo(W,H);c.closePath();c.fill();
  c.fillStyle=`rgba(255,200,110,${0.32*(o.win==null?1:o.win)*(0.92+0.08*Math.sin(t*0.6))})`;c.fillRect(505,y-95,28,38);
  c.fillStyle='rgba(150,190,200,0.10)';c.fillRect(120,y-70,24,30);
  lamp(c,830,y+40,300,t,o.lamp==null?1:o.lamp,0.9);
  if(o.fig>0){c.save();c.globalAlpha=o.fig;hatShadow(c,800,y+5,0.15,{col:'#03070a',blur:1});c.restore();}
  c.fillStyle='#050b0e';c.fillRect(0,y+40,W,H);}
// ---------- прохожий под фонарём, вид из окна второго этажа (сверху-сбоку). Ступни в (0,0), рост ~600. lift 0..1 — поднимает голову ----------
function manStand(c,x,y,s,lift){const L=ease(lift);c.save();c.translate(x,y);c.scale(s,s);
  // тень на асфальте от фонаря (фонарь справа сверху)
  c.fillStyle='rgba(4,8,10,0.5)';c.beginPath();c.moveTo(-60,0);c.quadraticCurveTo(-260,40,-430,90);c.lineTo(-400,130);c.quadraticCurveTo(-220,70,60,10);c.closePath();c.fill();
  c.fillStyle='#06090b';c.fillRect(-48,-110,40,112);c.fillRect(10,-110,40,112);
  c.beginPath();c.moveTo(-74,-90);c.quadraticCurveTo(-92,-210,-104,-292);c.quadraticCurveTo(-60,-322,0,-326);c.quadraticCurveTo(60,-322,104,-292);c.quadraticCurveTo(92,-210,74,-90);c.closePath();c.fill();
  c.strokeStyle='rgba(255,214,140,0.42)';c.lineWidth=5;c.beginPath();c.moveTo(20,-325);c.quadraticCurveTo(70,-320,104,-292);c.quadraticCurveTo(94,-200,76,-95);c.stroke();
  // лицо без черт: только тёмный овал с холодным краем, видно, когда голова поднята
  const fy=-362-14*L;
  if(L>0){c.save();c.globalAlpha=L;c.fillStyle='#1b2428';ell(c,0,fy,40,50);c.fill();
    c.strokeStyle='rgba(200,214,210,0.3)';c.lineWidth=3;c.beginPath();c.ellipse(0,fy,40,50,0,-0.9,1.3);c.stroke();c.restore();}
  // шляпа: в покое видны верх полей и тулья (лицо закрыто); голова поднята — поля встают ребром и уходят вверх
  const by=-372-46*L,bry=lerp(36,13,L);
  c.fillStyle='#04070a';ell(c,0,by,102,bry);c.fill();
  c.strokeStyle='rgba(255,214,140,0.45)';c.lineWidth=4;c.beginPath();c.ellipse(0,by,102,bry,0,-1.2,0.5);c.stroke();
  const cy=by-lerp(12,30,L);c.fillStyle='#090d10';c.beginPath();c.moveTo(-58,by-2);c.quadraticCurveTo(-62,cy-30,-30,cy-38);c.quadraticCurveTo(0,cy-26,30,cy-38);c.quadraticCurveTo(62,cy-30,58,by-2);c.closePath();c.fill();
  c.strokeStyle='rgba(255,214,140,0.3)';c.lineWidth=3;c.beginPath();c.moveTo(30,cy-38);c.quadraticCurveTo(62,cy-30,58,by-2);c.stroke();
  c.restore();}
// ---------- окно изнутри комнаты ----------
function windowIn(c,x,y,w,h,t,o={}){c.save();
  c.fillStyle='#0d171b';c.fillRect(x-14,y-14,w+28,h+28);
  const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,'#0f2430');g.addColorStop(1,'#1b3640');c.fillStyle=g;c.fillRect(x,y,w,h);
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  glow(c,x+w*0.72,y+h*1.05,h*0.7,'255,206,130',0.22*(o.lampA==null?1:o.lampA));
  for(let i=0;i<40;i++){const sx=x+((i*137.3)%w),sy=y+((i*71.9)%(h*0.5));c.fillStyle=`rgba(230,235,220,${0.25+0.2*Math.sin(t*0.7+i)})`;c.fillRect(sx,sy,2,2);}
  if(o.block>0){c.fillStyle=`rgba(3,6,8,${0.9*o.block})`;c.fillRect(x+w*0.7-30,y+h*0.6,60,h*0.5);}
  c.restore();
  c.strokeStyle='#0a1215';c.lineWidth=14;c.beginPath();c.moveTo(x+w/2,y);c.lineTo(x+w/2,y+h);c.moveTo(x,y+h*0.45);c.lineTo(x+w,y+h*0.45);c.stroke();
  c.fillStyle='#16110c';c.fillRect(x-40,y+h+10,w+80,26);c.fillStyle='rgba(255,210,150,0.12)';c.fillRect(x-40,y+h+10,w+80,4);
  c.restore();}
// ---------- мальчик со спины (силуэт), ступни в (0,0), рост ~380 ----------
function boyBack(c,x,y,s,col='#070b0d'){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle=col;
  c.beginPath();c.moveTo(-60,0);c.lineTo(-58,-150);c.quadraticCurveTo(-80,-260,-62,-280);c.quadraticCurveTo(0,-300,62,-280);c.quadraticCurveTo(80,-260,58,-150);c.lineTo(60,0);c.closePath();c.fill();
  ell(c,0,-325,52,56);c.fill();
  c.strokeStyle='rgba(150,190,205,0.35)';c.lineWidth=3;c.beginPath();c.arc(0,-325,52,-2.6,-0.5);c.stroke();
  c.restore();}
// ---------- шторы: close 0..1; щель посередине ----------
function curtains(c,x0,x1,y0,y1,t,close,sway=0){const mid=(x0+x1)/2,gap=lerp(220,13,close);
  for(const sd of [-1,1]){const edge=mid+sd*gap,outer=sd<0?x0-40:x1+40;
    c.save();const g=c.createLinearGradient(outer,0,edge,0);g.addColorStop(0,'#1d2b2e');g.addColorStop(1,'#2e4245');c.fillStyle=g;
    c.beginPath();c.moveTo(outer,y0);c.lineTo(edge,y0);
    for(let yy=y0;yy<=y1;yy+=40){const sw=sway*Math.sin(t*0.9+yy*0.004)*(yy-y0)/(y1-y0)*10;c.lineTo(edge+sw*sd,yy);}
    c.lineTo(outer,y1);c.closePath();c.fill();
    c.strokeStyle='rgba(8,14,16,0.45)';c.lineWidth=10;for(let k=1;k<6;k++){const fx=lerp(outer,edge,k/6);c.beginPath();c.moveTo(fx,y0);c.lineTo(fx+Math.sin(k)*6,y1);c.stroke();}
    c.strokeStyle='rgba(255,215,160,0.18)';c.lineWidth=4;c.beginPath();c.moveTo(edge,y0);c.lineTo(edge,y1);c.stroke();
    c.restore();}
  c.fillStyle='#120d09';c.fillRect(x0-80,y0-24,x1-x0+160,18);}
const SC={
  sky(c,t,lt){
    sky(c,t,0);c.fillStyle='rgba(2,14,18,0.5)';c.fillRect(0,0,W,H);
    const z=1+lt*0.006;c.save();zoomAt(c,W/2,H/2,z);
    const ent=ease(lt/1.6);moon(c,540,700,t);owl(c,540,760+(1-ent)*500,1.15*(0.6+0.4*ent),t,blink(t,0),false,{talk:talk(t)});c.restore();
    const gl=ease((lt-K('glow'))/1.6);glow(c,800,1100,420,'110,150,165',0.14*gl);
    street(c,t,{win:0.5+0.5*gl,lamp:0.6+0.4*gl});fog(c,t,1060,1260,0.15);vignD(c,0.66);
  },
  sviter(c,t,lt){
    // клубки → нити ползут по стене → на стене тень в шляпе; Раз — красная полоса, Два — зелёная, Три — все, медленная рябь
    const kl=ease((lt-K('klubki'))/2.2),ni=ease((lt-K('niti'))/2.6),sh=ease((lt-K('niti')-0.6)/2.6);
    const r1=ease((lt-K('raz'))/1.3),r2=ease((lt-K('dva'))/1.3),tr=K('tri'),ry=ease((lt-K('ryab'))/2.2),ot=ease((lt-K('otvern'))/2.4);
    const z=lerp(1.0,1.1,ease(lt/14))+0.04*ry;
    c.save();zoomAt(c,520,640,z);c.translate(-160*ot,0);c.rotate(-0.025*ot);
    grad(c,'#253c43','#20343a','#172529');
    glow(c,180,1200,1000,'235,175,105',0.26*flick(t));glow(c,520,640,700,'190,205,195',0.06);
    // обои: редкие вертикальные полосы
    c.strokeStyle='rgba(180,210,205,0.05)';c.lineWidth=18;for(let x=-200;x<1300;x+=90){c.beginPath();c.moveTo(x,-300);c.lineTo(x,1150);c.stroke();}
    const st=i=>i===4?r1:i===5?r2:ease((lt-tr-Math.abs(i-4.5)*0.12)/1.6);
    hatShadow(c,520,1110,1.2,{a:sh,st,rip:7*ry,t:lt,blur:3});
    // плинтус и пол
    c.fillStyle='#120e0a';c.fillRect(-300,1150,W+600,900);c.fillStyle='rgba(255,210,150,0.12)';c.fillRect(-300,1150,W+600,5);
    c.fillStyle='#2b2016';c.fillRect(-300,1135,W+600,18);
    // корзинка и клубки; нити тянутся к своим полосам
    c.fillStyle='#3a2a18';c.beginPath();c.moveTo(70,1060);c.lineTo(330,1060);c.lineTo(305,1185);c.lineTo(95,1185);c.closePath();c.fill();
    c.strokeStyle='rgba(20,12,6,0.6)';c.lineWidth=4;for(let i=0;i<6;i++){c.beginPath();c.moveTo(80+i*45,1062);c.lineTo(100+i*40,1183);c.stroke();}
    const rx=lerp(170,330,kl),gx=lerp(250,800,kl),ry_=lerp(1060,1150,kl);
    thread(c,[[rx+20,ry_-20],[470,1000],[380,880],[520,1110-1.2*(446-4*48-15)]],ni,RED);
    thread(c,[[gx-20,ry_-20],[760,980],[660,900],[560,1110-1.2*(446-5*48-15)]],ni,GRN);
    yarn(c,rx,ry_-40,58,[160,40,36],lt*0.3*(1-kl*0)+kl*3);
    yarn(c,gx,ry_-40,58,[40,112,64],-kl*6);
    c.restore();
    fog(c,t,950,1250,0.05,'160,150,130');vignD(c,0.62+0.12*ot);
  },
  son(c,t,lt){
    // спальня: спящий под одеялом, часы на стене; тень в шляпе входит справа и растёт над кроватью
    const ph=ease((lt-K('prihodit'))/3.0),pr=ease((lt-K('prosn'))/2.0);
    c.save();zoomAt(c,540,760,1.02+0.012*lt);
    grad(c,'#223840','#1e3238','#152328');
    glow(c,900,980,900,'235,180,110',0.22*flick(t));
    wallClock(c,230,330,78,t);
    hatShadow(c,lerp(1250,660,ph),1250,lerp(1.0,1.35,ph),{a:0.95,st:()=>1,rip:3,t:lt,blur:4});
    // кровать
    c.fillStyle='#120c08';c.fillRect(120,720,60,420);ell(c,150,720,40,26);c.fill();
    c.fillStyle='#24303a';c.fillRect(170,975,860,70);
    c.fillStyle='#8e938a';ell(c,280,930,110,46);c.fill();
    c.fillStyle='#0c0f12';ell(c,330,905,58,52);c.fill();c.strokeStyle='rgba(255,215,160,0.25)';c.lineWidth=3;c.beginPath();c.arc(330,905,56,-2.4,-0.6);c.stroke();
    const br=Math.sin(lt*1.4)*6;
    const bl=c.createLinearGradient(0,840,0,1040);bl.addColorStop(0,'#4b5d63');bl.addColorStop(1,'#2a383e');c.fillStyle=bl;
    c.beginPath();c.moveTo(360,1040);c.bezierCurveTo(360,940,420,890-br,560,880-br);c.bezierCurveTo(720,870-br,860,900,920,960);c.lineTo(1040,975);c.lineTo(1040,1045);c.closePath();c.fill();
    c.strokeStyle='rgba(255,215,160,0.18)';c.lineWidth=4;c.beginPath();c.moveTo(380,960);c.bezierCurveTo(420,890-br,560,880-br,720,875-br);c.stroke();
    c.fillStyle='#0e0a07';c.fillRect(170,1045,860,40);c.fillRect(980,1040,40,140);
    c.fillStyle='#120e0a';c.fillRect(-300,1150,W+600,900);
    c.restore();
    // сон: комната медленно плывёт (без вспышек)
    if(pr>0){c.save();c.globalAlpha=0.18*pr;c.drawImage(c.canvas,Math.sin(lt*0.8)*10,4);c.restore();}
    fog(c,t,600,1200,0.05+0.05*pr);vignD(c,0.64+0.08*pr);
  },
  perchatka(c,t,lt){
    // крупно: стена над подушкой. Четыре — тик. Рука-силуэт (без лезвий) проплывает по стене. Пять — маятник замирает. Ночник тускнеет.
    const pc=K('perch'),py=K('pyat'),ob=ease((lt-K('oborval'))/2.2);
    const hp=ease((lt-pc)/2.4);
    c.save();zoomAt(c,520,700,1.04+0.01*lt);
    grad(c,'#223840','#1e3238','#152328');
    glow(c,860,1000,900,'235,180,110',0.24*flick(t)*(1-0.45*ob));
    wallClock(c,270,420,105,lt+3.3,py+3.3);
    hatShadow(c,1110,1400,1.6,{a:1-0.7*ob,st:()=>1,rip:3*(1-ob),t:Math.min(lt,py),blur:4});
    // «мелькнула»: рука медленно выходит справа к подушке и уходит обратно (без лезвий)
    if(hp>0&&hp<1){const sp=Math.sin(Math.PI*hp);handSil(c,1260-880*sp,700-90*sp,1.0,-0.1*sp);}
    // подушка и голова спящего
    c.fillStyle='#8e938a';ell(c,420,1080,190,70);c.fill();c.fillStyle='#0c0f12';ell(c,500,1040,92,82);c.fill();c.strokeStyle='rgba(255,215,160,0.25)';c.lineWidth=4;c.beginPath();c.arc(500,1040,90,-2.4,-0.6);c.stroke();
    c.fillStyle='#4b5d63';c.fillRect(640,1060,600,200);
    c.fillStyle='#120c08';c.fillRect(60,780,70,500);
    c.restore();
    c.fillStyle=`rgba(2,6,8,${0.18*ob})`;c.fillRect(0,0,W,H);
    vignD(c,0.64+0.06*ob);
  },
  zhurnal(c,t,lt){
    // стол под лампой: старый журнал. Два кружка цвета рядом. Справа вырванная страница: «статью так и не нашли»
    const cv=ease((lt-K('cveta'))/1.6),nt=ease((lt-K('net'))/2.4);
    c.save();zoomAt(c,lerp(470,640,nt),720,1.04+0.012*lt+0.1*nt);
    grad(c,'#1c2c30','#1a2a2d','#121c1f');
    glow(c,520,520,900,'250,205,140',0.28);
    c.fillStyle='#2a1e14';c.fillRect(-300,820,W+600,900);
    // журнал раскрыт
    c.save();c.translate(540,720);c.rotate(-0.05);
    c.fillStyle='rgba(0,0,0,0.35)';c.fillRect(-430,-300,880,620);
    c.fillStyle='#cfc6ad';c.fillRect(-440,-320,430,600);
    c.fillStyle='rgba(60,50,40,0.5)';c.fillRect(-400,-280,300,26);
    for(let i=0;i<5;i++){c.fillRect(-400,-220+i*26,lerp(250,350,(i*37%10)/10),8);}
    // два цветных кружка рядом
    const ca=0.75+0.25*cv;c.fillStyle=`rgba(${RED},${ca})`;ell(c,-300,40,62,62);c.fill();c.fillStyle=`rgba(${GRN},${ca})`;ell(c,-160,40,62,62);c.fill();
    if(cv>0){glow(c,-230,40,200,'255,230,190',0.12*cv);}
    for(let i=0;i<4;i++){c.fillStyle='rgba(60,50,40,0.45)';c.fillRect(-400,150+i*26,lerp(200,340,(i*53%10)/10),8);}
    // правая страница вырвана: остался зубчатый корешок
    c.fillStyle='#c7bea4';c.beginPath();c.moveTo(-10,-320);for(let i=0;i<=24;i++){c.lineTo(10+((i*7)%3)*9+(i%2)*12,-320+i*25);}c.lineTo(-10,280);c.closePath();c.fill();
    c.strokeStyle='rgba(60,50,40,0.6)';c.lineWidth=3;c.beginPath();c.moveTo(-10,-320);c.lineTo(-10,280);c.stroke();
    // пустое место, где была статья
    c.fillStyle=`rgba(20,16,12,${0.25+0.25*nt})`;c.fillRect(30,-310,400,590);
    c.strokeStyle=`rgba(207,198,173,${0.12+0.2*nt})`;c.setLineDash([14,12]);c.lineWidth=3;c.strokeRect(40,-300,380,570);c.setLineDash([]);
    c.restore();
    c.restore();
    vignD(c,0.66);
  },
  okno(c,t,lt){
    // A: детская, маленький Уэс у окна; его тень на стене вырастает и надевает шляпу. B: вид вниз — фонарь, незнакомец; поднимает голову; кадр замирает
    const vz=K('vniz'),gv=K('golovu');const sw=ease((lt-vz)/1.4);
    const fr=gv+2.4;const tf=Math.min(lt,fr);const tg=Math.min(t,t-lt+fr);// замороженное время
    if(sw<1){const tn=ease((lt-K('ten'))/2.8),vr=ease((lt-K('vyros'))/3);
      c.save();zoomAt(c,540,640,1.02+0.02*lt);
      grad(c,'#243a42','#1f3339','#162629');
      glow(c,200,1150,900,'235,180,110',0.24*flick(t));
      windowIn(c,330,260,420,560,t,{});
      // тень мальчика на правой стене: растёт и становится фигурой в шляпе
      c.save();c.globalAlpha=0.9*(1-tn);c.filter='blur(3px)';
      boyBack(c,820,1130,lerp(1.0,1.2,vr),'rgba(5,9,11,0.85)');c.filter='none';c.restore();
      if(tn>0){c.save();c.globalAlpha=tn;hatShadow(c,820,1110,lerp(0.5,0.9,tn),{blur:4});c.restore();}
      boyBack(c,540,1130,0.95);
      c.fillStyle='#120e0a';c.fillRect(-300,1135,W+600,900);
      c.restore();vignD(c,0.64);}
    if(sw>0){c.save();c.globalAlpha=sw;
      const nz=ease((lt-K('neznak'))/3);const z=1.0+0.04*ease((tf-vz)/8)+0.1*nz;
      c.save();zoomAt(c,540,820,z);
      // та сторона улицы: газон, дома (тёмные), тротуар в свете фонаря, дорога ближе к нам
      grad(c,'#15242a','#172529','#101a1d');
      c.fillStyle='#0a1418';c.beginPath();c.moveTo(-200,560);for(const [xx,yy] of [[-200,420],[60,420],[60,340],[180,290],[300,340],[300,420],[620,420],[620,360],[700,320],[780,360],[780,440],[1300,440],[1300,560]])c.lineTo(xx,yy);c.closePath();c.fill();
      c.fillStyle='rgba(255,200,110,0.25)';c.fillRect(150,360,30,36);
      c.fillStyle='#1a2a2c';c.fillRect(-200,560,1500,240);
      c.fillStyle='#2a3536';c.fillRect(-200,800,1500,280);
      c.strokeStyle='rgba(160,175,170,0.14)';c.lineWidth=4;for(let i=0;i<9;i++){c.beginPath();c.moveTo(-100+i*170,800);c.lineTo(-160+i*175,1080);c.stroke();}
      c.fillStyle='#3a4645';c.fillRect(-200,1080,1500,22);c.fillStyle='#121a1c';c.fillRect(-200,1102,1500,H);
      // лужа света
      c.save();c.translate(600,960);c.scale(1,0.42);glow(c,0,0,560,'255,214,140',0.5*flick(tg,0.5));glow(c,0,0,240,'255,228,175',0.3);c.restore();
      // фонарь
      c.strokeStyle='#05090b';c.lineWidth=14;c.lineCap='round';c.beginPath();c.moveTo(740,1000);c.lineTo(740,420);c.quadraticCurveTo(740,385,700,388);c.stroke();
      c.fillStyle='#05090b';c.beginPath();c.moveTo(670,392);c.lineTo(722,392);c.lineTo(710,368);c.lineTo(682,368);c.closePath();c.fill();
      glow(c,696,398,190,'255,214,130',0.45*flick(tg,0.5));glow(c,696,398,30,'255,236,190',0.9);
      c.fillStyle='rgba(255,214,130,0.07)';c.beginPath();c.moveTo(680,400);c.lineTo(712,400);c.lineTo(900,1000);c.lineTo(400,1000);c.closePath();c.fill();
      manStand(c,560,990,0.78,ease((lt-gv)/2.2));
      c.restore();
      fog(c,tg,500,1100,0.05);
      // рама окна: смотрим из комнаты
      c.fillStyle='rgba(8,13,15,0.94)';c.fillRect(0,0,60,H);c.fillRect(W-60,0,60,H);c.fillRect(0,0,W,70);c.fillRect(0,1150,W,40);
      vignD(c,0.62);c.restore();}
  },
  shtora(c,t,lt){
    // комната слушателя: тёмное окно → шторы задёргиваются → щёлочка между краями; в ней на миг гаснет дальний фонарь
    const zd=ease((lt-K('zadern'))/1.8),sc=ease((lt-K('shchel'))/2.6);
    c.save();zoomAt(c,490,640,1.02+0.02*lt+0.25*sc);
    grad(c,'#203339','#1c2e33','#142024');
    glow(c,150,1150,900,'235,180,110',0.2*flick(t));
    windowIn(c,260,280,460,620,t,{block:sc});
    curtains(c,240,740,270,1060,t,zd,1);
    c.fillStyle='#120e0a';c.fillRect(-300,1140,W+600,900);
    c.restore();vignD(c,0.66+0.06*sc);
  },
  goodnight(c,t,lt){
    sky(c,t,0);c.fillStyle='rgba(2,14,18,0.5)';c.fillRect(0,0,W,H);
    const dim=ease((lt-K('dim'))/2);
    c.save();const z=1.12-lt*0.006;zoomAt(c,W/2,H/2,z);
    const SL=K('sleep');const sl=ease((lt-SL)/2.5);
    moon(c,540,700,t);owl(c,540,760,1.15,t,clamp(blink(t,0)+sl,0,1),true,{talk:talk(t),sleepy:sl});
    c.restore();
    if(sl>0){c.save();c.font='700 64px C';c.fillStyle='#b8c4cc';for(let i=0;i<3;i++){const p=((t*0.35+i/3)%1);c.globalAlpha=sl*Math.sin(p*Math.PI)*0.6;c.fillText('z',640+p*120+Math.sin(p*9)*15,560-p*260);}c.restore();}
    glow(c,800,1100,420,'110,150,165',0.14);
    // последняя мурашка: под фонарём медленно проступает силуэт в шляпе (без звука, без вспышки)
    street(c,t,{win:0.8,fig:ease((lt-SL-2.2)/2.6)});
    fog(c,t,1060,1260,0.15);
    c.fillStyle=`rgba(0,6,10,${0.12*dim})`;c.fillRect(0,0,W,H);vignD(c,0.66);
  }
};
