// Страшная арка s10, финал: Садако («Звонок», Япония, 1998). Подключается после obshchee/core.js.
// Узнаём: фигура в белом, длинные чёрные волосы закрывают лицо, колодец в тумане, движение рывками «кадр-назад».
// Нельзя: телевизор и выход из экрана, кадры фильма, лицо. Фигура мягко размыта, лица нет — только завеса волос.
// Без крови, без оружия, без скримеров: рывки маленькие, яркость не скачет, смены кадров — мягкие (0,25 с).
// Палитра: холодные сине-зелёные, тусклый жёлтый фонарь/андон, туман, зерно. Фоны заметно светлее чёрного (телефон).
const DEFK={glow:1.4,sled:0.8,zhivyh:4.78,dzyn1:0.8,dzyn2:1.42,komnata:2.47,nikto:4.83,obryv:6.37,dvor:0.8,tuman:2.48,hide:4.46,
  r1:5.31,r2:6.16,r3:6.96,r4:7.71,r5:8.46,shag:8.86,plecho:10.89,syuda:12.17,back:0.8,zadom:4.28,plenka:5.88,nepr:7.56,zamok:0.8,
  kolodec2:5.98,schet:8.6,rewind:0.8,popyat:1.7,snova:4.3,dim:0.8,sleep:1.2,end:3.4};
