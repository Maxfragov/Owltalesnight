// Страшная арка s04: маска из «Крика» (1996). Подключается после obshchee/core.js.
window.END_SUB='страшные истории';
// Узнаём по символам: вытянутая белая маска с открытым ртом (СВОЯ форма: круглые вертикальные глазницы,
// кривой овал рта, без «песочных часов» и каплевидных глаз Fun World), чёрный капюшон на спинке стула, телефон с проводом.
// Маску целиком в луче не показываем: край светлого овала и тёмный провал рта. Без ножа, без крови, без скримеров.
// Палитра: холодные сине-зелёные, почти чёрный (не полный), тусклый жёлтый луч фонарика. Силуэты держим на фоне
// более светлого тумана / лунного света, чтобы читались на телефоне.
const DEFK={glow:1.4,beam:1.0,found:4.54,up:5.04,dark:8.4,sweep:0.4,chair:2.86,hide:5.22,face:5.82,mouth:8.8,scream:9.8,dolgo:12.08,wait:14.98,
  back:0.8,photo:1.2,toy:5.98,cord:0.8,feet:2.67,near:3.9,put:0.8,tel:3.49,dim:0.8,sleep:1.2,end:3.4};
const DEFKA={hide:16.16,back:29.9};
const K=n=>CFG.k&&CFG.k[n]!=null?CFG.k[n]:DEFK[n];
const KA=n=>CFG.ka&&CFG.ka[n]!=null?CFG.ka[n]:DEFKA[n];
// мини-совёнок прячется на жути (строки 5–7) и возвращается на строке 8
const _miniOwl=miniOwl;
miniOwl=function(c,t,a){const h=ease((t-KA('hide'))/1.0)*(1-ease((t-KA('back'))/1.4));_miniOwl(c,t,a*(1-0.88*h));};
// ---------- helpers ----------
let sd4=41;function r4(){sd4=(sd4*16807)%2147483647;return (sd4-1)/2147483646;}
const FOG=[];for(let i=0;i<34;i++)FOG.push({x:r4()*1.4-0.2,y:r4(),r:160+r4()*260,v:6+r4()*14,p:r4()*6.28});
function fog(c,t,y0,y1,a){c.save();c.globalCompositeOperation='screen';
  for(const f of FOG){const x=((f.x*W+t*f.v)%(W*1.4)+W*1.4)%(W*1.4)-W*0.2,y=lerp(y0,y1,f.y)+Math.sin(t*0.2+f.p)*20;
    const g=c.createRadialGradient(x,y,0,x,y,f.r);const al=a*(0.55+0.45*Math.sin(t*0.15+f.p));
    g.addColorStop(0,`rgba(120,150,155,${al})`);g.addColorStop(1,'rgba(120,150,155,0)');c.fillStyle=g;c.fillRect(x-f.r,y-f.r,f.r*2,f.r*2);}
  c.restore();}
