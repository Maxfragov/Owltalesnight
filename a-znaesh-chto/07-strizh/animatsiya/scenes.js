// ---------- из 03-yozhik (не в core.js) ----------
function ridge(c,y0,amp,fr,ph,col){c.fillStyle=col;c.beginPath();c.moveTo(0,H);c.lineTo(0,y0);
  for(let x=0;x<=W;x+=12)c.lineTo(x,y0-amp*(0.6*Math.sin(x*fr+ph)+0.4*Math.sin(x*fr*2.3+ph*1.7)));c.lineTo(W,H);c.closePath();c.fill();}
function sunDisk(c,x,y,r,a){const g=c.createRadialGradient(x,y,r*0.2,x,y,r*3.5);g.addColorStop(0,`rgba(255,200,110,${0.55*a})`);g.addColorStop(1,'rgba(255,200,110,0)');c.fillStyle=g;c.fillRect(x-r*3.5,y-r*3.5,r*7,r*7);
  c.fillStyle=`rgba(255,214,140,${a})`;ell(c,x,y,r,r);c.fill();}
function mixCol(a,b,k){const h=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16));const A=h(a),B=h(b);return `rgb(${A.map((v,i)=>Math.round(lerp(v,B[i],k))).join(',')})`;}
function snowfall(c,t,a,dens=1){if(a<=0)return;c.fillStyle=`rgba(235,240,255,${0.7*a})`;for(let j=0;j<dens;j++)for(const d of DUST){const x=(d.x+j*331)%W+Math.sin(t*0.5+d.p+j)*30,y=(d.y+j*577+t*d.v*(3+j))%H;ell(c,x,y,d.r,d.r);c.fill();}}
// ---------- helpers ----------
// Выпуск 7: «Птица, которая 10 месяцев не касается земли» — стриж. Короткий формат с хуком (~30 с).
window.END_SUB='факты, в которые трудно поверить';
CFG.fadeIn=0;
const K=n=>CFG.k&&CFG.k[n]!=null?CFG.k[n]:{hook1:1.99,vobshe:5.23,drink:2.1,zz:0.8,apus:2.1,years:0.8,touch:3.86,q:0.8}[n];
// ---------- helpers ----------
function sparkleS(c,x,y,L,a){if(a<=0)return;const k=L*0.18;c.save();c.globalAlpha=clamp(a,0,1);c.fillStyle='#fff6dc';c.beginPath();c.moveTo(x,y-L);c.quadraticCurveTo(x+k,y-k,x+L,y);c.quadraticCurveTo(x+k,y+k,x,y+L);c.quadraticCurveTo(x-k,y+k,x-L,y);c.quadraticCurveTo(x-k,y-k,x,y-L);c.fill();c.restore();}
function gtext(c,txt,x,y,size,col,a=1,blur=30,glow='rgba(255,200,110,0.85)'){if(a<=0)return;c.save();c.globalAlpha=clamp(a,0,1);c.textAlign='center';c.textBaseline='middle';c.font=`700 ${size}px C`;
  c.shadowColor='rgba(0,0,20,0.8)';c.shadowBlur=18;c.fillStyle=col;c.fillText(txt,x,y);c.shadowColor=glow;c.shadowBlur=blur;c.fillText(txt,x,y);c.restore();}
function dusk(c,k=0){ // k 0 закат .. 1 ночь
  skyG(c,mixCol('#2a2f78','#070b24',k),mixCol('#9a5d9a','#1b2156',k),mixCol('#ffb36b','#3a3f80',k));}
const CLOUDS=[];for(let i=0;i<14;i++)CLOUDS.push({x:rnd()*W,y:rnd(),s:0.6+rnd()*0.9,v:8+rnd()*20});
function cloud(c,x,y,s,col,a=1){c.save();c.globalAlpha=a;c.fillStyle=col;
  c.beginPath();for(const [dx,dy,r] of [[-120,10,60],[-60,-20,80],[20,-40,95],[100,-10,70],[160,15,50],[0,20,90],[-170,25,40]]){c.moveTo(x+dx*s+r*s,y+dy*s);c.ellipse(x+dx*s,y+dy*s,r*s,r*s*0.85,0,0,Math.PI*2);}c.fill();
  c.restore();}
