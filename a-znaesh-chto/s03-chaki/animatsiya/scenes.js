// Страшная арка s03: Чаки («Детские игры», 1988). Подключается после obshchee/core.js.
// Узнаём по символам: рыжая кукла в полосатом комбинезоне — только со спины или в глубокой тени, ящик с игрушками.
// Своя кукла: лицо всегда в тени, видны только стеклянные глаза; без шрамов, веснушек, логотипа Good Guys, без оружия.
// Палитра: холодные сине-зелёные, почти чёрный (не полный), тусклый жёлтый свет ночника/лампы.
const DEFK={glow:1.4,nine:0.9,one:4.36,creak:0.5,lid:2.29,dust:4.58,else:6.26,hide:0.2,sit:0.8,still:3.94,eyes:0.8,fingers:1.8,blink:4.4,back:0.8,orch:2.29,sens:0.8,lips:3.05,seam:3.43,tall:4.66,scale:0.8,adult:2.86,look:0.8,maybe:5.2,dim:0.8,sleep:1.2,end:3.4,close:4.6};
const DEFKA={hide:16.26,back:30.98};
const K=n=>CFG.k&&CFG.k[n]!=null?CFG.k[n]:DEFK[n];
const KA=n=>CFG.ka&&CFG.ka[n]!=null?CFG.ka[n]:DEFKA[n];
// мини-совёнок прячется на жути (строки 5–7) и возвращается на строке 8
const _miniOwl=miniOwl;
miniOwl=function(c,t,a){const h=ease((t-KA('hide'))/1.0)*(1-ease((t-KA('back'))/1.4));_miniOwl(c,t,a*(1-0.88*h));};
// ---------- helpers ----------
let sd2=37;function r2(){sd2=(sd2*16807)%2147483647;return (sd2-1)/2147483646;}
const FOG=[];for(let i=0;i<34;i++)FOG.push({x:r2()*1.4-0.2,y:r2(),r:160+r2()*260,v:6+r2()*14,p:r2()*6.28});
function fog(c,t,y0,y1,a){c.save();c.globalCompositeOperation='screen';
  for(const f of FOG){const x=((f.x*W+t*f.v)%(W*1.4)+W*1.4)%(W*1.4)-W*0.2,y=lerp(y0,y1,f.y)+Math.sin(t*0.2+f.p)*20;
    const g=c.createRadialGradient(x,y,0,x,y,f.r);const al=a*(0.55+0.45*Math.sin(t*0.15+f.p));
    g.addColorStop(0,`rgba(120,150,155,${al})`);g.addColorStop(1,'rgba(120,150,155,0)');c.fillStyle=g;c.fillRect(x-f.r,y-f.r,f.r*2,f.r*2);}
  c.restore();}
