// Страшная арка s01: Франкенштейн. Подключается после obshchee/core.js.
// Палитра: холодные сине-зелёные, почти чёрный (не #000), тусклый жёлтый свет свечи.
// Монстр по книге Шелли: высокий, сшитый, печальный силуэт. НЕ рисовать плоскую голову, болты, зелёную кожу.
function rgba(r,g,b,a){return `rgba(${r},${g},${b},${a})`;}
const NIGHT=[4,10,14]; // самый тёмный тон арки (не чистый чёрный)
// ---------- атмосфера ----------
const RAIN=[];for(let i=0;i<240;i++)RAIN.push({x:rnd()*W*1.3-W*0.15,y:rnd()*H,l:30+rnd()*60,v:900+rnd()*700,a:0.08+rnd()*0.18});
function rain(c,t,a=1,ang=0.12,y1=H){if(a<=0)return;c.save();c.lineCap='round';
  for(const r of RAIN){const y=(r.y+t*r.v)%(H+200)-100;if(y>y1)continue;const x=r.x+y*ang;
    c.strokeStyle=rgba(170,200,210,r.a*a);c.lineWidth=2;c.beginPath();c.moveTo(x,y);c.lineTo(x+r.l*ang,y+r.l);c.stroke();}c.restore();}
const DROPS=[];for(let i=0;i<70;i++)DROPS.push({x:rnd(),y:rnd(),r:3+rnd()*7,v:0.01+rnd()*0.05,ph:rnd()*6.28,st:rnd()});
function glassDrops(c,t,x0,y0,w,h,a=1){c.save();c.beginPath();c.rect(x0,y0,w,h);c.clip();
  for(const d of DROPS){const run=d.st>0.55;const y=y0+((d.y+(run?t*d.v*(0.6+0.4*Math.sin(t*0.7+d.ph)):0))%1)*h,x=x0+d.x*w+Math.sin(y*0.02+d.ph)*4;
    if(run){c.strokeStyle=rgba(150,185,195,0.10*a);c.lineWidth=d.r*0.6;c.beginPath();c.moveTo(x,y-d.r*12);c.lineTo(x,y);c.stroke();}
    c.fillStyle=rgba(160,195,205,0.22*a);ell(c,x,y,d.r*0.8,d.r);c.fill();
    c.fillStyle=rgba(230,240,240,0.25*a);ell(c,x-d.r*0.25,y-d.r*0.35,d.r*0.25,d.r*0.25);c.fill();}
  c.restore();}
const FOG=[];for(let i=0;i<16;i++)FOG.push({x:rnd()*W,y:rnd(),r:220+rnd()*260,v:6+rnd()*14,p:rnd()*6.28});
function fog(c,t,y0,y1,a=1,col=[120,150,160]){if(a<=0)return;
  for(const f of FOG){const x=((f.x+t*f.v)%(W+600))-300,y=y0+f.y*(y1-y0)+Math.sin(t*0.2+f.p)*20;
    const g=c.createRadialGradient(x,y,0,x,y,f.r);g.addColorStop(0,rgba(col[0],col[1],col[2],0.10*a));g.addColorStop(1,rgba(col[0],col[1],col[2],0));
    c.fillStyle=g;c.fillRect(x-f.r,y-f.r,f.r*2,f.r*2);}}
function grainX(c,a=0.07){c.save();c.globalAlpha=a;c.globalCompositeOperation='overlay';const ox=Math.floor(Math.random()*256),oy=Math.floor(Math.random()*256);
  c.fillStyle=c.createPattern(grain,'repeat');c.translate(-ox,-oy);c.fillRect(0,0,W+256,H+256);c.restore();}
function darkV(c,k=0.75){const g=c.createRadialGradient(W/2,800,H*0.18,W/2,800,H*0.72);g.addColorStop(0,'rgba(2,6,9,0)');g.addColorStop(1,`rgba(2,6,9,${k})`);c.fillStyle=g;c.fillRect(0,0,W,H);}
function bottomDark(c,y=1150,k=0.85){const g=c.createLinearGradient(0,y,0,H);g.addColorStop(0,'rgba(3,8,11,0)');g.addColorStop(1,`rgba(3,8,11,${k})`);c.fillStyle=g;c.fillRect(0,y,W,H-y);}
function wall(c,top='#0c1a1f',bot='#060d10'){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,top);g.addColorStop(1,bot);c.fillStyle=g;c.fillRect(0,0,W,H);}
// ---------- свеча ----------
function flick(t,s=1){return 1+0.06*Math.sin(t*7.3)*s+0.04*Math.sin(t*12.1+1)*s+0.05*Math.sin(t*2.3)*s;}
function candleGlow(c,x,y,a,R=520){if(a<=0)return;const f=flick(c._t||0);
  const g=c.createRadialGradient(x,y,10,x,y,R*f);g.addColorStop(0,rgba(255,196,110,0.30*a));g.addColorStop(0.35,rgba(220,150,70,0.12*a));g.addColorStop(1,'rgba(200,130,60,0)');
  c.save();c.globalCompositeOperation='lighter';c.fillStyle=g;c.fillRect(x-R*1.2,y-R*1.2,R*2.4,R*2.4);c.restore();}
