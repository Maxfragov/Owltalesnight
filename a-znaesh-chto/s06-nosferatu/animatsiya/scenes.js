// Страшная арка s06: граф Орлок, «Носферату» (1922). Подключается после obshchee/core.js.
window.END_SUB='страшные истории';
// Фильм 1922 года в общественном достоянии, облик делаем максимально похожим: лысый вытянутый череп, острые уши,
// крючковатый нос, два передних зуба, глубокие глазницы, сгорбленная спина, длинные пальцы-когти, тень на лестнице.
// Знаменитый кадр кадр-в-кадр не повторяем: лестница идёт справа налево, тень сначала «тонкая, как карандаш».
// Без крови, без оружия, без скримеров. Палитра: холодные сине-зелёные, тусклый жёлтый свет свечи, лунный свет.
// Силуэты всегда на фоне более светлой стены / окна / тумана, чтобы читались на телефоне. Полного чёрного нет.
const DEFK={glow:1.4,strip:0.8,sud:3.24,candle:0.8,up:3.18,hide:4.28,crawl:4.68,karandash:6.36,palcy:9.04,spina:10.15,climb:12.36,tiho:16.1,
  net:0.8,sovsem:3.3,back:0.8,kniga:1.1,isk:3.24,kopii:5.98,ucel:8.04,portret:0.8,ispug:3.54,zerkalo:5.04,vampir:7.86,off:1.7,ostalsya:4.3,dim:0.8,sleep:1.2,end:3.4};
