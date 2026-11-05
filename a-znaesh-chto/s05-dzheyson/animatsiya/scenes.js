// Страшная арка s05: Джейсон («Пятница, 13-е»). Подключается после obshchee/core.js.
// Узнаём по символам жанра: общая хоккейная маска вратаря (своя форма: светлый овал, неровные точки-дырочки,
// без красных треугольников и без точного рисунка отверстий), лес, туман, озеро, летний лагерь, домики.
// Оружия нет. Палитра: холодные сине-зелёные, почти чёрный (не полный), тусклый жёлтый свет фонаря на крыльце.
// Читаемость на телефоне: тёмные силуэты всегда стоят на более светлом тумане/небе, контровой свет по краю.
const DEFK={glow:1.4,reel:0.8,nomask:4.0,cabins:2.29,hide:0.2,snap1:0.85,snap2:5.13,closer:7.18,stand:0.3,still:3.06,holes:0.8,look:3.14,back:0.8,light:1.1,chance:3.16,bag:4.36,test:8.78,fit:0.8,paint:2.48,mist:0.8,scouts:3.62,lookw:0.8,forestw:2.86,dim:0.8,sleep:1.2,crack:5.0,out:5.6};
const DEFKA={hide:11.42,back:30.3,still:22.66};
const K=n=>CFG.k&&CFG.k[n]!=null?CFG.k[n]:DEFK[n];
const KA=n=>CFG.ka&&CFG.ka[n]!=null?CFG.ka[n]:DEFKA[n];
// мини-совёнок прячется на жути (строки 4–7) и возвращается на строке 8
const _miniOwl=miniOwl;
miniOwl=function(c,t,a){const h=ease((t-KA('hide'))/1.0)*(1-ease((t-KA('back'))/1.4));_miniOwl(c,t,a*(1-0.88*h));};
// ---------- helpers ----------
let sd2=53;function r2(){sd2=(sd2*16807)%2147483647;return (sd2-1)/2147483646;}
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
// ель-силуэт: ярусы с рваным краем
function pine(c,x,y,h,col){const w=h*0.36;c.fillStyle=col;c.beginPath();c.moveTo(x,y-h);
  const n=6;for(let i=1;i<=n;i++){const yy=y-h+h*i/n*0.92,ww=w*(0.25+0.75*i/n);c.lineTo(x+ww,yy);c.lineTo(x+ww*0.55,yy-h*0.03);}
  c.lineTo(x+w*0.08,y-h*0.06);c.lineTo(x+w*0.08,y);c.lineTo(x-w*0.08,y);c.lineTo(x-w*0.08,y-h*0.06);
  for(let i=n;i>=1;i--){const yy=y-h+h*i/n*0.92,ww=w*(0.25+0.75*i/n);c.lineTo(x-ww*0.55,yy-h*0.03);c.lineTo(x-ww,yy);}
  c.closePath();c.fill();}
const TREES=[];{let s=19;const r=()=>{s=(s*16807)%2147483647;return (s-1)/2147483646;};for(let i=0;i<40;i++)TREES.push({x:r(),h:r(),d:r()});}
// полоса леса: силуэты елей по линии y
function treeline(c,y,hmin,hmax,col,off=0,dens=1){for(let i=0;i<TREES.length*dens;i++){const T=TREES[i%TREES.length];const x=((T.x+i*0.031+off)%1.2)*W*1.0-W*0.1;pine(c,x,y+T.d*20,lerp(hmin,hmax,T.h),col);}
  c.fillStyle=col;c.fillRect(-20,y+10,W+40,H);}
// ствол: x — центр, w — ширина внизу, rim — контровой свет справа/слева
function trunk(c,x,w,col,rim=0,side=1,y0=-50,y1=H+50){c.fillStyle=col;c.beginPath();c.moveTo(x-w*0.38,y0);c.lineTo(x+w*0.38,y0);c.lineTo(x+w*0.5,y1);c.lineTo(x-w*0.5,y1);c.closePath();c.fill();
  c.strokeStyle='rgba(0,0,0,0.25)';c.lineWidth=Math.max(2,w*0.04);for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(x+i*w*0.18,y0);c.lineTo(x+i*w*0.24,y1);c.stroke();}
  if(rim>0){c.strokeStyle=`rgba(150,185,190,${0.18*rim})`;c.lineWidth=Math.max(2,w*0.05);c.beginPath();c.moveTo(x+side*w*0.38,y0);c.lineTo(x+side*w*0.5,y1);c.stroke();}}