function vignD(c,k=0.8){const g=c.createRadialGradient(W/2,H*0.42,H*0.2,W/2,H*0.45,H*0.74);g.addColorStop(0,'rgba(2,6,8,0)');g.addColorStop(1,`rgba(2,6,8,${k})`);c.fillStyle=g;c.fillRect(0,0,W,H);}
function grad(c,a,b,d){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,a);g.addColorStop(0.55,b);g.addColorStop(1,d);c.fillStyle=g;c.fillRect(-400,-400,W+800,H+800);}
function glow(c,x,y,r,col,a){if(a<=0)return;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
function zoomAt(c,x,y,z){c.translate(x,y);c.scale(z,z);c.translate(-x,-y);}
// ---------- маска: своя форма ----------
// вытянутый овал с длинным подбородком, круглые вертикальные глазницы, кривой вертикальный провал рта
function maskPath(c){c.beginPath();c.moveTo(0,-185);
  c.bezierCurveTo(70,-185,104,-120,100,-50);c.bezierCurveTo(97,20,78,70,62,120);c.bezierCurveTo(48,165,24,195,-2,196);
  c.bezierCurveTo(-30,195,-52,162,-64,118);c.bezierCurveTo(-80,66,-98,18,-100,-52);c.bezierCurveTo(-102,-124,-68,-185,0,-185);c.closePath();}
function maskK(c,x,y,s,o={}){const a=o.a==null?1:o.a,col=o.col||[214,220,212],rot=o.rot||0;if(a<=0)return;
  c.save();c.translate(x,y);c.rotate(rot);c.scale(s,s);c.globalAlpha*=a;
  maskPath(c);const g=c.createRadialGradient(-28,-80,20,0,-10,230);
  g.addColorStop(0,`rgb(${col.map(v=>Math.min(255,v+24)).join(',')})`);g.addColorStop(0.6,`rgb(${col.join(',')})`);g.addColorStop(1,`rgb(${col.map(v=>Math.round(v*0.5)).join(',')})`);
  c.fillStyle=g;c.fill();
  c.save();maskPath(c);c.clip();
  const sh=c.createLinearGradient(-110,0,130,30);sh.addColorStop(0,'rgba(18,36,44,0)');sh.addColorStop(1,'rgba(18,36,44,0.45)');c.fillStyle=sh;c.fillRect(-130,-200,260,400);
  // мягкие впадины под глазами и скулы
  c.fillStyle='rgba(30,50,58,0.16)';for(const ex of [-40,40]){ell(c,ex,-4,34,52);c.fill();}
  // тень: в луче только край и рот, верх-лево уходит в темноту
  if(o.shade>0){const sg=c.createLinearGradient(-110,-190,70,130);sg.addColorStop(0,`rgba(3,8,10,${0.92*o.shade})`);sg.addColorStop(0.55,`rgba(3,8,10,${0.6*o.shade})`);sg.addColorStop(1,'rgba(3,8,10,0)');c.fillStyle=sg;c.fillRect(-130,-200,260,400);}
  c.restore();
  // глазницы: круглые, вертикальные, чуть разной высоты
  for(const [ex,ey] of [[-40,-46],[40,-42]]){const gg=c.createRadialGradient(ex,ey,2,ex,ey,40);gg.addColorStop(0,'#020405');gg.addColorStop(0.65,'#050b0d');gg.addColorStop(1,'rgba(6,14,18,0)');
    c.fillStyle=gg;ell(c,ex,ey,30,40);c.fill();c.fillStyle='#020405';ell(c,ex,ey,20,29);c.fill();}
  // рот: длинный кривой овал, без перехвата
  c.fillStyle='rgba(10,20,24,0.5)';c.beginPath();c.moveTo(-4,40);c.bezierCurveTo(30,42,32,110,18,150);c.bezierCurveTo(8,170,-22,168,-28,140);c.bezierCurveTo(-36,100,-34,40,-4,40);c.fill();
  c.fillStyle='#020405';c.beginPath();c.moveTo(-4,50);c.bezierCurveTo(22,52,24,108,14,140);c.bezierCurveTo(6,158,-16,156,-21,134);c.bezierCurveTo(-27,98,-26,50,-4,50);c.fill();
  c.restore();}
// чёрный капюшон с плащом, висит на спинке стула (пустой)
function hood(c,x,y,s,t,o={}){c.save();c.translate(x,y);c.scale(s,s);const sw=Math.sin(t*0.4)*3;
  c.fillStyle=o.col||'#06090b';c.beginPath();
  c.moveTo(0,-250);c.quadraticCurveTo(70,-240,92,-150);c.quadraticCurveTo(108,-90,150,-60);c.quadraticCurveTo(190,40,170+sw,260);
  c.lineTo(-170+sw,260);c.quadraticCurveTo(-190,40,-150,-60);c.quadraticCurveTo(-108,-90,-92,-150);c.quadraticCurveTo(-70,-240,0,-250);c.closePath();c.fill();
  // проём капюшона — пустой
  c.fillStyle='#010304';c.beginPath();c.moveTo(0,-206);c.quadraticCurveTo(52,-196,58,-120);c.quadraticCurveTo(52,-60,0,-48);c.quadraticCurveTo(-52,-60,-58,-120);c.quadraticCurveTo(-52,-196,0,-206);c.fill();
  // лунный контур по краю ткани
  const rim=o.rim==null?1:o.rim;c.strokeStyle=`rgba(150,185,195,${0.34*rim})`;c.lineWidth=4;c.lineCap='round';
  c.beginPath();c.moveTo(-150,-60);c.quadraticCurveTo(-108,-90,-92,-150);c.quadraticCurveTo(-70,-240,0,-250);c.quadraticCurveTo(50,-244,74,-200);c.stroke();
  c.beginPath();c.moveTo(-150,-60);c.quadraticCurveTo(-190,40,-170+sw,260);c.stroke();
  c.strokeStyle=`rgba(150,185,195,${0.12*rim})`;for(const dx of [-80,-20,50]){c.beginPath();c.moveTo(dx,-20);c.quadraticCurveTo(dx+10+sw,120,dx+sw,250);c.stroke();}
  c.restore();}
// детский стульчик в углу
function chair(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle='#1b2a2c';
  c.fillRect(-120,-330,22,330);c.fillRect(98,-330,22,330);// задние ножки и спинка
  c.fillRect(-120,-330,240,26);c.fillRect(-120,-250,240,16);
  c.fillStyle='#22332f';c.beginPath();c.moveTo(-140,-120);c.lineTo(140,-120);c.lineTo(160,-90);c.lineTo(-160,-90);c.closePath();c.fill();
  c.fillStyle='#16221f';c.fillRect(-150,-90,20,90);c.fillRect(130,-90,20,90);
  c.strokeStyle='rgba(150,185,195,0.25)';c.lineWidth=3;c.beginPath();c.moveTo(-160,-90);c.lineTo(160,-90);c.stroke();
  c.restore();}
// плюшевый мишка (силуэт с пуговичными глазами)
function bear(c,x,y,s,a=1){c.save();c.translate(x,y);c.scale(s,s);c.globalAlpha*=a;c.fillStyle='#2a2620';
  ell(c,0,-60,62,70);c.fill();ell(c,0,-150,46,42);c.fill();ell(c,-38,-184,16,16);c.fill();ell(c,38,-184,16,16);c.fill();
  ell(c,-58,-6,26,18);c.fill();ell(c,58,-6,26,18);c.fill();
  c.fillStyle='#3a342a';ell(c,0,-136,20,15);c.fill();c.fillStyle='rgba(180,200,200,0.5)';ell(c,-16,-158,4,4);c.fill();ell(c,16,-158,4,4);c.fill();
  c.restore();}
// пластиковое ведёрко-тыква для конфет
function pail(c,x,y,r,a=1){c.save();c.translate(x,y);c.globalAlpha*=a;c.fillStyle='#4a2a12';ell(c,0,-r*0.8,r,r*0.82);c.fill();
  c.strokeStyle='#2a1a0e';c.lineWidth=r*0.08;c.beginPath();c.arc(0,-r*1.2,r*0.95,Math.PI*1.08,Math.PI*1.92);c.stroke();
  c.fillStyle='#1a0f08';const tri=(ax,ay,bx,by,cx_,cy_)=>{c.beginPath();c.moveTo(ax,ay);c.lineTo(bx,by);c.lineTo(cx_,cy_);c.closePath();c.fill();};
  tri(-r*0.5,-r*0.85,-r*0.15,-r*0.85,-r*0.33,-r*1.12);tri(r*0.5,-r*0.85,r*0.15,-r*0.85,r*0.33,-r*1.12);
  c.beginPath();c.moveTo(-r*0.5,-r*0.55);c.quadraticCurveTo(0,-r*0.2,r*0.5,-r*0.55);c.quadraticCurveTo(0,-r*0.42,-r*0.5,-r*0.55);c.fill();c.restore();}
// детская комната. o: z (камера), cx,cy (центр наезда), beam {x,y,r,a}, dk (темнота вне луча), mask (альфа), mrot, day (0..1)
function room(c,t,o){const z=o.z||1,day=o.day||0;
  c.save();zoomAt(c,o.cx||620,o.cy||820,z);
  // стены: угол на x 620
  c.fillStyle=day?'#1c2d31':'#132326';c.fillRect(-500,-500,W+1000,H+1000);
  c.fillStyle='#162a2e';c.beginPath();c.moveTo(620,100);c.lineTo(1500,-200);c.lineTo(1500,1180);c.lineTo(620,985);c.closePath();c.fill();
  // обои: бледные полоски на правой стене
  c.strokeStyle='rgba(150,185,190,0.05)';c.lineWidth=10;for(let i=0;i<9;i++){const x=680+i*80,k=(x-620)/880;c.beginPath();c.moveTo(x,100-300*k);c.lineTo(x,985+195*k);c.stroke();}
  // пол
  c.fillStyle='#0d1a1c';c.beginPath();c.moveTo(-500,1300);c.lineTo(620,985);c.lineTo(1500,1180);c.lineTo(1500,2400);c.lineTo(-500,2400);c.closePath();c.fill();
  c.strokeStyle='rgba(140,170,170,0.06)';c.lineWidth=3;for(let i=-8;i<=10;i++){c.beginPath();c.moveTo(620+i*14,990);c.lineTo(620+i*190,2400);c.stroke();}
  c.strokeStyle='rgba(150,185,190,0.18)';c.lineWidth=3;c.beginPath();c.moveTo(620,100);c.lineTo(620,985);c.stroke();
  // окно на левой стене: холодный лунный свет
  c.fillStyle='#2c4c55';c.beginPath();c.moveTo(150,330);c.lineTo(400,390);c.lineTo(400,760);c.lineTo(150,800);c.closePath();c.fill();
  c.fillStyle='rgba(190,220,225,0.10)';c.beginPath();c.moveTo(160,345);c.lineTo(390,400);c.lineTo(390,560);c.lineTo(160,520);c.closePath();c.fill();
  c.strokeStyle='#0b1517';c.lineWidth=14;c.beginPath();c.moveTo(150,330);c.lineTo(400,390);c.lineTo(400,760);c.lineTo(150,800);c.closePath();c.moveTo(275,360);c.lineTo(275,780);c.moveTo(150,565);c.lineTo(400,575);c.stroke();
  // лунное пятно на полу
  c.fillStyle='rgba(120,165,180,0.11)';c.beginPath();c.moveTo(330,1150);c.lineTo(560,1060);c.lineTo(760,1260);c.lineTo(470,1400);c.closePath();c.fill();
  glow(c,280,560,420,'110,160,175',0.10);
  // мобиль над кроваткой
  {c.strokeStyle='rgba(150,180,180,0.25)';c.lineWidth=2;c.beginPath();c.moveTo(300,60);c.lineTo(300,200);c.stroke();
   const ang=Math.sin(t*0.3)*0.4;for(let i=0;i<4;i++){const a2=ang+i*Math.PI/2,dx=Math.cos(a2)*70,dz=Math.sin(a2);
     c.beginPath();c.moveTo(300,200);c.lineTo(300+dx,215);c.lineTo(300+dx,260+i*8);c.stroke();
     c.fillStyle=`rgba(140,165,165,${0.25+0.15*dz})`;ell(c,300+dx,270+i*8,12,12);c.fill();}}
  // лошадка-качалка (силуэт)
  c.save();c.translate(170,1180);c.rotate(Math.sin(t*0.25)*0.02);c.fillStyle='#0a1416';
  c.beginPath();c.moveTo(-130,0);c.quadraticCurveTo(0,40,130,0);c.lineTo(130,10);c.quadraticCurveTo(0,52,-130,10);c.fill();
  c.fillRect(-90,-120,14,120);c.fillRect(70,-120,14,120);ell(c,0,-150,110,40);c.fill();
  c.beginPath();c.moveTo(80,-170);c.lineTo(120,-280);c.quadraticCurveTo(170,-300,180,-250);c.lineTo(150,-230);c.lineTo(110,-150);c.fill();
  c.strokeStyle='rgba(150,185,195,0.18)';c.lineWidth=3;c.beginPath();c.moveTo(-110,-170);c.quadraticCurveTo(0,-200,110,-170);c.stroke();c.restore();
  // мяч, мишка, ведёрко-тыква
  {c.fillStyle='#24302c';ell(c,860,1150,46,46);c.fill();c.strokeStyle='rgba(150,185,195,0.2)';c.lineWidth=3;c.beginPath();c.arc(860,1150,46,-2.6,-1.0);c.stroke();}
  bear(c,420,1060,0.75,0.95);
  pail(c,800,1060,34,0.9);
  // стул, капюшон на спинке, маска на сиденье — лицом к двери (к нам)
  chair(c,620,1010,0.9);
  hood(c,620,700,0.62,t,{rim:1});
  maskK(c,622,818,0.5,{a:o.mask==null?1:o.mask,rot:(o.mrot||0)-0.06,col:o.mcol||[212,218,210],shade:o.mshade||0});
  fog(c,t,900,1300,0.05);
  // фонарик: вне луча темно (не в ноль), в луче тёплый свет
  const b=o.beam;
  if(b&&b.a>0){const dk=o.dk==null?0.62:o.dk;
    const g=c.createRadialGradient(b.x,b.y,b.r*0.22,b.x,b.y,b.r*1.35);g.addColorStop(0,'rgba(2,6,8,0)');g.addColorStop(1,`rgba(2,6,8,${dk*b.a})`);c.fillStyle=g;c.fillRect(-600,-600,W+1200,H+1200);
    c.save();c.globalCompositeOperation='lighter';glow(c,b.x,b.y,b.r*1.15,'255,206,140',0.16*b.a);glow(c,b.x,b.y,b.r*0.5,'255,226,170',0.08*b.a);
    c.fillStyle=`rgba(255,206,140,${0.025*b.a})`;c.beginPath();c.moveTo(520,2300);c.lineTo(600,2300);c.lineTo(b.x+b.r*0.9,b.y);c.lineTo(b.x-b.r*0.9,b.y);c.closePath();c.fill();c.restore();}
  else if(o.dk){c.fillStyle=`rgba(2,6,8,${o.dk})`;c.fillRect(-600,-600,W+1200,H+1200);}
  c.restore();}
// дом-силуэт: двухэтажный, двускатная крыша. win: фонарик в окне первого этажа {x,a}; up: бледный овал в окне наверху
function house(c,x,y,s,t,o={}){c.save();c.translate(x,y);c.scale(s,s);
  c.fillStyle=o.col||'#071114';
  c.beginPath();c.moveTo(-300,0);c.lineTo(-300,-420);c.lineTo(-340,-420);c.lineTo(0,-700);c.lineTo(340,-420);c.lineTo(300,-420);c.lineTo(300,0);c.closePath();c.fill();
  c.fillRect(-220,-700,50,160);// труба
  // крыльцо
  c.fillRect(-360,-10,720,20);c.fillRect(-120,-190,240,14);c.fillRect(-110,-190,12,190);c.fillRect(98,-190,12,190);
  // контур крыши от неба
  c.strokeStyle='rgba(140,175,185,0.28)';c.lineWidth=4;c.beginPath();c.moveTo(-340,-420);c.lineTo(0,-700);c.lineTo(340,-420);c.stroke();
  // окна
  const wins=[[-200,-330,110,140],[90,-330,110,140],[-210,-560+0,0,0]];
  c.fillStyle='#12252b';c.fillRect(-230,-330,120,150);c.fillRect(110,-330,120,150);// низ
  c.fillRect(-70,-610,140,170);// наверху: детская
  c.fillRect(-55,-170,110,170);// дверь
  c.fillStyle='rgba(170,200,210,0.07)';c.fillRect(-230,-330,120,60);c.fillRect(110,-330,120,60);c.fillRect(-70,-610,140,70);
  // фонарик внутри, первый этаж
  if(o.win&&o.win.a>0){c.save();c.beginPath();c.rect(-230,-330,120,150);c.rect(110,-330,120,150);c.clip();
    glow(c,o.win.x,-250,90,'255,206,140',0.55*o.win.a);glow(c,o.win.x,-250,26,'255,236,190',0.7*o.win.a);c.restore();}
  if(o.up>0){c.save();c.beginPath();c.rect(-70,-610,140,170);c.clip();maskK(c,0,-520,0.26,{a:0.55*o.up,col:[190,200,196]});c.restore();}
  // переплёты
  c.strokeStyle=o.col||'#071114';c.lineWidth=10;
  for(const [wx,wy,ww,wh] of [[-230,-330,120,150],[110,-330,120,150],[-70,-610,140,170]]){c.beginPath();c.moveTo(wx+ww/2,wy);c.lineTo(wx+ww/2,wy+wh);c.moveTo(wx,wy+wh/2);c.lineTo(wx+ww,wy+wh/2);c.stroke();}
  c.restore();}
// телефон 90-х: корпус, кнопки, трубка на рычаге, витой шнур. y — низ корпуса
function phone(c,x,y,s,t,o={}){c.save();c.translate(x,y);c.scale(s,s);
  const lit=o.lit==null?1:o.lit;
  // тень
  c.fillStyle='rgba(0,0,0,0.35)';ell(c,0,4,190,22);c.fill();
  // корпус
  let g=c.createLinearGradient(0,-150,0,0);g.addColorStop(0,'#4d5452');g.addColorStop(1,'#262c2c');c.fillStyle=g;
  c.beginPath();c.moveTo(-170,0);c.lineTo(-140,-130);c.quadraticCurveTo(0,-150,140,-130);c.lineTo(170,0);c.closePath();c.fill();
  // кнопки
  for(let r=0;r<4;r++)for(let k=0;k<3;k++){c.fillStyle='#6d7471';c.beginPath();c.roundRect(-42+k*30-12,-100+r*22-7,24,14,4);c.fill();}
  // трубка на рычаге
  g=c.createLinearGradient(0,-215,0,-140);g.addColorStop(0,'#5b6260');g.addColorStop(1,'#2a302f');c.fillStyle=g;
  c.beginPath();c.moveTo(-190,-150);c.quadraticCurveTo(-200,-200,-150,-205);c.lineTo(150,-205);c.quadraticCurveTo(200,-200,190,-150);c.lineTo(130,-150);c.quadraticCurveTo(120,-175,80,-178);c.lineTo(-80,-178);c.quadraticCurveTo(-120,-175,-130,-150);c.closePath();c.fill();
  // блик лунного света
  c.strokeStyle=`rgba(170,205,215,${0.45*lit})`;c.lineWidth=4;c.lineCap='round';c.beginPath();c.moveTo(-170,-190);c.quadraticCurveTo(-160,-202,-140,-203);c.lineTo(140,-203);c.stroke();
  c.beginPath();c.moveTo(-138,-128);c.quadraticCurveTo(0,-147,138,-128);c.stroke();
  // витой шнур от трубки к корпусу
  c.strokeStyle='#2a302f';c.lineWidth=7;c.beginPath();const sw=Math.sin(t*0.5)*4*(o.sway||0);
  for(let i=0;i<=140;i++){const u=i/140,px=-185-40*Math.sin(u*Math.PI)+sw*Math.sin(u*Math.PI),py=-160+u*150,cx2=px+Math.cos(u*60)*6,cy2=py+Math.sin(u*60)*3;i?c.lineTo(cx2,cy2):c.moveTo(cx2,cy2);}c.stroke();
  c.restore();}
// дверь с полосой света снизу; feet 0..1 — две тени ног в полосе
function doorStrip(c,x,y,w,h,t,o={}){const fe=o.feet||0,lt2=o.light==null?1:o.light;
  c.fillStyle='#1d2c2c';c.fillRect(x-w/2-26,y-h-26,w+52,h+26);
  c.fillStyle='#0f1b1c';c.fillRect(x-w/2,y-h,w,h);
  c.strokeStyle='rgba(150,185,190,0.12)';c.lineWidth=4;c.strokeRect(x-w/2+40,y-h+50,w-80,h*0.38);c.strokeRect(x-w/2+40,y-h*0.5,w-80,h*0.38);
  c.fillStyle='#4a4a3a';ell(c,x+w/2-46,y-h*0.5,10,10);c.fill();
  // полоса света и отблеск на полу
  const fl=lt2*(0.92+0.08*Math.sin(t*1.7));
  c.save();c.translate(x,y+6);c.scale(1,0.16);glow(c,0,0,w*0.95,'255,200,120',0.42*fl);c.restore();
  c.fillStyle=`rgba(255,214,140,${0.9*fl})`;c.fillRect(x-w/2,y-2,w,10);
  if(fe>0){c.fillStyle=`rgba(8,10,10,${0.92*fe})`;for(const dx of [-w*0.14,w*0.12]){c.fillRect(x+dx-w*0.07,y-2,w*0.14,10);
      c.save();c.translate(x+dx,y+8);c.scale(1,0.12);c.fillStyle=`rgba(4,8,9,${0.5*fe})`;ell(c,0,0,w*0.1,w*0.6);c.fill();c.restore();}}}
// витой шнур по полу от p0 до p1 (точки), с провисом
function floorCord(c,pts,t,col='#1c2324'){c.strokeStyle=col;c.lineWidth=6;c.lineCap='round';c.beginPath();c.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length;i++){const [ax,ay]=pts[i-1],[bx,by]=pts[i];c.quadraticCurveTo((ax+bx)/2+Math.sin(i*2.1)*30,(ay+by)/2+Math.cos(i*1.3)*12,bx,by);}c.stroke();
  c.strokeStyle='rgba(160,195,200,0.18)';c.lineWidth=2;c.stroke();}