const DEFKA={hide:19.35,back:29.11};
const K=n=>CFG.k&&CFG.k[n]!=null?CFG.k[n]:DEFK[n];
const KA=n=>CFG.ka&&CFG.ka[n]!=null?CFG.ka[n]:DEFKA[n];
// мини-совёнок прячется, когда она выбирается (стр. 6–7), и возвращается на строке 8
const _miniOwl=miniOwl;
miniOwl=function(c,t,a){const h=ease((t-KA('hide'))/1.0)*(1-ease((t-KA('back'))/1.4));_miniOwl(c,t,a*(1-0.88*h));};
// ---------- helpers ----------
let sd10=101;function r10(){sd10=(sd10*16807)%2147483647;return (sd10-1)/2147483646;}
const FOG=[];for(let i=0;i<34;i++)FOG.push({x:r10()*1.4-0.2,y:r10(),r:160+r10()*260,v:5+r10()*12,p:r10()*6.28});
function fog(c,t,y0,y1,a,col='130,160,165'){c.save();c.globalCompositeOperation='screen';
  for(const f of FOG){const x=((f.x*W+t*f.v)%(W*1.4)+W*1.4)%(W*1.4)-W*0.2,y=lerp(y0,y1,f.y)+Math.sin(t*0.2+f.p)*20;
    const g=c.createRadialGradient(x,y,0,x,y,f.r);const al=a*(0.55+0.45*Math.sin(t*0.15+f.p));
    g.addColorStop(0,`rgba(${col},${al})`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.fillRect(x-f.r,y-f.r,f.r*2,f.r*2);}
  c.restore();}
function vignD(c,k=0.7){const g=c.createRadialGradient(W/2,H*0.4,H*0.22,W/2,H*0.45,H*0.76);g.addColorStop(0,'rgba(2,6,8,0)');g.addColorStop(1,`rgba(2,6,8,${k})`);c.fillStyle=g;c.fillRect(0,0,W,H);}
function grad(c,a,b,d){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,a);g.addColorStop(0.55,b);g.addColorStop(1,d);c.fillStyle=g;c.fillRect(-600,-600,W+1200,H+1200);}
function glow(c,x,y,r,col,a){if(a<=0)return;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
function zoomAt(c,x,y,z){c.translate(x,y);c.scale(z,z);c.translate(-x,-y);}
function flick(t,k=1){return 1+k*(0.035*Math.sin(t*2.1)+0.02*Math.sin(t*3.7+1));}
// «неправильный» шаг: рывок вперёд с перелётом, кадр назад, дотяжка. d — время от рывка
function jstep(d){if(d<=0)return 0;if(d<0.07)return d/0.07*1.18;if(d<0.13)return 1.18-(d-0.07)/0.06*0.3;return 0.88+0.12*ease((d-0.13)/0.3);}
// дрожь кадрами (8 к/с), без плавности — как перескоки плёнки
function trem(t,a){const q=Math.floor(t*8);return a*Math.sin(q*12.9898)*Math.cos(q*4.1414);}
// рывки по списку времён -> доля пути 0..1
function jprog(lt,times){let s=0;for(const k of times)s+=jstep(lt-k);return s/times.length;}
function seqT(a,step,until,max=20){const r=[];for(let i=0;i<max;i++){const v=a+i*step;if(v>=until)break;r.push(v);}return r;}
// ---------- ОНА: фигура в белом, волосы закрывают лицо. Ступни в (0,0), рост ~1000 ----------
// o: a, sh (поднятое плечо 0..1), tilt (наклон головы), t, blur
function ghost(c,x,y,s,o={}){const a=o.a==null?1:o.a;if(a<=0||s<=0)return;const t=o.t||0,sh=o.sh||0,tl=o.tilt||0;
  c.save();c.translate(x,y);c.scale(s,s);c.globalAlpha*=a;c.filter=`blur(${o.blur==null?2.5:o.blur}px)`;
  // мягкое холодное свечение вокруг белого, чтобы читалось на телефоне
  glow(c,0,-520,560,'190,215,215',0.10);
  // платье
  const dg=c.createLinearGradient(0,-780,0,0);dg.addColorStop(0,'#d3dbd6');dg.addColorStop(0.6,'#b7c3bf');dg.addColorStop(1,'#8b9a97');
  c.fillStyle=dg;c.beginPath();c.moveTo(-112,-770-sh*36);c.quadraticCurveTo(-150,-420,-178,-30);
  for(let i=0;i<=14;i++){const xx=lerp(-178,178,i/14);c.lineTo(xx,(i%2?0:9)+5*Math.sin(t*1.3+i));}
  c.quadraticCurveTo(150,-420,112,-770);c.quadraticCurveTo(0,-800,-112,-770-sh*36);c.closePath();c.fill();
  c.strokeStyle='rgba(70,88,90,0.28)';c.lineWidth=6;for(const fx of [-80,-25,35,90]){c.beginPath();c.moveTo(fx*0.6,-700);c.quadraticCurveTo(fx*0.9,-350,fx,-40);c.stroke();}
  // руки висят вдоль тела; левое плечо может дёрнуться вверх
  c.lineCap='round';c.strokeStyle='#bcc7c3';c.lineWidth=58;
  c.save();c.translate(-125,-745-sh*36);c.rotate(0.06+sh*0.12);c.beginPath();c.moveTo(0,0);c.lineTo(-18,330);c.stroke();
  c.fillStyle='#a9b5b1';ell(c,-20,372,24,46);c.fill();c.strokeStyle='#a9b5b1';c.lineWidth=14;for(const fx of [-32,-20,-8]){c.beginPath();c.moveTo(fx+4,395);c.lineTo(fx,445);c.stroke();}c.restore();
  c.strokeStyle='#bcc7c3';c.lineWidth=58;
  c.save();c.translate(125,-745);c.rotate(-0.06);c.beginPath();c.moveTo(0,0);c.lineTo(18,330);c.stroke();
  c.fillStyle='#a9b5b1';ell(c,20,372,24,46);c.fill();c.strokeStyle='#a9b5b1';c.lineWidth=14;for(const fx of [8,20,32]){c.beginPath();c.moveTo(fx-4,395);c.lineTo(fx,445);c.stroke();}c.restore();
  // голова и завеса волос до груди (лица нет)
  c.save();c.translate(0,-790);c.rotate(tl);
  c.fillStyle='#0a0d0e';ell(c,0,-95,82,98);c.fill();
  c.beginPath();c.moveTo(-84,-150);c.quadraticCurveTo(-112,-60,-118,60);
  for(let i=0;i<=12;i++){const xx=lerp(-122,122,i/12);c.lineTo(xx+3*Math.sin(t*0.9+i*1.7),300+((i*37)%5)*16+8*Math.sin(t*0.7+i));}
  c.quadraticCurveTo(112,-60,84,-150);c.quadraticCurveTo(0,-205,-84,-150);c.closePath();c.fill();
  // пряди и холодный блик — чтобы волосы читались, а не были дырой
  c.strokeStyle='rgba(120,150,155,0.20)';c.lineWidth=3;
  for(let i=0;i<9;i++){const xx=-70+i*17;c.beginPath();c.moveTo(xx*0.7,-180);c.quadraticCurveTo(xx*1.15+4*Math.sin(t+i),40,xx*1.3+5*Math.sin(t*0.8+i),270);c.stroke();}
  c.strokeStyle='rgba(170,200,205,0.28)';c.lineWidth=5;c.beginPath();c.arc(0,-95,84,-2.5,-0.7);c.stroke();
  // узкая щель между прядями: темнее серого, без черт
  c.fillStyle='rgba(38,46,48,0.85)';c.beginPath();c.moveTo(-6,-60);c.quadraticCurveTo(-10,20,-3,110);c.lineTo(4,110);c.quadraticCurveTo(9,20,6,-60);c.closePath();c.fill();
  c.restore();
  c.filter='none';c.restore();}
// кисть на краю колодца (пальцы свешиваются наружу)
function rimHand(c,x,y,s,a,side=1){if(a<=0)return;c.save();c.translate(x,y);c.scale(s*side,s);c.globalAlpha*=a;c.filter='blur(2px)';
  // предплечье уходит в темноту колодца, ладонь лежит на ободе, пальцы свешиваются через край к нам
  c.strokeStyle='rgba(150,165,160,0.55)';c.lineCap='round';c.lineWidth=40;c.beginPath();c.moveTo(-6,-14);c.lineTo(-30,-58);c.stroke();
  c.fillStyle='#a3b0ab';ell(c,0,-8,34,16);c.fill();
  c.lineWidth=12;c.strokeStyle='#a3b0ab';
  for(const [fx,L] of [[-24,26],[-8,32],[8,30],[23,24]]){c.beginPath();c.moveTo(fx,-4);c.quadraticCurveTo(fx+2,8,fx+1,L);c.stroke();}
  c.fillStyle='rgba(60,70,70,0.6)';for(const [fx,L] of [[-24,26],[-8,32],[8,30],[23,24]]){ell(c,fx+1,L,5,4);c.fill();}
  c.filter='none';c.restore();}
// ---------- колодец: центр верхнего края (x,y), rx; back — внутренность, front — передняя стенка ----------
function wellBack(c,x,y,rx){const ry=rx*0.27;c.save();
  c.fillStyle='#384543';ell(c,x,y,rx,ry);c.fill();
  c.fillStyle='#040708';ell(c,x,y+ry*0.12,rx*0.82,ry*0.72);c.fill();
  c.restore();}
function wellFront(c,x,y,rx,t,o={}){const ry=rx*0.27,h=rx*0.85;c.save();
  const g=c.createLinearGradient(x-rx,0,x+rx,0);g.addColorStop(0,'#212b2b');g.addColorStop(0.55,'#3c4947');g.addColorStop(1,'#56625d');
  c.fillStyle=g;c.beginPath();c.moveTo(x-rx,y);c.ellipse(x,y,rx,ry,0,Math.PI,0,true);c.lineTo(x+rx,y+h);c.ellipse(x,y+h,rx,ry,0,0,Math.PI);c.closePath();c.fill();
  // камни рядами
  c.strokeStyle='rgba(10,16,17,0.55)';c.lineWidth=Math.max(2,rx*0.012);
  for(let r=1;r<4;r++){const yy=y+h*r/4;c.beginPath();c.ellipse(x,yy,rx,ry,0,0,Math.PI);c.stroke();
    for(let i=0;i<7;i++){const an=(i+(r%2)*0.5+0.5)/7*Math.PI;const xx=x+Math.cos(an)*rx,y2=yy+Math.sin(an)*ry;c.beginPath();c.moveTo(xx,y2-h/4);c.lineTo(xx,y2);c.stroke();}}
  // передний край обода
  c.strokeStyle='#5e6b66';c.lineWidth=rx*0.07;c.beginPath();c.ellipse(x,y,rx*0.96,ry*0.9,0,0,Math.PI);c.stroke();
  c.strokeStyle='rgba(255,214,140,0.16)';c.lineWidth=rx*0.02;c.beginPath();c.ellipse(x,y,rx,ry,0,-0.2,0.9);c.stroke();
  // деревянная крышка, сдвинута
  if(o.lid){c.save();c.translate(x+rx*0.55,y-ry*0.35);c.rotate(-0.12);c.fillStyle='#2b2017';c.fillRect(-rx*0.55,-ry*0.5,rx*1.0,ry*0.75);
    c.strokeStyle='rgba(10,8,6,0.7)';c.lineWidth=rx*0.015;for(let i=1;i<5;i++){c.beginPath();c.moveTo(-rx*0.55+i*rx*0.2,-ry*0.5);c.lineTo(-rx*0.55+i*rx*0.2,ry*0.25);c.stroke();}c.restore();}
  if(o.grate){c.save();c.beginPath();c.ellipse(x,y,rx*0.9,ry*0.82,0,0,Math.PI*2);c.clip();c.strokeStyle='#14191a';c.lineWidth=rx*0.03;
    for(let i=-6;i<=6;i++){c.beginPath();c.moveTo(x+i*rx*0.15,y-ry);c.lineTo(x+i*rx*0.15,y+ry);c.stroke();}
    for(let j=-2;j<=2;j++){c.beginPath();c.moveTo(x-rx,y+j*ry*0.35);c.lineTo(x+rx,y+j*ry*0.35);c.stroke();}
    c.restore();c.strokeStyle='#1b2122';c.lineWidth=rx*0.04;c.beginPath();c.ellipse(x,y,rx*0.9,ry*0.82,0,0,Math.PI*2);c.stroke();}
  c.restore();}
// фигура внутри колодца: видна только выше края (обод) и внутри отверстия
// фигура в колодце: видна только выше линии края и в самом отверстии
function inWellUp(c,x,y,rx,fn){const ry=rx*0.27;c.save();c.beginPath();c.moveTo(-600,-600);c.lineTo(W+600,-600);c.lineTo(W+600,y);c.lineTo(x+rx*0.82,y);c.ellipse(x,y+ry*0.12,rx*0.82,ry*0.72,0,0,Math.PI,false);c.lineTo(-600,y);c.closePath();c.clip();fn();c.restore();}
// ---------- двор: дом-энгава слева, каменный фонарь справа, сосны, туман ----------
function stoneLantern(c,x,y,s,t,on=1){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle='#2f3a39';
  c.fillRect(-18,-150,36,150);c.fillRect(-50,-12,100,14);c.fillRect(-46,-186,92,36);
  c.fillStyle='#3b4746';c.fillRect(-36,-250,72,64);
  c.fillStyle=`rgba(255,200,110,${0.55*on*flick(t,1.4)})`;c.fillRect(-20,-238,40,40);
  c.fillStyle='#262f2f';c.beginPath();c.moveTo(-86,-250);c.quadraticCurveTo(0,-300,86,-250);c.lineTo(60,-282);c.quadraticCurveTo(0,-318,-60,-282);c.closePath();c.fill();
  ell(c,0,-322,14,14);c.fill();c.restore();
  glow(c,x,y-218*s,260*s,'255,200,110',0.32*on*flick(t,1.4));}
function pine(c,x,y,s,col){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle=col;c.strokeStyle=col;c.lineWidth=22;c.lineCap='round';
  c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(-30,-200,20,-420);c.stroke();
  for(const [bx,by,bw] of [[-60,-250,150],[60,-330,170],[-20,-420,190],[40,-180,120]]){ell(c,bx,by,bw,38);c.fill();}
  c.restore();}
function house(c,x,y,s,t,win=1){c.save();c.translate(x,y);c.scale(s,s);
  c.fillStyle='#0f1819';c.fillRect(-20,-330,560,330);
  // седзи: тусклый тёплый свет за решёткой
  c.fillStyle=`rgba(225,180,110,${0.38*win*flick(t,0.6)})`;c.fillRect(60,-270,300,210);
  c.strokeStyle='#0f1819';c.lineWidth=7;for(let i=1;i<6;i++){c.beginPath();c.moveTo(60+i*50,-270);c.lineTo(60+i*50,-60);c.stroke();}
  for(let j=1;j<4;j++){c.beginPath();c.moveTo(60,-270+j*52);c.lineTo(360,-270+j*52);c.stroke();}
  // крыша с загнутыми краями
  c.fillStyle='#0a1112';c.beginPath();c.moveTo(-120,-300);c.quadraticCurveTo(-80,-330,-40,-330);c.lineTo(520,-330);c.quadraticCurveTo(600,-330,640,-300);c.lineTo(560,-430);c.lineTo(40,-430);c.closePath();c.fill();
  c.strokeStyle='rgba(150,185,190,0.18)';c.lineWidth=4;c.beginPath();c.moveTo(-120,-300);c.quadraticCurveTo(-80,-330,-40,-330);c.lineTo(520,-330);c.quadraticCurveTo(600,-330,640,-300);c.stroke();
  c.fillStyle='#141c1c';c.fillRect(-40,-14,600,22);// энгава
  c.restore();
  glow(c,x+210*s,y-165*s,320*s,'225,180,110',0.14*win);}
// двор целиком (без фигуры): колодец (wx,wy,wr), фигура рисуется между back и front
function yardBg(c,t,o={}){grad(c,'#2b434b','#26393f','#1b2a2d');
  glow(c,700,560,700,'170,200,205',0.10);
  pine(c,960,820,1.0,'#142225');pine(c,120,790,0.8,'#152326');
  house(c,-60,840,1.0,t,o.win==null?1:o.win);
  c.fillStyle='#1c2a2c';c.fillRect(-600,830,W+1200,H);
  // гравий/земля
  c.fillStyle='rgba(150,175,170,0.05)';for(let i=0;i<60;i++){const xx=(i*173)%1300-100,yy=860+((i*97)%380);ell(c,xx,yy,10+(i%4)*4,3);c.fill();}
  fog(c,t,700,900,0.11);
  stoneLantern(c,880,900,0.9,t,o.lamp==null?1:o.lamp);}
function grain2(c,a){c.save();c.globalAlpha=a;c.globalCompositeOperation='overlay';const ox=Math.floor(Math.random()*256),oy=Math.floor(Math.random()*256);
  c.fillStyle=c.createPattern(grain,'repeat');c.translate(-ox,-oy);c.fillRect(0,0,W+256,H+256);c.restore();}
// мягкие горизонтальные полосы помех (без вспышек, низкая альфа)
function scan(c,t,a){if(a<=0)return;c.save();const q=Math.floor(t*10);
  for(let i=0;i<14;i++){const y=((i*211+q*37*(i%3+1))%H);const h=6+((i*13+q)%5)*5;c.fillStyle=`rgba(190,210,210,${a*(0.25+0.5*((i*7+q)%4)/4)})`;c.fillRect(0,y,W,h);}
  for(let i=0;i<4;i++){const y=(i*480+t*90)%H;const g=c.createLinearGradient(0,y-40,0,y+40);g.addColorStop(0,'rgba(180,200,205,0)');g.addColorStop(0.5,`rgba(180,200,205,${a*0.6})`);g.addColorStop(1,'rgba(180,200,205,0)');c.fillStyle=g;c.fillRect(0,y-40,W,80);}
  c.restore();}
// ---------- телефон с диском ----------
function phone(c,x,y,s,jit){c.save();c.translate(x+jit,y);c.scale(s,s);
  c.fillStyle='rgba(0,0,0,0.35)';ell(c,0,18,190,28);c.fill();
  const g=c.createLinearGradient(0,-120,0,10);g.addColorStop(0,'#272d2f');g.addColorStop(1,'#0c0f10');c.fillStyle=g;
  c.beginPath();c.moveTo(-170,10);c.quadraticCurveTo(-150,-110,-90,-120);c.lineTo(90,-120);c.quadraticCurveTo(150,-110,170,10);c.closePath();c.fill();
  c.strokeStyle='rgba(220,200,160,0.25)';c.lineWidth=4;c.beginPath();c.moveTo(-150,-30);c.quadraticCurveTo(-140,-108,-90,-116);c.lineTo(60,-116);c.stroke();
  // диск
  c.save();c.translate(0,-48);c.scale(1,0.55);c.fillStyle='#b8b4a5';ell(c,0,0,78,78);c.fill();c.fillStyle='#1a1f20';
  for(let i=0;i<10;i++){const an=-2.3+i*0.42;ell(c,Math.cos(an)*55,Math.sin(an)*55,12,12);c.fill();}
  c.fillStyle='#d8d2c0';ell(c,0,0,28,28);c.fill();c.restore();
  // трубка на рычагах
  c.save();c.translate(0,-150+jit*0.6);c.rotate(jit*0.004);c.fillStyle='#14191a';
  c.beginPath();c.moveTo(-200,10);c.quadraticCurveTo(-210,-34,-160,-36);c.lineTo(160,-36);c.quadraticCurveTo(210,-34,200,10);c.lineTo(150,14);c.quadraticCurveTo(120,-8,0,-8);c.quadraticCurveTo(-120,-8,-150,14);c.closePath();c.fill();
  c.strokeStyle='rgba(220,200,160,0.28)';c.lineWidth=4;c.beginPath();c.moveTo(-196,-14);c.quadraticCurveTo(-200,-32,-160,-34);c.lineTo(160,-34);c.stroke();c.restore();
  // провод
  c.strokeStyle='#0d1112';c.lineWidth=7;c.beginPath();c.moveTo(165,0);for(let i=0;i<16;i++){c.lineTo(185+i*22,10+(i%2?14:-6)+i*3);}c.stroke();
  c.restore();}
function andon(c,x,y,s,t,on){c.save();c.translate(x,y);c.scale(s,s);
  c.fillStyle='#1d1610';c.fillRect(-70,-20,10,20);c.fillRect(60,-20,10,20);
  c.fillStyle=`rgba(232,190,120,${0.55+0.35*on})`;c.fillRect(-62,-300,124,280);
  c.strokeStyle='#1d1610';c.lineWidth=8;c.strokeRect(-62,-300,124,280);c.beginPath();c.moveTo(-62,-160);c.lineTo(62,-160);c.stroke();
  c.restore();glow(c,x,y-160*s,620*s,'235,185,110',0.30*on*flick(t));}
// ---------- мокрый след босой ноги; rot — куда смотрят пальцы ----------
function footprint(c,x,y,s,rot,a){if(a<=0)return;c.save();c.translate(x,y);c.rotate(rot);c.scale(s,s*0.55);c.globalAlpha*=a;
  c.fillStyle='rgba(8,14,16,0.72)';c.beginPath();c.ellipse(0,10,26,44,0,0,Math.PI*2);c.fill();
  for(const [tx,ty,tr] of [[-18,-44,9],[-4,-50,8],[9,-48,7],[19,-42,6],[26,-33,5]]){ell(c,tx,ty,tr,tr*1.2);c.fill();}
  c.strokeStyle='rgba(180,210,215,0.35)';c.lineWidth=3;c.beginPath();c.ellipse(0,10,24,42,0,-2.6,-1.2);c.stroke();
  c.restore();}
// ---------- замок Химэдзи силуэтом ----------
function castle(c,x,y,s,t){c.save();c.translate(x,y);c.scale(s,s);
  const wall='#7d8c8b',roof='#162127',edge='rgba(190,215,215,0.25)';
  c.fillStyle='#2a3436';c.beginPath();c.moveTo(-330,0);c.lineTo(-260,-150);c.lineTo(260,-150);c.lineTo(330,0);c.closePath();c.fill();// каменное основание
  c.strokeStyle='rgba(10,16,18,0.5)';c.lineWidth=3;for(let i=1;i<5;i++){c.beginPath();c.moveTo(-330+i*14,-i*30);c.lineTo(330-i*14,-i*30);c.stroke();}
  const tiers=[[250,120],[205,105],[165,95],[125,85],[90,80]];let yy=-150;
  tiers.forEach(([hw,h],i)=>{c.fillStyle=wall;c.fillRect(-hw,yy-h,hw*2,h);
    c.fillStyle='rgba(20,30,34,0.6)';for(let k=-2;k<=2;k++)c.fillRect(k*hw*0.36-10,yy-h*0.65,20,h*0.3);
    yy-=h;const rw=hw+60;c.fillStyle=roof;c.beginPath();c.moveTo(-rw-30,yy+16);c.quadraticCurveTo(-rw,yy+2,-rw+30,yy-6);c.lineTo(-hw+10,yy-38);c.lineTo(hw-10,yy-38);c.lineTo(rw-30,yy-6);c.quadraticCurveTo(rw,yy+2,rw+30,yy+16);c.lineTo(rw-20,yy+6);c.lineTo(-rw+20,yy+6);c.closePath();c.fill();
    c.strokeStyle=edge;c.lineWidth=3;c.beginPath();c.moveTo(-rw-30,yy+16);c.quadraticCurveTo(-rw,yy+2,-rw+30,yy-6);c.lineTo(-hw+10,yy-38);c.stroke();
    if(i%2===0){c.fillStyle=roof;c.beginPath();c.moveTo(-50,yy-30);c.lineTo(0,yy-76);c.lineTo(50,yy-30);c.closePath();c.fill();c.fillStyle=wall;c.beginPath();c.moveTo(-34,yy-34);c.lineTo(0,yy-64);c.lineTo(34,yy-34);c.closePath();c.fill();}
    yy-=38;});
  c.fillStyle=roof;c.beginPath();c.moveTo(-70,yy+4);c.lineTo(0,yy-60);c.lineTo(70,yy+4);c.closePath();c.fill();
  c.restore();}
// тарелка-призрак (Окику считает тарелки)
function plate(c,x,y,s,a){if(a<=0)return;c.save();c.globalAlpha*=a;c.translate(x,y);c.scale(s,s);glow(c,0,0,90,'200,225,225',0.22);
  c.filter='blur(1.5px)';c.fillStyle='rgba(215,228,226,0.75)';ell(c,0,0,46,15);c.fill();c.strokeStyle='rgba(120,150,160,0.7)';c.lineWidth=3;ell(c,0,0,30,9);c.stroke();c.filter='none';c.restore();}
// ---------- плёночная рамка (перфорация бежит вверх = обратная перемотка) ----------
function filmFrame(c,t,a){if(a<=0)return;c.save();c.globalAlpha=a;c.fillStyle='rgba(8,12,13,0.92)';c.fillRect(0,0,90,H);c.fillRect(W-90,0,90,H);
  c.fillStyle='rgba(170,185,180,0.35)';const off=(t*140)%120;
  for(let y=-120+120-off;y<H+120;y+=120){c.fillRect(28,y,34,58);c.fillRect(W-62,y,34,58);}
  c.fillStyle='rgba(8,12,13,0.85)';const fy=(1000-(t*140)%1000);c.fillRect(90,fy-6,W-180,12);
  // значок перемотки ◀◀ вверху слева (вне угла совёнка)
  c.fillStyle='rgba(205,215,210,0.55)';for(const dx of [0,46]){c.beginPath();c.moveTo(150+dx,170);c.lineTo(196+dx,140);c.lineTo(196+dx,200);c.closePath();c.fill();}
  c.restore();}
function stageBg(c,t,spot=1){grad(c,'#20343a','#1d2f33','#14211f');
  c.fillStyle='#16262a';c.fillRect(-300,-300,W+600,1220);
  c.strokeStyle='rgba(6,12,14,0.5)';c.lineWidth=26;for(let x=-200;x<1300;x+=110){c.beginPath();c.moveTo(x,-300);c.quadraticCurveTo(x+20+8*Math.sin(t*0.4+x),400,x,920);c.stroke();}
  c.strokeStyle='rgba(140,170,170,0.07)';c.lineWidth=10;for(let x=-150;x<1300;x+=110){c.beginPath();c.moveTo(x,-300);c.lineTo(x+10,920);c.stroke();}
  // пол сцены: доски в перспективе
  const fg=c.createLinearGradient(0,920,0,1500);fg.addColorStop(0,'#2d241b');fg.addColorStop(1,'#1a140f');c.fillStyle=fg;c.fillRect(-300,920,W+600,900);
  c.strokeStyle='rgba(8,6,4,0.55)';c.lineWidth=4;for(let i=-10;i<=10;i++){c.beginPath();c.moveTo(540+i*70,920);c.lineTo(540+i*170,1700);c.stroke();}
  c.fillStyle='rgba(255,210,150,0.10)';c.fillRect(-300,920,W+600,4);
  // тусклый луч
  c.fillStyle=`rgba(255,214,140,${0.06*spot})`;c.beginPath();c.moveTo(500,-300);c.lineTo(580,-300);c.lineTo(800,1180);c.lineTo(280,1180);c.closePath();c.fill();
  c.save();c.translate(540,1120);c.scale(1,0.25);glow(c,0,0,420,'255,214,140',0.42*spot);c.restore();}
const SC={
  sky(c,t,lt){
    sky(c,t,0);c.fillStyle='rgba(2,14,18,0.52)';c.fillRect(0,0,W,H);
    const z=1+lt*0.006;c.save();zoomAt(c,W/2,H/2,z);
    const ent=ease(lt/1.6);moon(c,540,700,t);owl(c,540,760+(1-ent)*500,1.15*(0.6+0.4*ent),t,blink(t,0),false,{talk:talk(t)});c.restore();
    const gl=ease((lt-K('glow'))/1.6);
    // внизу двор: дом, колодец в тумане, каменный фонарь
    c.save();c.translate(0,330);c.scale(1,0.75);c.translate(0,0);
    pine(c,980,1160,0.9,'#071114');house(c,-80,1180,0.85,t,0.4+0.6*gl);
    c.fillStyle='#071012';c.fillRect(-600,1170,W+1200,800);
    wellBack(c,640,1190,95);wellFront(c,640,1190,95,t,{lid:1});
    stoneLantern(c,860,1240,0.6,t,0.5+0.5*gl);
    c.restore();
    fog(c,t,1120,1290,0.16);vignD(c,0.64);
    // мост от s09: мягкие помехи и кольцо колодца в первые секунды
    const st=1-ease((lt-0.2)/1.6);if(st>0){scan(c,t,0.10*st);c.save();c.globalAlpha=0.22*st;c.strokeStyle='#cfe0e0';c.lineWidth=10;c.filter='blur(4px)';ell(c,540,980,260,80);c.stroke();c.filter='none';c.restore();}
  },
  sledy(c,t,lt){
    // энгава ночью: мокрые следы босых ног появляются сами — неровно, пальцами от нас, а идут к нам
    const z=lerp(1.0,1.08,ease(lt/6));c.save();zoomAt(c,540,700,z);
    grad(c,'#253c43','#213439','#182629');
    // в глубине — раздвинутые седзи, за ними туман
    c.fillStyle='#14211f';c.fillRect(250,140,580,520);
    const sg=c.createLinearGradient(0,170,0,640);sg.addColorStop(0,'#4f6a6d');sg.addColorStop(1,'#33494c');c.fillStyle=sg;c.fillRect(290,170,500,470);
    fog(c,t,250,620,0.16,'170,195,200');
    c.strokeStyle='#14211f';c.lineWidth=8;for(let i=1;i<4;i++){c.beginPath();c.moveTo(290+i*125,170);c.lineTo(290+i*125,640);c.stroke();}
    c.fillStyle='rgba(220,175,110,0.4)';c.fillRect(70,190,170,420);c.fillRect(840,190,170,420);// боковые седзи с тёплым светом
    c.strokeStyle='#14211f';c.lineWidth=6;for(const x0 of [70,840]){for(let i=1;i<3;i++){c.beginPath();c.moveTo(x0+i*57,190);c.lineTo(x0+i*57,610);c.stroke();}for(let j=1;j<6;j++){c.beginPath();c.moveTo(x0,190+j*70);c.lineTo(x0+170,190+j*70);c.stroke();}}
    // пол: доски сходятся к двери
    const fg=c.createLinearGradient(0,640,0,1400);fg.addColorStop(0,'#3a3226');fg.addColorStop(1,'#241d15');c.fillStyle=fg;
    c.beginPath();c.moveTo(250,640);c.lineTo(830,640);c.lineTo(1300,1500);c.lineTo(-220,1500);c.closePath();c.fill();
    c.strokeStyle='rgba(10,8,5,0.55)';c.lineWidth=4;for(let i=-6;i<=6;i++){c.beginPath();c.moveTo(540+i*48,640);c.lineTo(540+i*150,1500);c.stroke();}
    glow(c,540,640,700,'170,200,205',0.10);glow(c,160,700,520,'235,185,110',0.16*flick(t));
    // следы: от двери к нам, пальцы смотрят к двери (идёт задом), шаг неровный
    const P=[[548,700,0.45,0.00,0.05],[506,760,0.52,0.45,-0.1],[560,830,0.6,0.62,0.12],[512,925,0.7,1.55,-0.05],[520,935,0.72,1.66,2.9],[585,1050,0.84,2.55,0.1],[505,1150,0.95,2.95,-0.12],[575,1250,1.08,3.65,0.08]];
    for(const [x,y,s,d,rot] of P){footprint(c,x,y,s,Math.PI+rot,ease((lt-K('sled')-d)/0.18));}
    c.restore();
    fog(c,t,1000,1300,0.06);vignD(c,0.62);
  },
  telefon(c,t,lt){
    // пустая комната с татами, на низком столике старый телефон. «Дзынь» — трубка дрожит и расходятся бледные кольца. Обрыв — тишина
    const d1=K('dzyn1'),d2=K('dzyn2'),ob=ease((lt-K('obryv'))/1.6);
    const ring=(k)=>{const d=lt-k;return d>0&&d<0.7?Math.sin(d/0.7*Math.PI):0;};
    const r=Math.max(ring(d1),ring(d2));const jit=r*3*Math.sin(lt*70);
    c.save();zoomAt(c,540,820,1.02+0.012*lt);
    grad(c,'#2a4046','#24383d','#1a2a2d');
    // задняя стена: седзи, за ними холодный туман двора
    c.fillStyle='#152224';c.fillRect(-100,120,1280,640);
    const sg=c.createLinearGradient(0,150,0,740);sg.addColorStop(0,'#58706f');sg.addColorStop(1,'#3e5455');c.fillStyle=sg;c.fillRect(-60,150,1200,580);
    c.strokeStyle='#152224';c.lineWidth=7;for(let i=1;i<12;i++){c.beginPath();c.moveTo(-60+i*100,150);c.lineTo(-60+i*100,730);c.stroke();}
    for(let j=1;j<6;j++){c.beginPath();c.moveTo(-60,150+j*97);c.lineTo(1140,150+j*97);c.stroke();}
    c.lineWidth=16;for(const x of [240,540,840]){c.beginPath();c.moveTo(x,150);c.lineTo(x,730);c.stroke();}
    // татами
    c.fillStyle='#4e5544';c.fillRect(-200,740,1480,900);
    c.strokeStyle='#2a2e22';c.lineWidth=12;c.beginPath();c.moveTo(-200,980);c.lineTo(1280,980);c.moveTo(540,740);c.lineTo(540,980);c.moveTo(250,980);c.lineTo(160,1500);c.stroke();
    c.strokeStyle='rgba(30,34,26,0.35)';c.lineWidth=3;for(let y=760;y<1500;y+=26){c.beginPath();c.moveTo(-200,y);c.lineTo(1280,y);c.stroke();}
    andon(c,170,960,1.0,t,1-0.45*ob);
    // столик и пустая подушка
    c.fillStyle='#2a1f16';ell(c,600,1000,280,70);c.fill();c.fillStyle='#3b2c1f';ell(c,600,985,280,70);c.fill();
    c.fillStyle='#1f1710';c.fillRect(440,1010,22,90);c.fillRect(740,1010,22,90);
    c.fillStyle='#3e4b55';c.beginPath();c.moveTo(780,1150);c.lineTo(980,1130);c.lineTo(1010,1210);c.lineTo(800,1235);c.closePath();c.fill();
    // кольца звонка — тихие, бледные, без вспышек
    for(const k of [d1,d2]){const d=lt-k;if(d>0&&d<1.6){for(let j=0;j<3;j++){const p=(d-j*0.18)/1.2;if(p<=0||p>=1)continue;c.strokeStyle=`rgba(200,220,220,${0.22*(1-p)})`;c.lineWidth=4;c.beginPath();c.ellipse(600,860,90+p*300,30+p*100,0,0,Math.PI*2);c.stroke();}}}
    phone(c,600,975,1.0,jit);
    c.restore();
    c.fillStyle=`rgba(2,8,10,${0.16*ob})`;c.fillRect(0,0,W,H);
    vignD(c,0.6+0.08*ob);
  },
  dvor(c,t,lt){
    // A: двор, колодец в тумане; кисть на краю, вторая, голова, плечи, встаёт. B: ближе — шаг, плечо. C: ещё ближе — «идёт сюда». Смены кадров мягкие
    const sg=K('shag'),sy=K('syuda');
    const cB=ease((lt-sg+0.05)/0.25),cC=ease((lt-sy+0.05)/0.25);
    const wx=560,wy=1000,wr=250;
    if(cB<1){c.save();zoomAt(c,560,900,1.0+0.006*lt);
      yardBg(c,t);wellBack(c,wx,wy,wr);
      const r1=jstep(lt-K('r1')),r2=jstep(lt-K('r2')),up=(jstep(lt-K('r3'))*0.35+jstep(lt-K('r4'))*0.35+jstep(lt-K('r5'))*0.3);
      // фигура поднимается рывками из колодца
      if(up>0)inWellUp(c,wx,wy,wr,()=>ghost(c,wx-10+trem(lt,3),wy+700-up*790,0.62,{t:lt,tilt:0.08+trem(lt+3,0.02)}));
      wellFront(c,wx,wy,wr,t,{lid:1});
      rimHand(c,wx-120+trem(lt,2),wy+44,1.1,r1*(1-ease((up-0.6)/0.3)));rimHand(c,wx+110+trem(lt+1,2),wy+42,1.1,r2*(1-ease((up-0.6)/0.3)),-1);
      c.restore();fog(c,t,950,1250,0.08);vignD(c,0.62);}
    if(cB>0&&cC<1){c.save();c.globalAlpha=cB;
      // B: ближе, она уже стоит во дворе, колодец за спиной справа
      c.save();zoomAt(c,700,880,1.35);yardBg(c,t);wellBack(c,780,960,180);wellFront(c,780,960,180,t,{lid:1});c.restore();
      const st=jstep(lt-sg),ps=jstep(lt-K('plecho'));
      const sh=ps*(1-ease((lt-K('plecho')-0.9)/0.4))+0.25*ps;
      ghost(c,460+40*st+trem(lt,3),1180+30*st,0.68+0.05*st,{t:lt,sh,tilt:0.1-0.16*ps+trem(lt+2,0.02)});
      fog(c,t,1000,1250,0.08);vignD(c,0.62);c.restore();}
    if(cC>0){c.save();c.globalAlpha=cC;
      // C: совсем близко, ниже пояса — за кадром; дальше она не двигается (без скримера)
      c.save();zoomAt(c,650,860,1.7);yardBg(c,t,{lamp:0.8});c.restore();
      ghost(c,470+trem(lt,2),1580,1.02,{t:lt,sh:0.3,tilt:-0.12+trem(lt+5,0.015)});
      c.fillStyle='rgba(2,8,10,0.10)';c.fillRect(0,0,W,H);fog(c,t,1100,1350,0.07);vignD(c,0.66);c.restore();}
  },
  aktrisa(c,t,lt){
    // театральная сцена: актриса в белом идёт задом наперёд, резко (уходит в глубину). Плёнку пустили обратно — она идёт к нам, «неправильно»
    const zd=seqT(K('zadom'),0.5,K('plenka')),pl=K('plenka'),fw=seqT(pl+0.4,0.5,pl+2.4);
    const away=jprog(lt,zd),toward=jprog(lt,fw),fm=ease((lt-pl)/0.8),np=ease((lt-K('nepr'))/0.3);
    const u=clamp(away-toward,0,1);
    c.save();zoomAt(c,540,900,1.02+0.008*lt);
    stageBg(c,t);
    ghost(c,540+trem(lt,toward>0?4:2),lerp(1170,980,u),lerp(0.66,0.42,u),{t:lt,tilt:0.06+(np?(-0.14*np):0)+trem(lt+4,toward>0?0.03:0.01),sh:np*0.4});
    c.restore();
    if(fm>0){c.save();c.globalAlpha=0.22*fm;c.fillStyle='#8fa6a3';c.globalCompositeOperation='color';c.fillRect(0,0,W,H);c.restore();
      scan(c,t,0.035*fm);filmFrame(c,t,fm);}
    vignD(c,0.64);
  },
  okiku(c,t,lt){
    // A: замок Химэдзи силуэтом на холме, туман. B: колодец Окику под решёткой, серый день, никого. Счёт до девяти — бледные тарелки по одной
    const kb=ease((lt-K('kolodec2')+0.1)/0.9),sc=K('schet');
    if(kb<1){c.save();zoomAt(c,540,700,1.0+0.01*lt);
      grad(c,'#33494f','#2a3e43','#1c2b2d');glow(c,540,420,800,'180,205,210',0.14);
      fog(c,t,500,900,0.12,'170,195,200');
      c.fillStyle='#15211f';c.beginPath();c.moveTo(-200,1100);c.quadraticCurveTo(300,880,540,880);c.quadraticCurveTo(800,880,1300,1100);c.lineTo(1300,H);c.lineTo(-200,H);c.closePath();c.fill();
      castle(c,540,900,1.0,t);
      for(const [x,s] of [[120,1.0],[260,0.7],[880,0.9],[1000,1.1]])pine(c,x,1080,s,'#0e1819');
      c.fillStyle='#0e1819';c.fillRect(-200,1080,1500,900);
      fog(c,t,880,1150,0.14);c.restore();vignD(c,0.6);}
    if(kb>0){c.save();c.globalAlpha=kb;c.save();zoomAt(c,540,820,1.02+0.006*lt);
      grad(c,'#4b6062','#3f5456','#2c3c3d');
      // белая стена замка с тёмными балками
      c.fillStyle='#8a9997';c.fillRect(-200,180,1480,520);c.fillStyle='#24302f';for(let x=-160;x<1300;x+=200)c.fillRect(x,180,22,520);c.fillRect(-200,400,1480,18);
      c.fillStyle='#1d2729';c.beginPath();c.moveTo(-200,180);c.lineTo(1300,180);c.lineTo(1300,120);c.lineTo(-200,140);c.closePath();c.fill();
      c.fillStyle='#3a4645';c.fillRect(-200,700,1480,1200);
      c.strokeStyle='rgba(20,28,28,0.5)';c.lineWidth=4;for(let y=740;y<1500;y+=60){c.beginPath();c.moveTo(-200,y);c.lineTo(1300,y);c.stroke();for(let x=((y/60)%2)*60-200;x<1300;x+=120){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+60);c.stroke();}}
      fog(c,t,500,900,0.08,'190,210,210');
      const wx=540,wy=900,wr=300;wellBack(c,wx,wy,wr);
      // круги на воде под решёткой — на каждый счёт
      c.save();c.beginPath();c.ellipse(wx,wy+wr*0.27*0.12,wr*0.82,wr*0.27*0.72,0,0,Math.PI*2);c.clip();
      for(let i=0;i<9;i++){const d=lt-(sc+i*0.42);if(d>0&&d<2.2){const p=d/2.2;c.strokeStyle=`rgba(190,215,215,${0.35*(1-p)})`;c.lineWidth=3;ell(c,wx+(i%3-1)*60,wy+12,20+p*160,6+p*40);c.stroke();}}
      c.restore();
      wellFront(c,wx,wy,wr,t,{grate:1});
      c.restore();
      // девять тарелок — дугой над колодцем, по одной
      for(let i=0;i<9;i++){const an=Math.PI*(1.12+i*0.095);const px=540+Math.cos(an)*400,py=860+Math.sin(an)*330;
        plate(c,px,py+Math.sin(t*0.8+i)*6,1.35,0.8*ease((lt-sc-i*0.42)/0.35));}
      vignD(c,0.58);c.restore();}
  },
  nazad(c,t,lt){
    // перемотка: полосы помех, она пятится к колодцу рывками и уходит в него; «и снова начнёт считать» — одна тарелка на краю
    const rw=ease((lt-K('rewind'))/0.6),bk=seqT(K('popyat'),0.9,K('snova')),pr=jprog(lt,bk),sn=K('snova');
    const sink=ease((lt-sn+0.6)/1.0);
    const wx=760,wy=960,wr=180;
    c.save();zoomAt(c,700,880,1.35);yardBg(c,t,{lamp:0.8});wellBack(c,wx,wy,wr);c.restore();
    // путь: из переднего плана (как в кадре B) назад к колодцу
    const x=lerp(470,700+(760-700)*0.35*1.35,pr),y=lerp(1190,930+20,pr),s=lerp(0.72,0.40,pr);
    const gx=x+trem(lt,3),gy=y+sink*420;
    const sx=v=>700+(v-700)*1.35,sy=v=>880+(v-880)*1.35;
    const front=()=>{c.save();zoomAt(c,700,880,1.35);wellFront(c,wx,wy,wr,t,{lid:1});c.restore();};
    if(pr<0.7){front();ghost(c,gx,gy,s,{t:lt,tilt:0.1+trem(lt+1,0.03)});}
    else{if(sink>0)inWellUp(c,sx(wx),sy(wy),wr*1.35,()=>ghost(c,gx,gy,s,{t:lt,tilt:0.1}));else ghost(c,gx,gy,s,{t:lt,tilt:0.1+trem(lt+1,0.03)});front();}
    plate(c,sx(wx)-120,sy(wy)-40,0.7,0.6*ease((lt-sn-0.5)/0.8));
    fog(c,t,1000,1250,0.08);
    c.save();c.globalAlpha=0.16*rw;c.fillStyle='#9fb6b6';c.globalCompositeOperation='color';c.fillRect(0,0,W,H);c.restore();
    scan(c,t,0.06*rw*(1-ease((lt-sn)/1.2)));vignD(c,0.64);
  },
  goodnight(c,t,lt){
    sky(c,t,0);c.fillStyle='rgba(2,14,18,0.52)';c.fillRect(0,0,W,H);
    const dim=ease((lt-K('dim'))/2);
    c.save();const z=1.12-lt*0.006;zoomAt(c,W/2,H/2,z);
    const SL=K('sleep');const sl=ease((lt-SL)/2.5);
    moon(c,540,700,t);owl(c,540,760,1.15,t,clamp(blink(t,0)+sl,0,1),true,{talk:talk(t),sleepy:sl});
    c.restore();
    if(sl>0){c.save();c.font='700 64px C';c.fillStyle='#b8c4cc';for(let i=0;i<3;i++){const p=((t*0.35+i/3)%1);c.globalAlpha=sl*Math.sin(p*Math.PI)*0.6;c.fillText('z',640+p*120+Math.sin(p*9)*15,560-p*260);}c.restore();}
    // последний кадр — самый холодный: тёплое окно гаснет, у колодца молча стоит маленькая белая фигура
    const cold=ease((lt-SL-1.6)/2.4),fig=ease((lt-SL-2.2)/2.6);
    c.save();c.translate(0,330);c.scale(1,0.75);
    pine(c,980,1160,0.9,'#071114');house(c,-80,1180,0.85,t,1-0.95*cold);
    c.fillStyle='#071012';c.fillRect(-600,1170,W+1200,800);
    wellBack(c,640,1190,95);
    ghost(c,560,1214,0.13,{a:fig,t,tilt:0.12,blur:1});
    wellFront(c,640,1190,95,t,{lid:1});
    stoneLantern(c,860,1240,0.6,t,1-0.7*cold);
    c.restore();
    fog(c,t,1120,1290,0.16+0.06*cold);
    c.save();c.globalAlpha=0.14*cold;c.fillStyle='#7fa3b0';c.globalCompositeOperation='color';c.fillRect(0,0,W,H);c.restore();
    c.fillStyle=`rgba(0,6,10,${0.10*dim})`;c.fillRect(0,0,W,H);vignD(c,0.66);
  }
};