// домик лагеря: x — центр, y — земля, win — свет в окне, lamp — фонарь на крыльце
function cabin(c,x,y,s,o={}){c.save();c.translate(x,y);c.scale(s,s);const col=o.col||'#0a1419';
  c.fillStyle=col;c.fillRect(-120,-150,240,150);c.beginPath();c.moveTo(-145,-145);c.lineTo(0,-245);c.lineTo(145,-145);c.closePath();c.fill();
  c.fillRect(70,-235,22,60);// труба
  c.fillRect(-150,-8,300,8);// крыльцо
  if(o.edge){c.strokeStyle=`rgba(150,185,190,${0.16*o.edge})`;c.lineWidth=3;c.beginPath();c.moveTo(-145,-145);c.lineTo(0,-245);c.lineTo(145,-145);c.stroke();}
  // доски
  c.strokeStyle='rgba(0,0,0,0.25)';c.lineWidth=2;for(let yy=-140;yy<0;yy+=18){c.beginPath();c.moveTo(-120,yy);c.lineTo(120,yy);c.stroke();}
  const wv=o.win||0;c.fillStyle=wv>0?`rgba(255,200,110,${0.55*wv})`:'#05090c';c.fillRect(-90,-110,60,50);
  c.fillStyle='#05090c';c.fillRect(20,-120,48,120);
  c.strokeStyle='rgba(0,0,0,0.5)';c.lineWidth=4;c.beginPath();c.moveTo(-60,-110);c.lineTo(-60,-60);c.moveTo(-90,-85);c.lineTo(-30,-85);c.stroke();
  if(wv>0)glow(c,-60,-85,120,'255,200,110',0.18*wv);
  const lm=o.lamp||0;if(lm>0){glow(c,0,-135,160,'255,206,120',0.22*lm);glow(c,0,-135,14,'255,236,190',0.9*lm);c.save();c.scale(1,0.2);glow(c,0,-20,220,'255,206,120',0.25*lm);c.restore();}
  c.restore();}
// озеро с отражением
function lake(c,y0,y1,t,col1,col2,ref=0.25,rx=540){const g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,col1);g.addColorStop(1,col2);c.fillStyle=g;c.fillRect(0,y0,W,y1-y0);
  c.strokeStyle=`rgba(190,215,220,${ref})`;c.lineWidth=3;c.lineCap='round';
  for(let i=0;i<14;i++){const yy=y0+8+i*(y1-y0)/14,w=30+((i*53)%90)*(1-i/18),xx=rx+Math.sin(t*0.6+i)*12+((i*37)%40-20);c.globalAlpha=0.5+0.5*Math.sin(t*0.9+i*1.7);c.beginPath();c.moveTo(xx-w,yy);c.lineTo(xx+w,yy);c.stroke();}
  c.globalAlpha=1;}
// маска вратаря (общий предмет): светлый овал, широкий лоб, неровные дырочки, без красных треугольников.
// o.a — прозрачность, o.col — цвет, o.holes — глубина дырочек 0..1, o.marks — карандашные пометки, o.turn — поворот −1..1
function maskG(c,x,y,s,o={}){const col=o.col||[214,212,198],a=o.a==null?1:o.a,ho=o.holes==null?1:o.holes,tu=o.turn||0;
  c.save();c.translate(x,y);c.scale(s,s);c.globalAlpha*=a;
  const path=()=>{c.beginPath();c.moveTo(0,-175);c.bezierCurveTo(92,-175,128,-110,124,-20);c.bezierCurveTo(120,70,78,150,0,172);c.bezierCurveTo(-78,150,-120,70,-124,-20);c.bezierCurveTo(-128,-110,-92,-175,0,-175);c.closePath();};
  path();const g=c.createRadialGradient(-34+tu*30,-80,16,0,-10,210);g.addColorStop(0,`rgb(${col.map(v=>Math.min(255,v+24)).join(',')})`);g.addColorStop(0.6,`rgb(${col.join(',')})`);g.addColorStop(1,`rgb(${col.map(v=>Math.round(v*0.55)).join(',')})`);c.fillStyle=g;c.fill();
  c.save();path();c.clip();
  const sh=c.createLinearGradient(-120,0,140,40);sh.addColorStop(0,'rgba(20,40,50,0)');sh.addColorStop(1,'rgba(20,40,50,0.42)');c.fillStyle=sh;c.fillRect(-130,-180,260,360);
  // лёгкий рельеф: надбровье и скулы
  c.fillStyle='rgba(20,40,50,0.10)';ell(c,0+tu*8,-58,96,18);c.fill();
  c.fillStyle='rgba(255,255,255,0.07)';ell(c,-6+tu*10,40,10,46);c.fill();
  // карандашные пометки «подгонки» (сцена craft)
  if(o.marks>0){c.globalAlpha*=o.marks;c.strokeStyle='rgba(60,64,62,0.75)';c.lineWidth=3;c.setLineDash([10,9]);
    c.beginPath();c.moveTo(-110,-120);c.quadraticCurveTo(0,-150,110,-120);c.stroke();c.beginPath();c.moveTo(-104,60);c.quadraticCurveTo(-60,140,0,152);c.stroke();c.setLineDash([]);
    c.strokeStyle='rgba(70,80,84,0.6)';c.lineWidth=4;c.beginPath();c.moveTo(-40,-150);c.lineTo(-10,-120);c.moveTo(60,-140);c.lineTo(40,-112);c.stroke();c.globalAlpha/=o.marks;}
  c.restore();
  // дырочки: своё неровное расположение (не рисунок из фильма)
  const H_=[[-30,40,7],[28,46,7],[-6,74,6],[24,92,6],[-28,100,5],[2,118,6],[-58,70,5],[60,64,5],[-14,-118,5],[18,-104,5],[-70,4,5],[76,12,5]];
  for(const [hx,hy,hr] of H_){c.fillStyle=`rgba(4,8,10,${0.85*ho})`;ell(c,hx+tu*6,hy,hr,hr*1.1);c.fill();c.fillStyle=`rgba(255,255,255,${0.10*ho})`;ell(c,hx+tu*6+1,hy+hr*0.9,hr*0.8,1.6);c.fill();}
  // глазницы
  for(const ex of [-46,46]){const exx=ex+tu*10;const gg=c.createRadialGradient(exx,-26,2,exx,-26,34);gg.addColorStop(0,'#020506');gg.addColorStop(0.7,'#061014');gg.addColorStop(1,'rgba(6,16,20,0)');
    c.fillStyle=gg;c.beginPath();c.ellipse(exx,-26,34,20,ex<0?0.12:-0.12,0,Math.PI*2);c.fill();
    c.fillStyle='#020506';c.beginPath();c.ellipse(exx,-26,24*(0.8+0.2*ho),12*(0.8+0.2*ho),ex<0?0.12:-0.12,0,Math.PI*2);c.fill();}
  // ремешки по бокам
  if(o.straps!==false){c.strokeStyle='rgba(30,36,38,0.9)';c.lineWidth=8;c.beginPath();c.moveTo(-122,-60);c.lineTo(-150,-70);c.moveTo(122,-60);c.lineTo(150,-70);c.moveTo(-118,40);c.lineTo(-146,46);c.moveTo(118,40);c.lineTo(146,46);c.stroke();}
  c.restore();}