function vignD(c,k=0.8){const g=c.createRadialGradient(W/2,H*0.42,H*0.18,W/2,H*0.45,H*0.72);g.addColorStop(0,'rgba(2,6,8,0)');g.addColorStop(1,`rgba(2,6,8,${k})`);c.fillStyle=g;c.fillRect(0,0,W,H);}
function grad(c,a,b,d){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,a);g.addColorStop(0.55,b);g.addColorStop(1,d);c.fillStyle=g;c.fillRect(0,0,W,H);}
function glow(c,x,y,r,col,a){if(a<=0)return;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
function zoomAt(c,x,y,z){c.translate(x,y);c.scale(z,z);c.translate(-x,-y);}
const DUSTP=[];for(let i=0;i<46;i++)DUSTP.push({x:r2(),v:10+r2()*26,p:r2()*6.28,r:1.5+r2()*3,o:r2()});
// дома: силуэты крыш, одно тусклое окно (детская)
function houses(c,y,t,col='#060c10',win=0.6){c.fillStyle=col;c.beginPath();c.moveTo(0,H);c.lineTo(0,y+40);
  const R=[[0,40],[90,-60],[200,30],[260,30],[360,-90],[470,20],[560,20],[640,-40],[720,30],[800,30],[900,-70],[1000,30],[1080,10]];
  for(const [x,dy] of R)c.lineTo(x,y+dy);c.lineTo(W,H);c.fill();
  glow(c,385,y+7,90,'255,200,110',0.12*win);
  c.fillStyle=`rgba(255,200,110,${0.26*win*(0.9+0.1*Math.sin(t*0.7))})`;c.fillRect(372,y-10,26,34);
  c.fillStyle='#04080a';c.fillRect(383,y-10,3,34);c.fillRect(372,y+5,26,3);
  c.fillStyle=`rgba(150,190,200,0.05)`;c.fillRect(900,y+0,24,30);}
// ---------- кукла (своя): рыжие пряди, полосатая рубашка, тёмный комбинезон ----------
const HAIR='#5e2a15',HAIR2='#8a4424',SKIN='#2b2522',DEN='#17232c',DEN2='#1d2b35';
function hairTufts(c,cx,cy,r,a0,a1,n,len,col){c.fillStyle=col;
  for(let i=0;i<n;i++){const j=Math.sin(i*12.9898+n)*43758.5453,rr=j-Math.floor(j);const a=lerp(a0,a1,(i+0.3*rr)/(n-1)),l=len*(0.45+0.9*rr);
    const bx=cx+Math.cos(a)*r*0.86,by=cy+Math.sin(a)*r*0.86,tx=cx+Math.cos(a+0.25*(rr-0.3))*(r+l),ty=cy+Math.sin(a+0.25*(rr-0.3))*(r+l)+l*0.45;
    c.beginPath();c.moveTo(cx+Math.cos(a-0.16)*r*0.9,cy+Math.sin(a-0.16)*r*0.9);c.quadraticCurveTo(bx+Math.cos(a)*l*0.6,by+Math.sin(a)*l*0.6,tx,ty);c.lineTo(cx+Math.cos(a+0.18)*r*0.9,cy+Math.sin(a+0.18)*r*0.9);c.closePath();c.fill();}}
function stripes(c,x0,y0,w,h,horiz,cols,step){for(let i=0,p=horiz?y0:x0;p<(horiz?y0+h:x0+w);p+=step,i++){c.fillStyle=cols[i%cols.length];horiz?c.fillRect(x0,p,w,step/2):c.fillRect(p,y0,step/2,h);}}
// со спины. Начало координат — линия бёдер. o: sit, seam 0..1, rim 0..1, dark 0..1, armL/armR (поворот рук)
function dollBack(c,x,y,s,o={}){const dk=o.dark==null?0:o.dark;c.save();c.translate(x,y);c.scale(s,s);
  // ноги
  if(!o.sit){c.fillStyle=DEN;c.beginPath();c.roundRect(-78,-10,70,150,18);c.fill();c.beginPath();c.roundRect(8,-10,70,150,18);c.fill();
    c.fillStyle='#0d0f10';ell(c,-44,150,48,24);c.fill();ell(c,44,150,48,24);c.fill();}
  // руки: полосатые рукава + ладошки
  for(const sd of [-1,1]){c.save();c.translate(sd*100,-215);c.rotate(sd*(o.arm||0.08));
    c.save();c.beginPath();c.roundRect(-26,0,52,170,24);c.clip();stripes(c,-30,0,60,170,true,['#3e261d','#1c2531'],26);c.restore();
    c.fillStyle=SKIN;ell(c,0,186,26,30);c.fill();c.restore();}
  // торс: рубашка в полоску
  c.save();c.beginPath();c.moveTo(-104,-200);c.quadraticCurveTo(-110,-250,-60,-262);c.lineTo(60,-262);c.quadraticCurveTo(110,-250,104,-200);c.lineTo(96,0);c.lineTo(-96,0);c.closePath();c.clip();
  stripes(c,-120,-270,240,280,true,['#3e261d','#1c2531'],28);
  // спинка комбинезона в узкую полоску
  c.beginPath();c.moveTo(-84,-150);c.lineTo(84,-150);c.lineTo(98,0);c.lineTo(-98,0);c.closePath();c.save();c.clip();stripes(c,-110,-160,220,170,false,[DEN,'#1a2730'],18);c.restore();
  // лямки крест-накрест
  c.strokeStyle=DEN2;c.lineWidth=26;c.beginPath();c.moveTo(-70,-262);c.lineTo(50,-150);c.moveTo(70,-262);c.lineTo(-50,-150);c.stroke();
  c.fillStyle='#3d4448';ell(c,-50,-150,8,8);c.fill();ell(c,50,-150,8,8);c.fill();
  // шов на спине: чуть раскрыт
  const sm=o.seam||0;if(sm>0){c.fillStyle='#020405';c.beginPath();c.moveTo(0,-235);c.quadraticCurveTo(10*sm,-140,0,-40);c.quadraticCurveTo(-10*sm,-140,0,-235);c.fill();
    c.strokeStyle=`rgba(150,140,120,${0.45*sm})`;c.lineWidth=3;for(let yy=-220;yy<-50;yy+=18){const wd=(4+10*sm)*Math.sin(Math.PI*(yy+235)/195);c.beginPath();c.moveTo(-wd-6,yy);c.lineTo(wd+6,yy+4);c.stroke();}}
  c.restore();
  // шея и голова (затылок)
  c.fillStyle=SKIN;c.fillRect(-26,-292,52,36);
  c.fillStyle=SKIN;ell(c,-92,-338,16,24);c.fill();ell(c,92,-338,16,24);c.fill();
  {const g=c.createRadialGradient(-30,-380,10,0,-340,110);g.addColorStop(0,HAIR2);g.addColorStop(1,HAIR);c.fillStyle=g;ell(c,0,-345,92,98);c.fill();}
  hairTufts(c,0,-345,92,Math.PI*0.75,Math.PI*2.25,13,26,HAIR);
  c.strokeStyle='rgba(30,12,6,0.45)';c.lineWidth=3;c.lineCap='round';for(let i=0;i<14;i++){const a=-2.6+i*0.37,x0=Math.cos(a)*30,y0=-400+Math.sin(a)*20;c.beginPath();c.moveTo(x0,y0);c.quadraticCurveTo(x0*2.2+Math.sin(i*3)*12,-350,x0*2.6+Math.sin(i*5)*16,-268-((i*7)%18));c.stroke();}
  c.strokeStyle='rgba(170,90,50,0.18)';c.lineWidth=2;for(let i=0;i<6;i++){c.beginPath();c.moveTo(-40+i*12,-428);c.quadraticCurveTo(-60+i*10,-390,-70+i*8,-340);c.stroke();}
  if(o.rim){c.strokeStyle=`rgba(150,185,190,${0.35*o.rim})`;c.lineWidth=4;c.beginPath();c.arc(0,-345,94,Math.PI*1.05,Math.PI*1.55);c.stroke();
    c.beginPath();c.moveTo(-104,-205);c.quadraticCurveTo(-110,-250,-60,-262);c.stroke();}
  if(dk>0){c.globalCompositeOperation='source-atop';c.fillStyle=`rgba(4,8,10,${dk})`;c.fillRect(-200,-500,400,700);}
  c.restore();}
// лицо в тени: видны только стеклянные глаза. lid 0..1 — веки, eye 0..1 — блик в глазах
function dollFace(c,x,y,s,o={}){const lid=o.lid||0,ey=o.eye==null?1:o.eye;c.save();c.translate(x,y);c.scale(s,s);
  // уши
  c.fillStyle='#101212';ell(c,-146,14,14,24);c.fill();ell(c,146,14,14,24);c.fill();
  {const g=c.createRadialGradient(50,-60,20,0,0,170);g.addColorStop(0,'#1a1d1d');g.addColorStop(1,'#0c0f10');c.fillStyle=g;ell(c,0,0,150,158);c.fill();}
  // холодный контровой свет по краю щеки
  c.save();ell(c,0,0,150,158);c.clip();c.strokeStyle=`rgba(130,170,175,${0.18*(o.rim==null?1:o.rim)})`;c.lineWidth=10;c.beginPath();c.arc(-8,4,150,-0.2,0.9);c.stroke();
  c.restore();
  // глаза: стекло
  for(const ex of [-54,54]){c.save();ell(c,ex,-8,34,30);c.clip();
    c.fillStyle=`rgba(150,165,160,${0.55*ey})`;c.fillRect(ex-40,-40,80,64);
    c.fillStyle=`rgba(50,120,128,${0.9*ey})`;ell(c,ex+2,-6,20,20);c.fill();
    c.fillStyle=`rgba(4,8,10,${ey})`;ell(c,ex+2,-6,9,9);c.fill();
    c.fillStyle=`rgba(235,245,240,${0.85*ey})`;ell(c,ex+10,-15,5,5);c.fill();ell(c,ex-6,2,2.2,2.2);c.fill();
    // верхнее веко
    c.fillStyle='#141717';c.fillRect(ex-40,-40,80,lid*64+3);
    c.restore();
    c.strokeStyle='#060808';c.lineWidth=4;c.beginPath();c.ellipse(ex,-8,34,30,0,Math.PI*1.05,Math.PI*1.95);c.stroke();
    const ly=-38+lid*58;c.lineWidth=3;for(let i=-3;i<=3;i++){c.beginPath();c.moveTo(ex+i*9,ly);c.lineTo(ex+i*11,ly-10+Math.abs(i));c.stroke();}}
  // пряди сверху
  {const g=c.createRadialGradient(0,-150,10,0,-120,160);g.addColorStop(0,HAIR2);g.addColorStop(1,HAIR);c.fillStyle=g;
   c.beginPath();c.moveTo(-150,-30);c.quadraticCurveTo(-160,-170,0,-170);c.quadraticCurveTo(160,-170,150,-30);c.quadraticCurveTo(110,-110,30,-112);c.quadraticCurveTo(-10,-92,-40,-120);c.quadraticCurveTo(-110,-110,-150,-30);c.fill();}
  hairTufts(c,0,-60,130,Math.PI*1.05,Math.PI*1.95,11,34,HAIR);
  // чёлка неровными прядями
  c.fillStyle=HAIR;for(let i=0;i<9;i++){const x0=-120+i*30,l=26+((i*37)%30);c.beginPath();c.moveTo(x0-16,-112);c.quadraticCurveTo(x0+4,-100+l*0.4,x0+6+((i%3)-1)*8,-96+l);c.lineTo(x0+16,-110);c.closePath();c.fill();}
  {const g=c.createLinearGradient(0,-60,0,160);g.addColorStop(0,'rgba(4,8,10,0)');g.addColorStop(1,'rgba(4,8,10,0.5)');c.fillStyle=g;ell(c,0,40,150,120);c.fill();}
  c.restore();}
// ладошка на краю: f — шевеление пальцев 0..1
function dollHand(c,x,y,s,f){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle='#1e1b19';
  ell(c,0,-14,46,30);c.fill();
  for(let i=0;i<4;i++){const fx=-30+i*20,cr=0.25*f*Math.sin(i*1.7+1)+0.15*f;c.save();c.translate(fx,6);c.rotate(-cr);c.beginPath();c.roundRect(-8,-4,16,42,8);c.fill();c.restore();}
  c.save();c.translate(42,-6);c.rotate(-0.9);c.beginPath();c.roundRect(-8,-4,16,34,8);c.fill();c.restore();
  c.strokeStyle='rgba(130,170,175,0.12)';c.lineWidth=3;c.beginPath();c.arc(0,-14,46,Math.PI*1.1,Math.PI*1.8);c.stroke();
  c.restore();}
// ящик с игрушками (вид спереди). gap — щель под крышкой, px
function toyBox(c,x,y,w,h,gap,t,o={}){c.save();c.translate(x,y);
  c.save();c.translate(0,0);c.scale(1,0.12);glow(c,0,0,w*0.8,'0,0,0',0.6);c.restore();
  // корпус
  {const g=c.createLinearGradient(0,-h,0,0);g.addColorStop(0,'#2a1e16');g.addColorStop(1,'#140e0a');c.fillStyle=g;c.fillRect(-w/2,-h,w,h);}
  c.strokeStyle='rgba(0,0,0,0.45)';c.lineWidth=3;for(let i=1;i<4;i++){c.beginPath();c.moveTo(-w/2,-h+i*h/4);c.lineTo(w/2,-h+i*h/4);c.stroke();}
  c.fillStyle='#2b2f30';for(const sx of [-1,1]){c.fillRect(sx*w/2-(sx>0?36:0),-h,36,36);c.fillRect(sx*w/2-(sx>0?36:0),-36,36,36);}
  // выцветшие нарисованные кубики-буквы (без надписей): просто квадраты
  c.globalAlpha=0.18;for(const [bx,col] of [[-140,'#7a3a2a'],[0,'#2f5560'],[140,'#7a6a3a']]){c.fillStyle=col;c.fillRect(bx-44,-h*0.62,88,88);}c.globalAlpha=1;
  c.fillStyle='#0b0909';ell(c,0,-h+46,7,10);c.fill();c.fillRect(-3,-h+46,6,16);
  // щель
  if(gap>0){c.fillStyle='#020405';c.fillRect(-w/2+6,-h-gap,w-12,gap+2);
    if(o.inner){c.save();c.beginPath();c.rect(-w/2+6,-h-gap,w-12,gap+2);c.clip();o.inner(c);c.restore();}}
  // крышка
  {const ly=-h-gap;const g=c.createLinearGradient(0,ly-44,0,ly);g.addColorStop(0,'#33251b');g.addColorStop(1,'#1c140f');c.fillStyle=g;
   c.beginPath();c.moveTo(-w/2-14,ly);c.lineTo(w/2+14,ly);c.lineTo(w/2+6,ly-44);c.lineTo(-w/2-6,ly-44);c.closePath();c.fill();
   c.fillStyle='rgba(255,214,150,0.06)';c.fillRect(-w/2-6,ly-44,w+12,4);}
  c.restore();}
// детская: o.z, o.gap, o.hair, o.dust, o.toys, o.night
function kidroom(c,t,o){const z=o.z||1;c.save();zoomAt(c,o.cx||540,o.cy||860,z);
  grad(c,'#0b161a','#0c171b','#080f12');
  // обои: мелкий ромбик
  c.fillStyle='rgba(150,180,185,0.035)';for(let y=80;y<1080;y+=70)for(let x=(y/70%2)*35;x<W;x+=70){c.save();c.translate(x,y);c.rotate(Math.PI/4);c.fillRect(-7,-7,14,14);c.restore();}
  // окно слева, лунный свет
  c.fillStyle='#0f1d24';c.fillRect(70,250,290,400);c.fillStyle='rgba(120,160,180,0.12)';c.fillRect(84,264,262,372);
  c.strokeStyle='#0a1114';c.lineWidth=14;c.strokeRect(70,250,290,400);c.beginPath();c.moveTo(215,250);c.lineTo(215,650);c.moveTo(70,450);c.lineTo(360,450);c.stroke();
  c.fillStyle='#0a1316';c.beginPath();c.moveTo(30,220);c.lineTo(150,220);c.quadraticCurveTo(110,500,130,700);c.lineTo(30,700);c.fill();
  c.fillStyle='rgba(120,160,180,0.05)';c.beginPath();c.moveTo(84,650);c.lineTo(346,650);c.lineTo(700,1250);c.lineTo(220,1250);c.closePath();c.fill();
  // плинтус и пол
  c.fillStyle='#091114';c.fillRect(0,1080,W,H-1080);c.fillStyle='rgba(150,180,185,0.06)';c.fillRect(0,1078,W,6);
  c.strokeStyle='rgba(0,0,0,0.35)';c.lineWidth=3;for(let i=-8;i<=8;i++){c.beginPath();c.moveTo(540+i*70,1084);c.lineTo(540+i*240,H);c.stroke();}
  // ночник
  const nl=o.night==null?1:o.night;glow(c,950,1060,300,'255,200,110',0.13*nl);glow(c,950,1050,40,'255,224,160',0.6*nl);c.fillStyle='#1a1410';c.fillRect(930,1060,40,20);
  // игрушки на полу
  if(o.toys){c.fillStyle='#3a1a16';ell(c,230,1160,46,46);c.fill();c.fillStyle='rgba(255,220,180,0.06)';ell(c,218,1146,16,12);c.fill();
    c.save();c.translate(830,1170);c.rotate(0.2);c.fillStyle='#24333a';c.fillRect(-36,-36,72,72);c.restore();
    // мишка лежит на боку
    c.fillStyle='#2a2018';ell(c,330,1200,60,34);c.fill();ell(c,262,1190,34,32);c.fill();ell(c,250,1164,12,12);c.fill();ell(c,280,1162,12,12);c.fill();}
  toyBox(c,540,1180,620,300,o.gap||0,t,{inner:o.hair>0?(cc=>{cc.save();cc.globalAlpha=o.hair;cc.strokeStyle=HAIR2;cc.lineWidth=4;
      for(const [hx,dy] of [[-40,0],[-28,6],[-14,-2]]){cc.beginPath();cc.moveTo(hx,-330);cc.quadraticCurveTo(hx+8,-300+dy,hx-4,-270);cc.stroke();}cc.restore();}):null});
  if(o.hair>0){c.save();c.globalAlpha=o.hair;c.strokeStyle=HAIR2;c.lineWidth=4;c.lineCap='round';for(const [hx,dy] of [[500,0],[512,8],[526,-4]]){c.beginPath();c.moveTo(hx,880-(o.gap||0));c.quadraticCurveTo(hx+8,905+dy,hx-6,930+dy);c.stroke();}c.restore();}
  // пыль из щели
  if(o.dust>0){c.save();c.globalCompositeOperation='screen';for(const d of DUSTP){const q=((t*0.12+d.o)%1),x=300+d.x*480+Math.sin(t*0.6+d.p)*24,y=878-(o.gap||0)-q*d.v*14;
    c.fillStyle=`rgba(200,210,200,${0.35*o.dust*Math.sin(q*Math.PI)})`;ell(c,x,y,d.r,d.r);c.fill();}c.restore();}
  c.restore();}
const SC={
  sky(c,t,lt){
    sky(c,t,0);c.fillStyle='rgba(2,14,18,0.55)';c.fillRect(0,0,W,H);
    const z=1+lt*0.006;c.save();zoomAt(c,W/2,H/2,z);
    const ent=ease(lt/1.6);moon(c,540,700,t);owl(c,540,760+(1-ent)*500,1.15*(0.6+0.4*ent),t,blink(t,0),false,{talk:talk(t)});c.restore();
    houses(c,1060,t,'#050a0d',ease((lt-K('glow'))/1.5));
    fog(c,t,1000,1250,0.16);vignD(c,0.7);
  },
  eye(c,t,lt){
    const n9=K('nine'),n1=K('one');const z=1+0.12*ease(lt/7);c.save();zoomAt(c,520,680,z);
    grad(c,'#091215','#0a1316','#070d10');
    glow(c,700,320,600,'120,160,170',0.07);
    // крупно: щека, бровь из прядей, глаз
    {const g=c.createRadialGradient(420,640,60,560,760,900);g.addColorStop(0,'#1d2120');g.addColorStop(0.6,'#121515');g.addColorStop(1,'#0a0d0e');c.fillStyle=g;ell(c,560,820,700,560);c.fill();}
    // пряди чёлки свисают сверху
    for(let i=0;i<16;i++){const x0=-60+i*76,l=90+((i*53)%160),sw=Math.sin(t*0.5+i)*4;const g=c.createLinearGradient(0,150,0,150+l);g.addColorStop(0,HAIR2);g.addColorStop(1,HAIR);c.fillStyle=g;
      const hw=30+((i*29)%34);c.beginPath();c.moveTo(x0-hw,140);c.quadraticCurveTo(x0-10,200+l*0.5,x0+14+sw+((i%3)-1)*26,200+l);c.quadraticCurveTo(x0+20,180+l*0.4,x0+hw,140);c.closePath();c.fill();}
    {const g=c.createLinearGradient(0,140,0,420);g.addColorStop(0,'rgba(6,10,12,0.15)');g.addColorStop(0.55,'rgba(6,10,12,0.55)');g.addColorStop(1,'rgba(6,10,12,0)');c.fillStyle=g;c.fillRect(-60,140,1200,300);}
    c.fillStyle=HAIR;c.fillRect(-60,100,1200,60);
    c.strokeStyle='rgba(30,12,6,0.4)';c.lineWidth=3;for(let i=0;i<20;i++){const x0=-40+i*58;c.beginPath();c.moveTo(x0,120);c.quadraticCurveTo(x0+10,220,x0+4+((i%4)-1.5)*10,300+((i*41)%90));c.stroke();}
    const tw=Math.max(0,Math.sin(Math.PI*clamp((lt-n9-2.2)/1.8,0,1)))*0.28;
    c.save();c.translate(530,700);
    c.save();ell(c,0,0,230,160);c.clip();
    {const g=c.createLinearGradient(0,-160,0,160);g.addColorStop(0,'#3a4442');g.addColorStop(0.5,'#76827e');g.addColorStop(1,'#5d6865');c.fillStyle=g;c.fillRect(-240,-170,480,340);}
    {const g=c.createRadialGradient(0,0,10,0,0,130);g.addColorStop(0,'#5aa0a6');g.addColorStop(0.7,'#2f6a72');g.addColorStop(1,'#163a40');c.fillStyle=g;ell(c,10,8,125,125);c.fill();}
    c.strokeStyle='rgba(10,30,34,0.5)';c.lineWidth=3;for(let i=0;i<24;i++){const a=i/24*6.28;c.beginPath();c.moveTo(10+Math.cos(a)*55,8+Math.sin(a)*55);c.lineTo(10+Math.cos(a)*118,8+Math.sin(a)*118);c.stroke();}
    c.fillStyle='#030607';ell(c,10,8,52,52);c.fill();
    c.fillStyle='rgba(240,250,245,0.75)';ell(c,60,-30,16,12);c.fill();ell(c,-30,50,7,6);c.fill();
    c.fillStyle='rgba(0,0,0,0.35)';c.fillRect(-240,-170,480,90);
    const lid=0.3+tw;c.fillStyle='#151918';c.fillRect(-240,-170,480,lid*330);
    c.restore();
    c.strokeStyle='#050707';c.lineWidth=10;c.beginPath();c.ellipse(0,0,230,160,0,Math.PI*1.02,Math.PI*1.98);c.stroke();
    const ly=-160+(0.3+tw)*330;c.lineWidth=7;c.lineCap='round';for(let i=-6;i<=6;i++){c.beginPath();c.moveTo(i*34,ly);c.lineTo(i*40,ly-38+Math.abs(i)*3);c.stroke();}
    c.restore();
    c.restore();
    // нити поверх: уходят в голову кукловодов: девять, потом одна
    for(let i=0;i<9;i++){const ap=ease((lt-n9-i*0.28)/0.9);if(ap<=0)continue;const keep=i===4,fa=keep?1:1-0.88*ease((lt-n1)/1.4);
      const x0=110+i*80,x1=300+i*55;c.strokeStyle=keep?`rgba(255,214,150,${0.5*ap*(0.6+0.4*ease((lt-n1)/1.4))})`:`rgba(170,195,200,${0.45*ap*fa})`;c.lineWidth=keep?5:3.5;
      c.beginPath();c.moveTo(x0,-20);c.bezierCurveTo(x0,200,x1,260,x1,lerp(-20,330+((i*47)%90),ap));c.stroke();}
    for(let i=0;i<9;i++){const ap=ease((lt-n9-i*0.28-0.7)/0.4);if(ap<=0)continue;const keep=i===4,fa=keep?1:1-0.88*ease((lt-n1)/1.4);glow(c,300+i*55,330+((i*47)%90),18,keep?'255,214,150':'170,195,200',0.5*ap*fa);}
    fog(c,t,900,1300,0.06);vignD(c,0.85);
  },
  box(c,t,lt){
    const gap=lerp(0,26,ease((lt-K('creak'))/2.4)),z=1+0.3*ease((lt-K('dust')+1.5)/7);
    kidroom(c,t,{z,cx:540,cy:880,gap,dust:ease((lt-K('dust'))/1.6),hair:ease((lt-K('else'))/1.8),night:0.85});
    fog(c,t,1000,1300,0.08);vignD(c,0.85);
  },
  sit(c,t,lt){
    // после «лёжа» всё замирает
    const fr=K('still'),tt=lt<fr?lt:fr,T=t-(lt-tt);
    const z=1.04+0.1*ease(tt/6);c.save();zoomAt(c,540,760,z);
    grad(c,'#0b1215','#0c1416','#080e10');
    // внутренние стенки ящика
    c.fillStyle='#1a120d';c.fillRect(0,0,W,H);
    c.strokeStyle='rgba(0,0,0,0.5)';c.lineWidth=4;for(let y=60;y<1300;y+=110){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
    c.fillStyle='rgba(6,10,12,0.55)';c.beginPath();c.moveTo(0,0);c.lineTo(150,0);c.lineTo(150,1180);c.lineTo(0,1400);c.fill();c.beginPath();c.moveTo(W,0);c.lineTo(930,0);c.lineTo(930,1180);c.lineTo(W,1400);c.fill();
    // дно ящика
    c.fillStyle='#120c09';c.beginPath();c.moveTo(150,1180);c.lineTo(930,1180);c.lineTo(W,1400);c.lineTo(W,H);c.lineTo(0,H);c.lineTo(0,1400);c.fill();
    // крышка над головой: щель света
    c.fillStyle='#07090a';c.fillRect(0,0,W,250);c.fillStyle='rgba(150,190,200,0.5)';c.fillRect(150,248,780,6);
    c.fillStyle='rgba(150,190,200,0.07)';c.beginPath();c.moveTo(150,254);c.lineTo(930,254);c.lineTo(760,1180);c.lineTo(320,1180);c.closePath();c.fill();
    // игрушки лежат
    c.fillStyle='#2a2018';ell(c,270,1150,74,40);c.fill();ell(c,190,1132,40,38);c.fill();ell(c,176,1100,14,14);c.fill();
    c.save();c.translate(820,1150);c.rotate(-0.3);c.fillStyle='#24333a';c.fillRect(-44,-44,88,88);c.restore();
    c.fillStyle='#3a1a16';ell(c,700,1185,40,40);c.fill();
    c.save();c.translate(380,1210);c.rotate(0.1);c.fillStyle='#262012';c.fillRect(-30,-30,60,60);c.restore();
    // кукла сидит ровно, спиной к нам
    dollBack(c,540,1170,1.15,{sit:true,rim:1,arm:0.12});
    c.restore();
    fog(c,T,950,1300,0.07);
    c.fillStyle='rgba(2,6,8,0.2)';c.fillRect(0,0,W,H);vignD(c,0.88);
  },
  face(c,t,lt){
    const st=1.2,z=1+0.28*ease((lt-st)/(K('blink')+3-st));c.save();zoomAt(c,540,640,z);
    grad(c,'#090f11','#0a1113','#070c0e');
    // крышка над ящиком и щель
    c.fillStyle='#060809';c.fillRect(0,0,W,200);c.fillStyle='rgba(150,190,200,0.45)';c.fillRect(0,198,W,5);
    const li=ease((lt-K('eyes')+0.4)/1.4);
    c.fillStyle=`rgba(150,190,200,${0.04+0.05*li})`;c.beginPath();c.moveTo(200,203);c.lineTo(880,203);c.lineTo(760,1050);c.lineTo(330,1050);c.closePath();c.fill();
    // плечи и лямки
    c.fillStyle='#0d1215';c.beginPath();c.moveTo(250,1080);c.quadraticCurveTo(270,870,420,830);c.lineTo(660,830);c.quadraticCurveTo(810,870,830,1080);c.fill();
    c.save();c.beginPath();c.moveTo(250,1080);c.quadraticCurveTo(270,870,420,830);c.lineTo(660,830);c.quadraticCurveTo(810,870,830,1080);c.clip();
    c.globalAlpha=0.35;stripes(c,240,820,600,260,true,['#3a2219','#141c26'],26);c.globalAlpha=1;
    c.fillStyle='#0f171d';c.fillRect(380,840,46,240);c.fillRect(654,840,46,240);c.restore();
    // лицо
    const B=K('blink');const lid=lt<B?0:Math.min(ease((lt-B)/0.9),1-ease((lt-B-1.3)/1.1));
    dollFace(c,540,620,1.45,{lid,eye:li,rim:0.6+0.4*li});
    // край ящика и ладошка
    c.fillStyle='#1c140f';c.fillRect(0,1050,W,60);c.fillStyle='rgba(255,214,150,0.05)';c.fillRect(0,1050,W,4);c.fillStyle='#120c09';c.fillRect(0,1110,W,200);
    const F=K('fingers'),fg=Math.max(0,Math.sin(Math.PI*clamp((lt-F)/1.4,0,1)))*(0.6+0.4*Math.sin((lt-F)*9));
    dollHand(c,760,1060,1.2,fg);
    c.restore();
    fog(c,t,950,1300,0.05);vignD(c,0.9);
  },
  screen(c,t,lt){
    const z=1.02+lt*0.006;c.save();zoomAt(c,540,800,z);
    grad(c,'#0b1214','#0c1315','#080d0f');
    glow(c,540,430,640,'255,200,120',0.16);glow(c,540,420,90,'255,226,170',0.45);
    c.fillStyle='#050809';c.fillRect(500,250,80,40);c.fillRect(536,0,8,260);
    // кукловоды за ширмой — силуэты, как оркестр
    const O=K('orch'),og=ease((lt-O+0.6)/1.2);
    const P=[[170,690,0.95],[310,660,1.05],[450,700,0.9],[630,670,1.0],[770,690,0.95],[905,700,1.0]];
    P.forEach(([px,py,ps],i)=>{c.save();c.translate(px,py);c.scale(ps,ps);c.fillStyle='#04070a';
      ell(c,0,-60,46,54);c.fill();c.beginPath();c.moveTo(-80,80);c.quadraticCurveTo(-78,-6,0,-6);c.quadraticCurveTo(78,-6,80,80);c.fill();
      const mv=og*(Math.sin(t*2.6+i*0.9)*0.5+0.5);const hx=(i%2?36:-36),hy=-120-mv*50-((i*37)%30);
      c.strokeStyle='#04070a';c.lineWidth=20;c.lineCap='round';c.beginPath();c.moveTo(hx*0.9,10);c.quadraticCurveTo(hx*1.6,-40,hx,hy);c.stroke();
      c.fillRect(hx-22,hy-26,44,30);c.strokeStyle='rgba(255,214,150,0.25)';c.lineWidth=2;c.strokeRect(hx-22,hy-26,44,30);
      c.restore();
      P[i].ctl=[px+(i%2?36:-36)*ps,py+(-120-og*(Math.sin(t*2.6+i*0.9)*0.5+0.5)*50-((i*37)%30))*ps-26*ps];});
    // ширма
    for(let i=0;i<5;i++){const x0=i*216;const g=c.createLinearGradient(x0,0,x0+216,0);g.addColorStop(0,'#0b0f11');g.addColorStop(1,'#060809');c.fillStyle=g;c.fillRect(x0,760,216,440);
      c.fillStyle='rgba(255,214,150,0.07)';c.fillRect(x0,760,216,3);c.fillStyle='#030506';c.fillRect(x0+212,760,4,440);}
    // кабели от кулис к кукле
    for(const p of P){c.strokeStyle='rgba(170,190,190,0.28)';c.lineWidth=2.5;c.beginPath();c.moveTo(p.ctl[0],p.ctl[1]);c.bezierCurveTo(p.ctl[0],p.ctl[1]-60,540+(p.ctl[0]-540)*0.3,640,540,880);c.stroke();}
    // пол перед ширмой и кукла на табурете, спиной к нам
    c.fillStyle='#0a0e10';c.fillRect(0,1200,W,H-1200);
    c.fillStyle='#120d0a';c.fillRect(470,1170,140,30);c.fillRect(480,1200,14,140);c.fillRect(586,1200,14,140);
    dollBack(c,540,1170,0.72,{sit:true,rim:0.7,arm:0.1+0.06*og*Math.sin(t*2.6),dark:0.25});
    c.restore();
    fog(c,t,1050,1350,0.07);vignD(c,0.8);
  },
  sensors(c,t,lt){
    const z=1+lt*0.008;c.save();zoomAt(c,540,700,z);
    grad(c,'#091417','#0b171a','#070d10');
    glow(c,540,700,520,'90,150,160',0.1);
    const L=K('lips'),mv=ease((lt-L+0.3)/0.6),m=mv*(0.5+0.5*Math.sin(t*8.5)*Math.sin(t*3.1+1));
    const sa=ease((lt-K('sens'))/1.2);
    // человек в профиль (слева, смотрит вправо)
    c.save();c.translate(300,720);c.fillStyle='#04080a';
    c.beginPath();c.moveTo(-200,-200);c.quadraticCurveTo(-200,-330,-40,-330);c.quadraticCurveTo(90,-325,110,-200);c.lineTo(118,-120);c.lineTo(160,-60);c.lineTo(116,-44);
    c.lineTo(122,-18);c.lineTo(112,-6);c.lineTo(118,8+m*10);c.lineTo(108,24+m*22);c.quadraticCurveTo(100,80+m*22,40,92+m*18);c.quadraticCurveTo(-20,96,-40,150);c.lineTo(-60,400);c.lineTo(-260,400);c.lineTo(-210,120);c.quadraticCurveTo(-230,-60,-200,-200);c.fill();
    c.strokeStyle='rgba(130,175,180,0.28)';c.lineWidth=4;c.beginPath();c.moveTo(-40,-330);c.quadraticCurveTo(90,-325,110,-200);c.lineTo(118,-120);c.lineTo(160,-60);c.stroke();
    // датчики
    const D=[[96,-22],[104,4],[98,30+m*20],[70,52+m*18],[40,70+m*16],[60,-30],[28,-8],[8,40+m*10]];
    for(const [dx,dy] of D){glow(c,dx,dy,26,'120,230,210',0.5*sa);c.fillStyle=`rgba(200,255,240,${0.9*sa})`;ell(c,dx,dy,5,5);c.fill();}
    c.strokeStyle=`rgba(150,190,190,${0.3*sa})`;c.lineWidth=3;c.beginPath();c.moveTo(-10,20);c.quadraticCurveTo(-100,80,-120,400);c.stroke();
    c.restore();
    // сигнал: точки бегут от человека к кукле
    if(mv>0){for(let i=0;i<10;i++){const q=((t*0.6+i/10)%1),x=lerp(440,660,q),y=730+Math.sin(q*Math.PI*2+t)*14;c.fillStyle=`rgba(150,230,215,${0.35*mv*Math.sin(q*Math.PI)})`;ell(c,x,y,4,4);c.fill();}}
    // кукла в профиль (справа, смотрит влево)
    c.save();c.translate(800,760);const md=m*0.9;
    c.fillStyle='#05090b';ell(c,30,-90,150,158);c.fill();
    c.beginPath();c.moveTo(-112,-60);c.quadraticCurveTo(-140,-40,-128,-16);c.lineTo(-114,-10);c.lineTo(-118,8+md*14);c.quadraticCurveTo(-90,60+md*16,-30,64);c.lineTo(60,60);c.lineTo(80,260);c.lineTo(260,260);c.lineTo(200,-40);c.fill();
    c.fillStyle=HAIR;c.beginPath();c.moveTo(-80,-200);c.quadraticCurveTo(30,-280,150,-190);c.quadraticCurveTo(200,-120,170,-20);c.quadraticCurveTo(120,-120,40,-150);c.quadraticCurveTo(-20,-160,-80,-200);c.fill();
    hairTufts(c,30,-90,150,Math.PI*1.25,Math.PI*2.1,9,26,HAIR);
    c.strokeStyle='rgba(130,175,180,0.3)';c.lineWidth=4;c.beginPath();c.arc(30,-90,150,Math.PI*0.95,Math.PI*1.3);c.stroke();
    c.fillStyle='rgba(150,165,160,0.5)';ell(c,-78,-80,12,15);c.fill();c.fillStyle='rgba(240,250,245,0.8)';ell(c,-82,-86,3,3);c.fill();
    c.restore();
    c.restore();
    fog(c,t,950,1300,0.07);vignD(c,0.85);
  },
  wall(c,t,lt){
    const z=1.04+lt*0.006;c.save();zoomAt(c,540,800,z);
    grad(c,'#0c171a','#0b1518','#080e10');
    c.fillStyle='rgba(150,180,185,0.035)';for(let y=80;y<1150;y+=70)for(let x=(y/70%2)*35;x<W;x+=70){c.save();c.translate(x,y);c.rotate(Math.PI/4);c.fillRect(-7,-7,14,14);c.restore();}
    // низкий ночник слева у пола: свет снизу, тень вырастает на стене
    glow(c,250,1150,700,'255,200,110',0.12);glow(c,250,1140,50,'255,226,170',0.6);c.fillStyle='#1a1410';c.fillRect(230,1150,40,22);
    c.fillStyle='#091114';c.fillRect(0,1150,W,H-1150);c.fillStyle='rgba(150,180,185,0.06)';c.fillRect(0,1148,W,5);
    const sm=ease((lt-K('seam'))/1.6),tl=ease((lt-K('tall'))/2.2);
    // тень куклы на стене -> тень взрослого
    c.save();c.globalAlpha=0.55*(1-tl);c.translate(700,1150);c.scale(1.35,1.55);c.transform(1,0,-0.25,1,0,0);
    c.fillStyle='#03080a';c.beginPath();ell(c,0,-500,95,100);c.fill();c.beginPath();c.roundRect(-100,-400,200,250,40);c.fill();c.fillRect(-70,-160,140,160);c.restore();
    if(tl>0){c.save();c.globalAlpha=0.55*tl;c.translate(700,1150);c.scale(1.35,1.55);c.transform(1,0,-0.25,1,0,0);c.fillStyle='#03080a';
      ell(c,0,-640,48,58);c.fill();c.beginPath();c.moveTo(-90,-560);c.quadraticCurveTo(0,-600,90,-560);c.lineTo(110,-300);c.lineTo(70,-280);c.lineTo(60,0);c.lineTo(-60,0);c.lineTo(-70,-280);c.lineTo(-110,-300);c.closePath();c.fill();c.restore();}
    dollBack(c,520,990,0.95,{rim:0.8,seam:sm,arm:0.06});
    c.restore();
    fog(c,t,1050,1300,0.07);vignD(c,0.85);
  },
  giant(c,t,lt){
    const S=K('scale'),zz=lerp(1.9,1.0,ease((lt-S+0.4)/3.6));c.save();zoomAt(c,640,1000,zz);
    grad(c,'#0b1518','#0c1619','#080e10');
    c.fillStyle='rgba(150,180,185,0.03)';for(let y=60;y<1150;y+=170)for(let x=(y/170%2)*85;x<W;x+=170){c.save();c.translate(x,y);c.rotate(Math.PI/4);c.fillRect(-18,-18,36,36);c.restore();}
    glow(c,700,700,700,'255,200,110',0.07);
    // пол: огромные доски
    c.fillStyle='#0a1013';c.fillRect(0,1150,W,H-1150);c.fillStyle='rgba(150,180,185,0.07)';c.fillRect(0,1148,W,6);
    c.strokeStyle='rgba(0,0,0,0.45)';c.lineWidth=6;for(let i=-3;i<=3;i++){c.beginPath();c.moveTo(540+i*260,1154);c.lineTo(540+i*900,H);c.stroke();}
    // огромный стул слева
    const wd='#1e150f',wd2='#140e0a';
    c.fillStyle=wd2;c.fillRect(60,-200,80,690);c.fillRect(470,-200,80,690);for(const yy of [-60,110,280])c.fillRect(60,yy,490,44);
    c.fillStyle=wd;c.fillRect(20,470,560,64);c.fillStyle='rgba(255,214,150,0.07)';c.fillRect(20,470,560,5);
    c.fillStyle=wd2;c.fillRect(60,534,80,616);c.fillRect(470,534,80,616);c.fillRect(140,860,330,40);
    // фигура-кукла у ножки стула (на самом деле взрослый в костюме)
    dollBack(c,640,1006,0.42,{rim:0.9,arm:0.05});
    // тень на полу/стене
    const ad=ease((lt-K('adult'))/1.8);
    c.save();c.globalAlpha=0.4;c.translate(640,1150);c.scale(1,0.18);c.fillStyle='#000';ell(c,0,0,110,60);c.fill();c.restore();
    if(ad>0){c.save();c.globalAlpha=0.4*ad;c.translate(760,1150);c.transform(1,0,-0.3,1,0,0);c.fillStyle='#03080a';
      ell(c,0,-560,40,48);c.fill();c.beginPath();c.moveTo(-80,-490);c.quadraticCurveTo(0,-520,80,-490);c.lineTo(96,-260);c.lineTo(60,-240);c.lineTo(52,0);c.lineTo(-52,0);c.lineTo(-60,-240);c.lineTo(-96,-260);c.closePath();c.fill();c.restore();}
    c.restore();
    fog(c,t,1050,1300,0.07);vignD(c,0.85);
  },
  room2(c,t,lt){
    const z=1.12-0.1*ease(lt/6),gp=lerp(12,16,ease((lt-K('maybe'))/3));
    kidroom(c,t,{z,cx:540,cy:900,gap:gp,toys:true,night:1});
    fog(c,t,1000,1300,0.07);vignD(c,0.8);
  },
  goodnight(c,t,lt){
    sky(c,t,0);c.fillStyle='rgba(2,14,18,0.55)';c.fillRect(0,0,W,H);
    const dim=ease((lt-K('dim'))/2);
    c.save();const z=1.12-lt*0.006;zoomAt(c,W/2,H/2,z);
    const SL=K('sleep');const sl=ease((lt-SL)/2.5);
    moon(c,540,700,t);owl(c,540,760,1.15,t,clamp(blink(t,0)+sl,0,1),true,{talk:talk(t),sleepy:sl});
    c.restore();
    if(sl>0){c.save();c.font='700 64px C';c.fillStyle='#b8c4cc';for(let i=0;i<3;i++){const p=((t*0.35+i/3)%1);c.globalAlpha=sl*Math.sin(p*Math.PI)*0.6;c.fillText('z',640+p*120+Math.sin(p*9)*15,560-p*260);}c.restore();}
    // окно детской гаснет само, когда крышка закрывается
    const cl=ease((lt-K('close'))/1.4);
    houses(c,1070,t,'#050a0d',(0.85-0.35*dim)*(1-0.85*cl));
    fog(c,t,1020,1260,0.16);
    c.fillStyle=`rgba(0,6,10,${0.18*dim})`;c.fillRect(0,0,W,H);vignD(c,0.75);
  }
};