function candle(c,x,y,s,t,o={}){ // y = основание; o.flame 0..1, o.lean (сквозняк) -1..1, o.smoke 0..1
  const fl=o.flame==null?1:o.flame,ln=o.lean||0;
  c.save();c.translate(x,y);c.scale(s,s);
  // подсвечник
  c.fillStyle='#2a2620';ell(c,0,0,70,16);c.fill();c.fillStyle='#3a342a';ell(c,0,-6,46,10);c.fill();
  // свеча
  const cg=c.createLinearGradient(-22,0,22,0);cg.addColorStop(0,'#8c8268');cg.addColorStop(0.5,'#c9bd98');cg.addColorStop(1,'#6e6652');
  c.fillStyle=cg;c.fillRect(-22,-190,44,184);ell(c,0,-190,22,7);c.fillStyle='#d8cca6';c.fill();
  c.fillStyle='#b5a983';c.beginPath();c.moveTo(14,-188);c.quadraticCurveTo(22,-150,16,-120);c.quadraticCurveTo(12,-150,10,-186);c.fill(); // наплыв
  c.strokeStyle='#1c1814';c.lineWidth=3;c.beginPath();c.moveTo(0,-192);c.lineTo(ln*3,-206);c.stroke();
  if(fl>0.01){const f=flick(t),h=58*fl*f,w=13*fl;const sway=Math.sin(t*3.1)*3+ln*26;
    c.save();c.translate(0,-204);
    const g=c.createRadialGradient(0,-h*0.4,2,0,-h*0.4,h*1.6);g.addColorStop(0,rgba(255,220,150,0.45*fl));g.addColorStop(1,'rgba(255,200,120,0)');c.fillStyle=g;c.fillRect(-h*2,-h*2.4,h*4,h*3.2);
    c.beginPath();c.moveTo(-w,0);c.quadraticCurveTo(-w*1.1,-h*0.5,sway,-h);c.quadraticCurveTo(w*1.1,-h*0.5,w,0);c.quadraticCurveTo(0,w*0.8,-w,0);
    const fg=c.createLinearGradient(0,0,0,-h);fg.addColorStop(0,rgba(140,150,190,0.8*fl));fg.addColorStop(0.25,rgba(255,214,140,0.95*fl));fg.addColorStop(1,rgba(255,236,190,0.9*fl));
    c.fillStyle=fg;c.fill();c.restore();}
  if(o.smoke>0){c.save();c.strokeStyle=rgba(170,180,180,0.35*o.smoke);c.lineWidth=4;c.lineCap='round';c.beginPath();
    for(let i=0;i<=20;i++){const u=i/20,yy=-206-u*260,xx=Math.sin(u*7+t*1.4)*18*u+u*20;i?c.lineTo(xx,yy):c.moveTo(xx,yy);}c.stroke();c.restore();}
  c.restore();}
// ---------- предметы ----------
function quill(c,x,y,s,ang){c.save();c.translate(x,y);c.rotate(ang);c.scale(s,s);
  c.strokeStyle='#2b2a26';c.lineWidth=4;c.beginPath();c.moveTo(0,0);c.lineTo(0,-300);c.stroke();
  c.fillStyle='rgba(200,196,180,0.85)';c.beginPath();c.moveTo(0,-60);c.quadraticCurveTo(-46,-170,-14,-310);c.quadraticCurveTo(-4,-200,0,-60);c.fill();
  c.fillStyle='rgba(160,156,145,0.85)';c.beginPath();c.moveTo(0,-80);c.quadraticCurveTo(34,-190,8,-300);c.quadraticCurveTo(4,-200,0,-80);c.fill();
  c.strokeStyle='rgba(90,88,80,0.6)';c.lineWidth=1.5;for(let i=0;i<9;i++){const yy=-90-i*24;c.beginPath();c.moveTo(0,yy);c.lineTo(-22+i*1.2,yy-24);c.stroke();}
  c.fillStyle='#14110e';c.beginPath();c.moveTo(-3,0);c.lineTo(3,0);c.lineTo(0,10);c.fill();c.restore();}
function scribble(c,x,y,w,prog,seed0,col='rgba(30,28,40,0.75)',lh=34,n=8){ // строки «почерка», prog 0..1
  let sd=seed0;const r=()=>{sd=(sd*16807)%2147483647;return (sd-1)/2147483646;};
  c.strokeStyle=col;c.lineWidth=2.4;c.lineCap='round';const tot=n*w;let left=prog*tot;
  for(let i=0;i<n&&left>0;i++){const lw=w*(i==n-1?0.55:0.85+0.15*r()),L=Math.min(lw,left);left-=lw;c.beginPath();
    for(let xx=0;xx<=L;xx+=4){const yy=y+i*lh+Math.sin(xx*0.45+i*3)*5*(0.5+0.5*Math.sin(xx*0.07+r()))-((xx*0.13+i)%7<1?6:0);xx?c.lineTo(x+xx,yy):c.moveTo(x+xx,yy);}c.stroke();}
  return prog*tot;}
function page(c,x,y,w,h,rot,lit=1){c.save();c.translate(x,y);c.rotate(rot);
  const g=c.createLinearGradient(-w/2,-h/2,w/2,h/2);g.addColorStop(0,rgba(196,182,148,lit));g.addColorStop(1,rgba(150,136,104,lit));
  c.fillStyle=g;c.beginPath();c.moveTo(-w/2,-h/2);c.lineTo(w/2,-h/2+4);c.lineTo(w/2-3,h/2);c.lineTo(-w/2+2,h/2-3);c.closePath();c.fill();
  c.strokeStyle='rgba(90,70,50,0.25)';c.lineWidth=2;c.stroke();c.restore();}