const DEFKA={hide:12.2,back:29.72};
const K=n=>CFG.k&&CFG.k[n]!=null?CFG.k[n]:DEFK[n];
const KA=n=>CFG.ka&&CFG.ka[n]!=null?CFG.ka[n]:DEFKA[n];
// мини-совёнок прячется на жути (строки 4–7) и возвращается на строке 8
const _miniOwl=miniOwl;
miniOwl=function(c,t,a){const h=ease((t-KA('hide'))/1.0)*(1-ease((t-KA('back'))/1.4));_miniOwl(c,t,a*(1-0.88*h));};
// ---------- helpers ----------
let sd6=61;function r6(){sd6=(sd6*16807)%2147483647;return (sd6-1)/2147483646;}
const FOG=[];for(let i=0;i<34;i++)FOG.push({x:r6()*1.4-0.2,y:r6(),r:160+r6()*260,v:6+r6()*14,p:r6()*6.28});
function fog(c,t,y0,y1,a,col='120,150,155'){c.save();c.globalCompositeOperation='screen';
  for(const f of FOG){const x=((f.x*W+t*f.v)%(W*1.4)+W*1.4)%(W*1.4)-W*0.2,y=lerp(y0,y1,f.y)+Math.sin(t*0.2+f.p)*20;
    const g=c.createRadialGradient(x,y,0,x,y,f.r);const al=a*(0.55+0.45*Math.sin(t*0.15+f.p));
    g.addColorStop(0,`rgba(${col},${al})`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.fillRect(x-f.r,y-f.r,f.r*2,f.r*2);}
  c.restore();}
function vignD(c,k=0.8){const g=c.createRadialGradient(W/2,H*0.42,H*0.2,W/2,H*0.45,H*0.74);g.addColorStop(0,'rgba(2,6,8,0)');g.addColorStop(1,`rgba(2,6,8,${k})`);c.fillStyle=g;c.fillRect(0,0,W,H);}
function grad(c,a,b,d){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,a);g.addColorStop(0.55,b);g.addColorStop(1,d);c.fillStyle=g;c.fillRect(-600,-600,W+1200,H+1200);}
function glow(c,x,y,r,col,a){if(a<=0)return;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
function zoomAt(c,x,y,z){c.translate(x,y);c.scale(z,z);c.translate(-x,-y);}
function flick(t,k=1){return 1+k*(0.06*Math.sin(t*9.1)+0.04*Math.sin(t*14.7+1)+0.03*Math.sin(t*23.3+2));}
// пламя свечи; a — яркость (0 — погасла)
function flame(c,x,y,s,t,a=1,bend=0){if(a<=0)return;c.save();c.translate(x,y);c.scale(s,s);
  glow(c,0,-20,260,'255,190,110',0.22*a*flick(t));glow(c,0,-18,70,'255,220,150',0.5*a);
  const sw=Math.sin(t*3.1)*3+Math.sin(t*7.3)*1.5+bend*14;
  c.globalAlpha*=a;c.fillStyle='#ffd27a';c.beginPath();c.moveTo(-9,0);c.quadraticCurveTo(-11,-22,sw,-50);c.quadraticCurveTo(11,-22,9,0);c.quadraticCurveTo(0,6,-9,0);c.fill();
  c.fillStyle='#fff3cf';c.beginPath();c.moveTo(-4,-2);c.quadraticCurveTo(-5,-14,sw*0.5,-28);c.quadraticCurveTo(5,-14,4,-2);c.fill();c.restore();}
function candle(c,x,y,s,t,o={}){c.save();c.translate(x,y);c.scale(s,s);
  // подсвечник
  c.fillStyle='#2a2116';ell(c,0,4,60,14);c.fill();c.fillRect(-10,-40,20,44);ell(c,0,-40,30,8);c.fill();
  c.fillStyle='#d9ccaa';c.fillRect(-14,-130,28,90);c.fillStyle='rgba(255,230,180,0.35)';c.fillRect(-14,-130,8,90);
  c.strokeStyle='#1b140c';c.lineWidth=3;c.beginPath();c.moveTo(0,-130);c.lineTo(0,-140);c.stroke();
  c.restore();flame(c,x,y-140*s,s,t,o.a==null?1:o.a,o.bend||0);
  if(o.smoke>0){c.save();c.strokeStyle=`rgba(170,180,180,${0.25*o.smoke})`;c.lineWidth=3*s;c.beginPath();
    for(let i=0;i<=30;i++){const u=i/30,px=x+Math.sin(u*8+t*1.5)*12*u*s,py=y-145*s-u*260*s*(0.4+0.6*(1-o.smoke));i?c.lineTo(px,py):c.moveTo(px,py);}c.stroke();c.restore();}}
// ---------- граф Орлок: силуэт в профиль (лицом вправо), ступни в (0,0), рост 1000 ед. ----------
// o: arm 0..1 (рука опущена .. поднята вперёд), sx (сжатие «карандаш»), lean (наклон вперёд), flip, col
function orlokSil(c,x,y,s,o={}){const arm=o.arm==null?1:o.arm;c.save();c.translate(x,y);if(o.lean)c.rotate(o.lean*(o.flip?-1:1));
  c.scale((o.flip?-1:1)*s*(o.sx==null?1:o.sx),s*(o.sy||1));
  c.fillStyle=o.col||'#06090b';c.strokeStyle=o.col||'#06090b';c.lineCap='round';c.lineJoin='round';
  c.beginPath();c.moveTo(-60,0);
  c.bezierCurveTo(-75,-250,-95,-470,-118,-600);// спина пальто
  c.bezierCurveTo(-130,-690,-100,-760,-40,-790);// горб
  c.bezierCurveTo(-18,-805,-20,-845,-12,-875);// затылок
  c.lineTo(-66,-992);c.lineTo(22,-905);// острое ухо назад-вверх
  c.bezierCurveTo(38,-972,118,-990,150,-922);// лысый вытянутый купол
  c.lineTo(166,-890);// надбровье
  c.bezierCurveTo(184,-880,214,-852,224,-820);// длинный крючковатый нос
  c.bezierCurveTo(214,-812,196,-814,186,-817);
  c.lineTo(183,-806);c.lineTo(192,-782);c.lineTo(186,-783);c.lineTo(181,-796);c.lineTo(176,-782);c.lineTo(171,-784);c.lineTo(174,-800);// два зуба
  c.bezierCurveTo(172,-785,166,-770,146,-764);// подбородок
  c.bezierCurveTo(128,-758,112,-748,104,-726);// горло, стоячий воротник
  c.bezierCurveTo(118,-600,98,-340,82,0);c.closePath();c.fill();
  // рука: от плеча вперёд, пальцы-когти
  const hx=lerp(140,305,arm),hy=lerp(-430,-745,arm);
  c.lineWidth=40;c.beginPath();c.moveTo(30,-690);c.quadraticCurveTo(lerp(110,170,arm),lerp(-560,-640,arm),hx,hy);c.stroke();
  ell(c,hx+6,hy+2,26,20);c.fill();
  for(let i=0;i<4;i++){const sp=i-1.5;
    const fx=lerp(18+sp*14,165,arm),fy=lerp(170,18+sp*20,arm),cx=lerp(8+sp*10,90,arm),cy=lerp(80,-34+sp*12,arm);
    c.lineWidth=11;c.beginPath();c.moveTo(hx+6,hy+sp*7);c.quadraticCurveTo(hx+cx,hy+cy,hx+fx,hy+fy);c.stroke();
    // коготь загнут вниз
    c.lineWidth=6;c.beginPath();c.moveTo(hx+fx,hy+fy);c.quadraticCurveTo(hx+fx+lerp(0,16,arm),hy+fy+lerp(12,6,arm),hx+fx+lerp(-4,12,arm),hy+fy+lerp(26,26,arm));c.stroke();}
  // большой палец
  c.lineWidth=10;c.beginPath();c.moveTo(hx,hy+10);c.quadraticCurveTo(hx+30,hy+40,hx+lerp(10,60,arm),hy+lerp(90,40,arm));c.stroke();
  // вторая рука висит вдоль тела, пальцы ниже колен
  if(o.arm2!==false){c.lineWidth=32;c.beginPath();c.moveTo(-20,-680);c.quadraticCurveTo(40,-560,70,-430);c.stroke();
    for(let i=0;i<4;i++){c.lineWidth=9;c.beginPath();c.moveTo(70+i*5,-430);c.quadraticCurveTo(84+i*8,-360,82+i*10,-290+i*6);c.stroke();}}
  c.restore();}
// ---------- лицо Орлока анфас (портрет) ----------
function orlokFace(c,x,y,s,t,o={}){c.save();c.translate(x,y);c.scale(s,s);
  const skin1=o.skin1||'#c9cdbc',skin2=o.skin2||'#4d5850';
  // пальто и стоячий воротник
  c.fillStyle='#0b0f10';c.beginPath();c.moveTo(-380,620);c.quadraticCurveTo(-350,280,-120,215);c.lineTo(120,215);c.quadraticCurveTo(350,280,380,620);c.closePath();c.fill();
  c.beginPath();c.moveTo(-120,215);c.lineTo(-170,110);c.lineTo(-60,190);c.closePath();c.fill();c.beginPath();c.moveTo(120,215);c.lineTo(170,110);c.lineTo(60,190);c.closePath();c.fill();
  c.strokeStyle='rgba(150,180,175,0.22)';c.lineWidth=4;c.beginPath();c.moveTo(-170,110);c.lineTo(-120,215);c.quadraticCurveTo(-350,280,-380,620);c.stroke();
  // ряд пуговиц
  c.fillStyle='#1d2422';for(let i=0;i<4;i++){ell(c,0,300+i*80,9,9);c.fill();}
  // шея
  c.fillStyle=skin2;c.fillRect(-42,120,84,110);
  // уши: большие, острые, вверх и в стороны
  for(const sd of [-1,1]){c.save();c.scale(sd,1);
    c.fillStyle=skin2;c.beginPath();c.moveTo(112,-10);c.quadraticCurveTo(150,-70,232,-238);c.quadraticCurveTo(190,-120,124,-112);c.closePath();c.fill();
    c.fillStyle='rgba(20,26,24,0.55)';c.beginPath();c.moveTo(120,-30);c.quadraticCurveTo(150,-80,214,-210);c.quadraticCurveTo(176,-118,126,-100);c.closePath();c.fill();
    c.strokeStyle='rgba(210,215,195,0.35)';c.lineWidth=3;c.beginPath();c.moveTo(126,-112);c.quadraticCurveTo(190,-120,232,-238);c.stroke();c.restore();}
  // голова: вытянутый лысый купол
  const hp=()=>{c.beginPath();c.moveTo(0,-340);c.bezierCurveTo(106,-340,136,-236,130,-122);c.bezierCurveTo(126,-40,112,40,82,102);c.bezierCurveTo(60,150,30,176,0,178);
    c.bezierCurveTo(-30,176,-60,150,-82,102);c.bezierCurveTo(-112,40,-126,-40,-130,-122);c.bezierCurveTo(-136,-236,-106,-340,0,-340);c.closePath();};
  hp();let g=c.createRadialGradient(-40,-190,20,0,-60,300);g.addColorStop(0,skin1);g.addColorStop(0.55,o.skinm||'#8d968a');g.addColorStop(1,skin2);c.fillStyle=g;c.fill();
  c.save();hp();c.clip();
  // свет свечи слева снизу, правая сторона в тени
  g=c.createLinearGradient(-140,0,150,0);g.addColorStop(0,'rgba(10,16,18,0)');g.addColorStop(1,'rgba(10,16,18,0.55)');c.fillStyle=g;c.fillRect(-150,-360,300,560);
  // морщины на лбу
  c.strokeStyle='rgba(40,50,46,0.35)';c.lineWidth=3;for(const yy of [-205,-180,-157]){c.beginPath();c.moveTo(-60,yy);c.quadraticCurveTo(0,yy-10,60,yy);c.stroke();}
  // впалые щёки и виски
  c.fillStyle='rgba(28,36,34,0.32)';ell(c,-80,40,34,70,0.2);c.fill();ell(c,80,40,34,70,-0.2);c.fill();ell(c,-115,-150,22,60);c.fill();ell(c,115,-150,22,60);c.fill();
  c.restore();
  // глазницы
  for(const ex of [-54,54]){const gg=c.createRadialGradient(ex,-56,4,ex,-56,60);gg.addColorStop(0,'rgba(8,10,10,0.95)');gg.addColorStop(0.6,'rgba(12,16,16,0.7)');gg.addColorStop(1,'rgba(20,26,24,0)');c.fillStyle=gg;ell(c,ex,-56,56,44);c.fill();}
  // глаза: маленькие, светлые, взгляд прямо
  for(const ex of [-52,52]){c.fillStyle='#cfcab4';ell(c,ex,-54,17,11);c.fill();c.fillStyle='#0b0d0c';ell(c,ex+(o.look||0),-54,8,8);c.fill();
    if(o.glint>0){c.fillStyle=`rgba(255,240,200,${o.glint})`;ell(c,ex-3+(o.look||0),-57,3,3);c.fill();}}
  // тяжёлые брови, сведены
  c.strokeStyle='#1a1f1c';c.lineCap='round';c.lineWidth=15;
  c.beginPath();c.moveTo(-104,-104);c.quadraticCurveTo(-60,-104,-20,-80);c.stroke();c.beginPath();c.moveTo(104,-104);c.quadraticCurveTo(60,-104,20,-80);c.stroke();
  // нос: длинный, с горбинкой
  c.fillStyle='rgba(60,70,64,0.9)';c.beginPath();c.moveTo(-12,-74);c.quadraticCurveTo(-24,0,-24,52);c.quadraticCurveTo(-10,74,0,76);c.quadraticCurveTo(10,74,24,52);c.quadraticCurveTo(24,0,12,-74);c.closePath();c.fill();
  c.fillStyle=skin1;c.globalAlpha*=0.55;c.beginPath();c.moveTo(-8,-70);c.quadraticCurveTo(-16,0,-14,46);c.quadraticCurveTo(-6,30,-4,-70);c.fill();c.globalAlpha/=0.55;
  c.fillStyle='#141917';ell(c,-13,64,7,4);c.fill();ell(c,13,64,7,4);c.fill();
  // рот и два передних зуба
  c.strokeStyle='#161b19';c.lineWidth=5;c.beginPath();c.moveTo(-40,112);c.quadraticCurveTo(0,104,40,112);c.stroke();
  c.fillStyle='#dcd6c0';for(const tx of [-13,2]){c.beginPath();c.moveTo(tx,106);c.lineTo(tx+11,106);c.lineTo(tx+10,136);c.lineTo(tx+5.5,142);c.lineTo(tx+1,136);c.closePath();c.fill();}
  c.strokeStyle='rgba(30,30,25,0.6)';c.lineWidth=2;for(const tx of [-13,2]){c.beginPath();c.moveTo(tx,106);c.lineTo(tx+1,136);c.lineTo(tx+5.5,142);c.lineTo(tx+10,136);c.lineTo(tx+11,106);c.stroke();}
  // рука с длинными пальцами у воротника
  if(o.hand>0){c.save();c.globalAlpha*=o.hand;c.translate(-210,390);c.rotate(-0.15);
    c.fillStyle=skin2;ell(c,0,0,46,36);c.fill();
    for(let i=0;i<4;i++){const ang=-1.9+i*0.22;c.strokeStyle=i%2?'#7d877c':'#8e978b';c.lineWidth=15;c.beginPath();c.moveTo(Math.cos(ang)*30,Math.sin(ang)*20);
      const L=170+i%3*20;c.quadraticCurveTo(Math.cos(ang)*L*0.6,Math.sin(ang)*L*0.7,Math.cos(ang+0.4)*L,Math.sin(ang+0.4)*L*0.85);c.stroke();
      c.strokeStyle='#1b1f1c';c.lineWidth=7;c.beginPath();const ex=Math.cos(ang+0.4)*L,ey=Math.sin(ang+0.4)*L*0.85;c.moveTo(ex,ey);c.lineTo(ex+18,ey+12);c.stroke();}
    c.restore();}
  c.restore();}
// ---------- лестница старого дома (мир 1080x1920) ----------
// ступени поднимаются справа-снизу (1080,1300) налево-вверх (90,430). stairY(x) — линия носков ступеней
const ST={x0:1080,y0:1300,x1:90,y1:430,n:12};
function stairPt(p){return [lerp(ST.x0,ST.x1,p),lerp(ST.y0,ST.y1,p)];}
// o: cand (яркость свечи 0..1), moon (лунный свет в окне 0..1), dark (затемнение), sh {p,sx,arm,lean,a}, fig (фигура наверху 0..1), bend
function stairs(c,t,o){const ca=o.cand==null?1:o.cand,mo=o.moon||0;const CX=930,CY=1120;
  // стена: холодная, тёплая у свечи
  grad(c,'#15232a','#1a2a2e','#121c1f');
  glow(c,CX,CY-100,1250,'200,150,90',0.30*ca*flick(t,0.6));glow(c,CX,CY-60,520,'255,196,120',0.20*ca*flick(t));
  // окно наверху слева (луна) — за фигурой наверху
  c.fillStyle='#0f1b20';c.fillRect(110,110,200,300);
  const wg=c.createLinearGradient(0,120,0,400);wg.addColorStop(0,`rgba(150,190,205,${0.20+0.5*mo})`);wg.addColorStop(1,`rgba(90,130,150,${0.12+0.35*mo})`);
  c.fillStyle=wg;c.beginPath();c.moveTo(126,400);c.lineTo(126,190);c.quadraticCurveTo(210,104,294,190);c.lineTo(294,400);c.closePath();c.fill();
  c.strokeStyle='#0a1215';c.lineWidth=12;c.beginPath();c.moveTo(210,130);c.lineTo(210,400);c.moveTo(126,290);c.lineTo(294,290);c.stroke();
  glow(c,210,300,520,'130,170,190',0.10+0.30*mo);
  // лунный отсвет на ступенях сверху
  if(mo>0){c.fillStyle=`rgba(130,170,190,${0.12*mo})`;c.beginPath();c.moveTo(90,430);c.lineTo(330,430);c.lineTo(560,720);c.lineTo(300,740);c.closePath();c.fill();}
  // тень на стене (до перил, они впереди)
  if(o.sh&&o.sh.a>0){const sh=o.sh,[px,py]=stairPt(sh.p);c.save();c.globalAlpha=sh.a;c.filter='blur(3px)';
    orlokSil(c,px-60,py-150,sh.s||0.55,{flip:true,sx:sh.sx,sy:sh.sy||1,arm:sh.arm,lean:sh.lean||0,col:'rgba(6,9,12,0.88)'});c.filter='none';c.restore();}
  // площадка наверху и тёмный проём
  c.fillStyle='#0b1316';c.fillRect(-300,430,420,40);c.fillStyle='#070c0e';c.fillRect(-300,470,400,900);
  // ступени: косоур и носки
  c.fillStyle='#120d09';c.beginPath();c.moveTo(ST.x0,ST.y0);
  const dx=(ST.x1-ST.x0)/ST.n,dy=(ST.y1-ST.y0)/ST.n;
  for(let i=0;i<ST.n;i++){const x=ST.x0+dx*i,y=ST.y0+dy*i;c.lineTo(x,y+dy);c.lineTo(x+dx,y+dy);}
  c.lineTo(ST.x1,ST.y1+260);c.lineTo(ST.x0+200,ST.y0+260);c.closePath();c.fill();
  for(let i=0;i<ST.n;i++){const x=ST.x0+dx*i,y=ST.y0+dy*i;const d=Math.hypot(x-CX,y-CY);const lit=clamp(1-d/1000,0,1)*ca*flick(t,0.5)+mo*clamp(1-Math.hypot(x-210,y-430)/650,0,1)*0.8;
    c.fillStyle=`rgba(${Math.round(70+120*lit)},${Math.round(55+85*lit)},${Math.round(40+50*lit)},${0.35+0.5*lit})`;c.fillRect(x+dx,y+dy-8,-dx,10);
    c.strokeStyle=`rgba(255,205,140,${0.08+0.45*lit})`;c.lineWidth=3;c.beginPath();c.moveTo(x+dx,y+dy-8);c.lineTo(x,y+dy-8);c.stroke();}
  // под лестницей
  c.fillStyle='#0a1012';c.beginPath();c.moveTo(ST.x1,ST.y1+260);c.lineTo(ST.x0+200,ST.y0+260);c.lineTo(ST.x0+200,H+300);c.lineTo(ST.x1-400,H+300);c.closePath();c.fill();
  // пол
  c.fillStyle='#0e1517';c.fillRect(-300,1300,W+600,900);c.strokeStyle='rgba(255,205,140,0.06)';c.lineWidth=3;for(let i=0;i<6;i++){c.beginPath();c.moveTo(-300,1330+i*60+i*i*8);c.lineTo(W+300,1330+i*60+i*i*8);c.stroke();}
  glow(c,CX,1310,360,'255,190,110',0.10*ca);
  // перила: поручень и балясины
  const rh=230;c.strokeStyle='#0b0806';c.lineWidth=7;
  for(let i=0;i<ST.n;i++){const x=ST.x0+dx*(i+0.5),y=ST.y0+dy*(i+0.5)+dy*0.5;c.beginPath();c.moveTo(x,y-8);c.lineTo(x,y-rh+dy*0.0-6);c.stroke();}
  c.lineWidth=16;c.beginPath();c.moveTo(ST.x0+20,ST.y0-rh+20);c.lineTo(ST.x1,ST.y1-rh+30);c.stroke();
  c.strokeStyle=`rgba(255,205,140,${0.12+0.25*ca})`;c.lineWidth=3;c.beginPath();c.moveTo(ST.x0+20,ST.y0-rh+13);c.lineTo(ST.x1,ST.y1-rh+23);c.stroke();
  // столбик и свеча внизу
  c.fillStyle='#160f0a';c.fillRect(CX-34,CY+30,68,300);c.fillRect(CX-46,CY+14,92,22);
  candle(c,CX,CY+14,1.0,t,{a:ca,bend:o.bend||0,smoke:o.smoke||0});
  // фигура на верхней ступеньке: темнее темноты, на фоне окна
  if(o.fig>0){c.save();c.globalAlpha=o.fig;orlokSil(c,215,440,0.36,{flip:false,arm:0.15,arm2:true,col:'#020405'});c.restore();}
  if(o.dark>0){c.fillStyle=`rgba(2,5,7,${o.dark})`;c.fillRect(-600,-600,W+1200,H+1200);}
}
// состояние тени по ключам лестницы (lt — время внутри сцены lestnitsa)
function shadowState(lt){const cr=ease((lt-K('crawl'))/2.4),pa=ease((lt-K('palcy'))/2.0),sp=ease((lt-K('spina'))/1.8);
  const cl=clamp((lt-K('climb'))/(K('tiho')-K('climb')+0.6),0,1);
  // подъём по ступенькам ступенчато: шаг — пауза
  const steps=6,q=cl*steps,stp=(Math.floor(q)+ease((q%1)*1.6))/steps;
  return {p:lerp(0.06,0.2,cr)+0.36*stp,sx:lerp(0.13,1,pa),sy:lerp(1.05,1,pa),arm:lerp(0.2,1,pa),lean:0.1*sp+Math.sin(q*Math.PI*2)*0.01,a:cr,s:0.55};}
// ---------- дом на холме ----------
function house(c,x,y,s,t,o={}){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle=o.col||'#050b0e';
  c.beginPath();c.moveTo(-170,0);c.lineTo(-170,-520);c.lineTo(-200,-520);c.lineTo(-40,-780);c.lineTo(0,-760);c.lineTo(60,-860);c.lineTo(200,-520);c.lineTo(170,-520);c.lineTo(170,0);c.closePath();c.fill();
  c.fillRect(90,-760,36,140);
  c.strokeStyle='rgba(140,175,185,0.3)';c.lineWidth=5;c.beginPath();c.moveTo(-200,-520);c.lineTo(-40,-780);c.lineTo(0,-760);c.lineTo(60,-860);c.lineTo(200,-520);c.stroke();
  // окна
  c.fillStyle='#12232a';c.fillRect(-120,-300,80,120);c.fillRect(40,-300,80,120);c.fillRect(-40,-600,80,130);
  const cw=o.win==null?1:o.win;
  if(cw>0){c.save();c.beginPath();c.rect(-40,-600,80,130);c.clip();c.fillStyle=`rgba(120,90,50,${0.6*cw})`;c.fillRect(-40,-600,80,130);glow(c,0,-520,90,'255,200,120',0.7*cw*flick(t));c.restore();glow(c,0,-535,220,'255,190,110',0.18*cw*flick(t));}
  if(o.fig>0){c.save();c.beginPath();c.rect(-40,-600,80,130);c.clip();c.globalAlpha=o.fig;orlokSil(c,-30,-380,0.2,{arm:0,arm2:false,col:'#030506'});c.restore();}
  c.strokeStyle=o.col||'#050b0e';c.lineWidth=8;c.beginPath();c.moveTo(0,-600);c.lineTo(0,-470);c.moveTo(-40,-535);c.lineTo(40,-535);c.stroke();
  c.restore();}
// ---------- кинокадр (рамка плёнки) ----------
function filmFrame(c,x,y,w,h,t,draw,o={}){c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  c.translate(x,y);c.scale(w/W,h/H);draw(c);c.restore();
  // монохром + тонировка старой плёнки
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  c.globalCompositeOperation='saturation';c.fillStyle='#808080';c.fillRect(x,y,w,h);
  c.globalCompositeOperation='multiply';c.fillStyle=o.tint||'rgb(205,215,200)';c.fillRect(x,y,w,h);
  c.globalCompositeOperation='source-over';
  const fl=0.06+0.05*Math.sin(t*17+x)+0.03*Math.sin(t*29);c.fillStyle=`rgba(230,225,200,${fl*(o.fl==null?1:o.fl)})`;c.fillRect(x,y,w,h);
  c.strokeStyle='rgba(230,225,205,0.25)';c.lineWidth=2;for(let i=0;i<3;i++){const sx=x+((Math.sin(t*3.3+i*7)*0.5+0.5)*w);c.beginPath();c.moveTo(sx,y);c.lineTo(sx+3,y+h);c.stroke();}
  if(o.burn>0){// кадр «уничтожен»: царапины и муть
    c.fillStyle=`rgba(38,36,32,${0.97*o.burn})`;c.fillRect(x,y,w,h);
    c.strokeStyle=`rgba(200,195,175,${0.35*o.burn})`;c.lineWidth=2;for(let i=0;i<14;i++){const sx=x+((i*97.3)%w);c.beginPath();c.moveTo(sx,y);c.lineTo(sx+((i*31)%9)-4,y+h);c.stroke();}}
  c.restore();}
function filmStrip(c,x,y,w,h,col='#141412'){c.fillStyle=col;c.fillRect(x,y,w,h);}
// мини-рисунки для кадров плёнки
function frameStairs(c,t){stairs(c,t,{cand:1,sh:{p:0.42,sx:1,arm:1,lean:0.06,a:1,s:0.62}});}
function frameFace(c,t){grad(c,'#5a6460','#3e4743','#2a312e');glow(c,400,800,800,'255,220,170',0.25);orlokFace(c,540,860,1.6,t,{hand:1});}
function frameDoor(c,t){grad(c,'#5c6662','#4a5450','#2e3532');c.fillStyle='#232a28';c.fillRect(300,300,480,1100);
  const g=c.createLinearGradient(0,300,0,1400);g.addColorStop(0,'#8a948c');g.addColorStop(1,'#6a746c');c.fillStyle=g;c.fillRect(340,340,400,1060);
  orlokSil(c,520,1390,1.0,{arm:0,col:'#0b0e0d'});}
// ---------- архив ----------
const CANS=[];for(let r=0;r<5;r++)for(let i=0;i<4;i++)CANS.push({r,i,o:r6(),keep:(r==1&&i==2)||(r==3&&i==0)||(r==2&&i==3)});
function filmCan(c,x,y,rad,a,lit=0){c.save();c.globalAlpha*=a;c.fillStyle='#3a4140';ell(c,x,y,rad,rad*0.98);c.fill();
  c.strokeStyle='#6a7370';c.lineWidth=6;ell(c,x,y,rad*0.92,rad*0.9);c.stroke();c.fillStyle='#1a1e1d';ell(c,x,y,rad*0.25,rad*0.25);c.fill();
  c.strokeStyle='rgba(170,190,190,0.25)';c.lineWidth=3;c.beginPath();c.arc(x,y,rad*0.92,-2.6,-1.0);c.stroke();
  if(lit>0){glow(c,x,y,rad*1.9,'235,220,180',0.28*lit);c.strokeStyle=`rgba(240,225,185,${0.6*lit})`;c.lineWidth=4;c.beginPath();c.arc(x,y,rad*0.98,-2.9,-0.4);c.stroke();
    // бирка-ярлык (уехала за границу)
    c.fillStyle=`rgba(200,185,150,${0.8})`;c.save();c.translate(x+rad*0.7,y+rad*0.55);c.rotate(0.4);c.fillRect(0,0,46,28);c.fillStyle='#2a2f2e';ell(c,8,14,4,4);c.fill();c.restore();}
  c.restore();}
const SC={
  sky(c,t,lt){
    sky(c,t,0);c.fillStyle='rgba(2,14,18,0.55)';c.fillRect(0,0,W,H);
    const z=1+lt*0.006;c.save();zoomAt(c,W/2,H/2,z);
    const ent=ease(lt/1.6);moon(c,540,700,t);owl(c,540,760+(1-ent)*500,1.15*(0.6+0.4*ent),t,blink(t,0),false,{talk:talk(t)});c.restore();
    const gl=ease((lt-K('glow'))/1.6);
    glow(c,860,1050,420,'110,150,165',0.14*gl);
    c.fillStyle='#050b0e';c.beginPath();c.moveTo(0,1250);c.quadraticCurveTo(600,1150,1080,1185);c.lineTo(1080,H);c.lineTo(0,H);c.fill();
    house(c,860,1195,0.42,t,{col:'#050b0e',win:0.5+0.5*gl});
    fog(c,t,1050,1260,0.16);vignD(c,0.7);
  },
  plenka(c,t,lt){
    // старая плёнка 1922 года ползёт вниз; на «суд велел» кадры один за другим мутнеют, один остаётся
    grad(c,'#0d1719','#111d20','#0b1214');glow(c,540,700,700,'200,210,190',0.10);
    const sd=K('sud');const slow=1-0.8*ease((lt-sd)/3);
    const off=(lt*90*slow)%560;const fx=230,fw=620,fh=500;
    c.save();c.translate(0,0);
    filmStrip(c,fx-80,-100,fw+160,H+200);
    for(let i=-1;i<4;i++){const y=-260+i*560+off;
      // перфорация
      c.fillStyle='#2c2f2c';for(let j=0;j<6;j++){c.beginPath();c.roundRect(fx-60,y+20+j*90,34,46,6);c.fill();c.beginPath();c.roundRect(fx+fw+26,y+20+j*90,34,46,6);c.fill();}
      const kind=((i+20)%3);const burn=i===1?0:ease((lt-sd-0.3-Math.abs(i-1)*0.7)/1.4);
      filmFrame(c,fx,y,fw,fh,t,kind==0?(cc=>frameStairs(cc,t)):kind==1?(cc=>frameFace(cc,t)):(cc=>frameDoor(cc,t)),{burn});}
    c.restore();
    c.save();c.font='700 34px C';c.fillStyle='rgba(220,210,170,0.55)';c.translate(fx+fw+110,900);c.rotate(Math.PI/2);c.fillText('1922',0,0);c.restore();
    vignD(c,0.82);
  },
  lestnitsa(c,t,lt){
    // одна непрерывная сцена: свеча, лестница вверх, тень ползёт, пальцы, спина, подъём по ступеням
    const cd=ease((lt-K('candle'))/2),up=ease((lt-K('up'))/3),cl=ease((lt-K('climb'))/5);
    const sh=shadowState(lt);
    const z=lerp(1.25,1.08,up)*lerp(1,1.08,ease((lt-K('palcy'))/4)),cx=lerp(860,640,up),cy=lerp(1050,800,up)-220*cl;
    c.save();zoomAt(c,cx,cy,z);
    stairs(c,t,{cand:0.55+0.45*cd,sh});
    c.restore();
    fog(c,t,1000,1300,0.04,'160,150,130');vignD(c,0.66);
  },
  pusto(c,t,lt){
    // тень на стене, камера опускается к ступеньке, где должен стоять хозяин тени: пусто
    const nt=ease((lt-K('net'))/2.6),sv=ease((lt-K('sovsem'))/1.2);
    const [px,py]=stairPt(0.56);
    const z=1.3,cy=lerp(260,700,nt),cx=lerp(470,560,nt);
    c.save();c.translate(W/2,H*0.4);c.scale(z,z);c.translate(-cx,-cy);
    stairs(c,t,{cand:1,bend:sv*Math.sin(lt*3)*0.8,sh:{p:0.56,sx:1,arm:1,lean:0.1,a:1-0.15*sv,s:0.55}});
    // пустая ступенька под тенью в тёплом свете
    glow(c,px-40,py-20,260,'255,200,130',0.16*nt);
    c.restore();
    vignD(c,0.7);
  },
  arkhiv(c,t,lt){
    const sw=ease((lt-K('kopii')+0.6)/1.2);
    if(sw<1){// стол: книга «Дракула», письмо с печатью
      grad(c,'#141c1c','#162022','#0e1516');
      const z=1.04+lt*0.012;c.save();zoomAt(c,540,800,z);
      glow(c,820,520,700,'255,196,120',0.22*flick(t,0.5));
      c.fillStyle='#1d1610';c.fillRect(-200,860,W+400,900);c.strokeStyle='rgba(255,205,140,0.15)';c.lineWidth=3;c.beginPath();c.moveTo(-200,862);c.lineTo(W+200,862);c.stroke();
      // книга
      c.save();c.translate(430,760);c.rotate(-0.08);c.fillStyle='rgba(0,0,0,0.4)';c.fillRect(-250,-180,520,390);
      c.fillStyle='#3a1f1a';c.fillRect(-260,-200,500,380);c.strokeStyle='#6e5132';c.lineWidth=4;c.strokeRect(-236,-176,452,332);
      c.fillStyle='#c8a46a';c.font='700 72px C';c.textAlign='center';c.fillText('DRACULA',-10,-30);c.font='700 30px C';c.fillText('BRAM STOKER',-10,40);
      c.fillStyle='rgba(255,220,160,0.08)';c.fillRect(-260,-200,500,120);c.restore();
      // письмо с печатью въезжает
      const is=ease((lt-K('isk'))/1.8);
      c.save();c.translate(lerp(1300,700,is),lerp(1000,930,is));c.rotate(lerp(0.3,0.12,is));
      c.fillStyle='#bdb39a';c.fillRect(-200,-120,400,250);c.strokeStyle='rgba(60,50,40,0.5)';c.lineWidth=3;
      for(let i=0;i<7;i++){c.beginPath();c.moveTo(-160,-80+i*28);c.lineTo(lerp(60,150,(i*37%10)/10),-80+i*28);c.stroke();}
      c.fillStyle='#5a1714';ell(c,110,90,34,34);c.fill();c.fillStyle='#43100e';ell(c,110,90,22,22);c.fill();c.restore();
      candle(c,860,850,1.0,t,{});
      c.restore();vignD(c,0.72);}
    if(sw>0){c.save();c.globalAlpha=sw;
      // архив: полки с коробками плёнки; на «уничтожить» гаснут одна за другой, несколько остаются
      grad(c,'#101a1c','#13201f','#0b1314');
      const z=1.02+0.02*(lt-K('kopii'));c.save();zoomAt(c,540,760,z);
      glow(c,540,600,800,'140,170,170',0.12);
      const kp=K('kopii'),uc=K('ucel');
      for(let r=0;r<5;r++){const y=300+r*190;c.fillStyle='#0a0f10';c.fillRect(80,y+90,920,18);c.strokeStyle='rgba(150,180,180,0.18)';c.lineWidth=3;c.beginPath();c.moveTo(80,y+90);c.lineTo(1000,y+90);c.stroke();}
      for(const cn of CANS){if(cn.r==0&&cn.i==3)continue;const x=170+cn.i*210,y=300+cn.r*190;
        const gone=cn.keep?0:ease((lt-kp-0.2-cn.o*2.2)/0.9);const lit=cn.keep?ease((lt-uc)/1.6):0;
        filmCan(c,x,y,78,1-0.93*gone,lit);}
      // коробка с плёнкой впереди: край кадра светлеет
      const ed=ease((lt-uc-0.4)/2.5);
      c.fillStyle='#2b241a';c.fillRect(260,1080,560,120);c.fillStyle='#1d1811';c.fillRect(260,1060,560,24);
      c.save();c.beginPath();c.rect(330,960,420,110);c.clip();c.fillStyle='#161614';c.fillRect(330,960,420,110);
      for(let i=0;i<3;i++){const fx=360+i*130;c.fillStyle=`rgba(${120+110*ed},${120+100*ed},${110+80*ed},${0.35+0.4*ed})`;c.fillRect(fx,980,110,80);}
      c.restore();glow(c,540,1000,300,'240,225,185',0.18*ed);
      c.restore();vignD(c,0.74);c.restore();}
  },
  akter(c,t,lt){
    const sw=ease((lt-K('zerkalo')+0.6)/1.2);
    if(sw<1){// портрет актёра: Макс Шрек в гриме графа
      grad(c,'#141d1e','#172224','#0e1517');
      const ig=ease((lt-K('ispug'))/1.6);const z=1+0.02*lt+0.12*ig;c.save();zoomAt(c,470,640,z);c.translate(-110,60);
      glow(c,900,1000,800,'255,196,120',0.24*flick(t,0.6));
      // рама
      c.fillStyle='#2a2016';c.fillRect(200,140,680,920);c.strokeStyle='#5f4a2c';c.lineWidth=8;c.strokeRect(222,162,636,876);
      c.save();c.beginPath();c.rect(240,180,600,840);c.clip();
      grad(c,'#4d5754','#3c4542','#272e2c');glow(c,420,700,520,'255,220,170',0.22);
      orlokFace(c,540,640,1.05,t,{hand:1,glint:0.7*ig});
      c.globalCompositeOperation='saturation';c.fillStyle='#808080';c.fillRect(240,180,600,840);c.globalCompositeOperation='multiply';c.fillStyle='rgb(214,214,196)';c.fillRect(240,180,600,840);
      c.restore();
      c.fillStyle='rgba(255,220,160,0.05)';c.fillRect(200,140,680,920);
      // табличка над рамой (снизу её закрывали субтитры)
      c.fillStyle='#4b3a22';c.fillRect(420,92,240,46);c.fillStyle='#b99a62';c.font='700 26px C';c.textAlign='center';c.fillText('MAX SCHRECK',540,124);
      c.restore();
      candle(c,930,1180,0.9,t,{});
      vignD(c,0.72);}
    if(sw>0){c.save();c.globalAlpha=sw;
      // гримёрка: зеркало, пустой стул. В зеркале проступает лысая голова с острыми ушами
      grad(c,'#121b1d','#152022','#0d1416');
      const vp=ease((lt-K('vampir'))/2.6);const z=1.02+0.015*(lt-K('zerkalo'))+0.08*vp;c.save();zoomAt(c,430,700,z);c.translate(-150,40);
      // рама зеркала и лампочки (половина не горит)
      c.fillStyle='#231c14';c.fillRect(190,170,700,860);
      for(let i=0;i<7;i++){for(const [bx,by] of [[215,210+i*125],[865,210+i*125]]){const on=(i*3+bx)%4===1;c.fillStyle=on?'#e8d6a4':'#3a352c';ell(c,bx,by,15,15);c.fill();if(on)glow(c,bx,by,90,'255,220,160',0.25*flick(t+i));}}
      // отражение: стена, стул
      c.save();c.beginPath();c.rect(250,210,580,780);c.clip();
      grad(c,'#33413f','#2a3634','#1d2624');glow(c,540,520,500,'200,215,205',0.12);
      c.fillStyle='rgba(150,170,165,0.08)';c.fillRect(250,210,580,780);
      // фигура в отражении за стулом
      if(vp>0){c.save();c.globalAlpha=vp*0.92;orlokSil(c,600,1180,0.62,{flip:true,arm:0.0,arm2:false,col:'#0a0e0e'});c.restore();}
      // спинка стула в отражении
      c.fillStyle='#120d0a';c.fillRect(440,780,200,26);c.fillRect(450,780,20,260);c.fillRect(610,780,20,260);c.fillRect(450,860,180,14);
      // блик стекла
      c.fillStyle='rgba(220,235,230,0.06)';c.beginPath();c.moveTo(250,210);c.lineTo(420,210);c.lineTo(250,600);c.closePath();c.fill();
      c.restore();
      // столик и пустой стул впереди (спинка)
      c.fillStyle='#1b140e';c.fillRect(140,1030,800,40);c.fillStyle='#120d09';c.fillRect(150,1070,780,300);
      c.fillStyle='#0b0806';c.fillRect(400,1000,280,36);c.fillRect(412,1000,26,400);c.fillRect(642,1000,26,400);c.fillRect(412,1110,256,18);
      c.strokeStyle='rgba(255,205,140,0.18)';c.lineWidth=3;c.beginPath();c.moveTo(400,1000);c.lineTo(680,1000);c.stroke();
      c.restore();vignD(c,0.74);c.restore();}
  },
  svet(c,t,lt){
    // общий план лестницы. «Выключи свет»: свеча гаснет, почти чёрное ~1,5 с, потом лунный свет и фигура наверху
    const of=K('off'),os=K('ostalsya');const out=ease((lt-of)/0.6);
    const mo=ease((lt-of-1.6)/2.2);const fg=ease((lt-os)/2.4);
    c.save();zoomAt(c,520,820,1.0+0.01*lt);c.translate(40,170);
    stairs(c,t,{cand:1-out,moon:mo,smoke:out*(1-ease((lt-of-2.5)/2)),fig:fg*0.97,dark:0.9*out*(1-0.55*mo)});
    c.restore();
    // фигура — силуэт поверх затемнения: заново, чтобы была «темнее темноты» на светлом окне
    vignD(c,0.66);
  },
  goodnight(c,t,lt){
    sky(c,t,0);c.fillStyle='rgba(2,14,18,0.55)';c.fillRect(0,0,W,H);
    const dim=ease((lt-K('dim'))/2);
    c.save();const z=1.12-lt*0.006;zoomAt(c,W/2,H/2,z);
    const SL=K('sleep');const sl=ease((lt-SL)/2.5);
    moon(c,540,700,t);owl(c,540,760,1.15,t,clamp(blink(t,0)+sl,0,1),true,{talk:talk(t),sleepy:sl});
    c.restore();
    if(sl>0){c.save();c.font='700 64px C';c.fillStyle='#b8c4cc';for(let i=0;i<3;i++){const p=((t*0.35+i/3)%1);c.globalAlpha=sl*Math.sin(p*Math.PI)*0.6;c.fillText('z',640+p*120+Math.sin(p*9)*15,560-p*260);}c.restore();}
    glow(c,860,1050,420,'110,150,165',0.14);
    c.fillStyle='#050b0e';c.beginPath();c.moveTo(0,1250);c.quadraticCurveTo(600,1150,1080,1185);c.lineTo(1080,H);c.lineTo(0,H);c.fill();
    // последняя мурашка: в окне со свечой медленно проступает горбатый силуэт с острыми ушами
    house(c,860,1195,0.42,t,{col:'#050b0e',win:0.8,fig:ease((lt-SL-2.2)/2.6)});
    fog(c,t,1050,1260,0.16);
    c.fillStyle=`rgba(0,6,10,${0.15*dim})`;c.fillRect(0,0,W,H);vignD(c,0.72);
  }
};