// стойка с осветительным прибором (съёмочная площадка)
function filmLight(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);c.strokeStyle='#081012';c.lineWidth=10;c.lineCap='round';
  c.beginPath();c.moveTo(0,0);c.lineTo(0,-560);c.moveTo(0,-120);c.lineTo(-90,0);c.moveTo(0,-120);c.lineTo(90,0);c.stroke();
  c.fillStyle='#081012';c.save();c.translate(0,-600);c.rotate(0.35);c.fillRect(-70,-55,140,110);c.beginPath();c.moveTo(70,-55);c.lineTo(120,-90);c.lineTo(120,90);c.lineTo(70,55);c.closePath();c.fill();c.restore();
  c.strokeStyle='rgba(150,185,195,0.22)';c.lineWidth=3;c.beginPath();c.moveTo(-2,-540);c.lineTo(-2,-130);c.stroke();c.restore();}
function dirChair(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);c.strokeStyle='#081012';c.lineWidth=9;
  c.beginPath();c.moveTo(-70,0);c.lineTo(70,-160);c.moveTo(70,0);c.lineTo(-70,-160);c.moveTo(-70,-160);c.lineTo(-70,-300);c.moveTo(70,-160);c.lineTo(70,-300);c.stroke();
  c.fillStyle='#0c1517';c.fillRect(-80,-170,160,18);c.fillRect(-76,-300,152,60);c.strokeStyle='rgba(150,185,195,0.2)';c.lineWidth=3;c.strokeRect(-76,-300,152,60);c.restore();}