function windowFrame(c,x,y,w,h,col='#060b0d'){ // переплёт окна, арка сверху
  c.save();c.strokeStyle=col;c.lineWidth=26;c.beginPath();c.moveTo(x,y+h);c.lineTo(x,y+w/2);c.arc(x+w/2,y+w/2,w/2,Math.PI,0);c.lineTo(x+w,y+h);c.closePath();c.stroke();
  c.lineWidth=14;c.beginPath();c.moveTo(x+w/2,y);c.lineTo(x+w/2,y+h);c.moveTo(x,y+h*0.52);c.lineTo(x+w,y+h*0.52);c.stroke();
  c.fillStyle=col;c.fillRect(x-40,y+h-6,w+80,30);c.restore();}
function windowPath(c,x,y,w,h){c.beginPath();c.moveTo(x,y+h);c.lineTo(x,y+w/2);c.arc(x+w/2,y+w/2,w/2,Math.PI,0);c.lineTo(x+w,y+h);c.closePath();}
// ---------- монстр по книге: высокий, сшитый, печальный ----------
function monster(c,x,y,s,t,o={}){ // y — уровень пола; рост ~ 900*s
  const a=o.a==null?1:o.a;if(a<=0)return;const br=Math.sin(t*0.9)*4;
  c.save();c.globalAlpha=a;c.translate(x,y);c.scale(s*0.84,s);
  const body='#05090b';c.fillStyle=body;
  // ноги и длинное пальто
  c.beginPath();c.moveTo(-150,0);c.lineTo(-170,-380);c.quadraticCurveTo(-200,-560,-185,-640+br);c.lineTo(185,-640+br);c.quadraticCurveTo(200,-560,170,-380);c.lineTo(150,0);c.closePath();c.fill();
  // плечи — широкие, опущенные
  c.beginPath();c.moveTo(-185,-640+br);c.quadraticCurveTo(-200,-730+br,-120,-760+br);c.lineTo(120,-760+br);c.quadraticCurveTo(205,-725+br,185,-640+br);c.closePath();c.fill();
  // длинные руки вдоль тела
  c.beginPath();c.moveTo(-178,-700+br);c.quadraticCurveTo(-245,-470,-232,-215);c.quadraticCurveTo(-226,-170,-198,-180);c.quadraticCurveTo(-190,-420,-150,-640);c.fill();
  c.beginPath();c.moveTo(178,-700+br);c.quadraticCurveTo(245,-470,232,-215);c.quadraticCurveTo(226,-170,198,-180);c.quadraticCurveTo(190,-420,150,-640);c.fill();
  // кисти: длинные пальцы
  for(const sd of [-1,1]){c.save();c.translate(sd*218,-190);c.beginPath();ell(c,0,0,26,34);c.fill();
    for(let i=0;i<4;i++){c.beginPath();c.ellipse(sd*(-12+i*9),36+i%2*4,5,26,sd*0.08,0,Math.PI*2);c.fill();}c.restore();}
  // шея и голова — склонена, обычной формы (не плоская)
  c.save();c.translate(0,-760+br);c.rotate(-0.10+Math.sin(t*0.4)*0.015);
  c.fillRect(-34,-60,68,70);
  c.beginPath();c.moveTo(-78,-120);c.bezierCurveTo(-86,-215,-50,-262,0,-262);c.bezierCurveTo(52,-262,88,-210,80,-120);c.bezierCurveTo(74,-70,40,-40,0,-38);c.bezierCurveTo(-42,-40,-72,-72,-78,-120);c.fill();
  // длинные чёрные волосы (как у Шелли), спадают на плечи
  c.beginPath();c.moveTo(-84,-150);c.bezierCurveTo(-110,-230,-60,-292,4,-284);c.bezierCurveTo(70,-284,112,-226,92,-140);c.quadraticCurveTo(104,-60,118,-10);c.quadraticCurveTo(84,-40,70,-110);
  c.lineTo(-66,-110);c.quadraticCurveTo(-84,-40,-116,-12);c.quadraticCurveTo(-98,-70,-84,-150);c.fill();
  // контровой свет холодного окна по краю волос и плеч
  if(o.rim>0){c.strokeStyle=rgba(120,165,175,0.45*o.rim);c.lineWidth=4;c.beginPath();c.moveTo(-96,-150);c.bezierCurveTo(-112,-232,-60,-290,4,-283);c.bezierCurveTo(68,-283,110,-226,92,-142);c.stroke();}
  // тусклые жёлтые «водянистые» глаза — еле видны
  if(o.eyes>0){for(const ex of [-26,26]){const g=c.createRadialGradient(ex,-150,0,ex,-150,16);g.addColorStop(0,rgba(214,190,110,0.75*o.eyes));g.addColorStop(1,'rgba(214,190,110,0)');c.fillStyle=g;c.fillRect(ex-16,-166,32,32);
      c.fillStyle=rgba(225,205,130,0.55*o.eyes);ell(c,ex,-150,4.5,2.6);c.fill();}}
  // швы: на лбу и на шее (стежки), без болтов
  if(o.seams>0){c.strokeStyle=rgba(140,170,170,0.5*o.seams);c.lineWidth=2.5;
    // косой шов от виска к скуле (не по лбу, не на шее)
    c.beginPath();c.moveTo(48,-214);c.quadraticCurveTo(62,-160,40,-96);c.stroke();
    for(let i=0;i<6;i++){const u=i/5,xx=48+Math.sin(u*Math.PI)*12-u*8,yy=-208+u*104;c.beginPath();c.moveTo(xx-7,yy-2);c.lineTo(xx+7,yy+2);c.stroke();}}
  c.restore();
  if(o.rim>0){c.strokeStyle=rgba(120,165,175,0.32*o.rim);c.lineWidth=4;c.beginPath();c.moveTo(-120,-760+br);c.quadraticCurveTo(-200,-730+br,-186,-640+br);c.moveTo(120,-760+br);c.quadraticCurveTo(205,-725+br,186,-640+br);c.stroke();}
  // шов на запястье
  if(o.seams>0){c.strokeStyle=rgba(140,170,170,0.45*o.seams);c.lineWidth=2.5;c.beginPath();c.moveTo(196,-222);c.lineTo(240,-216);c.stroke();for(let i=0;i<4;i++){c.beginPath();c.moveTo(200+i*12,-229);c.lineTo(202+i*12,-209);c.stroke();}}
  c.restore();}