// фигура: крупный, чуть сутулый силуэт в рабочей куртке, руки опущены, без оружия. y — ступни, рост ~900*s
function bigFig(c,x,y,s,o={}){const a=o.a==null?1:o.a,col=o.col||'#070d10';c.save();c.translate(x,y);c.scale(s,s);c.globalAlpha*=a;
  c.fillStyle=col;c.beginPath();
  c.moveTo(-70,0);c.lineTo(-84,-400);c.lineTo(-118,-430);c.quadraticCurveTo(-150,-600,-140,-720);c.quadraticCurveTo(-110,-768,-44,-776);c.lineTo(44,-776);c.quadraticCurveTo(110,-768,140,-720);c.quadraticCurveTo(150,-600,118,-430);c.lineTo(84,-400);c.lineTo(70,0);c.lineTo(14,0);c.lineTo(0,-360);c.lineTo(-14,0);c.closePath();c.fill();
  // руки висят
  c.beginPath();c.moveTo(-140,-720);c.quadraticCurveTo(-176,-560,-160,-340);c.lineTo(-124,-336);c.quadraticCurveTo(-130,-540,-112,-660);c.fill();
  c.beginPath();c.moveTo(140,-720);c.quadraticCurveTo(176,-560,160,-340);c.lineTo(124,-336);c.quadraticCurveTo(130,-540,112,-660);c.fill();
  // контровой свет по плечам
  if(o.rim){c.strokeStyle=`rgba(160,195,200,${0.35*o.rim})`;c.lineWidth=5;c.beginPath();c.moveTo(-160,-340);c.quadraticCurveTo(-176,-560,-140,-720);c.quadraticCurveTo(-110,-768,-44,-776);c.stroke();
    c.beginPath();c.moveTo(44,-776);c.quadraticCurveTo(110,-768,140,-720);c.quadraticCurveTo(176,-560,160,-340);c.stroke();}
  c.fillRect(-34,-810,68,44);
  c.translate(0,-800+(o.dy||0));c.rotate(o.tilt||0);
  c.fillStyle=col;ell(c,0,-70,78,96);c.fill();
  if(o.rim){c.strokeStyle=`rgba(160,195,200,${0.3*o.rim})`;c.lineWidth=5;c.beginPath();c.ellipse(0,-70,78,96,0,Math.PI*1.05,Math.PI*1.95);c.stroke();}
  if((o.face||0)>0)maskG(c,0+(o.turn||0)*8,-64,0.5,{a:o.face,col:o.mcol||[200,200,188],holes:o.holes==null?1:o.holes,turn:o.turn||0});
  c.restore();}
