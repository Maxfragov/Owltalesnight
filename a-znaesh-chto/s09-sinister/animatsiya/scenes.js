// Страшная арка s09: Багул («Синистер»). Подключается после obshchee/core.js.
// Персонажа НЕ рисуем по фильму: никакой маски Багула. Только длинная чёрная фигура без лица (силуэт в луче / тень на стене),
// чердак, коробка с катушками, проектор, луч, мерцание, зерно. Что было на плёнке — НЕ показываем: на стене только светлый прямоугольник.
// Мост к s10 («Звонок»): в последнем кадре плёнки на миг мелькают помехи и кольцо колодца.
// Палитра: холодные сине-зелёные, почти чёрный (не полный, фон не темнее #10232a), тусклый жёлтый свет лампы, бледный холодный свет проектора.
// Без вспышек: луч разгорается и гаснет плавно. Без крови и насилия.
const DEFK={flick:2.12,beat:0.8,peak:3.05,lamp:0.8,sleep0:2.29,hide:3.98,up:4.48,hatch:5.97,box:0.8,reel:2.48,proj:4.96,wait:6.98,load:8.98,on:11.36,fig:12.36,back:0.8,stars:2.67,tv:4.74,script:8.4,two:10.84,noise:0.8,cut:2.67,long:0.8,flick2:3.93,sleep:1.2,stop:4.2};
const DEFKA={hide:11.52,back:29.26};
const K=n=>CFG.k&&CFG.k[n]!=null?CFG.k[n]:DEFK[n];
const KA=n=>CFG.ka&&CFG.ka[n]!=null?CFG.ka[n]:DEFKA[n];
// мини-совёнок прячется на жути (строки 4–7) и возвращается на строке 8
const _miniOwl=miniOwl;
miniOwl=function(c,t,a){const h=ease((t-KA('hide'))/1.0)*(1-ease((t-KA('back'))/1.4));_miniOwl(c,t,a*(1-0.88*h));};
// ---------- helpers ----------
let sd2=91;function r2(){sd2=(sd2*16807)%2147483647;return (sd2-1)/2147483646;}
const FOG=[];for(let i=0;i<34;i++)FOG.push({x:r2()*1.4-0.2,y:r2(),r:160+r2()*260,v:6+r2()*14,p:r2()*6.28});
const MOTES=[];for(let i=0;i<70;i++)MOTES.push({u:r2(),v:r2()*2-1,p:r2()*6.28,s:0.3+r2()*0.8,r:1+r2()*2.4});
function fog(c,t,y0,y1,a,col='120,150,155'){c.save();c.globalCompositeOperation='screen';
  for(const f of FOG){const x=((f.x*W+t*f.v)%(W*1.4)+W*1.4)%(W*1.4)-W*0.2,y=lerp(y0,y1,f.y)+Math.sin(t*0.2+f.p)*20;
    const g=c.createRadialGradient(x,y,0,x,y,f.r);const al=a*(0.55+0.45*Math.sin(t*0.15+f.p));
    g.addColorStop(0,`rgba(${col},${al})`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.fillRect(x-f.r,y-f.r,f.r*2,f.r*2);}
  c.restore();}
function vignD(c,k=0.8){const g=c.createRadialGradient(W/2,H*0.42,H*0.18,W/2,H*0.45,H*0.72);g.addColorStop(0,'rgba(2,6,8,0)');g.addColorStop(1,`rgba(2,6,8,${k})`);c.fillStyle=g;c.fillRect(0,0,W,H);}
function grad(c,a,b,d){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,a);g.addColorStop(0.55,b);g.addColorStop(1,d);c.fillStyle=g;c.fillRect(0,0,W,H);}
function glow(c,x,y,r,col,a){if(a<=0)return;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
function zoomAt(c,x,y,z){c.translate(x,y);c.scale(z,z);c.translate(-x,-y);}
// мерцание проектора: мягкое, 0.86..1, без вспышек
function flk(t){return 0.92+0.04*Math.sin(t*37)+0.03*Math.sin(t*23.3)+0.02*Math.sin(t*61.7);}
// зерно и царапины плёнки в прямоугольнике (детерминировано по кадру 24 к/с)
function specks(c,x,y,w,h,t,a){if(a<=0)return;let s=(Math.floor(t*24)*9301+49297)%2147483647+1;const R=()=>{s=(s*16807)%2147483647;return s/2147483647;};
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  for(let i=0;i<46;i++){const px=x+R()*w,py=y+R()*h,r=1+R()*2.6;c.fillStyle=R()<0.55?`rgba(255,255,248,${a*R()*0.8})`:`rgba(12,16,18,${a*R()*0.6})`;c.fillRect(px,py,r,r);}
  for(let i=0;i<3;i++){if(R()<0.55)continue;const sx=x+R()*w;c.strokeStyle=`rgba(245,245,235,${0.22*a})`;c.lineWidth=1.6;c.beginPath();c.moveTo(sx,y);c.lineTo(sx+R()*10-5,y+h);c.stroke();}
  c.restore();}
// помехи: маленький холст шума, растягивается мягко
const NZ=document.createElement('canvas');NZ.width=90;NZ.height=64;const NZc=NZ.getContext('2d');let NZf=-1;
function noise(c,x,y,w,h,t,a,tone=1){if(a<=0)return;const f=Math.floor(t*24);if(f!==NZf){NZf=f;const im=NZc.createImageData(90,64);let s=f*7919+13;
    for(let i=0;i<im.data.length;i+=4){s=(s*16807)%2147483647;const v=60+(s%170);im.data[i]=v*0.92;im.data[i+1]=v;im.data[i+2]=v*1.02;im.data[i+3]=255;}NZc.putImageData(im,0,0);}
  c.save();c.globalAlpha*=a;c.imageSmoothingEnabled=true;c.drawImage(NZ,x,y,w,h);
  // строчки развёртки
  c.fillStyle=`rgba(10,16,18,${0.18*tone})`;for(let yy=y;yy<y+h;yy+=6)c.fillRect(x,yy,w,2);
  const by=y+((t*90)%h);c.fillStyle='rgba(230,240,240,0.12)';c.fillRect(x,by,w,18);
  c.restore();}
// катушка плёнки: x,y центр, r радиус, rot поворот. o.fill — сколько плёнки намотано, o.lit — свет, o.a — прозрачность
function reel(c,x,y,r,rot,o={}){const a=o.a==null?1:o.a;if(a<=0)return;const lit=o.lit==null?1:o.lit,fill=o.fill==null?0.75:o.fill;
  c.save();c.translate(x,y);c.rotate(rot);c.globalAlpha*=a;
  const rf=r*(0.28+0.66*fill);
  c.fillStyle=`rgb(${Math.round(22+30*lit)},${Math.round(20+22*lit)},${Math.round(18+14*lit)})`;ell(c,0,0,rf,rf);c.fill();
  c.strokeStyle=`rgba(150,125,95,${0.22*lit})`;c.lineWidth=1.2;for(let k=0.34;k<rf/r;k+=0.07){ell(c,0,0,r*k,r*k);c.stroke();}
  // металлический фланец с тремя окнами
  const m=[Math.round(70+80*lit),Math.round(82+86*lit),Math.round(88+88*lit)];
  c.fillStyle=`rgba(${m.join(',')},0.92)`;c.beginPath();c.arc(0,0,r,0,Math.PI*2);
  for(let i=0;i<3;i++){const an=i*2.094+0.4,hx=Math.cos(an)*r*0.56,hy=Math.sin(an)*r*0.56,hr=r*0.27;c.moveTo(hx+hr,hy);c.arc(hx,hy,hr,0,Math.PI*2);}
  c.fill('evenodd');
  c.strokeStyle=`rgba(220,232,235,${0.35*lit})`;c.lineWidth=3;c.beginPath();c.arc(0,0,r-1.5,-2.4,-0.6);c.stroke();
  c.fillStyle=`rgb(${m.map(v=>Math.round(v*0.6)).join(',')})`;ell(c,0,0,r*0.16,r*0.16);c.fill();
  c.fillStyle='#0b1214';c.fillRect(-r*0.05,-r*0.05,r*0.1,r*0.1);
  c.restore();}
// проектор (объектив смотрит влево). x,y — центр корпуса. o.spin — угол катушек, o.on — лампа 0..1, o.lit — свет на корпусе, o.front — альфа передней катушки
function projector(c,x,y,s,o={}){const a=o.a==null?1:o.a;if(a<=0)return;const lit=o.lit==null?1:o.lit,on=o.on||0,sp=o.spin||0;
  c.save();c.translate(x,y);c.scale(s,s);c.globalAlpha*=a;
  const body=`rgb(${Math.round(24+34*lit)},${Math.round(34+40*lit)},${Math.round(38+42*lit)})`,dk=`rgb(${Math.round(14+18*lit)},${Math.round(20+22*lit)},${Math.round(23+24*lit)})`;
  // кронштейны катушек
  c.strokeStyle=dk;c.lineWidth=14;c.lineCap='round';c.beginPath();c.moveTo(-40,-50);c.lineTo(-78,-180);c.moveTo(60,-50);c.lineTo(92,-180);c.stroke();
  reel(c,92,-188,80,-sp*0.8,{fill:0.18+0.1*on,lit:0.6*lit+0.2});
  reel(c,-78,-188,80,-sp,{fill:0.78,lit:0.6*lit+0.2,a:o.front==null?1:o.front});
  // корпус
  c.fillStyle=body;c.beginPath();c.roundRect(-125,-62,240,124,18);c.fill();
  c.fillStyle=`rgba(200,220,225,${0.16*lit})`;c.beginPath();c.roundRect(-118,-58,226,10,5);c.fill();
  // объектив
  c.fillStyle=dk;c.beginPath();c.roundRect(-200,-26,82,52,8);c.fill();c.fillStyle=body;c.fillRect(-170,-30,12,60);
  c.fillStyle=`rgb(${Math.round(30+40*lit)},${Math.round(44+50*lit)},${Math.round(50+56*lit)})`;ell(c,-202,0,9,24);c.fill();
  // щели вентиляции: при работе — тёплый свет лампы
  for(let i=0;i<5;i++){c.fillStyle=on>0?`rgba(255,${Math.round(190+30*on)},${Math.round(120+40*on)},${0.15+0.6*on*flk(0.3*i+x)})`:dk;c.beginPath();c.roundRect(-10+i*22,-36,10,46,4);c.fill();}
  if(on>0)glow(c,30,-12,120,'255,200,130',0.16*on);
  // ножки
  c.fillStyle=dk;c.fillRect(-100,60,24,22);c.fillRect(76,60,24,22);
  c.restore();
  return [x-206*s,y];}
// луч: многоугольник от объектива к пятну на стене + пылинки
function beam(c,poly,lx,ly,cx,cy,a,t){if(a<=0)return;c.save();c.globalCompositeOperation='screen';const f=a*flk(t);
  const g=c.createLinearGradient(lx,ly,cx,cy);g.addColorStop(0,`rgba(230,240,240,${0.30*f})`);g.addColorStop(1,`rgba(190,215,225,${0.10*f})`);
  c.fillStyle=g;c.beginPath();poly.forEach(([px,py],i)=>i?c.lineTo(px,py):c.moveTo(px,py));c.closePath();c.fill();
  c.clip();
  for(const m of MOTES){const u=(m.u+t*0.012*m.s)%1,x=lerp(lx,cx,u)+m.v*lerp(10,260,u)*0.9+Math.sin(t*m.s+m.p)*14,y=lerp(ly,cy,u)+m.v*lerp(8,200,u)+Math.cos(t*m.s*0.8+m.p)*12;
    c.fillStyle=`rgba(255,250,235,${0.55*f*(0.5+0.5*Math.sin(t*2*m.s+m.p))})`;ell(c,x,y,m.r,m.r);c.fill();}
  c.restore();}
// светлое пятно проектора на стене (без изображения). o.nz — помехи, o.well — кольцо колодца (мост к s10)
function lightRect(c,R,a,t,o={}){if(a<=0)return;const [x,y,w,h]=R,f=a*flk(t);
  glow(c,x+w/2,y+h/2,Math.max(w,h)*0.95,'190,215,225',0.20*f);
  c.save();const g=c.createRadialGradient(x+w/2,y+h/2,10,x+w/2,y+h/2,Math.max(w,h)*0.7);
  g.addColorStop(0,`rgba(236,242,238,${0.86*f})`);g.addColorStop(1,`rgba(160,188,195,${0.62*f})`);c.fillStyle=g;c.fillRect(x,y,w,h);
  // кадровая рамка проезжает изредка (как у старой плёнки)
  const fr=((t*0.35)%1);if(fr<0.12){c.fillStyle=`rgba(20,28,30,${0.35*f})`;c.fillRect(x,y+h*(fr/0.12)-10,w,16);}
  if(o.nz>0)noise(c,x,y,w,h,t,o.nz*a*0.85);
  if(o.well>0){c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.globalAlpha*=o.well*a;const wx=x+w/2,wy=y+h*0.55,rx=w*0.2,ry=rx*0.34;
    c.fillStyle='rgba(30,36,38,0.75)';c.fillRect(wx-rx,wy,rx*2,rx*0.62);ell(c,wx,wy+rx*0.62,rx,ry);c.fill();
    c.fillStyle='rgba(70,80,82,0.85)';ell(c,wx,wy,rx,ry);c.fill();c.fillStyle='rgba(6,10,12,0.95)';ell(c,wx,wy,rx*0.78,ry*0.72);c.fill();
    c.strokeStyle='rgba(20,26,28,0.6)';c.lineWidth=3;for(let i=0;i<4;i++){c.beginPath();c.moveTo(wx-rx,wy+i*rx*0.16+10);c.lineTo(wx+rx,wy+i*rx*0.16+10);c.stroke();}
    c.restore();}
  specks(c,x,y,w,h,t,0.9*a);
  // мягкий край
  c.strokeStyle=`rgba(200,220,225,${0.25*f})`;c.lineWidth=6;c.strokeRect(x,y,w,h);
  c.restore();}
// длинная чёрная фигура без лица. x — центр, y — макушка, h — рост. o.a, o.tilt (наклон головы), o.col, o.fade (низ растворяется)
function figure(c,x,y,h,o={}){const a=o.a==null?1:o.a;if(a<=0.01)return;const s=h/600,col=o.col||'6,10,12';
  c.save();c.translate(x,y);c.scale(s,s*(o.sy||1));c.globalAlpha*=a;
  const g=c.createLinearGradient(0,0,0,600);g.addColorStop(0,`rgba(${col},1)`);g.addColorStop(0.6,`rgba(${col},0.95)`);g.addColorStop(1,`rgba(${col},${o.fade==null?0:o.fade})`);
  c.fillStyle=g;c.shadowColor=`rgba(${col},0.8)`;c.shadowBlur=o.blur==null?10:o.blur;
  // голова: вытянутая, чуть наклонена, без лица
  c.save();c.translate(0,44);c.rotate(o.tilt||0.07);ell(c,0,0,25,44);c.fill();c.restore();
  // шея и узкие плечи
  c.beginPath();c.moveTo(-9,80);c.lineTo(9,80);c.lineTo(12,104);c.lineTo(-12,104);c.closePath();c.fill();
  // длинное тело-балахон
  c.beginPath();c.moveTo(-14,100);c.quadraticCurveTo(-44,104,-46,150);c.lineTo(-50,600);c.lineTo(50,600);c.lineTo(46,150);c.quadraticCurveTo(44,104,14,100);c.closePath();c.fill();
  // очень длинные руки и пальцы
  for(const sd of [-1,1]){c.beginPath();c.moveTo(sd*40,112);c.quadraticCurveTo(sd*68,260,sd*64,470);c.lineTo(sd*52,470);c.quadraticCurveTo(sd*52,270,sd*30,132);c.closePath();c.fill();
    c.strokeStyle=g;c.lineWidth=4;c.lineCap='round';for(let i=0;i<4;i++){c.beginPath();c.moveTo(sd*(53+i*3.5),466);c.quadraticCurveTo(sd*(55+i*4),500,sd*(52+i*5),530+i*2);c.stroke();}}
  c.restore();}
// коробка с катушками. x,y — левый верхний угол передней стенки, o.lit
function box(c,x,y,o={}){const lit=o.lit==null?1:o.lit,w=330,h=190;
  const cb=v=>`rgb(${Math.round(v[0]*(0.45+0.55*lit))},${Math.round(v[1]*(0.45+0.55*lit))},${Math.round(v[2]*(0.45+0.55*lit))})`;
  // задние клапаны
  c.fillStyle=cb([70,62,50]);c.beginPath();c.moveTo(x+20,y);c.lineTo(x+60,y-70);c.lineTo(x+w-40,y-80);c.lineTo(x+w-10,y);c.closePath();c.fill();
  // катушки внутри
  for(const [dx,dy,r,ro] of [[90,-20,62,0.3],[200,-38,70,1.2],[260,-6,52,2.1]])reel(c,x+dx,y+dy,r,ro,{lit:0.5*lit+0.15,fill:0.8});
  if(o.glint>0)glow(c,x+200,y-60,90,'230,240,240',0.35*o.glint);
  // передняя стенка
  c.fillStyle=cb([92,80,62]);c.fillRect(x,y,w,h);
  c.fillStyle=cb([60,52,42]);c.beginPath();c.moveTo(x,y);c.lineTo(x-40,y+70);c.lineTo(x+10,y+80);c.lineTo(x+40,y);c.closePath();c.fill();
  c.strokeStyle=cb([120,108,86]);c.lineWidth=3;c.beginPath();c.moveTo(x+12,y+h*0.45);c.lineTo(x+w-12,y+h*0.45);c.stroke();
  c.fillStyle=`rgba(210,205,190,${0.35*lit})`;c.fillRect(x+110,y+40,110,46);
  c.fillStyle=`rgba(40,40,36,${0.35*lit})`;c.fillRect(x+122,y+54,86,4);c.fillRect(x+122,y+66,60,4);
}
// дома-силуэты с чердачным окном (мерцает светом проектора)
function roofs(c,y,col,win,flick,t){const HS=[[-20,180,200],[150,210,270],[350,170,230],[510,250,320],[760,180,250],[930,200,290]];
  c.fillStyle=col;c.fillRect(-20,y,W+40,H-y);for(const [x,w,h] of HS){c.fillRect(x,y-h,w,h+4);c.beginPath();c.moveTo(x-10,y-h);c.lineTo(x+w/2,y-h-w*0.42);c.lineTo(x+w+10,y-h);c.closePath();c.fill();}
  for(const [x,yy] of [[200,y-200],[790,y-150]]){c.fillStyle=win>0?`rgba(255,200,110,${0.5*win})`:'rgba(30,50,58,0.9)';c.fillRect(x,yy,34,44);if(win>0)glow(c,x+17,yy+22,80,'255,200,110',0.14*win);}
  // чердачное окно-полукруг в доме 510..760
  const ax=635,ay=y-320-40;c.fillStyle='rgba(28,44,50,0.95)';c.beginPath();c.arc(ax,ay,30,Math.PI,0);c.lineTo(ax+30,ay+18);c.lineTo(ax-30,ay+18);c.closePath();c.fill();
  if(flick>0){const f=flick*(0.55+0.45*flk(t*1.3)*(0.6+0.4*Math.sin(t*9)));c.fillStyle=`rgba(205,225,235,${0.75*f})`;c.beginPath();c.arc(ax,ay,26,Math.PI,0);c.lineTo(ax+26,ay+14);c.lineTo(ax-26,ay+14);c.closePath();c.fill();glow(c,ax,ay,110,'190,215,230',0.22*f);}}
// спальня: коробка комнаты, кровать со спящим, тумбочка с лампой, люк в потолке. o.lamp, o.hatch (0..1), o.ladder, o.leak (свет из щелей люка)
function bedroom(c,t,o={}){const lm=o.lamp==null?1:o.lamp;
  // потолок (уходит высоко вверх — для панорамы)
  c.fillStyle='#132a32';c.beginPath();c.moveTo(-200,-700);c.lineTo(W+200,-700);c.lineTo(980,300);c.lineTo(100,300);c.closePath();c.fill();
  c.strokeStyle='rgba(120,150,155,0.10)';c.lineWidth=4;for(const k of [0.2,0.45,0.7]){c.beginPath();c.moveTo(lerp(100,-200,k),lerp(300,-700,k));c.lineTo(lerp(980,W+200,k),lerp(300,-700,k));c.stroke();}
  // задняя стена
  {const g=c.createLinearGradient(0,300,0,1080);g.addColorStop(0,'#1c3a44');g.addColorStop(1,'#16303a');c.fillStyle=g;c.fillRect(100,300,880,780);}
  // боковые стены и пол
  c.fillStyle='#142c34';c.beginPath();c.moveTo(-200,-700);c.lineTo(100,300);c.lineTo(100,1080);c.lineTo(-200,H+200);c.closePath();c.fill();
  c.beginPath();c.moveTo(W+200,-700);c.lineTo(980,300);c.lineTo(980,1080);c.lineTo(W+200,H+200);c.closePath();c.fill();
  c.fillStyle='#10222a';c.beginPath();c.moveTo(100,1080);c.lineTo(980,1080);c.lineTo(W+200,H+200);c.lineTo(-200,H+200);c.closePath();c.fill();
  c.strokeStyle='rgba(150,180,185,0.12)';c.lineWidth=3;c.beginPath();c.moveTo(100,300);c.lineTo(980,300);c.lineTo(980,1080);c.lineTo(100,1080);c.closePath();c.stroke();
  // тёплый свет лампы на стене
  glow(c,800,800,520,'255,200,120',0.20*lm);glow(c,800,800,200,'255,215,150',0.16*lm);
  // тень на стене (в «письме»)
  if(o.shadow)o.shadow(c);
  // люк в потолке
  const hx0=400,hx1=680,hy0=150,hy1=250,hp=o.hatch||0;
  c.fillStyle='#0c1c22';c.beginPath();c.moveTo(hx0+20,hy0);c.lineTo(hx1-20,hy0);c.lineTo(hx1,hy1);c.lineTo(hx0,hy1);c.closePath();c.fill();
  if(hp>0){c.save();c.beginPath();c.moveTo(hx0+20,hy0);c.lineTo(hx1-20,hy0);c.lineTo(hx1,hy1);c.lineTo(hx0,hy1);c.closePath();c.clip();
    const g=c.createLinearGradient(0,hy0,0,hy1);g.addColorStop(0,`rgba(200,225,235,${0.55*hp})`);g.addColorStop(1,`rgba(150,185,195,${0.35*hp})`);c.fillStyle=g;c.fillRect(hx0,hy0,hx1-hx0,hy1-hy0);c.restore();
    // холодный свет падает вниз
    c.save();c.globalCompositeOperation='screen';const lg=c.createLinearGradient(0,hy1,0,1100);lg.addColorStop(0,`rgba(180,210,220,${0.22*hp})`);lg.addColorStop(1,'rgba(180,210,220,0)');c.fillStyle=lg;
    c.beginPath();c.moveTo(hx0,hy1);c.lineTo(hx1,hy1);c.lineTo(hx1+120,1100);c.lineTo(hx0-120,1100);c.closePath();c.fill();c.restore();}
  // крышка люка: откидывается вниз на петле у левого края
  {c.save();c.translate(hx0,hy1);const an=hp*1.35;c.fillStyle='#1d3640';c.strokeStyle='rgba(150,180,185,0.25)';c.lineWidth=3;
    c.beginPath();c.moveTo(0,0);c.lineTo((hx1-hx0)*Math.cos(an),(hx1-hx0)*Math.sin(an)*1.0-(hy1-hy0)*(1-hp)*0);c.lineTo((hx1-hx0)*Math.cos(an)-20*(1-hp),(hx1-hx0)*Math.sin(an)-(hy1-hy0)*(1-hp));c.lineTo(20*(1-hp),-(hy1-hy0)*(1-hp));c.closePath();c.fill();c.stroke();c.restore();}
  // щели люка светятся (проектор работает наверху)
  if(o.leak>0){const f=o.leak*(0.5+0.5*flk(t*1.2)*(0.7+0.3*Math.sin(t*11)));c.strokeStyle=`rgba(215,235,245,${0.95*f})`;c.lineWidth=7;
    c.beginPath();c.moveTo(hx0+20,hy0);c.lineTo(hx1-20,hy0);c.lineTo(hx1,hy1);c.lineTo(hx0,hy1);c.closePath();c.stroke();glow(c,540,200,300,'190,215,230',0.30*f);}
  // лестница
  const ld=o.ladder||0;if(ld>0){c.strokeStyle='#2c454e';c.lineWidth=12;const L=ld*880;const x0=hx0+60,x1=hx1-60,ang=0.28;
    const ex=Math.sin(ang)*L,ey=Math.cos(ang)*L;c.beginPath();c.moveTo(x0,hy1);c.lineTo(x0+ex,hy1+ey);c.moveTo(x1,hy1);c.lineTo(x1+ex,hy1+ey);c.stroke();
    c.lineWidth=9;for(let d=60;d<L;d+=95){const px=Math.sin(ang)*d,py=Math.cos(ang)*d;c.beginPath();c.moveTo(x0+px,hy1+py);c.lineTo(x1+px,hy1+py);c.stroke();}}
  // кровать
  c.fillStyle='#0d1d23';c.beginPath();c.roundRect(104,790,70,330,14);c.fill();c.fillStyle='#132830';c.beginPath();c.roundRect(116,812,46,120,10);c.fill();
  c.fillStyle='#24414b';c.beginPath();c.roundRect(130,950,600,120,24);c.fill();
  c.fillStyle='#c9d4d2';c.globalAlpha=0.30+0.2*lm;c.beginPath();c.roundRect(160,895,190,80,34);c.fill();c.globalAlpha=1;
  // спящий: голова (затылок) и одеяло горкой
  c.fillStyle='#0f1b20';ell(c,265,905,46,42);c.fill();c.fillStyle='rgba(255,210,150,0.12)';ell(c,290,890,20,22);c.fill();
  const br=Math.sin(t*1.1)*4;
  {const g=c.createLinearGradient(0,880,0,1070);g.addColorStop(0,'#3a5a62');g.addColorStop(1,'#25404a');c.fillStyle=g;
    c.beginPath();c.moveTo(250,960);c.quadraticCurveTo(330,880-br,470,900-br);c.quadraticCurveTo(640,910,720,960);c.lineTo(730,1060);c.lineTo(240,1060);c.closePath();c.fill();}
  // тумбочка и лампа
  c.fillStyle='#0f2027';c.fillRect(770,930,190,170);c.strokeStyle='rgba(150,180,185,0.15)';c.lineWidth=3;c.strokeRect(780,970,170,50);
  if(o.book){c.fillStyle='#3b2f2a';c.save();c.translate(800,918);c.rotate(-0.05);c.beginPath();c.roundRect(0,0,130,18,3);c.fill();c.fillStyle='#d8cfb8';c.fillRect(4,4,122,4);c.restore();}
  c.fillStyle='#0b161a';c.fillRect(856,860,10,70);ell(c,861,930,34,8);c.fill();
  c.fillStyle=`rgb(${Math.round(120+120*lm)},${Math.round(90+100*lm)},${Math.round(60+70*lm)})`;c.beginPath();c.moveTo(818,858);c.lineTo(904,858);c.lineTo(888,778);c.lineTo(834,778);c.closePath();c.fill();
  glow(c,861,830,160,'255,205,130',0.35*lm);
}
// чердак: скаты крыши, круглое окно, доски, свет снизу из люка
function attic(c,t,o={}){
  grad(c,'#1a3640','#173039','#10232a');
  // задняя стена-треугольник под скатами
  c.fillStyle='#1d3a44';c.beginPath();c.moveTo(-60,1080);c.lineTo(540,180);c.lineTo(1140,1080);c.closePath();c.fill();
  // круглое окно с луной
  glow(c,540,420,260,'170,200,215',0.18);c.fillStyle='#2f5260';ell(c,540,420,64,64);c.fill();c.fillStyle='#4c7584';ell(c,540,420,56,56);c.fill();
  c.strokeStyle='#14262d';c.lineWidth=7;c.beginPath();c.moveTo(484,420);c.lineTo(596,420);c.moveTo(540,364);c.lineTo(540,476);c.stroke();
  // лунная полоса
  c.save();c.globalCompositeOperation='screen';c.fillStyle='rgba(160,195,210,0.08)';c.beginPath();c.moveTo(500,440);c.lineTo(580,400);c.lineTo(860,1100);c.lineTo(640,1100);c.closePath();c.fill();c.restore();
  // стропила
  c.strokeStyle='#0c1b20';c.lineCap='butt';for(const [w,dx] of [[46,0]]){c.lineWidth=w;c.beginPath();c.moveTo(-80,1110);c.lineTo(540,160);c.lineTo(1160,1110);c.stroke();}
  c.lineWidth=18;c.strokeStyle='#11232a';for(const k of [0.3,0.55,0.8]){c.beginPath();c.moveTo(lerp(540,-80,k),lerp(160,1110,k));c.lineTo(lerp(540,-80,k)-120,lerp(160,1110,k)-60);c.stroke();c.beginPath();c.moveTo(lerp(540,1160,k),lerp(160,1110,k));c.lineTo(lerp(540,1160,k)+120,lerp(160,1110,k)-60);c.stroke();}
  // пол
  {const g=c.createLinearGradient(0,1080,0,H);g.addColorStop(0,'#1b2f33');g.addColorStop(1,'#0f1d22');c.fillStyle=g;c.fillRect(0,1080,W,H-1080);}
  c.strokeStyle='rgba(120,150,150,0.12)';c.lineWidth=3;for(let i=0;i<9;i++){const y=1080+i*i*9;c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  // свет из люка (снизу, холодный)
  glow(c,540,1200,420,'170,205,215',0.20*(o.hatch==null?1:o.hatch));
}
const SC={
  sky(c,t,lt){
    sky(c,t,0);c.fillStyle='rgba(2,14,18,0.45)';c.fillRect(0,0,W,H);
    const z=1+lt*0.006;c.save();zoomAt(c,W/2,H/2,z);
    const ent=ease(lt/1.6);moon(c,540,700,t);owl(c,540,760+(1-ent)*500,1.15*(0.6+0.4*ent),t,blink(t,0),false,{talk:talk(t)});c.restore();
    fog(c,t,1000,1160,0.14);
    roofs(c,1180,'#050c0f',0.8,ease((lt-K('flick'))/1.2),t);
    fog(c,t,1120,1260,0.12);vignD(c,0.7);
  },
  pulse(c,t,lt){
    // кинозал со спины: пустой светлый экран (ничего не показываем), ряды голов, у каждого датчик. Линия пульса.
    grad(c,'#10242b','#142c34','#0d1c21');
    const sx=140,sy=430,sw=800,sh=330;
    beam(c,[[520,1260],[560,1260],[sx+sw,sy+sh],[sx+sw,sy],[sx,sy],[sx,sy+sh]],540,1260,540,595,0.55,t);
    glow(c,540,600,620,'170,200,210',0.18);
    {const g=c.createLinearGradient(0,sy,0,sy+sh);g.addColorStop(0,`rgba(205,222,224,${0.82*flk(t)})`);g.addColorStop(1,`rgba(170,192,198,${0.74*flk(t)})`);c.fillStyle=g;c.fillRect(sx,sy,sw,sh);}
    specks(c,sx,sy,sw,sh,t,0.6);
    // шторы по краям
    c.fillStyle='#0e1f25';c.fillRect(60,380,80,520);c.fillRect(940,380,80,520);
    // пульс: bpm 62 -> 92 после «самым страшным»
    const bp=lerp(62,92,ease((lt-K('peak'))/2.0)),rev=ease((lt-K('beat'))/1.2);
    // ряды зрителей (силуэты затылков), датчик мигает в такт
    const ph=(()=>{let acc=0;const b0=K('beat');const d=lt-b0;if(d<0)return 0;return (d*bp/60)%1;})();
    const rows=[[880,26,92,'#0b171c'],[985,34,120,'#09141a'],[1120,46,160,'#071116']];
    rows.forEach(([y,r,dx,col],ri)=>{c.fillStyle=col;c.fillRect(0,y+r*0.6,W,40+ri*30);
      for(let x=(ri%2?dx/2:0)+30;x<W+40;x+=dx){c.fillStyle=col;ell(c,x,y,r,r*1.12);c.fill();c.beginPath();c.roundRect(x-r*1.4,y+r*0.8,r*2.8,r*2,r*0.6);c.fill();
        c.strokeStyle='rgba(200,220,225,0.22)';c.lineWidth=2;c.beginPath();c.arc(x,y,r,-2.6,-0.5);c.stroke();
        const on=ph<0.18?1:0.25;glow(c,x+r*1.05,y+r*1.3,10,'255,80,70',0.6*on*rev);c.fillStyle=`rgba(255,90,80,${(0.35+0.6*on)*rev})`;ell(c,x+r*1.05,y+r*1.3,3,3);c.fill();}});
    // линия пульса над рядами
    {const y0=820,sp=260,amp=lerp(1,1.9,ease((lt-K('peak'))/2.0));c.save();c.beginPath();c.rect(40,640,lerp(40,1000,rev),360);c.clip();
      c.strokeStyle='rgba(255,120,95,0.85)';c.shadowColor='rgba(255,90,70,0.9)';c.shadowBlur=14;c.lineWidth=4;c.beginPath();
      for(let x=40;x<=1040;x+=3){const tt=lt-(1040-x)/sp;const bpx=lerp(62,92,ease((tt-K('peak'))/2.0));const q=((Math.max(0,tt-K('beat'))*bpx/60)%1);
        let v=0;if(q<0.04)v=-q/0.04*0.3;else if(q<0.08)v=-0.3+((q-0.04)/0.04)*1.9;else if(q<0.12)v=1.6-((q-0.08)/0.04)*2.2;else if(q<0.16)v=-0.6+((q-0.12)/0.04)*0.6;else if(q>0.35&&q<0.5)v=0.18*Math.sin((q-0.35)/0.15*Math.PI);
        const y=y0-v*42*amp;x>40?c.lineTo(x,y):c.moveTo(x,y);}
      c.stroke();c.restore();
      c.font='700 40px C';c.textAlign='right';c.fillStyle=`rgba(255,150,130,${0.85*rev})`;c.fillText('♥ '+Math.round(bp),1000,720);}
    fog(c,t,900,1250,0.08);vignD(c,0.7);
  },
  room(c,t,lt){
    // спальня: человек уснул при лампе. На строке 4 взгляд поднимается к люку чердака, люк открывается, спускается лестница
    const lm=ease((lt-K('lamp'))/1.0)*0.3+0.7+0.05*Math.sin(t*1.7)*ease((lt-K('sleep0'))/1);
    const up=ease((lt-K('up'))/2.6),hp=ease((lt-K('hatch'))/2.0),ld=ease((lt-K('hatch')-0.6)/2.4);
    c.fillStyle='#10232a';c.fillRect(0,0,W,H);
    c.save();c.translate(0,430*up);
    bedroom(c,t,{lamp:lm,hatch:hp,ladder:ld});
    c.restore();
    fog(c,t,600,1250,0.10);vignD(c,0.72);
  },
  attic(c,t,lt){
    // чердак во сне: коробка с катушками в углу, рядом проектор. Катушку ставят — проектор включается.
    // Луч бьёт в стену светлым пятном (без изображения). В луче медленно проступает длинная фигура без лица.
    const z=1+lt*0.003;c.save();zoomAt(c,540,800,z);
    attic(c,t);
    const bx=ease((lt-K('box'))/1.6),gl=ease((lt-K('reel'))/0.8)*(1-ease((lt-K('reel')-1.4)/1.2));
    const pj=ease((lt-K('proj'))/2.0),wt=ease((lt-K('wait'))/0.6)*(1-ease((lt-K('wait')-1.0)/1.0));
    const on=ease((lt-K('on'))/1.6),fg=ease((lt-K('fig'))/2.6);
    const R=[90,420,330,250];
    // пятно на стене и фигура перед ним
    lightRect(c,R,on,t);
    figure(c,262,448,560,{a:0.92*fg,tilt:0.08+0.05*ease((lt-K('fig')-1.5)/2)});
    // коробка в углу
    glow(c,280,980,300,'255,205,140',0.12*bx);
    box(c,110,960,{lit:0.35+0.65*bx,glint:gl});
    // проектор на ящике
    c.fillStyle='#0f2026';c.fillRect(620,1000,330,140);c.strokeStyle='rgba(150,180,185,0.15)';c.lineWidth=3;c.strokeRect(630,1010,310,120);
    // катушка переезжает из коробки на передний кронштейн
    const ld=ease((lt-K('load'))/2.2),placed=ld>=0.999?1:0;
    const spin=on>0?(lt-K('on'))*(2.2*on):0;
    const lens=projector(c,780,920,1,{lit:0.3+0.7*pj,on,spin,front:placed});
    if(ld>0&&!placed){const px=lerp(310,780-78,ld),py=lerp(925,920-188,ld)-Math.sin(ld*Math.PI)*120;reel(c,px,py,80*lerp(0.8,1,ld),ld*2,{lit:0.7,fill:0.78});}
    glow(c,lens[0]-10,lens[1],60,'230,240,240',0.45*wt+0.32*on);
    // луч
    beam(c,[[lens[0],lens[1]-18],[R[0]+R[2],R[1]],[R[0],R[1]],[R[0],R[1]+R[3]],[R[0]+R[2],R[1]+R[3]],[lens[0],lens[1]+18]],lens[0],lens[1],R[0]+R[2]/2,R[1]+R[3]/2,on,t);
    c.restore();
    fog(c,t,1000,1250,0.10);vignD(c,0.72);
  },
  critic(c,t,lt){
    // выдох: стол кинокритика, рецензия со звёздами; маленький телевизор с помехами («Звонок»); лист сценария «Синистер»
    grad(c,'#2a4450','#243b45','#18282f');
    glow(c,300,800,560,'255,205,140',0.22);
    // стол
    {const g=c.createLinearGradient(0,1040,0,H);g.addColorStop(0,'#3a3029');g.addColorStop(1,'#1d1814');c.fillStyle=g;c.fillRect(0,1040,W,H-1040);}
    c.fillStyle='rgba(255,220,170,0.08)';c.fillRect(0,1040,W,8);
    // настольная лампа слева
    c.strokeStyle='#121c20';c.lineWidth=12;c.lineCap='round';c.beginPath();c.moveTo(80,1060);c.lineTo(110,760);c.lineTo(240,640);c.stroke();
    c.fillStyle='#121c20';c.beginPath();c.moveTo(200,610);c.lineTo(300,650);c.lineTo(250,720);c.lineTo(180,680);c.closePath();c.fill();
    glow(c,250,700,90,'255,225,170',0.5);
    // телевизор справа
    const tv=ease((lt-K('tv'))/1.2);
    c.fillStyle='#141e22';c.beginPath();c.roundRect(620,660,340,280,26);c.fill();
    c.strokeStyle='#141e22';c.lineWidth=6;c.beginPath();c.moveTo(790,660);c.lineTo(710,540);c.moveTo(790,660);c.lineTo(880,560);c.stroke();
    c.fillStyle='#24343a';c.beginPath();c.roundRect(648,690,250,200,20);c.fill();
    if(tv>0){c.save();c.beginPath();c.roundRect(648,690,250,200,20);c.clip();noise(c,648,690,250,200,t,tv);c.restore();glow(c,773,790,260,'190,210,220',0.18*tv);}
    for(const y of [720,770])c.fillStyle='#0c1417',ell(c,930,y,12,12),c.fill();
    // видеокассета перед телевизором
    c.fillStyle='#0d1215';c.beginPath();c.roundRect(660,960,240,70,6);c.fill();c.fillStyle='rgba(220,220,210,0.55)';c.fillRect(690,972,180,22);c.fillStyle='#22292c';ell(c,730,1012,14,10);c.fill();ell(c,830,1012,14,10);c.fill();
    // рецензия: лист бумаги
    c.save();c.translate(340,770);c.rotate(-0.04);
    c.fillStyle='#d9d2c0';c.fillRect(-210,-260,420,520);c.fillStyle='rgba(60,50,40,0.18)';c.fillRect(-210,250,420,10);
    c.fillStyle='#3a332a';c.font='700 38px C';c.textAlign='center';c.fillText('РЕЦЕНЗИЯ',0,-190);
    c.fillStyle='rgba(60,54,46,0.45)';for(let i=0;i<7;i++){c.fillRect(-170,-140+i*40,i==6?200:340-((i*53)%80),9);}
    const st=ease((lt-K('stars'))/1.2);
    for(let i=0;i<5;i++){const a=clamp(st*5-i,0,1);if(a<=0)continue;c.save();c.translate(-130+i*65,190);c.scale(0.6+0.4*a,0.6+0.4*a);c.fillStyle=i<4?`rgba(214,150,40,${a})`:`rgba(120,110,95,${a})`;
      c.beginPath();for(let k=0;k<10;k++){const r=k%2?11:26,an=-Math.PI/2+k*Math.PI/5;k?c.lineTo(Math.cos(an)*r,Math.sin(an)*r):c.moveTo(Math.cos(an)*r,Math.sin(an)*r);}c.closePath();c.fill();c.restore();}
    c.restore();
    // лист сценария ложится сверху
    const sc=ease((lt-K('script'))/1.6),tw=ease((lt-K('two'))/1.4);
    if(sc>0){c.save();c.translate(360,lerp(-400,760,sc));c.rotate(lerp(0.2,0.03,sc));
      c.fillStyle='rgba(0,0,0,0.25)';c.fillRect(-200,-250,420,520);
      c.fillStyle='#ece6d6';c.fillRect(-215,-265,420,520);
      c.fillStyle='#2c2620';c.textAlign='center';c.font='700 30px C';c.fillText('сценарий',-5,-170);
      c.font='700 56px C';c.fillText('«Синистер»',-5,-90);
      c.globalAlpha=tw;c.font='700 30px C';c.fillStyle='#4a4036';c.fillText('К. Роберт Каргилл',-5,40);c.fillText('Скотт Дерриксон',-5,90);c.globalAlpha=1;
      c.restore();}
    // катушка на столе — память о сне
    reel(c,560,1100,56,t*0.05,{lit:0.7,fill:0.6});
    fog(c,t,1000,1250,0.06,'200,190,170');vignD(c,0.55);
  },
  film(c,t,lt){
    // ближе к стене: пятно света большое, фигура стоит в луче. На строке 11 по пятну бегут помехи, мелькает кольцо колодца (мост к s10) —
    // и луч плавно гаснет. Изображения на плёнке нет.
    attic(c,t,{hatch:0.6});
    c.fillStyle='rgba(16,34,41,0.55)';c.fillRect(0,0,W,H);
    const nz=ease((lt-K('noise')-0.2)/0.6)*(1-ease((lt-K('cut')+0.2)/0.6)),wl=ease((lt-K('noise')-0.5)/0.4)*(1-ease((lt-K('noise')-1.5)/0.5));
    const on=1-ease((lt-K('cut'))/1.6);
    const R=[150,440,700,480];
    lightRect(c,R,on,t,{nz,well:wl});
    // фигура: в луче, голова медленно склоняется; гаснет вместе со светом, после — едва заметный контур
    figure(c,300,470,700,{a:0.9*on+0.10*(1-on)*(1-ease((lt-K('cut')-1.6)/2.0)),tilt:0.06+0.18*ease(lt/4)});
    const lens=[1120,860];
    beam(c,[[lens[0],lens[1]-30],[R[0]+R[2],R[1]],[R[0],R[1]],[R[0],R[1]+R[3]],[R[0]+R[2],R[1]+R[3]],[lens[0],lens[1]+30]],lens[0],lens[1],R[0]+R[2]/2,R[1]+R[3]/2,on*0.9,t);
    fog(c,t,950,1250,0.12);vignD(c,0.72);
  },
  letter(c,t,lt){
    // снова спальня. Закрытая тетрадка-сценарий на тумбочке. На стене тень — длиннее, чем должна быть. Из щелей люка мерцает: проектор стрекочет.
    const lg=ease((lt-K('long'))/5.0),lk=ease((lt-K('flick2'))/1.2);
    bedroom(c,t,{lamp:0.95+0.03*Math.sin(t*1.7),book:true,leak:lk,shadow:cc=>{
      cc.save();cc.globalCompositeOperation='multiply';figure(cc,520,lerp(440,330,lg),lerp(560,700,lg),{a:0.42,col:'40,62,70',blur:40,tilt:0.12,fade:0.3});cc.restore();}});
    fog(c,t,800,1250,0.08);vignD(c,0.72);
  },
  goodnight(c,t,lt){
    sky(c,t,0);c.fillStyle='rgba(2,14,18,0.45)';c.fillRect(0,0,W,H);
    c.save();const z=1.12-lt*0.006;zoomAt(c,W/2,H/2,z);
    const sl=ease((lt-K('sleep'))/2.5);
    moon(c,540,700,t);owl(c,540,760,1.15,t,clamp(blink(t,0)+sl,0,1),true,{talk:talk(t),sleepy:sl});
    c.restore();
    if(sl>0){c.save();c.font='700 64px C';c.fillStyle='#b8c4cc';for(let i=0;i<3;i++){const p=((t*0.35+i/3)%1);c.globalAlpha=sl*Math.sin(p*Math.PI)*0.6;c.fillText('z',640+p*120+Math.sin(p*9)*15,560-p*260);}c.restore();}
    fog(c,t,1000,1160,0.14);
    // чердачное окно мерцает — проектор ещё работает — и обрывается
    roofs(c,1180,'#050c0f',0.6,1-ease((lt-K('stop'))/0.5),t);
    fog(c,t,1120,1260,0.12);vignD(c,0.72);
  }
};