// ---------- вилла и пейзаж ----------
function villa(c,x,y,s,win=1,t=0){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle='#03080a';
  c.fillRect(-260,-240,520,240);c.beginPath();c.moveTo(-290,-240);c.lineTo(0,-330);c.lineTo(290,-240);c.fill();
  c.fillRect(-190,-300,40,90);c.fillRect(150,-310,40,100); // трубы
  for(const [cx,lit] of [[-180,0],[-60,1],[60,0],[180,0]]){const L=lit*win;
    c.fillStyle=L>0?rgba(210,160,80,0.75*L*flick(t,0.6)):'#0a1418';c.fillRect(cx-22,-190,44,66);
    if(L>0){const g=c.createRadialGradient(cx,-157,4,cx,-157,120);g.addColorStop(0,rgba(230,170,80,0.22*L));g.addColorStop(1,'rgba(230,170,80,0)');c.fillStyle=g;c.fillRect(cx-120,-277,240,240);}
    c.fillStyle='#03080a';c.fillRect(cx-2,-190,4,66);c.fillRect(cx-22,-160,44,4);}
  c.fillStyle='#03080a';c.fillRect(-300,0,600,8);c.restore();}
function lake(c,y,t,col1='#0a1b20',col2='#040b0e'){const g=c.createLinearGradient(0,y,0,H);g.addColorStop(0,col1);g.addColorStop(1,col2);c.fillStyle=g;c.fillRect(0,y,W,H-y);
  c.strokeStyle='rgba(120,160,170,0.07)';c.lineWidth=2;for(let i=0;i<12;i++){const yy=y+14+i*i*3.2;c.beginPath();for(let x=0;x<=W;x+=30){const v=yy+Math.sin(x*0.02+t*0.7+i)*2.5;x?c.lineTo(x,v):c.moveTo(x,v);}c.stroke();}}
function hills(c,y,col='#050c0f'){c.fillStyle=col;c.beginPath();c.moveTo(0,y);for(let x=0;x<=W;x+=40)c.lineTo(x,y-60-Math.sin(x*0.006+1)*50-Math.sin(x*0.017)*20);c.lineTo(W,y);c.lineTo(W,y+20);c.lineTo(0,y+20);c.fill();}
function clouds(c,t,y0,y1,a,col=[20,34,40]){for(let i=0;i<9;i++){const x=((i*173+t*(10+i*2))%(W+700))-350,y=y0+(i*97%(y1-y0)),r=260+(i*61%200);
  const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(col[0],col[1],col[2],0.7*a));g.addColorStop(1,rgba(col[0],col[1],col[2],0));c.fillStyle=g;ell(c,x,y,r*1.6,r*0.6);c.fill();}}
function nightSky(c,t,a=0.6){sky(c,t,0);c.fillStyle=rgba(3,14,18,a);c.fillRect(0,0,W,H);}
// ---------- колыбель и камин ----------
function hearth(c,x,y,fire,t){c.save();c.translate(x,y); // y — пол
  c.fillStyle='#10181a';c.fillRect(-330,-560,660,560);c.fillStyle='#0b1214';c.fillRect(-370,-600,740,60);
  c.strokeStyle='rgba(60,80,82,0.35)';c.lineWidth=3;for(let r=0;r<9;r++)for(let k=0;k<6;k++){const yy=-540+r*60,xx=-330+k*110+(r%2)*55;c.strokeRect(xx,yy,110,60);}
  c.fillStyle='#030607';c.beginPath();c.moveTo(-210,0);c.lineTo(-210,-260);c.quadraticCurveTo(0,-400,210,-260);c.lineTo(210,0);c.fill();
  if(fire>0){const f=flick(t,1.5);
    const g=c.createRadialGradient(0,-60,10,0,-60,320*f);g.addColorStop(0,rgba(255,170,80,0.55*fire));g.addColorStop(1,'rgba(200,90,30,0)');c.save();c.globalCompositeOperation='lighter';c.fillStyle=g;c.fillRect(-340,-400,680,420);c.restore();
    for(let i=0;i<7;i++){const xx=-110+i*36,h=(90+60*Math.sin(t*2.1+i*1.7)+30*Math.sin(t*5.3+i))*fire;
      c.fillStyle=rgba(250,170+i*6,80,0.5*fire);c.beginPath();c.moveTo(xx-26,-30);c.quadraticCurveTo(xx-10,-30-h*0.6,xx+Math.sin(t*3+i)*10,-30-h);c.quadraticCurveTo(xx+12,-30-h*0.5,xx+26,-30);c.fill();}}
  // угли тлеют
  c.fillStyle='#1b1410';ell(c,0,-24,150,22);c.fill();
  for(let i=0;i<9;i++){const e=0.25+0.25*Math.sin(t*1.3+i*2.1);c.fillStyle=rgba(200,80,40,e*(0.25+0.75*Math.max(fire,0.25)));ell(c,-110+i*27,-26+(i%3)*4,9,4);c.fill();}
  c.restore();}