function cloudsLayer(c,t,y0,y1,col,a,speed=1){for(const q of CLOUDS){const x=((q.x+t*q.v*speed)%(W+500))-250;cloud(c,x,lerp(y0,y1,q.y),q.s,col,a);}}
function midges(c,t,cx,cy,n,a){c.save();c.globalAlpha=a;c.fillStyle='#2a1d28';for(let i=0;i<n;i++){const p=i*2.39;const x=cx+Math.sin(t*3+p)*70*Math.cos(p)+Math.sin(t*7+p*3)*8,y=cy+Math.cos(t*2.6+p)*55*Math.sin(p*1.3)+Math.cos(t*9+p)*6;ell(c,x,y,4,4);c.fill();
  c.globalAlpha=a*0.5;c.fillStyle='#fff';ell(c,x-3,y-4,3,2);ell(c,x+3,y-4,3,2);c.fill();c.globalAlpha=a;c.fillStyle='#2a1d28';}c.restore();}
// ---------- стриж (вид сверху, клюв вправо; головой повёрнут к зрителю) ----------
// o: flap 0..1 (0 — парит), fs частота взмаха, eye 1 открыт / 0 спит, mouth 0..1, legs (показать лапки)
function swift(c,x,y,s,ang,t,o={}){
  const fl=o.flap==null?1:o.flap,ph=t*(o.fs||11);
  const span=1-fl*0.42*(0.5+0.5*Math.cos(ph)),sweep=fl*0.12*Math.sin(ph);
  c.save();c.translate(x,y);c.rotate(ang);c.scale(s*(o.flip?-1:1),s);
  // хвост-вилочка
  c.fillStyle='#2b2531';c.beginPath();c.moveTo(-48,-13);c.lineTo(-132,-30);c.lineTo(-96,0);c.lineTo(-132,30);c.lineTo(-48,13);c.closePath();c.fill();
  // крылья-серпы
  for(const sg of [1,-1]){c.save();c.translate(8,0);c.rotate(sg*sweep);c.scale(1,sg*span);
    const g=c.createLinearGradient(0,0,-200,-170);g.addColorStop(0,'#3d3546');g.addColorStop(1,'#231e2a');c.fillStyle=g;
    c.beginPath();c.moveTo(16,-6);c.bezierCurveTo(0,-110,-90,-170,-215,-188);c.bezierCurveTo(-130,-130,-70,-70,-44,-6);c.closePath();c.fill();
    c.strokeStyle='rgba(150,140,175,0.35)';c.lineWidth=4;c.beginPath();c.moveTo(14,-14);c.bezierCurveTo(-2,-110,-90,-168,-208,-184);c.stroke();
    c.restore();}
  // тело
  const bg=c.createRadialGradient(10,-8,6,0,0,80);bg.addColorStop(0,'#5a5064');bg.addColorStop(1,'#353040');c.fillStyle=bg;ell(c,-4,0,70,30);c.fill();
  if(o.legs){c.strokeStyle='#d9a066';c.lineWidth=3.2;c.lineCap='round';for(const lx of [-2,14]){for(const d of [-0.5,-0.15,0.2,0.55]){c.beginPath();c.moveTo(lx,26);c.quadraticCurveTo(lx+Math.sin(d)*9,34,lx+Math.sin(d)*12,30);c.stroke();}}}
  // голова (смотрит в камеру)
  c.save();c.translate(60,0);c.scale(o.flip?-1:1,1);
  const hg=c.createRadialGradient(-6,-10,4,0,0,44);hg.addColorStop(0,'#62586c');hg.addColorStop(1,'#3a3444');c.fillStyle=hg;ell(c,0,0,40,37);c.fill();
  c.fillStyle='#e8e0d4';ell(c,6,22,18,12);c.fill(); // светлое горлышко
  const eo=o.eye==null?1:o.eye;
  for(const ex of [-13,15]){
    if(eo>0.5){c.fillStyle='#fffaf0';ell(c,ex,-8,12,13);c.fill();const lx=Math.sin(t*0.7+ex)*2;c.fillStyle='#16101a';ell(c,ex+1+lx,-6,8,9);c.fill();c.fillStyle='#fff';ell(c,ex+4+lx,-10,3,3);c.fill();}
    else{c.strokeStyle='#16101a';c.lineWidth=3.5;c.lineCap='round';c.beginPath();c.arc(ex,-9,8,0.15*Math.PI,0.85*Math.PI);c.stroke();}}
  const mo=o.mouth||0;
  if(mo>0.05){c.fillStyle='#8a2f3a';ell(c,1,10+mo*4,10+mo*6,3+mo*9);c.fill();}
  c.fillStyle='#2a2228';c.beginPath();c.moveTo(-6,4);c.lineTo(8,4);c.lineTo(1,12-mo*2);c.closePath();c.fill();
  c.fillStyle='rgba(240,140,150,0.45)';ell(c,-26,10,8,5);c.fill();ell(c,29,10,8,5);c.fill();
  c.restore();
  c.restore();}
