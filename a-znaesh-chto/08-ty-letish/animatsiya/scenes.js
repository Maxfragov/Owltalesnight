// Выпуск 8: «Ты сейчас летишь» — счётчик километров с кадра 0, ответ в финале. Короткий формат (~30 с).
window.END_SUB='факты, в которые трудно поверить';
CFG.fadeIn=0;
const K=n=>CFG.k&&CFG.k[n]!=null?CFG.k[n]:{bullet:1.99,loop:6.11,fast:2.83,stop:0.8,vlad:4.97,send:0.8}[n];
const KA=n=>CFG.ka&&CFG.ka[n]!=null?CFG.ka[n]:{stop:20.84,vlad:25.01}[n];
const FINAL=6900;
// счётчик: бежит с кадра 0, к словам «семь тысяч» доходит до 6 900 и замирает
function km(t){const T=KA('stop')+2.2;const u=clamp(t/T,0,1);return Math.round(FINAL*(u<0.85?u/0.85*0.93:0.93+0.07*ease((u-0.85)/0.15)));}
function fmt(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');}
// ---------- helpers ----------
function sparkleS(c,x,y,L,a){if(a<=0)return;const k=L*0.18;c.save();c.globalAlpha=clamp(a,0,1);c.fillStyle='#fff6dc';c.beginPath();c.moveTo(x,y-L);c.quadraticCurveTo(x+k,y-k,x+L,y);c.quadraticCurveTo(x+k,y+k,x,y+L);c.quadraticCurveTo(x-k,y+k,x-L,y);c.quadraticCurveTo(x-k,y-k,x,y-L);c.fill();c.restore();}
function gtext(c,txt,x,y,size,col,a=1,blur=30,glow='rgba(255,200,110,0.85)'){if(a<=0)return;c.save();c.globalAlpha=clamp(a,0,1);c.textAlign='center';c.textBaseline='middle';c.font=`700 ${size}px C`;
  c.shadowColor='rgba(0,0,20,0.8)';c.shadowBlur=18;c.fillStyle=col;c.fillText(txt,x,y);c.shadowColor=glow;c.shadowBlur=blur;c.fillText(txt,x,y);c.restore();}
function counter(c,t,y=470,size=120,a=1){if(a<=0)return;const n=km(t);const run=n<FINAL;
  c.save();c.globalAlpha=a;c.fillStyle='rgba(7,11,36,0.55)';c.beginPath();c.roundRect(170,y-size*0.75,740,size*1.5+50,40);c.fill();c.restore();
  gtext(c,'ты пролетел',540,y-size*0.42,44,'#cfd6ff',a,10,'rgba(150,170,255,0.6)');
  gtext(c,fmt(n)+' км',540,y+size*0.35,size,run?'#ffe9b0':'#ffd27a',a,run?30:50);}
function streaks(c,t,a,speed=1,ang=0){if(a<=0)return;c.save();c.globalAlpha=a;c.translate(W/2,H/2);c.rotate(ang);c.translate(-W/2,-H/2);c.strokeStyle='rgba(255,246,220,0.55)';c.lineCap='round';
  for(const s of SPARK){const x=((s.x-t*1600*speed*s.s)%(W*1.6)+W*1.6)%(W*1.6)-W*0.3;c.lineWidth=1+s.s;c.beginPath();c.moveTo(x,s.y);c.lineTo(x+s.l*5*speed,s.y);c.stroke();}c.restore();}
function planet(c,x,y,r,rot){ // Земля
  const g=c.createRadialGradient(x-r*0.35,y-r*0.35,r*0.1,x,y,r);g.addColorStop(0,'#6fb8ff');g.addColorStop(1,'#1d4f9e');c.fillStyle=g;ell(c,x,y,r,r);c.fill();
  c.save();ell(c,x,y,r,r);c.clip();c.fillStyle='#5fbf6a';
  for(const [dx,dy,rx,ry] of [[-0.3,-0.2,0.35,0.22],[0.35,0.1,0.25,0.35],[-0.1,0.45,0.3,0.15],[0.1,-0.55,0.2,0.12]]){const xx=x+((dx+rot)%2.4+2.4)%2.4*r-1.2*r;ell(c,xx,y+dy*r,rx*r,ry*r);c.fill();}
  c.fillStyle='rgba(255,255,255,0.18)';ell(c,x-r*0.3,y-r*0.4,r*0.5,r*0.25);c.fill();c.restore();
  c.strokeStyle='rgba(140,200,255,0.35)';c.lineWidth=r*0.06;ell(c,x,y,r*1.03,r*1.03);c.stroke();}
function sun(c,x,y,r,t){const g=c.createRadialGradient(x,y,r*0.3,x,y,r*3.2);g.addColorStop(0,'rgba(255,210,120,0.9)');g.addColorStop(0.35,'rgba(255,170,80,0.25)');g.addColorStop(1,'rgba(255,170,80,0)');c.fillStyle=g;c.fillRect(x-r*3.2,y-r*3.2,r*6.4,r*6.4);
  c.fillStyle='#ffd27a';ell(c,x,y,r,r);c.fill();c.fillStyle='#fff1c0';ell(c,x-r*0.2,y-r*0.2,r*0.6,r*0.6);c.fill();}
// человечек на диване (это «ты»)
function sofaKid(c,x,y,s,t,o={}){const wind=o.wind||0,tea=o.tea||0;
  c.save();c.translate(x,y);c.scale(s,s);
  c.fillStyle='#c4566a';c.beginPath();c.roundRect(-150,-70,300,90,30);c.fill();c.beginPath();c.roundRect(-170,-140,340,90,40);c.fill(); // диван
  c.fillStyle='#a8445a';c.beginPath();c.roundRect(-185,-90,60,110,28);c.fill();c.beginPath();c.roundRect(125,-90,60,110,28);c.fill();
  c.fillStyle='#5a3a2a';c.fillRect(-140,20,18,30);c.fillRect(122,20,18,30);
  // тело
  c.fillStyle='#4f7fd6';c.beginPath();c.roundRect(-45,-150,90,100,30);c.fill();
  c.fillStyle='#384e8a';c.beginPath();c.roundRect(-45,-70,90,40,14);c.fill();c.fillRect(-40,-40,30,50);c.fillRect(10,-40,30,50); // ноги
  c.fillStyle='#ffd9b8';ell(c,-25,15,16,9);c.fill();ell(c,25,15,16,9);c.fill();
  // голова
  const hx=0,hy=-200;c.fillStyle='#ffd9b8';ell(c,hx,hy,52,50);c.fill();
  c.fillStyle='#6a3e22';c.beginPath();c.moveTo(hx-54,hy-6);c.quadraticCurveTo(hx-50,hy-62,hx,hy-58);c.quadraticCurveTo(hx+50,hy-62,hx+54,hy-6);
  for(let i=0;i<5;i++){const xx=hx+54-i*27;c.lineTo(xx-14,hy-30+Math.sin(t*14+i)*6*wind-wind*8);}c.closePath();c.fill();
  for(let i=0;i<4;i++){c.beginPath();c.moveTo(hx-30+i*18,hy-52);c.quadraticCurveTo(hx-60+i*18-wind*30,hy-70+Math.sin(t*12+i)*8*wind,hx-80+i*18-wind*60,hy-50+Math.sin(t*9+i)*10*wind);c.lineWidth=10;c.strokeStyle='#6a3e22';c.lineCap='round';c.stroke();}
  // лицо
  const bl=blink(t+0.7,0);for(const ex of [-18,18]){if(bl>0.6){c.strokeStyle='#2a1a12';c.lineWidth=4;c.beginPath();c.moveTo(ex-7,hy-2);c.lineTo(ex+7,hy-2);c.stroke();}else{c.fillStyle='#2a1a12';ell(c,ex,hy-2,7,9);c.fill();c.fillStyle='#fff';ell(c,ex+2,hy-5,2.5,2.5);c.fill();}}
  c.fillStyle='rgba(240,130,130,0.45)';ell(c,-32,hy+14,10,6);c.fill();ell(c,32,hy+14,10,6);c.fill();
  c.strokeStyle='#2a1a12';c.lineWidth=4;c.lineCap='round';c.beginPath();c.arc(0,hy+12,12,0.15*Math.PI,0.85*Math.PI);c.stroke();
  // руки и чашка
  c.fillStyle='#4f7fd6';c.save();c.translate(40,-130);c.rotate(-0.9-tea*0.5);c.beginPath();c.roundRect(-10,0,22,70,10);c.fill();c.restore();
  if(tea>0){const cx=78-tea*20,cy=-110-tea*40;c.fillStyle='#fff7e6';c.beginPath();c.roundRect(cx-22,cy-26,44,46,8);c.fill();c.strokeStyle='#fff7e6';c.lineWidth=7;c.beginPath();c.arc(cx+24,cy-4,11,-1.2,1.2);c.stroke();
    c.strokeStyle='rgba(255,255,255,0.5)';c.lineWidth=4;for(let i=0;i<2;i++){c.beginPath();c.moveTo(cx-6+i*12,cy-32);c.quadraticCurveTo(cx-16+i*12-wind*10,cy-50,cx-4+i*12-wind*20,cy-70+Math.sin(t*3+i)*4);c.stroke();}}
  c.restore();}
function owlCorner(c,t){const a0=CFG.scenes[1][1];const k=ease((t-a0-0.5)/0.8);miniOwl(c,t,1-k);}
// ---------- сцены ----------
const SC={
  sofa(c,t,lt){
    sky(c,t,0);streaks(c,t,0.8,1.2);
    const R=360,PX=540,PY=1420;planet(c,PX,PY,R,t*0.08);
    sofaKid(c,PX,PY-R+30,1.05,t,{wind:0.6});
    // пуля отстаёт
    const B=K('bullet'),bp=(lt-B)/2.4;if(bp>0&&bp<1){const bx=lerp(-80,1300,1-bp*0.15)-bp*1500,by=930;
      c.save();c.translate(bx,by);c.scale(1.6,1.6);c.fillStyle='#c9a24a';c.beginPath();c.moveTo(60,0);c.quadraticCurveTo(40,-18,0,-18);c.lineTo(-50,-18);c.lineTo(-50,18);c.lineTo(0,18);c.quadraticCurveTo(40,18,60,0);c.fill();
      c.fillStyle='#a07a32';c.fillRect(-50,-18,12,36);c.restore();
      gtext(c,'пуля',bx,by+60,40,'#cfd6ff',1-bp,8,'rgba(150,170,255,0.5)');
      gtext(c,'×30',780,1060-bp*30,90,'#ff9c7c',ease(bp*4)*(1-ease((bp-0.8)/0.2)),20,'rgba(255,120,90,0.8)');}
    const pop=1+0.25*Math.exp(-lt*6);
    c.save();c.translate(540,440);c.scale(pop,pop);gtext(c,'ты сейчас летишь',0,0,76,'#fff7e6',1,24);c.restore();
    counter(c,t,640,120,1);
    // петля «досмотри»
    const L=ease((lt-K('loop'))/0.3)*(1-ease((lt-K('loop')-3.4)/0.4));
    if(L>0){c.save();c.globalAlpha=L;c.translate(530,300);c.fillStyle='rgba(255,233,176,0.95)';c.beginPath();c.roundRect(-250,-40,500,80,40);c.fill();
      c.fillStyle='#2a2f78';c.font='700 40px C';c.textAlign='center';c.textBaseline='middle';c.fillText('ответ в конце ролика',0,3);c.restore();}
    owlCorner(c,t);vign(c);
  },
  orbit(c,t,lt){
    sky(c,t,0);const SX=540,SY=900;sun(c,SX,SY,90,t);
    c.strokeStyle='rgba(207,214,255,0.25)';c.lineWidth=3;c.setLineDash([12,14]);ell(c,SX,SY,380,170);c.stroke();c.setLineDash([]);
    const a=0.6+lt*0.9;
    for(let i=1;i<16;i++){const b=a-i*0.05;c.fillStyle=`rgba(120,190,255,${0.4*(1-i/16)})`;ell(c,SX+Math.cos(b)*380,SY+Math.sin(b)*170,22-i,22-i);c.fill();}
    const ex=SX+Math.cos(a)*380,ey=SY+Math.sin(a)*170;planet(c,ex,ey,30,t*0.5);
    gtext(c,'30 км/с',ex,ey-70,54,'#fff7e6',ease(lt/0.4),14);
    counter(c,t,560,96,1);vign(c);
  },
  galaxy(c,t,lt){
    skyG(c,'#05071a','#0d1236','#1a1d4a');starsOnly(c,t,0.6);
    const GX=540,GY=960,z=1.55-lt*0.03,rot=t*0.08;
    c.save();c.translate(GX,GY);c.scale(z,z*0.62);c.rotate(rot);c.globalCompositeOperation='lighter';
    const cg=c.createRadialGradient(0,0,0,0,0,170);cg.addColorStop(0,'rgba(255,230,180,0.9)');cg.addColorStop(1,'rgba(255,230,180,0)');c.fillStyle=cg;ell(c,0,0,170,170);c.fill();
    for(let arm=0;arm<2;arm++)for(let i=0;i<260;i++){const u=i/260,an=arm*Math.PI+u*5.5,r=60+u*520;const j=Math.sin(i*12.9898+arm)*43758.5453%1;
      c.fillStyle=`rgba(${190+60*u|0},${200},255,${0.55*(1-u*0.6)})`;ell(c,Math.cos(an)*r+j*30,Math.sin(an)*r+j*30,3+3*(1-u),3+3*(1-u));c.fill();}
    c.restore();
    // наше Солнце со шлейфом
    const sa=2.2+lt*0.5,sr=330;
    for(let i=1;i<24;i++){const b=sa-i*0.03;c.fillStyle=`rgba(255,210,120,${0.5*(1-i/24)})`;ell(c,GX+Math.cos(b+rot)*sr*z,GY+Math.sin(b+rot)*sr*z*0.62,10-i*0.3,10-i*0.3);c.fill();}
    const sx=GX+Math.cos(sa+rot)*sr*z,sy=GY+Math.sin(sa+rot)*sr*z*0.62;sun(c,sx,sy,12,t);
    gtext(c,'мы здесь',sx,sy-50,40,'#ffe9b0',ease(lt/0.5),10);
    const F=ease((lt-K('fast'))/0.3);
    gtext(c,'230 км/с',540,1250,96,'#ff9c7c',F,24,'rgba(255,120,90,0.8)');
    counter(c,t,560,96,1);vign(c);
  },
  tea(c,t,lt){
    sky(c,t,0);streaks(c,t,1,2.2);
    const R=360,PX=540,PY=1420;planet(c,PX,PY,R,t*0.08);
    sofaKid(c,PX,PY-R+30,1.15,t,{wind:1,tea:ease(lt/0.8)});
    if(!CFG.noCounter)counter(c,t,560,110,1);vign(c);
  },
  map(c,t,lt){
    skyG(c,'#0b1030','#1d2560','#3a3f80');starsOnly(c,t,0.5);
    const V=K('vlad'),m=ease((lt-V+0.4)/0.5);
    // дуга Москва → Владивосток
    const A=[200,920],Bp=[880,980];const pr=ease((lt-V+0.2)/1.6);
    c.save();c.globalAlpha=m;c.strokeStyle='rgba(207,214,255,0.3)';c.lineWidth=6;c.setLineDash([16,16]);c.beginPath();c.moveTo(...A);c.quadraticCurveTo(540,700,...Bp);c.stroke();c.setLineDash([]);
    c.strokeStyle='#ffd27a';c.lineWidth=8;c.beginPath();c.moveTo(...A);for(let i=1;i<=40;i++){const u=i/40*pr,x=(1-u)*(1-u)*A[0]+2*u*(1-u)*540+u*u*Bp[0],y=(1-u)*(1-u)*A[1]+2*u*(1-u)*700+u*u*Bp[1];c.lineTo(x,y);}c.stroke();
    for(const [p,n] of [[A,'Москва'],[Bp,'Владивосток']]){c.fillStyle='#ffe9b0';ell(c,p[0],p[1],14,14);c.fill();}
    c.restore();
    gtext(c,'Москва',A[0],A[1]+60,44,'#fff7e6',m,10);gtext(c,'Владивосток',Bp[0]-40,Bp[1]+60,44,'#fff7e6',m,10);
    // счётчик крупно, замирает
    const st=km(t)>=FINAL,pulse=st?1+0.06*Math.exp(-(lt-K('stop')-2)*3)*Math.abs(Math.sin((lt)*10)):1;
    c.save();c.translate(540,600);c.scale(pulse,pulse);c.translate(-540,-600);counter(c,t,600,140,1);c.restore();
    if(st){sparkleS(c,200,380,30,0.9);sparkleS(c,890,420,24,0.8);}
    vign(c);
  },
  share(c,t,lt){
    sky(c,t,0);
    const z=1.06-lt*0.004;c.save();c.translate(W/2,H/2);c.scale(z,z);c.translate(-W/2,-H/2);
    const ent=ease(lt/1.0);moon(c,540,760,t);owl(c,540,820+(1-ent)*400,1.15*(0.7+0.3*ent),t,blink(t,0),false,{talk:talk(t)});c.restore();
    gtext(c,fmt(FINAL)+' км',540,360,90,'#ffd27a',1,30);
    const S=K('send'),b=ease((lt-S)/0.4);
    if(b>0){const fx=lerp(700,980,ease((lt-S-0.8)/1.4)),fy=lerp(560,300,ease((lt-S-0.8)/1.4));
      c.save();c.globalAlpha=b;c.translate(fx,fy);c.rotate(-0.4);c.scale(0.6+0.4*b,0.6+0.4*b);c.fillStyle='#fff7e6';c.beginPath();c.moveTo(70,0);c.lineTo(-60,-45);c.lineTo(-30,0);c.lineTo(-60,45);c.closePath();c.fill();
      c.fillStyle='#cfd6ff';c.beginPath();c.moveTo(70,0);c.lineTo(-30,0);c.lineTo(-45,30);c.closePath();c.fill();c.restore();}
    fireflies(c,t);vign(c);
  }
};