function cradle(c,x,y,s,rock,blanket,t,lit=[70,60,50]){c.save();c.translate(x,y);c.rotate(rock*0.07);c.scale(s,s);
  const col=rgba(lit[0],lit[1],lit[2],1);
  c.strokeStyle=col;c.lineWidth=14;c.lineCap='round';
  c.beginPath();c.arc(0,-210,250,0.25*Math.PI,0.75*Math.PI);c.stroke(); // полозья
  c.fillStyle=rgba(lit[0]*0.8,lit[1]*0.8,lit[2]*0.8,1);
  c.beginPath();c.moveTo(-220,-170);c.quadraticCurveTo(-210,-30,-150,-20);c.lineTo(150,-20);c.quadraticCurveTo(210,-30,220,-170);c.closePath();c.fill();
  c.strokeStyle=rgba(lit[0]*0.6,lit[1]*0.6,lit[2]*0.6,1);c.lineWidth=6;for(let i=-4;i<=4;i++){c.beginPath();c.moveTo(i*44,-165);c.lineTo(i*40,-28);c.stroke();}
  c.strokeStyle=col;c.lineWidth=12;c.beginPath();c.moveTo(-230,-170);c.lineTo(230,-170);c.stroke();
  // козырёк-полог
  c.fillStyle=rgba(lit[0]*0.9,lit[1]*0.9,lit[2]*0.9,1);c.beginPath();c.moveTo(130,-170);c.quadraticCurveTo(150,-330,250,-320);c.lineTo(240,-170);c.fill();
  // одеяльце: холмик (blanket 1) -> плоское (0)
  c.fillStyle=rgba(lit[0]*1.5,lit[1]*1.45,lit[2]*1.35,1);c.beginPath();c.moveTo(-170,-168);c.quadraticCurveTo(-40,-168-60*blanket,60,-172-26*blanket);c.quadraticCurveTo(110,-170,140,-168);c.closePath();c.fill();
  c.restore();}
// ---------- мини-совёнок прячется (альфа), возвращается на строке 8 ----------
const _miniOwl0=miniOwl;
function owlHide(t){const A=CFG.ka;if(!A||A.villa_h==null&&A.vnutri==null)return 1;
  const h=A.vnutri,g=A.gasnet,b=A.rodilsya;let m=1;
  if(h!=null)m=lerp(1,0.2,ease((t-h)/2.5));if(g!=null)m=Math.min(m,lerp(0.2,0,ease((t-g)/0.8)));
  if(b!=null&&t>b)m=Math.max(m,ease((t-b-0.6)/1.8));return m;}