function flock(c,t,n,cx,cy,rx,ry,s,a=1,sp=0.6){c.save();c.globalAlpha=a;for(let i=0;i<n;i++){const p=t*sp+i*6.283/n,x=cx+Math.cos(p)*rx,y=cy+Math.sin(p)*ry;
  const an=Math.atan2(Math.cos(p)*ry,-Math.sin(p)*rx);swift(c,x,y,s,an,t+i,{});}c.restore();}
// совёнок на луне в углу: с кадра 0 (ядро включает своего мини-совёнка со 2-й сцены, здесь подменяем его до этого)
function owlCorner(c,t){const a0=CFG.scenes[1][1];const k=ease((t-a0-0.5)/0.8);miniOwl(c,t,1-k);}
// ---------- сцены ----------
const SC={
  hook(c,t,lt){
    dusk(c,0);starsOnly(c,t,0.35);
    cloudsLayer(c,t*2,150,1100,'rgba(255,214,190,0.55)',0.5,1);
    const H1=K('hook1'),VB=K('vobshe');
    // фоновые стрижи
    flock(c,t,5,540,880,430,160,0.32,0.8,0.9);
    // главный стриж: пролёт на камеру в начале, потом крупно в центре
    const p=ease(lt/1.1);
    const x=lerp(-60,540,p)+Math.sin(lt*1.3)*30,y=lerp(1250,900,p)+Math.sin(lt*2.1)*24,sc=lerp(2.6,1.35,ease(lt/0.9));
    swift(c,x,y,sc,lerp(-0.45,-0.08,p)+Math.sin(lt*1.1)*0.06,t,{flap:lt<1.2?1:0.55+0.45*Math.max(0,Math.sin(lt*1.4)),mouth:0});
    // титр-хук с кадра 0
    const pop=1+0.25*Math.exp(-lt*6);
    c.save();c.translate(540,470);c.scale(pop,pop);gtext(c,'10 месяцев',0,0,128,'#ffe9b0',1,40);c.restore();
    gtext(c,'не касается земли',540,575,64,'#fff7e6',1,20);
    // счётчик месяцев: загораются по одному
    for(let i=0;i<10;i++){const on=ease((lt-0.2-i*Math.max(0.12,(H1+1.8)/10))/0.15);const xx=540+(i-4.5)*74,yy=670;
      c.save();c.globalAlpha=0.35+0.65*on;c.fillStyle=on>0.5?'#ffd27a':'rgba(255,255,255,0.25)';ell(c,xx,yy,20+on*6,20+on*6);c.fill();
      c.fillStyle='#2a2f78';c.font='700 24px C';c.textAlign='center';c.textBaseline='middle';c.fillText(String(i+1),xx,yy+1);c.restore();}
    // «ВООБЩЕ» — штамп
    const st=ease((lt-VB)/0.25);if(st>0){c.save();c.translate(540,770);c.rotate(-0.08);const z=1+1.2*(1-st);c.scale(z,z);c.globalAlpha=st;
      c.strokeStyle='#ff8a6a';c.lineWidth=8;c.beginPath();c.roundRect(-210,-52,420,104,18);c.stroke();gtext(c,'ВООБЩЕ',0,4,74,'#ff9c7c',1,16,'rgba(255,120,90,0.8)');c.restore();}
    // земля внизу, недосягаемая
    c.save();c.globalAlpha=0.9;ridge(c,1230,30,0.004,1.1,'#2b2347');ridge(c,1300,24,0.006,0.3,'#1c1733');c.restore();
    owlCorner(c,t);vign(c);
  },
  name(c,t,lt){
    dusk(c,0.1);starsOnly(c,t,0.3);
    cloudsLayer(c,t*6,120,1150,'rgba(255,214,190,0.5)',0.45,2.5);
    // линии скорости
    c.save();c.strokeStyle='rgba(255,240,220,0.35)';c.lineWidth=4;c.lineCap='round';for(let i=0;i<14;i++){const yy=(i*137)%1100+120,xx=W-((t*900+i*311)%(W+400));c.beginPath();c.moveTo(xx,yy);c.lineTo(xx+180,yy);c.stroke();}c.restore();
    const z=1+lt*0.03;
    swift(c,520,820+Math.sin(lt*2)*20,2.5*z,-0.05+Math.sin(lt*1.6)*0.05,t,{flap:0.8});
    const a=ease((lt-0.6)/0.4);
    c.save();c.globalAlpha=a;c.translate(540,1135);c.fillStyle='rgba(255,233,176,0.95)';c.beginPath();c.roundRect(-150,-46,300,92,46);c.fill();
    c.fillStyle='#2a2f78';c.font='700 60px C';c.textAlign='center';c.textBaseline='middle';c.fillText('стриж',0,4);c.restore();
    vign(c);
  },
  eat(c,t,lt){
    dusk(c,0.2);starsOnly(c,t,0.3);cloudsLayer(c,t,120,560,'rgba(255,214,190,0.45)',0.4);
    // река
    ridge(c,1000,26,0.005,2.0,'#3b2f5c');
    const rg=c.createLinearGradient(0,1040,0,1250);rg.addColorStop(0,'#c98a7a');rg.addColorStop(1,'#3a3466');c.fillStyle=rg;c.fillRect(0,1040,W,220);
    c.strokeStyle='rgba(255,230,200,0.35)';c.lineWidth=3;for(let i=0;i<10;i++){const yy=1060+i*18,xx=((i*173+t*40)%(W+200))-100;c.beginPath();c.moveTo(xx,yy);c.lineTo(xx+90+i*6,yy);c.stroke();}
    ridge(c,1270,20,0.006,0.6,'#211b3a');
    const DK=K('drink');
    const MX=640,MY=600,left=Math.max(0,Math.round(26-lt*6));
    midges(c,t,MX,MY,left,1);
    const p=(lt-DK+0.9)/1.8;let x,y,an,mo=0;
    if(p<0){const q=lt*2.4;x=MX+Math.cos(q)*230;y=MY+Math.sin(q)*120;an=Math.atan2(Math.cos(q)*120,-Math.sin(q)*230);mo=0.6+0.4*Math.sin(t*8);}
    else{const u=Math.min(p,1.3);const x0=MX+Math.cos((DK-0.9)*2.4)*230;x=lerp(x0-200,1250,u/1.3);y=600+452*Math.sin(Math.min(u,1)*Math.PI);
      const dy=452*Math.PI*Math.cos(Math.min(u,1)*Math.PI),dx=(1450-x0)/1.3;an=Math.atan2(dy,dx)*0.8;mo=Math.abs(u-0.5)<0.12?0.9:0.1;}
    swift(c,x,y,1.25,an,t,{flap:0.8,mouth:mo});
    // брызги и круги на воде
    const sp=lt-DK;if(sp>0&&sp<2.5){const sx=lerp(MX+Math.cos((DK-0.9)*2.4)*230-200,1250,0.5/1.3);
      c.save();c.strokeStyle=`rgba(255,240,220,${0.7*(1-sp/2.5)})`;c.lineWidth=4;for(const d of [0,0.35,0.7]){const r=Math.max(0,sp-d)*120;if(r>0){ell(c,sx,1068,r,r*0.22);c.stroke();}}
      c.fillStyle=`rgba(255,250,240,${0.9*(1-sp/0.8)})`;for(let i=0;i<7;i++){const a=-Math.PI*(0.15+0.7*i/6),r=sp*220;if(sp<0.8){ell(c,sx+Math.cos(a)*r,1068+Math.sin(a)*r*0.9+sp*sp*300,6,6);c.fill();}}c.restore();}
    vign(c);
  },
  sleep(c,t,lt){
    const n=ease(lt/2.5);dusk(c,0.55+0.45*n);starsOnly(c,t,0.4+0.6*n);
    // облака уходят вниз — стриж поднимается
    const rise=lt*90;
    for(const q of CLOUDS){const x=((q.x+t*q.v*0.4)%(W+500))-250;cloud(c,x,960+q.y*500+rise,q.s*1.3,'rgba(214,206,240,0.9)',0.85);}
    c.save();c.globalAlpha=0.9;c.fillStyle='rgba(214,206,240,0.95)';c.fillRect(0,1180+rise,W,H);c.restore();
    const ZZ=K('zz'),zz=ease((lt-ZZ)/0.6);
    swift(c,540,720+Math.sin(lt*0.9)*18,1.7,Math.sin(lt*0.7)*0.06,t,{flap:(1-zz)*0.6,eye:1-zz});
    if(zz>0){c.save();c.font='700 64px C';c.fillStyle='#cfd6ff';for(let i=0;i<3;i++){const p=((t*0.45+i/3)%1);c.globalAlpha=zz*Math.sin(p*Math.PI)*0.85;c.fillText('z',660+p*130+Math.sin(p*9)*15,620-p*260);}c.restore();}
    vign(c);
  },
  legs(c,t,lt){
    skyG(c,'#0b1030','#1d2560','#3a3f80');starsOnly(c,t,0.7);
    const AP=K('apus');
    const bx=540,by=760+Math.sin(lt*1.5)*12;
    swift(c,bx,by,1.9,-Math.PI/2+0.02*Math.sin(lt),t,{flap:0.5,legs:true});
    // лупа на крошечные лапки
    const m=ease((lt-0.4)/0.6);if(m>0){const lx=bx+52,ly=by+30;const MX=800,MY=1010,R=150;
      c.save();c.globalAlpha=m;c.strokeStyle='#ffe9b0';c.lineWidth=5;c.beginPath();c.moveTo(lx,ly);c.lineTo(MX-R*0.7,MY-R*0.7);c.stroke();
      c.fillStyle='rgba(20,26,70,0.9)';ell(c,MX,MY,R,R);c.fill();
      c.save();ell(c,MX,MY,R,R);c.clip();c.translate(MX,MY+10);c.scale(5,5);c.strokeStyle='#d9a066';c.lineWidth=1.6;c.lineCap='round';
      c.fillStyle='#353040';ell(c,0,-30,26,14);c.fill();
      for(const d of [-0.6,-0.2,0.2,0.6]){c.beginPath();c.moveTo(0,-18);c.quadraticCurveTo(Math.sin(d)*14,-6,Math.sin(d)*18,-10);c.stroke();}c.restore();
      c.lineWidth=12;c.strokeStyle='#ffe9b0';ell(c,MX,MY,R,R);c.stroke();c.lineCap='round';c.beginPath();c.moveTo(MX+R*0.72,MY+R*0.72);c.lineTo(MX+R*1.15,MY+R*1.15);c.stroke();c.restore();}
    const a=ease((lt-AP+0.3)/0.4);
    c.save();c.translate(330,470);const z=1+0.4*(1-a);c.scale(z,z);gtext(c,'Apus',0,0,104,'#ffe9b0',a,36);c.restore();
    gtext(c,'«без ног»',330,565,52,'#cfd6ff',a,14,'rgba(150,170,255,0.6)');
    vign(c);
  },
  years(c,t,lt){
    // времена года мелькают: лето → осень → зима → весна ×2
    const YR=K('years'),dur=3.6,pr=clamp((lt-YR+0.3)/dur,0,1);
    const ph=(pr*8)%4,sea=Math.floor(ph),f=ph-sea;
    const top=['#3b6fd1','#7a4c8f','#1c2858','#4a7fd6'],mid=['#86b6f0','#d9846a','#5b6aa8','#9ad0f0'],bot=['#ffe0a0','#f2a86a','#c9d3f0','#ffd6e6'];
    const nx=(sea+1)%4,k=ease(f);skyG(c,mixCol(top[sea],top[nx],k),mixCol(mid[sea],mid[nx],k),mixCol(bot[sea],bot[nx],k));
    cloudsLayer(c,t*3,120,700,'rgba(255,255,255,0.6)',0.5);
    // земля внизу
    const gr=['#5a9a4a','#b8743a','#e8eef8','#7cc06a'];ridge(c,1180,40,0.004,0.8,mixCol(gr[sea],gr[nx],k));ridge(c,1250,24,0.007,2.1,mixCol('#3a6a34','#2b2347',sea==2?1:0.3));
    if(sea==2||(sea==1&&f>0.6))snowfall(c,t,0.7);
    if(sea==1)for(const d of DUST.slice(0,20)){const x=(d.x+t*60)%W,y=(d.y+t*d.v*12)%1200;c.fillStyle='#e0873a';ell(c,x,y,9,5,t+d.p);c.fill();}
    // стриж кружит, не касаясь земли
    const q=t*1.8;swift(c,540+Math.cos(q)*300,860+Math.sin(q*1.3)*130,1.1,Math.atan2(Math.cos(q*1.3)*130*1.3,-Math.sin(q)*300),t,{});
    // счётчик дней 0 → 730
    const d=Math.round(730*ease(pr));
    gtext(c,String(d),540,420,150,'#ffe9b0',ease((lt-YR+0.6)/0.3),40);
    gtext(c,'дней без посадки',540,535,58,'#fff7e6',ease((lt-YR+0.4)/0.3),18);
    vign(c);
  },
  nest(c,t,lt){
    dusk(c,0.35);starsOnly(c,t,0.4);
    // стена дома и край крыши
    c.fillStyle='#4a3a52';c.fillRect(0,640,560,700);
    c.strokeStyle='rgba(0,0,0,0.25)';c.lineWidth=3;for(let r=0;r<14;r++){const yy=660+r*48;c.beginPath();c.moveTo(0,yy);c.lineTo(560,yy);c.stroke();for(let b=0;b<6;b++){const xx=(b*110+(r%2)*55);c.beginPath();c.moveTo(xx,yy);c.lineTo(xx,yy+48);c.stroke();}}
    c.fillStyle='#7a3f3a';c.beginPath();c.moveTo(-40,660);c.lineTo(620,660);c.lineTo(560,560);c.lineTo(-40,500);c.closePath();c.fill();
    c.fillStyle='#5a2c2a';c.fillRect(-40,650,660,22);
    // окно с тёплым светом
    c.fillStyle='#ffd27a';c.fillRect(120,820,170,200);c.fillStyle='#4a3a52';c.fillRect(200,820,10,200);c.fillRect(120,915,170,10);
    // гнездо под крышей
    const NX=470,NY=715;
    c.fillStyle='#8a6a48';c.beginPath();c.moveTo(NX-70,NY-25);c.quadraticCurveTo(NX,NY+70,NX+70,NY-25);c.closePath();c.fill();
    c.strokeStyle='#b08a5e';c.lineWidth=4;for(let i=0;i<6;i++){c.beginPath();c.moveTo(NX-60+i*8,NY-20+i*6);c.quadraticCurveTo(NX,NY+25+i*4,NX+60-i*8,NY-20+i*6);c.stroke();}
    const TC=K('touch'),p=ease((lt-0.2)/(TC-0.2));
    const x=lerp(1250,NX+30,p),y=lerp(500,NY-10,p)+Math.sin(p*Math.PI)*-120;
    const an=lerp(-0.2,-Math.PI/2+0.25,ease((p-0.75)/0.25));
    swift(c,x,y,lerp(1.4,0.9,p),an+Math.PI*0,t,{flap:1-ease((lt-TC)/0.3)*0.9,flip:true});
    const g=ease((lt-TC)/0.3)*(1-ease((lt-TC-1.6)/1));if(g>0){glowHeart(c,NX,NY,g,t);sparkleS(c,NX-90,NY-60,26*g,g);sparkleS(c,NX+80,NY-90,20*g,g*0.8);}
    vign(c);
  },
  final(c,t,lt){
    sky(c,t,0);
    const z=1.06-lt*0.004;c.save();c.translate(W/2,H/2);c.scale(z,z);c.translate(-W/2,-H/2);
    const ent=ease(lt/1.0);moon(c,540,700,t);owl(c,540,760+(1-ent)*400,1.15*(0.7+0.3*ent),t,blink(t,0),false,{talk:talk(t)});c.restore();
    flock(c,t,4,540,700,380,300,0.42,0.95,0.8);
    const Q=K('q'),b=ease((lt-Q)/0.4);
    if(b>0){c.save();c.globalAlpha=b;c.translate(820,470);c.scale(0.6+0.4*b,0.6+0.4*b);c.fillStyle='rgba(255,247,230,0.95)';c.beginPath();c.roundRect(-90,-70,180,130,40);c.fill();
      c.beginPath();c.moveTo(-40,55);c.lineTo(-70,100);c.lineTo(0,58);c.fill();c.fillStyle='#2a2f78';c.font='700 90px C';c.textAlign='center';c.textBaseline='middle';c.fillText('?',0,0);c.restore();}
    fireflies(c,t);vign(c);
  }
};