const SC={
  sky(c,t,lt){
    sky(c,t,0);c.fillStyle='rgba(2,14,18,0.5)';c.fillRect(0,0,W,H);
    const z=1+lt*0.006;c.save();zoomAt(c,W/2,H/2,z);
    const ent=ease(lt/1.6);moon(c,540,700,t);owl(c,540,760+(1-ent)*500,1.15*(0.6+0.4*ent),t,blink(t,0),false,{talk:talk(t)});c.restore();
    fog(c,t,1000,1160,0.14);
    treeline(c,1120,120,230,'#050b0e',0.05);
    cabin(c,770,1180,0.42,{col:'#060c0f',win:ease((lt-K('glow'))/1.5)});
    fog(c,t,1120,1260,0.12);vignD(c,0.7);
  },
  film(c,t,lt){
    grad(c,'#070b0d','#080d0f','#060809');
    const fl=1+0.03*Math.sin(t*19)+0.02*Math.sin(t*7.3);
    // перфорация плёнки по бокам
    c.fillStyle='#101618';c.fillRect(70,160,940,1060);
    c.fillStyle='#05080a';for(let y=180-((lt*90)%70);y<1220;y+=70){if(y<165)continue;c.beginPath();c.roundRect(88,y,40,34,6);c.fill();c.beginPath();c.roundRect(952,y,40,34,6);c.fill();}
    // кадр: озеро на рассвете, лодка, никого
    const fx=160,fy=300,fw=760,fh=800;c.save();c.beginPath();c.rect(fx,fy,fw,fh);c.clip();
    {const g=c.createLinearGradient(0,fy,0,fy+fh);g.addColorStop(0,'#3a4f55');g.addColorStop(0.45,'#5d6f6c');g.addColorStop(0.5,'#4b5f62');g.addColorStop(1,'#26363b');c.fillStyle=g;c.fillRect(fx,fy,fw,fh);}
    glow(c,700,640,260,'230,215,170',0.25);
    treeline(c,660,90,170,'#1d2b2f',0.3,0.8);
    lake(c,690,fy+fh,t,'#46585b','#22323a',0.22,700);
    // лодка
    c.fillStyle='#1a2629';c.beginPath();c.moveTo(380,850);c.lineTo(560,850);c.quadraticCurveTo(540,880,500,884);c.lineTo(430,884);c.quadraticCurveTo(395,880,380,850);c.fill();
    fog(c,t,640,820,0.18,'200,210,205');
    // «маски нет»: пунктирный контур проступает и тает
    const na=ease((lt-K('nomask'))/0.9)*(1-ease((lt-K('nomask')-1.6)/1.6));
    if(na>0){c.save();c.globalAlpha=na*0.8;c.strokeStyle='#e6e2d2';c.lineWidth=5;c.setLineDash([16,14]);c.lineDashOffset=-t*8;
      c.beginPath();c.moveTo(540,420);c.bezierCurveTo(600,420,622,460,620,520);c.bezierCurveTo(618,580,590,630,540,644);c.bezierCurveTo(490,630,462,580,460,520);c.bezierCurveTo(458,460,480,420,540,420);c.stroke();c.setLineDash([]);c.restore();}
    c.fillStyle=`rgba(0,0,0,${0.15+0.6*(fl-1)})`;c.fillRect(fx,fy,fw,fh);
    // царапины
    c.strokeStyle='rgba(220,220,210,0.10)';c.lineWidth=2;for(let i=0;i<3;i++){const xx=fx+((Math.floor(t*6)*137+i*251)%fw);c.beginPath();c.moveTo(xx,fy);c.lineTo(xx+6,fy+fh);c.stroke();}
    c.restore();
    c.font='700 40px C';c.fillStyle=`rgba(200,196,180,${0.55*ease((lt-K('reel'))/1)})`;c.textAlign='left';c.fillText('1980 · фильм 1',fx,fy-30);
    vignD(c,0.85);
  },
  camp(c,t,lt){
    const pan=lerp(40,-40,ease(lt/6));c.save();c.translate(pan,0);
    grad(c,'#10232c','#172e36','#0a1519');
    starsOnly(c,t,0.25);
    glow(c,300,420,300,'200,215,215',0.06);
    fog(c,t,860,1000,0.2);
    treeline(c,900,200,360,'#0b1a20',0.6);
    // озеро между деревьями слева
    lake(c,1000,1090,t,'#1c3138','#10202a',0.2,250);
    fog(c,t,940,1080,0.16);
    const lm=ease((lt-0.3)/1.5)*(0.85+0.1*Math.sin(t*1.3)+0.05*Math.sin(t*4.1));
    cabin(c,360,1110,0.62,{col:'#071014',edge:1});
    cabin(c,640,1130,0.75,{col:'#060d11',edge:1,lamp:lm});
    cabin(c,930,1120,0.6,{col:'#071014',edge:1});
    c.fillStyle='#060c0f';c.fillRect(-60,1120,W+120,H);
    fog(c,t,1080,1220,0.12);
    c.restore();vignD(c,0.8);
  },
  forest(c,t,lt){
    grad(c,'#10222a','#122830','#0a1418');
    // лунные полосы
    c.save();c.globalCompositeOperation='screen';for(const [x0,w] of [[260,90],[520,60],[760,110]]){const g=c.createLinearGradient(x0,0,x0-260,1200);g.addColorStop(0,'rgba(160,190,195,0.12)');g.addColorStop(1,'rgba(160,190,195,0)');c.fillStyle=g;c.beginPath();c.moveTo(x0,0);c.lineTo(x0+w,0);c.lineTo(x0+w-300,1250);c.lineTo(x0-300,1250);c.closePath();c.fill();}c.restore();
    fog(c,t,600,1000,0.18);
    // дальние стволы светлее, ближние темнее
    for(const [x,w,cl] of [[120,40,'#1a3138'],[330,30,'#1a3138'],[620,34,'#1a3138'],[880,44,'#1a3138']])trunk(c,x,w,cl);
    for(const [x,w,cl] of [[60,90,'#0d1b20'],[470,70,'#0d1b20'],[990,100,'#0d1b20']])trunk(c,x,w,cl,1,1);
    // земля: листва, мох
    {const g=c.createLinearGradient(0,1000,0,1300);g.addColorStop(0,'#13241f');g.addColorStop(1,'#0a1512');c.fillStyle=g;c.beginPath();c.moveTo(0,1040);c.quadraticCurveTo(540,990,W,1050);c.lineTo(W,H);c.lineTo(0,H);c.fill();}
    c.fillStyle='rgba(120,140,120,0.10)';for(let i=0;i<70;i++){const x=(i*157)%W,y=1030+((i*71)%220);ell(c,x,y,8+(i%4)*3,3,(i%5)*0.6);c.fill();}
    // ветка 1 (дальше), ветка 2 (ближе и крупнее)
    const twig=(x,y,L,k,s)=>{const p=ease((lt-k)/0.35);c.save();c.translate(x,y);c.scale(s,s);c.strokeStyle='#bfb8a2';c.lineCap='round';c.lineWidth=9;
      c.save();c.rotate(-0.04-0.32*p);c.beginPath();c.moveTo(0,0);c.lineTo(-L,0);c.stroke();c.lineWidth=5;c.beginPath();c.moveTo(-L*0.6,0);c.lineTo(-L*0.75,-26);c.stroke();c.restore();
      c.save();c.rotate(0.04+0.3*p);c.beginPath();c.moveTo(0,0);c.lineTo(L,0);c.stroke();c.restore();
      if(p>0){const q=ease((lt-k)/1.6);for(let i=0;i<10;i++){c.fillStyle=`rgba(200,200,180,${0.35*(1-q)})`;ell(c,(i-5)*7,-q*40-(i%3)*8,3,3);c.fill();}}
      c.restore();};
    twig(380,1085,70,K('snap1'),0.8);
    twig(700,1170,90,K('snap2'),1.15);
    // «уже ближе»: туман у земли чуть сгущается, свет в полосах тускнеет
    const cl=ease((lt-K('closer'))/2);
    fog(c,t,1000,1200,0.12+0.08*cl);
    c.fillStyle=`rgba(3,8,10,${0.15*cl})`;c.fillRect(0,0,W,H);
    vignD(c,0.8);
  },
  trunks(c,t,lt){
    // время замирает после «И не двигается»: туман и всё остальное останавливаются
    const st=K('still'),tf=lt<st?t:t-(lt-st)*0.97;
    grad(c,'#132830','#1a3239','#0b161a');
    // светлый туман позади фигуры — чтобы силуэт читался
    glow(c,560,820,520,'150,180,185',0.30);
    fog(c,tf,600,1050,0.22);
    for(const [x,w] of [[200,34],[380,26],[760,30],[900,40]])trunk(c,x,w,'#1c343b');
    // фигура далеко между стволами
    const ap=ease((lt-K('stand'))/2.6);
    bigFig(c,560,1040,0.36,{a:ap*0.95,face:ap,rim:ap,col:'#081014',mcol:[210,208,194]});
    fog(c,tf,900,1100,0.16);
    // ближние стволы-кулисы
    trunk(c,90,170,'#060d10',0.8,1);trunk(c,1000,190,'#060d10',0.8,-1);
    {const g=c.createLinearGradient(0,1040,0,1300);g.addColorStop(0,'#0f1d1c');g.addColorStop(1,'#08110f');c.fillStyle=g;c.fillRect(0,1040,W,H);}
    fog(c,tf,1000,1200,0.12);
    vignD(c,0.8);
  },
  near(c,t,lt){
    // ближе — только сменой кадра, без наезда
    grad(c,'#122630','#183038','#0a1418');
    glow(c,560,640,560,'150,180,185',0.30);
    fog(c,t,350,900,0.2);
    for(const [x,w] of [[150,40],[930,46]])trunk(c,x,w,'#1c343b');
    const ho=lerp(0.55,1,ease((lt-K('holes'))/1.6)),tu=lerp(0.6,0,ease((lt-K('look'))/2.2));
    bigFig(c,560,1700,1.0,{face:1,rim:1,col:'#070e11',mcol:[206,204,190],holes:ho,turn:tu,tilt:-0.03*tu});
    // глаза в тени: едва заметная влажная искра, когда «смотрят сюда»
    const lk=ease((lt-K('look'))/2.2);if(lk>0){for(const ex of [-23,23])glow(c,560+ex,900-64*0.5*0+(-800-64)+1700-26*0.5+ (0),6,'200,215,215',0.0);}
    fog(c,t,1000,1250,0.14);
    trunk(c,40,200,'#050b0e',0.7,1);trunk(c,1060,220,'#050b0e',0.7,-1);
    vignD(c,0.85);
  },
  set(c,t,lt){
    const z=1.02+lt*0.003;c.save();zoomAt(c,540,700,z);
    grad(c,'#0e1a1e','#111e22','#0a1215');
    const on=ease((lt-K('light'))/1.4),tst=K('test'),pulse=1-0.45*ease((lt-tst)/0.8)*(1-ease((lt-tst-1.1)/1.0));
    const L=on*pulse;
    // прожектор на стойке слева
    c.strokeStyle='#05090b';c.lineWidth=10;c.lineCap='round';c.beginPath();c.moveTo(160,1150);c.lineTo(200,560);c.moveTo(200,1150);c.lineTo(200,560);c.moveTo(240,1150);c.lineTo(200,560);c.stroke();
    c.save();c.translate(210,500);c.rotate(0.45);c.fillStyle='#0a1013';c.beginPath();c.roundRect(-70,-60,150,120,16);c.fill();c.fillStyle=`rgba(255,226,160,${0.15+0.8*L})`;ell(c,80,0,14,52);c.fill();c.restore();
    // конус света на подставку с маской
    c.save();c.globalCompositeOperation='screen';c.fillStyle=`rgba(255,214,140,${0.10*L})`;c.beginPath();c.moveTo(280,470);c.lineTo(300,560);c.lineTo(860,1050);c.lineTo(420,1100);c.closePath();c.fill();c.restore();
    glow(c,610,760,380,'255,214,140',0.16*L);
    // пол
    c.fillStyle='#0b1316';c.fillRect(0,1100,W,H);c.fillStyle=`rgba(255,214,140,${0.05*L})`;c.fillRect(0,1100,W,4);
    // камера на штативе справа
    c.strokeStyle='#05090b';c.lineWidth=8;c.beginPath();c.moveTo(900,1150);c.lineTo(940,820);c.moveTo(980,1150);c.lineTo(940,820);c.moveTo(940,1150);c.lineTo(940,820);c.stroke();
    c.fillStyle='#070c0e';c.beginPath();c.roundRect(860,700,190,120,12);c.fill();ell(c,890,690,44,44);c.fill();ell(c,990,690,44,44);c.fill();c.fillRect(800,740,70,40);
    // хлопушка «3»
    c.save();c.translate(230,1135);c.rotate(-0.08);c.fillStyle='#14191b';c.fillRect(0,-90,190,90);c.fillStyle='#262c2e';c.fillRect(0,-118,190,24);
    c.fillStyle='#c8c4b4';for(let i=0;i<5;i++){c.beginPath();c.moveTo(10+i*38,-118);c.lineTo(28+i*38,-118);c.lineTo(18+i*38,-94);c.lineTo(0+i*38,-94);c.closePath();c.fill();}
    c.font='700 54px C';c.fillStyle='#d8d4c4';c.fillText('3',80,-24);c.restore();
    // спортивная сумка на полу
    c.fillStyle='#10181b';c.beginPath();c.roundRect(470,1010,330,120,50);c.fill();c.strokeStyle='#1d282b';c.lineWidth=6;c.beginPath();c.moveTo(500,1040);c.quadraticCurveTo(635,940,770,1040);c.stroke();
    c.strokeStyle='rgba(255,214,140,0.10)';c.lineWidth=3;c.beginPath();c.moveTo(480,1060);c.lineTo(790,1060);c.stroke();
    // подставка-голова
    c.fillStyle='#0d1214';c.fillRect(585,840,50,170);ell(c,610,700,118,160);c.fill();
    // маска поднимается из сумки на подставку
    const bp=ease((lt-K('bag'))/2.6),my=lerp(1040,700,bp),ms=lerp(0.55,0.86,bp),ma=ease((lt-K('bag'))/0.8);
    if(ma>0){c.save();if(bp<0.4){c.beginPath();c.rect(0,0,W,1030);c.clip();}
      const lit=0.55+0.45*L;maskG(c,610,my,ms,{a:ma,col:[Math.round(210*lit),Math.round(206*lit),Math.round(190*lit)],holes:1});c.restore();}
    c.restore();
    fog(c,t,1000,1300,0.06);vignD(c,0.8);
  },
  craft(c,t,lt){
    const z=1.02+lt*0.004;c.save();zoomAt(c,540,700,z);
    grad(c,'#0e191c','#101c1f','#0a1214');
    // лампа
    c.strokeStyle='#05090b';c.lineWidth=12;c.lineCap='round';c.beginPath();c.moveTo(900,1000);c.lineTo(860,560);c.lineTo(720,390);c.stroke();
    c.fillStyle='#05090b';c.beginPath();c.moveTo(760,340);c.lineTo(650,410);c.lineTo(690,470);c.lineTo(800,400);c.closePath();c.fill();
    c.fillStyle='rgba(255,214,130,0.07)';c.beginPath();c.moveTo(690,440);c.lineTo(720,440);c.lineTo(900,1000);c.lineTo(160,1000);c.closePath();c.fill();
    glow(c,540,780,520,'255,214,130',0.13);glow(c,700,450,60,'255,236,190',0.7);
    // верстак
    c.fillStyle='#140f0b';c.fillRect(0,1000,W,260);c.fillStyle='rgba(255,214,130,0.08)';c.fillRect(0,1000,W,5);
    // подставка
    c.fillStyle='#0d1112';c.fillRect(515,880,50,125);c.fillRect(440,990,200,16);ell(c,540,700,126,172);c.fill();
    // маску подгоняют: контур пунктиром растёт, маска чуть увеличивается
    const fp=ease((lt-K('fit'))/2),pp=ease((lt-K('paint'))/2.4);
    const s=lerp(0.86,0.98,fp);
    if(fp>0&&fp<1||lt<K('paint')+1){c.save();c.globalAlpha=0.5*fp*(1-pp);c.strokeStyle='#cfc9b4';c.lineWidth=3;c.setLineDash([12,10]);c.beginPath();c.ellipse(540,700,130,182,0,0,Math.PI*2);c.stroke();c.setLineDash([]);c.restore();}
    maskG(c,540,700,s,{col:[214,210,194],holes:1,marks:pp});
    // кисточка и банка
    c.save();c.translate(lerp(820,700,pp)-30*Math.sin(t*2)*pp,lerp(930,780,pp));c.rotate(-0.7);c.fillStyle='#2a2018';c.fillRect(-6,0,12,140);c.fillStyle='#4a4a46';c.fillRect(-9,-28,18,30);c.fillStyle='#2b2e2c';c.beginPath();c.moveTo(-9,-28);c.lineTo(9,-28);c.lineTo(0,-52);c.closePath();c.fill();c.restore();
    c.fillStyle='#1a2124';c.beginPath();c.roundRect(170,900,110,100,10);c.fill();c.fillStyle='#3a3e3a';c.fillRect(170,900,110,16);
    // рулетка
    c.fillStyle='#22282a';ell(c,880,975,44,30);c.fill();c.strokeStyle='#8a8460';c.lineWidth=6;c.beginPath();c.moveTo(840,990);c.lineTo(640,996);c.stroke();
    c.restore();
    fog(c,t,1000,1300,0.06);vignD(c,0.8);
  },
  morning(c,t,lt){
    // выдох: утро, туман над озером, лагерь живой, но пока пустой
    const mi=ease((lt-K('mist'))/4);
    {const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#3a5560');g.addColorStop(0.42,'#7d8f8c');g.addColorStop(0.5,'#a49a80');g.addColorStop(1,'#26363b');c.fillStyle=g;c.fillRect(0,0,W,H);}
    glow(c,760,720,320,'240,215,160',0.35);
    treeline(c,760,140,260,'#2a3b3f',0.15);
    treeline(c,820,90,190,'#22323a',0.7);
    lake(c,860,1180,t,'#6e807e','#34474c',0.3,760);
    // причал и лодки
    c.fillStyle='#1d2a2d';c.fillRect(120,960,300,16);for(let i=0;i<5;i++)c.fillRect(140+i*64,960,10,60);
    for(const [x,y] of [[480,1010],[600,1050]]){c.fillStyle='#24312f';c.beginPath();c.moveTo(x,y);c.lineTo(x+150,y);c.quadraticCurveTo(x+130,y+26,x+100,y+28);c.lineTo(x+40,y+28);c.quadraticCurveTo(x+16,y+26,x,y);c.fill();}
    // домики и флагшток
    cabin(c,250,880,0.42,{col:'#25343a'});cabin(c,880,890,0.46,{col:'#22313a'});
    c.fillStyle='#1d2a2d';c.fillRect(640,620,6,260);
    // палатки скаутов проступают
    const sc=ease((lt-K('scouts'))/2);
    for(const [x,y,s] of [[380,1150,1],[560,1170,1.1],[760,1150,0.95]]){c.save();c.globalAlpha=sc;c.translate(x,y);c.scale(s,s);c.fillStyle='#3f5048';c.beginPath();c.moveTo(-70,0);c.lineTo(0,-80);c.lineTo(70,0);c.closePath();c.fill();c.fillStyle='#22302c';c.beginPath();c.moveTo(-14,0);c.lineTo(0,-40);c.lineTo(14,0);c.closePath();c.fill();c.restore();}
    c.fillStyle='#1c2a2a';c.fillRect(0,1190,W,H);
    fog(c,t,800,1100,0.34*(1-0.6*mi),'220,225,215');
    vignD(c,0.55);
  },
  window(c,t,lt){
    const z=lerp(0.94,1.04,ease(lt/6));c.save();zoomAt(c,540,690,z);
    {const g=c.createLinearGradient(0,-200,0,H);g.addColorStop(0,'#0a1519');g.addColorStop(0.55,'#0c181c');g.addColorStop(1,'#070e11');c.fillStyle=g;c.fillRect(-300,-300,W+600,H+600);}
    // за окном лес в тумане
    c.save();c.beginPath();c.rect(250,300,580,760);c.clip();
    grad(c,'#152a33','#1d363e','#10202a');starsOnly(c,t,0.15);
    glow(c,540,760,420,'150,180,185',0.22);
    fog(c,t,600,1000,0.2);
    for(const [x,w,cl] of [[300,26,'#1f3840'],[470,20,'#1f3840'],[640,24,'#1f3840'],[790,30,'#1f3840']])trunk(c,x,w,cl,0,1,300,1060);
    for(const [x,w] of [[380,46],[720,52]])trunk(c,x,w,'#0b171c',0.8,1,300,1060);
    const fw=ease((lt-K('forestw'))/3);fog(c,t,860,1060,0.12+0.1*fw);
    c.fillStyle='#0b1519';c.fillRect(250,1000,580,70);
    const rf=c.createLinearGradient(250,300,830,1060);rf.addColorStop(0,'rgba(160,190,200,0.06)');rf.addColorStop(0.45,'rgba(160,190,200,0)');rf.addColorStop(0.55,'rgba(160,190,200,0.04)');rf.addColorStop(1,'rgba(160,190,200,0)');c.fillStyle=rf;c.fillRect(250,300,580,760);
    c.restore();
    c.strokeStyle='#18232a';c.lineWidth=26;c.strokeRect(250,300,580,760);c.lineWidth=14;c.beginPath();c.moveTo(540,300);c.lineTo(540,1060);c.moveTo(250,640);c.lineTo(830,640);c.stroke();
    c.fillStyle='#1a2428';c.fillRect(220,1060,640,30);c.fillStyle='rgba(255,214,130,0.06)';c.fillRect(220,1060,640,4);
    // шторы
    for(const [x0,sd] of [[170,-1],[910,1]]){const sw=Math.sin(t*0.35+(sd>0?1:0))*10;c.fillStyle='#0d171b';c.beginPath();c.moveTo(x0-110,240);c.lineTo(x0+110,240);c.quadraticCurveTo(x0+70*-sd+sw,700,x0+40*-sd+sw*1.5,1180);c.lineTo(x0-120*-sd,1180);c.closePath();c.fill();
      c.strokeStyle='rgba(120,150,155,0.08)';c.lineWidth=3;for(let i=0;i<3;i++){c.beginPath();c.moveTo(x0-60+i*40,250);c.quadraticCurveTo(x0-60+i*40+sw,700,x0-60+i*40+sw*1.4,1170);c.stroke();}}
    // ночник на подоконнике
    glow(c,330,1040,140,'255,206,120',0.25);c.fillStyle='#2a2216';c.fillRect(312,1020,36,40);glow(c,330,1015,18,'255,236,190',0.8);
    c.restore();vignD(c,0.85);
  },
  goodnight(c,t,lt){
    sky(c,t,0);c.fillStyle='rgba(2,14,18,0.5)';c.fillRect(0,0,W,H);
    const dim=ease((lt-K('dim'))/2);
    c.save();const z=1.12-lt*0.006;zoomAt(c,W/2,H/2,z);
    const SL=K('sleep');const sl=ease((lt-SL)/2.5);
    moon(c,540,700,t);owl(c,540,760,1.15,t,clamp(blink(t,0)+sl,0,1),true,{talk:talk(t),sleepy:sl});
    c.restore();
    if(sl>0){c.save();c.font='700 64px C';c.fillStyle='#b8c4cc';for(let i=0;i<3;i++){const p=((t*0.35+i/3)%1);c.globalAlpha=sl*Math.sin(p*Math.PI)*0.6;c.fillText('z',640+p*120+Math.sin(p*9)*15,560-p*260);}c.restore();}
    fog(c,t,1000,1160,0.14);
    treeline(c,1120,120,230,'#050b0e',0.05);
    // фонарь на крыльце тихо гаснет после хруста ветки
    const out=ease((lt-K('out'))/1.6);
    cabin(c,770,1180,0.42,{col:'#060c0f',win:(0.85-0.3*dim)*(1-out)});
    fog(c,t,1120,1260,0.12);
    c.fillStyle=`rgba(0,6,10,${0.15*dim})`;c.fillRect(0,0,W,H);vignD(c,0.75);
  }
};