miniOwl=function(c,t,a){_miniOwl0(c,t,a*owlHide(t));};
// ---------- сцены ----------
const K=n=>CFG.k&&CFG.k[n]!=null?CFG.k[n]:{pishet:1,izverg:1.2,dymka:4.4,bezleta:6,vnutri:2.9,skvoz:4.9,bayron:6,strashnoe:9,gasnet:3.5,vidit:6,rodilsya:8.7,dnevnik:0.8,ogon:5.6,pusto:11.9,dozhd:0.8,prosto:2.9,dim:0.8,sleep:3.9}[n];
const SC={
  sky(c,t,lt){
    nightSky(c,t,0.55);clouds(c,t,150,900,0.5);
    const z=1+lt*0.005;c.save();c.translate(W/2,H/2);c.scale(z,z);c.translate(-W/2,-H/2);
    const ent=ease(lt/1.6);moon(c,540,700,t);owl(c,540,760+(1-ent)*500,1.15*(0.6+0.4*ent),t,blink(t,0),false,{talk:talk(t)});c.restore();
    clouds(c,t*1.3,500,800,0.25,[10,22,26]);
    hills(c,1060);villa(c,760,1052,0.55,1,t);lake(c,1070,t);
    fog(c,t,950,1200,1.1);rain(c,t,0.7);bottomDark(c,1150,0.7);darkV(c,0.6);grainX(c);
  },
  pero(c,t,lt){c._t=t;
    wall(c,'#0d1b20','#071013');
    // окно с дождём слева
    c.save();windowPath(c,90,200,280,420);c.clip();const wg=c.createLinearGradient(0,200,0,620);wg.addColorStop(0,'#14262c');wg.addColorStop(1,'#0b161a');c.fillStyle=wg;c.fillRect(80,190,300,440);rain(c,t,0.8,0.05,640);glassDrops(c,t,90,200,280,420,1);c.restore();windowFrame(c,90,200,280,420);
    // тень девушки на стене: дрожит от свечи
    const f=flick(t,1.4),sx=Math.sin(t*2.1)*10+Math.sin(t*6.7)*4;
    c.save();c.translate(560+sx,960);c.scale(1.05*f,1.05);c.fillStyle='rgba(2,6,8,0.75)';
    c.beginPath();ell(c,-10,-450,92,108,-0.15);c.fill();ell(c,50,-540,52,46);c.fill(); // голова и узел волос
    c.beginPath();c.moveTo(-60,-360);c.lineTo(40,-360);c.quadraticCurveTo(70,-300,200,-260);c.quadraticCurveTo(290,-200,300,0);c.lineTo(-280,0);c.quadraticCurveTo(-270,-220,-60,-300);c.fill();
    c.restore();
    // стол
    const tg=c.createLinearGradient(0,960,0,1300);tg.addColorStop(0,'#21201a');tg.addColorStop(1,'#0b0c0a');c.fillStyle=tg;c.fillRect(0,960,W,H-960);
    candleGlow(c,800,780,1,640);
    page(c,450,1060,420,250,-0.06,0.85);
    const pr=ease((lt-K('pishet'))/4.5);const L=scribble(c,280,975,330,pr,17,'rgba(28,26,36,0.8)',30,6);
    // перо следует за строкой
    const li=Math.min(5,Math.floor(pr*6*0.999)),px=280+((pr*6)%1)*330*0.9,py=975+li*30;
    quill(c,px,py,0.9,0.35+Math.sin(t*9)*0.03*(pr<1?1:0));
    c.fillStyle='#0c0b0a';ell(c,700,1010,40,14);c.fill();c.fillStyle='#16130f';c.fillRect(670,960,60,50);ell(c,700,960,30,10);c.fillStyle='#050505';c.fill(); // чернильница
    candle(c,800,1000,1,t,{flame:1});
    bottomDark(c,1120,0.85);darkV(c,0.7);grainX(c);
  },
  vulkan(c,t,lt){
    const iz=ease((lt-K('izverg'))/3),dy=ease((lt-K('dymka'))/3.5),bl=ease((lt-K('bezleta'))/3);
    const g=c.createLinearGradient(0,0,0,900);g.addColorStop(0,'#1d3138');g.addColorStop(1,'#33463f');c.fillStyle=g;c.fillRect(0,0,W,900);
    // бледное солнце, его закрывает дымка
    const sa=1-0.85*dy;const sg=c.createRadialGradient(330,420,10,330,420,260);sg.addColorStop(0,rgba(220,200,140,0.55*sa));sg.addColorStop(1,'rgba(220,200,140,0)');c.fillStyle=sg;c.fillRect(70,160,520,520);
    c.fillStyle=rgba(225,208,150,0.75*sa);ell(c,330,420,64,64);c.fill();
    // море и далёкий вулкан
    lake(c,900,t,'#1a2a2c','#070f11');
    c.fillStyle='#0d1415';c.beginPath();c.moveTo(640,902);c.lineTo(740,836);c.lineTo(780,836);c.lineTo(900,902);c.fill();
    if(iz>0){const gg=c.createRadialGradient(760,836,2,760,836,60);gg.addColorStop(0,rgba(190,90,50,0.45*iz));gg.addColorStop(1,'rgba(190,90,50,0)');c.fillStyle=gg;c.fillRect(700,776,120,120);}
    // столб пепла растёт и расползается по небу
    for(let i=0;i<46;i++){const u=i/46,grow=clamp(iz*1.6-u*0.9,0,1)+dy*0.6;if(grow<=0)continue;
      const rise=Math.min(1,grow)*(1+u*0.4);const yy=836-rise*780*u-40*u,xx=760-u*u*900*Math.min(1,dy*1.2+iz*0.25)+Math.sin(t*0.3+i)*20;
      const r=(40+u*300)*Math.min(1,grow);const cg=c.createRadialGradient(xx,yy,0,xx,yy,r);cg.addColorStop(0,rgba(32,38,38,0.55));cg.addColorStop(1,'rgba(32,38,38,0)');c.fillStyle=cg;ell(c,xx,yy,r*1.3,r*0.7);c.fill();}
    c.fillStyle=rgba(28,36,36,0.55*dy);c.fillRect(0,0,W,900);
    // год без лета: серый холод, пепельный снег
    c.fillStyle=rgba(60,72,74,0.25*bl);c.fillRect(0,0,W,H);
    if(bl>0){for(const s of DUST){const y=(s.y+t*s.v*3)%H,x=s.x+Math.sin(t*0.5+s.p)*30;c.fillStyle=rgba(190,195,190,0.35*bl);ell(c,x,y,s.r*0.9,s.r*0.9);c.fill();}}
    // берег с голыми деревьями
    c.fillStyle='#040a0c';c.beginPath();c.moveTo(0,1000);c.quadraticCurveTo(300,960,520,1010);c.quadraticCurveTo(800,1060,W,1020);c.lineTo(W,H);c.lineTo(0,H);c.fill();
    c.strokeStyle='#040a0c';c.lineCap='round';for(const [x,h] of [[150,330],[930,280]]){c.lineWidth=16;c.beginPath();c.moveTo(x,1010);c.lineTo(x+10,1010-h);c.stroke();c.lineWidth=7;
      for(let k=0;k<5;k++){const yy=1010-h*(0.45+k*0.11),d=(k%2?1:-1);c.beginPath();c.moveTo(x+6,yy);c.quadraticCurveTo(x+d*50,yy-30,x+d*(80-k*8),yy-70);c.stroke();}}
    fog(c,t,850,1150,1.2,[130,145,140]);bottomDark(c,1100,0.85);darkV(c,0.6);grainX(c);
  },
  villa(c,t,lt){c._t=t;
    const vn=ease((lt-K('vnutri'))/1.6),sk=ease((lt-K('skvoz'))/0.8),by=ease((lt-K('bayron'))/1.8),st=ease((lt-K('strashnoe'))/2.5);
    if(vn<1){const z=1+lt*0.03;c.save();c.translate(540,900);c.scale(z,z);c.translate(-540,-900);
      nightSky(c,t,0.7);clouds(c,t,100,900,0.7,[14,26,30]);hills(c,1000);villa(c,560,1000,1.15,1,t);lake(c,1010,t);fog(c,t,850,1150,1.3);rain(c,t,1,0.14);
      c.restore();}
    if(vn>0){c.save();c.globalAlpha=vn;
      wall(c,'#0d1a1e','#060c0e');
      // окно в дожде за спинами
      c.save();windowPath(c,480,250,270,470);c.clip();c.fillStyle='#0f1f24';c.fillRect(460,240,310,490);rain(c,t,0.9,0.06,730);glassDrops(c,t,480,250,270,470,1.2);c.restore();windowFrame(c,480,250,270,470);
      // тени гостей на стене: дрожат от свечи, растут к «страшному»
      const lean=Math.sin(t*1.7)*0.4*sk+sk*0.5;const fl=flick(t,1+sk*2);
      const heads=[[150,540,1.0,0],[320,480,1.12,1],[790,600,0.95,0],[930,660,0.85,0]];
      for(const [hx,hy,hs,curl] of heads){const grow=1+0.25*st;c.save();c.translate(hx+lean*30*hs,980);c.scale(hs*grow*fl,hs*grow);c.translate(0,hy-980);
        c.fillStyle='rgba(2,5,7,0.62)';ell(c,0,0,70,84);c.fill();
        if(curl){for(let k=0;k<7;k++){ell(c,-60+k*20,-60-Math.sin(k/6*Math.PI)*22,24,22);c.fill();}}
        c.beginPath();c.moveTo(-40,70);c.quadraticCurveTo(-150,130,-170,420);c.lineTo(170,420);c.quadraticCurveTo(150,130,40,70);c.fill();c.restore();}
      // рука Байрона на стене, поднимается
      if(by>0){c.save();c.translate(330+lean*30,470);c.fillStyle=`rgba(2,5,7,${0.6*by})`;c.rotate(-0.4+0.25*by);c.scale(1+0.3*st,1+0.3*st);
        const hy=-60-180*by;c.beginPath();c.moveTo(50,50);c.quadraticCurveTo(170,0,190,hy+40);c.lineTo(250,hy+40);c.quadraticCurveTo(230,20,90,100);c.fill();
        ell(c,220,hy+20,40,46);c.fill();for(let i=0;i<4;i++){c.beginPath();c.ellipse(192+i*19,hy-40-(i==1||i==2?14:0),9,40,(i-1.5)*0.08,0,Math.PI*2);c.fill();}
        c.beginPath();c.ellipse(258,hy+16,9,30,0.7,0,Math.PI*2);c.fill();c.restore();}
      // стол и свеча
      const tg=c.createLinearGradient(0,1000,0,1300);tg.addColorStop(0,'#1d1c17');tg.addColorStop(1,'#090a09');c.fillStyle=tg;c.fillRect(0,1000,W,H-1000);
      candleGlow(c,540,820,0.9+0.1*Math.sin(t*5),600);candle(c,540,1040,1,t,{flame:1,lean:lean});
      fog(c,t,200,1100,0.4,[90,110,115]);
      c.restore();}
    bottomDark(c,1130,0.88);darkV(c,0.72);grainX(c);
  },
  noch(c,t,lt){c._t=t;
    const ga=ease((lt-K('gasnet'))/1.0),vi=ease((lt-K('vidit'))/2.6),ro=ease((lt-K('rodilsya'))/2.4);
    const fl=Math.max(1-ga,ro);
    wall(c,'#0b171b','#050b0d');
    // окно: тусклый холодный ночной свет
    const wl=0.35+0.65*vi;c.save();windowPath(c,330,230,420,700);c.clip();const wg=c.createLinearGradient(0,230,0,930);wg.addColorStop(0,rgba(46,74,82,wl));wg.addColorStop(1,rgba(22,38,44,wl));c.fillStyle=wg;c.fillRect(320,220,440,720);
    rain(c,t,0.6*wl,0.04,940);glassDrops(c,t,330,230,420,700,wl);c.restore();windowFrame(c,330,230,420,700,'#03080a');
    // кровать, полог
    c.fillStyle='#08100f';c.fillRect(780,860,320,260);c.fillStyle='#0d1716';c.beginPath();c.moveTo(790,860);c.quadraticCurveTo(940,800,1100,850);c.lineTo(1100,900);c.lineTo(790,900);c.fill();
    c.fillStyle='rgba(20,34,36,0.9)';c.beginPath();c.moveTo(1080,120);c.quadraticCurveTo(990,500,1030,1120);c.lineTo(1080,1120);c.fill();
    // он стоит у окна: высокий печальный силуэт
    const ma=vi*(1-0.75*ro);
    monster(c,580,1150,0.87,t,{a:ma,rim:vi,eyes:vi*ease((lt-K('vidit')-1.2)/2)*(1-ro),seams:vi*0.9});
    // тумбочка, свеча, рукопись
    c.fillStyle='#0b0d0b';c.fillRect(20,1000,300,200);c.fillStyle='#151613';c.fillRect(0,985,340,22);
    candleGlow(c,90,800,fl,560);
    page(c,262,962,240,120,-0.05,0.3+0.65*fl);
    if(ro>0){c.save();c.globalAlpha=ro;c.translate(262,957);c.rotate(-0.05);c.textAlign='center';c.font='700 25px C';c.fillStyle='rgba(30,26,30,0.85)';c.fillText('Франкенштейн',0,-14);
      scribble(c,-80,8,160,ro,5,'rgba(30,26,30,0.6)',16,2);c.restore();}
    candle(c,80,1000,0.95,t,{flame:fl,smoke:ga*(1-ro)*(1-ease((lt-K('gasnet')-1.6)/2))});
    // почти чёрная темнота после свечи (не #000), без резкого возврата
    const dk=ga*(1-ro);c.fillStyle=rgba(NIGHT[0],NIGHT[1],NIGHT[2],0.93*dk*(1-0.55*vi));c.fillRect(0,0,W,H);
    // свет окна и силуэт поверх темноты
    if(vi>0&&dk>0){c.save();c.globalAlpha=0.55*vi*dk;windowPath(c,330,230,420,700);c.clip();const g2=c.createLinearGradient(0,230,0,930);g2.addColorStop(0,'#2a464e');g2.addColorStop(1,'#13232a');c.fillStyle=g2;c.fillRect(320,220,440,720);c.restore();
      monster(c,580,1150,0.87,t,{a:vi*dk*0.95,rim:vi,eyes:vi*ease((lt-K('vidit')-1.2)/2),seams:vi*0.8});}
    fog(c,t,500,1200,0.5,[80,105,110]);bottomDark(c,1140,0.88);darkV(c,0.75);grainX(c,0.08);
  },
  son(c,t,lt){c._t=t;
    const dn=ease((lt-K('dnevnik'))/1),og=ease((lt-K('ogon'))/1.6),pu=ease((lt-K('pusto'))/3);
    if(og<1){c.save();
      wall(c,'#0c1619','#050a0c');candleGlow(c,880,820,0.8,560);
      page(c,450,730,620,840,-0.03,0.8);
      c.save();c.translate(450,730);c.rotate(-0.03);c.textAlign='left';c.font='700 36px C';c.fillStyle='rgba(40,30,30,0.8)';c.fillText('19 марта 1815',-260,-330);c.restore();
      scribble(c,190,440,520,ease((lt-K('dnevnik')-0.3)/5),31,'rgba(36,30,36,0.7)',44,14);
      candle(c,870,1120,0.8,t,{flame:0.8});c.restore();}
    if(og>0){c.save();c.globalAlpha=og;
      wall(c,'#0e1719','#060b0c');
      const fire=1-pu;hearth(c,540,1040,fire,t);
      const lit=[lerp(96,30,pu),lerp(70,44,pu),lerp(52,48,pu)];
      const rk=Math.sin(t*1.1)*(1-ease((lt-K('pusto')-1)/3));
      cradle(c,420,1150,0.95,rk,1-ease((lt-K('pusto'))/2.5),t,lit);
      c.fillStyle=rgba(8,22,30,0.55*pu);c.fillRect(0,0,W,H);
      fog(c,t,600,1200,0.3+0.5*pu,[70,95,105]);c.restore();}
    bottomDark(c,1150,0.88);darkV(c,0.72);grainX(c);
  },
  okno(c,t,lt){
    const pr=ease((lt-K('prosto'))/3.5),z=1.02+lt*0.004;
    c.save();c.translate(540,700);c.scale(z,z);c.translate(-540,-700);
    wall(c,'#091316','#040809');
    c.save();windowPath(c,140,200,640,960);c.clip();
    const g=c.createLinearGradient(0,180,0,1160);g.addColorStop(0,'#16282e');g.addColorStop(1,'#0c171b');c.fillStyle=g;c.fillRect(160,170,760,1000);
    clouds(c,t,200,500,0.6,[10,20,24]);hills(c,880,'#071012');lake(c,890,t,'#0b181c','#060d10');
    // кто-то далеко у дерева, под дождём
    c.strokeStyle='#050b0d';c.lineWidth=12;c.beginPath();c.moveTo(735,900);c.lineTo(742,640);c.stroke();c.lineWidth=5;c.beginPath();c.moveTo(740,720);c.lineTo(700,670);c.moveTo(741,690);c.lineTo(790,640);c.stroke();
    {const fg=c.createRadialGradient(640,780,10,640,780,260);fg.addColorStop(0,'rgba(90,120,125,0.35)');fg.addColorStop(1,'rgba(90,120,125,0)');c.fillStyle=fg;c.fillRect(380,520,520,520);}
    monster(c,640,905,0.27,t,{a:0.9*pr,rim:pr,eyes:pr*0.8,seams:0});
    fog(c,t,700,1000,1.0,[110,135,140]);rain(c,t,0.9,0.05,1160);glassDrops(c,t,140,200,640,960,1.3);c.restore();
    windowFrame(c,140,200,640,960,'#030708');
    c.restore();
    bottomDark(c,1150,0.85);darkV(c,0.72);grainX(c);
  },
  goodnight(c,t,lt){
    const dim=ease((lt-K('dim'))/2),SL=K('sleep'),sl=ease((lt-SL)/2.5);
    nightSky(c,t,0.55+0.15*dim);clouds(c,t,150,900,0.5);
    c.save();const z=1.1-lt*0.005;c.translate(W/2,H/2);c.scale(z,z);c.translate(-W/2,-H/2);
    moon(c,540,700,t);owl(c,540,760,1.15,t,clamp(blink(t,0)+sl,0,1),true,{talk:talk(t),sleepy:sl});c.restore();
    if(sl>0){c.save();c.font='700 64px C';c.fillStyle='#9fb2b8';for(let i=0;i<3;i++){const p=((t*0.3+i/3)%1);c.globalAlpha=sl*Math.sin(p*Math.PI)*0.6;c.fillText('z',640+p*120+Math.sin(p*9)*15,560-p*260);}c.restore();}
    hills(c,1060);villa(c,760,1052,0.55,1-ease((lt-SL)/2),t);lake(c,1070,t);
    // в окне виллы — высокая тень, еле заметно
    c.save();c.globalAlpha=0.5*(1-ease((lt-SL)/2));monster(c,727,1013,0.05,t,{a:1});c.restore();
    fog(c,t,950,1200,1.1);rain(c,t,0.5);bottomDark(c,1150,0.7);c.fillStyle=`rgba(2,6,9,${0.2*dim})`;c.fillRect(0,0,W,H);darkV(c,0.6);grainX(c);
  }
};