// ---------- состояние фонарика в детской ----------
function beamState(lt){const sw=K('sweep'),ch=K('chair'),wt=K('wait');
  const jit=Math.sin(lt*2.3)*6+Math.sin(lt*5.1)*3;
  // скользит по стене слева направо, потом находит стул, рот в луче чуть правее центра маски
  let x=lerp(220,470,ease((lt-sw)/2.6)),y=lerp(560,980,ease((lt-sw)/2.6));
  const f=ease((lt-ch)/2.2);x=lerp(x,652,f);y=lerp(y,880,f);
  const w=ease((lt-wt)/3.4);x=lerp(x,600,w);y=lerp(y,1150,w);
  return {x:x+jit,y:y+jit*0.6,r:lerp(250,140,f)*(1+0.6*w),a:1-0.25*w};}
const SC={
  sky(c,t,lt){
    sky(c,t,0);c.fillStyle='rgba(2,14,18,0.55)';c.fillRect(0,0,W,H);
    const z=1+lt*0.006;c.save();zoomAt(c,W/2,H/2,z);
    const ent=ease(lt/1.6);moon(c,540,700,t);owl(c,540,760+(1-ent)*500,1.15*(0.6+0.4*ent),t,blink(t,0),false,{talk:talk(t)});c.restore();
    const gl=ease((lt-K('glow'))/1.6);
    glow(c,830,1050,420,'110,150,165',0.12*gl);
    c.fillStyle='#050b0e';c.beginPath();c.moveTo(0,1250);c.quadraticCurveTo(600,1150,1080,1185);c.lineTo(1080,H);c.lineTo(0,H);c.fill();
    house(c,830,1190,0.36,t,{col:'#050b0e'});
    fog(c,t,1050,1260,0.16);vignD(c,0.7);
  },
  dom(c,t,lt){
    // общий план дома, потом медленно вверх к окну детской
    const u=ease((lt-K('up'))/3.2),z=lerp(1.0,1.55,u)+lt*0.004,cy=lerp(820,560,u);
    c.save();zoomAt(c,540,cy,z);
    grad(c,'#0e1d24','#163038','#0c181c');
    glow(c,540,420,620,'150,185,190',0.16);starsOnly(c,t,0.18);
    // голые ветки по краям
    c.strokeStyle='#060c0e';c.lineCap='round';
    for(const [x0,sd] of [[40,1],[1040,-1]]){c.lineWidth=26;c.beginPath();c.moveTo(x0,1300);c.quadraticCurveTo(x0+sd*20,700,x0+sd*60,200);c.stroke();
      c.lineWidth=8;for(let i=0;i<5;i++){const yy=300+i*170;c.beginPath();c.moveTo(x0+sd*(30+i*4),yy);c.quadraticCurveTo(x0+sd*(120+i*10),yy-60,x0+sd*(200+i*14),yy-130+Math.sin(t*0.4+i)*6);c.stroke();}}
    c.fillStyle='#081113';c.fillRect(-200,1150,W+400,600);
    const wx=lerp(-170,170,ease((lt-K('beam'))/3.2)),wa=ease((lt-K('beam'))/1.2)*(1-ease((lt-K('up')-1.2)/1.6));
    house(c,540,1160,1.0,t,{col:'#081316',win:{x:wx,a:wa}});
    // в окне детской: тусклый холод, иногда пробегает отсвет фонарика
    const pass=ease((lt-K('dark')+1.6)/0.9)*(1-ease((lt-K('dark')-0.2)/0.9));
    if(pass>0){c.save();c.beginPath();c.rect(470,550,140,170);c.clip();glow(c,lerp(470,610,ease((lt-K('dark')+1.6)/2.4)),640,70,'255,206,140',0.35*pass);c.restore();}
    c.restore();
    fog(c,t,1000,1300,0.15);vignD(c,0.78);
  },
  detskaya(c,t,lt){
    const ch=K('chair'),fc=K('face'),sc=K('scream'),wt=K('wait');
    const z=lerp(1,1.3,ease((lt-ch)/3))*lerp(1,1.35,ease((lt-fc)/5))*lerp(1,1.12,ease((lt-sc)/6))*lerp(1,0.86,ease((lt-wt)/3.5));
    room(c,t,{z,cx:622,cy:lerp(760,800,ease((lt-fc)/3)),beam:beamState(lt),dk:0.6,mshade:0.35+0.45*ease((lt-ch)/2.5)});
    // «давно»: пыль медленно садится в луче
    const dl=ease((lt-K('dolgo'))/2);if(dl>0){c.save();c.globalCompositeOperation='screen';
      for(let i=0;i<40;i++){const q=((i*0.173+lt*0.04)%1),x=360+((i*131)%360),y=300+q*700;c.fillStyle=`rgba(230,215,180,${0.22*dl*Math.sin(q*Math.PI)})`;ell(c,x,y,2+i%3,2+i%3);c.fill();}c.restore();}
    vignD(c,0.72);
  },
  foto(c,t,lt){
    // полароид со стола: снимок детской проявляется; на 9 — наезд на стул среди игрушек
    const ph=ease((lt-K('photo'))/3.5),ty=ease((lt-K('toy'))/4);
    grad(c,'#121d20','#101a1d','#0b1315');
    glow(c,280,260,520,'255,214,150',0.12);
    c.save();zoomAt(c,540,700,1+0.03*lt+0.3*ty);
    // стол и разбросанные снимки
    c.fillStyle='rgba(255,214,150,0.03)';c.fillRect(0,0,W,H);
    for(const [x,y,r,s] of [[230,330,-0.3,0.55],[850,1040,0.25,0.5],[180,1060,0.15,0.45]]){c.save();c.translate(x,y);c.rotate(r);c.fillStyle='#8f8b80';c.fillRect(-200*s,-230*s,400*s,470*s);c.fillStyle='#1a2a2c';c.fillRect(-176*s,-206*s,352*s,352*s);
      c.save();c.beginPath();c.rect(-176*s,-206*s,352*s,352*s);c.clip();c.fillStyle='#0d191b';c.fillRect(-176*s,40*s,352*s,120*s);house(c,0,140*s,0.28*s,t,{col:'#0a1517'});c.restore();c.restore();}
    // главный снимок
    c.save();c.translate(540,700);c.rotate(-0.04);
    c.fillStyle='rgba(0,0,0,0.4)';c.fillRect(-300,-310,620,720);
    c.fillStyle='#c4bfb0';c.fillRect(-310,-330,620,720);
    c.save();c.beginPath();c.rect(-280,-300,560,560);c.clip();
    c.translate(-280-170*0.62,-300-360*0.62);c.scale(0.62,0.62);
    room(c,t,{z:1,day:1,dk:0});
    c.restore();
    // проявка: сначала бурое пятно, потом картинка
    c.fillStyle=`rgba(46,40,30,${1-ph})`;c.fillRect(-280,-300,560,560);
    c.fillStyle='rgba(60,50,40,0.25)';c.fillRect(-310,280,620,4);
    c.strokeStyle='rgba(60,60,60,0.5)';c.lineWidth=3;c.beginPath();c.moveTo(-220,330);c.quadraticCurveTo(-120,318,-40,334);c.quadraticCurveTo(20,342,60,326);c.stroke();
    c.restore();
    c.restore();
    // тёплая лампа сверху, тень по краям
    c.fillStyle='rgba(2,6,8,0.25)';c.fillRect(0,0,W,H);
    glow(c,540,640,520,'255,214,150',0.08);
    vignD(c,0.75);
  },
  dver(c,t,lt){
    // коридор на площадке: закрытая дверь, под ней свет; провод телефона уходит под дверь; на feet — за дверью кто-то встал
    const z=1.02+lt*0.01;c.save();zoomAt(c,540,800,z);
    grad(c,'#10201f','#122222','#0b1515');
    c.fillStyle='#0c1717';c.fillRect(-300,1060,W+600,900);
    c.strokeStyle='rgba(140,170,170,0.06)';c.lineWidth=3;for(let i=-7;i<=7;i++){c.beginPath();c.moveTo(540+i*70,1060);c.lineTo(540+i*300,H+200);c.stroke();}
    glow(c,540,700,600,'150,180,180',0.08);
    doorStrip(c,540,1060,400,760,t,{feet:ease((lt-K('feet'))/2.4)});
    // площадка: прибор, кресло режиссёра
    filmLight(c,150,1180,1.0);dirChair(c,900,1140,0.95);
    const tg=ease((lt-K('cord'))/2);
    floorCord(c,[[-40,1500],[120,1360+10*tg],[300,1250],[470,1150-6*tg],[580,1066]],t,'#1a2223');
    c.restore();
    fog(c,t,1000,1250,0.06);vignD(c,0.78);
  },
  telefon(c,t,lt){
    // пустая комната, старый телефон, трубка на месте. Провод к той же двери. «Откуда-то рядом» — свет под дверью перекрывается
    const z=1+lt*0.012;c.save();zoomAt(c,540,820,z);
    grad(c,'#0f1d20','#122326','#0a1416');
    c.fillStyle='#0b1618';c.fillRect(-300,900,W+600,1100);
    doorStrip(c,830,900,220,440,t,{feet:ease((lt-K('near'))/2.2)*0.9});
    // лунный свет из окна слева на столик
    c.fillStyle='rgba(130,170,185,0.07)';c.beginPath();c.moveTo(-100,200);c.lineTo(80,200);c.lineTo(700,1100);c.lineTo(300,1160);c.closePath();c.fill();
    glow(c,470,860,360,'130,170,185',0.14);
    // столик
    c.fillStyle='#1a1512';c.beginPath();c.roundRect(300,880,340,26,6);c.fill();c.fillRect(330,906,18,300);c.fillRect(592,906,18,300);
    c.strokeStyle='rgba(170,200,210,0.2)';c.lineWidth=3;c.beginPath();c.moveTo(300,881);c.lineTo(640,881);c.stroke();
    phone(c,470,880,0.82,t,{lit:1});
    floorCord(c,[[600,872],[650,900],[640,1060],[720,1160],[780,1010],[840,905]],t,'#151c1d');
    c.restore();
    fog(c,t,950,1250,0.06);vignD(c,0.78);
  },
  obratno(c,t,lt){
    // маску кладём обратно на стул; потом тот же телефон крупно — ничего не происходит
    const tl=K('tel'),x=ease((lt-tl)/1.4);
    if(x<1){const pu=ease((lt-K('put'))/2.2);
      room(c,t,{z:1.25,cx:622,cy:800,beam:{x:600,y:1120,r:230,a:0.75},dk:0.55,mask:pu,mshade:0.7,mrot:-0.12*(1-pu)});
      vignD(c,0.72);}
    if(x>0){c.save();c.globalAlpha=x;
      grad(c,'#0d1a1d','#0f1e21','#091315');
      const z=1+0.04*(lt-tl);c.save();zoomAt(c,540,800,z);
      glow(c,520,760,520,'130,170,185',0.16);
      c.fillStyle='#16110f';c.fillRect(-200,900,W+400,80);c.strokeStyle='rgba(170,200,210,0.2)';c.lineWidth=4;c.beginPath();c.moveTo(-200,902);c.lineTo(W+200,902);c.stroke();
      phone(c,560,905,1.5,t,{lit:1.2});
      c.restore();fog(c,t,950,1250,0.05);vignD(c,0.8);c.restore();}
  },
  goodnight(c,t,lt){
    sky(c,t,0);c.fillStyle='rgba(2,14,18,0.55)';c.fillRect(0,0,W,H);
    const dim=ease((lt-K('dim'))/2);
    c.save();const z=1.12-lt*0.006;zoomAt(c,W/2,H/2,z);
    const SL=K('sleep');const sl=ease((lt-SL)/2.5);
    moon(c,540,700,t);owl(c,540,760,1.15,t,clamp(blink(t,0)+sl,0,1),true,{talk:talk(t),sleepy:sl});
    c.restore();
    if(sl>0){c.save();c.font='700 64px C';c.fillStyle='#b8c4cc';for(let i=0;i<3;i++){const p=((t*0.35+i/3)%1);c.globalAlpha=sl*Math.sin(p*Math.PI)*0.6;c.fillText('z',640+p*120+Math.sin(p*9)*15,560-p*260);}c.restore();}
    glow(c,830,1050,420,'110,150,165',0.12);
    c.fillStyle='#050b0e';c.beginPath();c.moveTo(0,1250);c.quadraticCurveTo(600,1150,1080,1185);c.lineTo(1080,H);c.lineTo(0,H);c.fill();
    // последняя мурашка: в окне детской медленно проступает бледный вытянутый овал
    house(c,830,1190,0.36,t,{col:'#050b0e',up:ease((lt-SL-2.4)/2.6)});
    fog(c,t,1050,1260,0.16);
    c.fillStyle=`rgba(0,6,10,${0.15*dim})`;c.fillRect(0,0,W,H);vignD(c,0.72);
  }
};
