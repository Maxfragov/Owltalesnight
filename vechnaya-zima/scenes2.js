// Clearer, more literal scenes (override S.*)
const K=mk(),kx=K.getContext('2d');

function tree(g,x,y,s,snowAmt){
  g.fillStyle='#2a1d14';g.fillRect(x-10*s,y-120*s,20*s,120*s);
  const blobs=[[0,-190,85],[-55,-150,60],[55,-150,60],[0,-250,60]];
  for(const[bx,by,r]of blobs){g.fillStyle=mixc([46,92,48],[60,80,66],snowAmt*.6);g.beginPath();g.arc(x+bx*s,y+by*s,r*s,0,6.28);g.fill();}
  if(snowAmt>0){g.fillStyle=`rgba(235,242,250,${clamp(snowAmt*1.2)})`;
    for(const[bx,by,r]of blobs){g.beginPath();g.ellipse(x+bx*s,y+(by-r*.55)*s,r*.85*s,r*.38*s*clamp(snowAmt*1.5),0,Math.PI,2*Math.PI);g.fill();}}
}
S.july=(g,lt,d,t)=>{
  const p=sm(0,d,lt);
  const sky=g.createLinearGradient(0,0,0,H*.62);
  sky.addColorStop(0,mixc([70,125,180],[36,42,50],p));sky.addColorStop(1,mixc([175,200,205],[88,94,102],p));
  g.fillStyle=sky;g.fillRect(0,0,W,H);
  g.save();g.globalAlpha=1-p*.85;const sg=g.createRadialGradient(820,520,0,820,520,240);sg.addColorStop(0,'rgba(255,240,200,.95)');sg.addColorStop(1,'rgba(255,240,200,0)');g.fillStyle=sg;g.fillRect(0,0,W,H);g.restore();
  // ground
  g.fillStyle=mixc([58,100,52],[190,198,206],clamp(p*1.4));g.beginPath();g.moveTo(0,H);for(let x=0;x<=W;x+=20)g.lineTo(x,1180+Math.sin(x/280+1)*30);g.lineTo(W,H);g.fill();
  tree(g,170,1220,1.25,p);tree(g,930,1240,1.05,p);tree(g,560,1170,.75,p);
  // flowers turning dead
  const r=rng(8);for(let i=0;i<40;i++){const fx=r()*W,fy=1260+r()*500;g.fillStyle=mixc([220,190,60],[150,155,165],p);g.beginPath();g.arc(fx,fy,6,0,6.28);g.fill()}
  // tear-off calendar: ИЮЛЬ
  g.save();g.translate(W/2,520);g.rotate(-.03);
  g.fillStyle='rgba(0,0,0,.35)';g.fillRect(-170+10,-200+12,340,400);
  g.fillStyle='#efe9df';g.fillRect(-170,-200,340,400);g.fillStyle='#8f1d1d';g.fillRect(-170,-200,340,95);
  g.fillStyle='#fff';g.font='700 66px Osw';g.textAlign='center';g.fillText('ИЮЛЬ',0,-128);
  g.fillStyle='#1d1d1d';g.font='700 210px Osw';g.fillText('14',0,110);
  g.font='500 40px Osw';g.fillStyle='#555';g.fillText('ВТОРНИК',0,165);
  // snow sticking on calendar top
  g.fillStyle=`rgba(240,245,252,${p})`;g.beginPath();g.ellipse(0,-200,175,22*p,0,Math.PI,2*Math.PI);g.fill();
  g.restore();
  snow(g,t,.15+p*.6,.5,.2,.9);
  g.fillStyle='rgba(10,14,20,.22)';g.fillRect(0,0,W,H);vignette(g,.8);
};
function kidsScene(g,lt,t){
  const sky=g.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#2a3038');sky.addColorStop(.6,'#5b616a');sky.addColorStop(1,'#c8ced6');
  g.fillStyle=sky;g.fillRect(0,0,W,H);
  g.fillStyle='#b9c0c9';g.beginPath();g.moveTo(0,H);for(let x=0;x<=W;x+=20)g.lineTo(x,1250+Math.sin(x/300)*40);g.lineTo(W,H);g.fill();
  tree(g,120,1250,1.1,1);tree(g,960,1270,.9,1);
  // snowman (white, readable) with carrot, hat, scarf
  for(const[x,y,r]of[[560,1200,120],[560,1040,86],[560,925,60]]){const gr=g.createRadialGradient(x-r*.3,y-r*.3,r*.2,x,y,r);gr.addColorStop(0,'#f4f7fb');gr.addColorStop(1,'#9aa5b2');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,6.28);g.fill()}
  g.fillStyle='#111';g.fillRect(515,850,90,14);g.fillRect(530,790,60,62);
  g.fillStyle='#e0702a';g.beginPath();g.moveTo(560,930);g.lineTo(640,942);g.lineTo(560,950);g.fill();
  g.fillStyle='#111';for(const[x,y]of[[540,910],[580,910],[560,1010],[560,1050],[560,1090]]){g.beginPath();g.arc(x,y,7,0,6.28);g.fill()}
  g.fillStyle='#8f1d1d';g.fillRect(505,975,110,22);g.fillRect(585,985,24,70);
  g.strokeStyle='#3a2a1e';g.lineWidth=8;g.beginPath();g.moveTo(480,1030);g.lineTo(380,960);g.moveTo(640,1030);g.lineTo(740,965);g.stroke();
  // kids in winter coats rolling snowball
  const kid=(x,s,ph,col)=>{const b=Math.abs(Math.sin(t*3+ph))*10;g.fillStyle=col;
    g.beginPath();g.moveTo(x-34*s,1250-120*s-b);g.lineTo(x+34*s,1250-120*s-b);g.lineTo(x+46*s,1250-20*s);g.lineTo(x-46*s,1250-20*s);g.fill();
    g.fillStyle='#e6c3a6';g.beginPath();g.arc(x,1250-150*s-b,26*s,0,6.28);g.fill();g.fillStyle=col;g.beginPath();g.arc(x,1250-160*s-b,28*s,Math.PI,2*Math.PI);g.fill();
    g.fillStyle='#111';g.fillRect(x-30*s,1250-20*s,22*s,26*s);g.fillRect(x+8*s,1250-20*s,22*s,26*s)};
  kid(300,1.3,0,'#355e8c');kid(820,1.15,2,'#8c3f35');
  g.fillStyle='#eef2f7';g.beginPath();g.arc(390,1230,40,0,6.28);g.fill();
  snow(g,t,.55,.5,.15,.8);
}
S.kids=(g,lt,d,t)=>{
  const split=d*.42;
  if(lt<split+.5){kidsScene(g,lt,t);g.fillStyle='rgba(10,14,20,.25)';g.fillRect(0,0,W,H);vignette(g,.85)}
  if(lt>split){ // cut to a TV in a dark room showing the news
    const a=sm(split,split+.5,lt);g.save();g.globalAlpha=a;
    g.fillStyle='#07080a';g.fillRect(0,0,W,H);
    kidsScene(kx,lt,t);
    const z=1+(lt-split)*.02;g.translate(W/2,820);g.scale(z,z);g.translate(-W/2,-820);
    // TV body
    g.fillStyle='#1b1a18';g.fillRect(110,430,860,800);g.fillStyle='#2b2926';g.fillRect(130,450,820,760);
    g.save();g.beginPath();g.roundRect(170,490,600,680,40);g.clip();
    g.drawImage(K,0,300,W,1320,170,490,600,680);
    // news overlay inside screen
    g.fillStyle='rgba(140,10,10,.95)';g.fillRect(170,1040,600,62);g.fillStyle='#fff';g.font='700 40px Osw';g.textAlign='left';
    const msg='СНЕГ В ИЮЛЕ: СИНОПТИКИ НАЗВАЛИ «АНОМАЛИЕЙ»  •  ';const mw=g.measureText(msg).width;let x0=170-((lt*160)%mw);for(let i=0;i<3;i++)g.fillText(msg,x0+i*mw,1086);
    g.fillStyle='#0b3d7a';g.fillRect(170,1102,600,46);g.fillStyle='#fff';g.font='500 30px Osw';g.fillText('НОВОСТИ  ·  LIVE',190,1135);
    // scanlines + glare
    g.fillStyle='rgba(0,0,0,.18)';for(let y=490;y<1170;y+=6)g.fillRect(170,y,600,2);
    const gl=g.createLinearGradient(170,490,770,1170);gl.addColorStop(0,'rgba(255,255,255,.12)');gl.addColorStop(.4,'rgba(255,255,255,0)');g.fillStyle=gl;g.fillRect(170,490,600,680);
    g.restore();
    // knobs
    g.fillStyle='#0d0c0b';g.fillRect(800,490,130,680);g.fillStyle='#55504a';for(const y of[580,720]){g.beginPath();g.arc(865,y,40,0,6.28);g.fill()}
    g.fillStyle='#222';for(let y=850;y<1150;y+=22)g.fillRect(820,y,90,10);
    // legs
    g.fillStyle='#14130f';g.fillRect(180,1230,40,140);g.fillRect(860,1230,40,140);
    // screen glow on room
    g.globalCompositeOperation='lighter';const rg=g.createRadialGradient(470,830,100,470,830,900);rg.addColorStop(0,'rgba(80,110,150,.18)');rg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=rg;g.fillRect(0,0,W,H);
    g.restore();vignette(g,.9);
  }
};
// ---- sea: open water with lighthouse & boat, then freezes
const CR2=(()=>{const r=rng(21),a=[];for(let i=0;i<40;i++){let x=r()*W,y=1000+r()*900,ang=r()*6.28,pts=[[x,y]];for(let k=0;k<12;k++){ang+=(r()-.5)*1.2;x+=Math.cos(ang)*50;y+=Math.sin(ang)*20;pts.push([x,y])}a.push({pts,st:r()*.5})}return a})();
S.sea=(g,lt,d,t)=>{
  const p=sm(d*.15,d*.95,lt);const hz=980;
  const sky=g.createLinearGradient(0,0,0,hz);sky.addColorStop(0,'#0b1017');sky.addColorStop(1,'#46505c');g.fillStyle=sky;g.fillRect(0,0,W,hz);
  // lighthouse on rocks (right)
  g.fillStyle='#14181d';g.beginPath();g.moveTo(700,hz+40);g.lineTo(760,hz-60);g.lineTo(900,hz-80);g.lineTo(1080,hz-20);g.lineTo(1080,hz+60);g.fill();
  g.fillStyle='#d9d6cf';g.beginPath();g.moveTo(820,hz-70);g.lineTo(900,hz-70);g.lineTo(885,hz-420);g.lineTo(835,hz-420);g.fill();
  g.fillStyle='#8f1d1d';for(const y of[hz-160,hz-280])g.fillRect(824,y,72,40);
  g.fillStyle='#222';g.fillRect(826,hz-470,68,50);g.beginPath();g.moveTo(820,hz-470);g.lineTo(860,hz-520);g.lineTo(900,hz-470);g.fill();
  const on=1-p; // light dies as sea freezes
  if(on>.05){g.save();g.globalCompositeOperation='lighter';const ang=t*1.4;
    g.fillStyle=`rgba(255,235,170,${.18*on})`;g.beginPath();g.moveTo(860,hz-445);g.lineTo(860+Math.cos(ang)*1400,hz-445+Math.sin(ang)*120-60);g.lineTo(860+Math.cos(ang)*1400,hz-445+Math.sin(ang)*120+60);g.fill();
    const lg=g.createRadialGradient(860,hz-445,0,860,hz-445,60);lg.addColorStop(0,`rgba(255,240,190,${on})`);lg.addColorStop(1,'rgba(255,200,120,0)');g.fillStyle=lg;g.beginPath();g.arc(860,hz-445,60,0,6.28);g.fill();g.restore()}
  // water -> ice
  const sea=g.createLinearGradient(0,hz,0,H);sea.addColorStop(0,mixc([28,44,60],[160,174,188],p));sea.addColorStop(1,mixc([8,16,26],[92,106,122],p));g.fillStyle=sea;g.fillRect(0,hz,W,H-hz);
  const amp=1-p;
  for(let i=0;i<26;i++){const y=hz+12+i*i*1.45;const A=(3+i*.9)*amp;
    g.strokeStyle=`rgba(${lerp(170,230,p)|0},${lerp(200,236,p)|0},${lerp(215,245,p)|0},${.12+.25*amp})`;g.lineWidth=1.5+i*.12;g.beginPath();
    for(let x=0;x<=W;x+=16)g.lineTo(x,y+Math.sin(x/(40+i*6)+t*2.2*amp+i)*A);g.stroke();
    if(amp>.3){g.fillStyle=`rgba(230,240,250,${.25*amp})`;for(let x=(i*53)%90;x<W;x+=180+i*8){const yy=y+Math.sin(x/(40+i*6)+t*2.2*amp+i)*A;g.fillRect(x,yy-2,30+i,2)}}}
  // fishing boat, rocking then stuck & tilted
  const bx=360,by=hz+250,rock=Math.sin(t*1.6)*.08*amp+(-.12)*p,bob=Math.sin(t*1.6+1)*10*amp;
  g.save();g.translate(bx,by+bob);g.rotate(rock);
  g.fillStyle='#2b1f18';g.beginPath();g.moveTo(-170,-30);g.lineTo(170,-30);g.lineTo(120,40);g.lineTo(-130,40);g.fill();
  g.fillStyle='#6b2a1f';g.fillRect(-170,-40,340,14);
  g.fillStyle='#3a3f45';g.fillRect(-40,-120,90,90);g.fillStyle='#9fb7c9';g.fillRect(-25,-105,25,25);
  g.strokeStyle='#22262a';g.lineWidth=7;g.beginPath();g.moveTo(80,-30);g.lineTo(80,-260);g.stroke();
  g.fillStyle=`rgba(235,242,250,${p})`;g.fillRect(-172,-46,344,8*p);g.fillRect(-42,-124,94,8*p);
  g.restore();
  // ice rim around boat
  if(p>.3){g.fillStyle=`rgba(210,222,235,${(p-.3)*1.2})`;g.beginPath();g.ellipse(bx,by+40,230,40,0,0,6.28);g.fill()}
  g.strokeStyle='rgba(30,40,52,.7)';g.lineWidth=2.5;
  for(const c of CR2){const q=clamp((p-c.st-.2)/.35);if(q<=0)continue;const n=Math.floor(q*(c.pts.length-1));g.beginPath();g.moveTo(...c.pts[0]);for(let i=1;i<=n;i++)g.lineTo(...c.pts[i]);g.stroke()}
  snow(g,t,.35,.7,.6,.7);
  label(g,'СЕНТЯБРЬ',sm(0,.6,lt));
  g.fillStyle='rgba(5,8,12,.2)';g.fillRect(0,0,W,H);vignette(g,.85);
};
// ---- south: radio receiver losing signal from the south
S.south=(g,lt,d,t)=>{
  const p=sm(.05,d*.8,lt);
  g.fillStyle='#08090b';g.fillRect(0,0,W,H);
  // window with snow, cold light
  g.fillStyle='#1a2330';g.fillRect(620,180,360,460);g.save();g.beginPath();g.rect(620,180,360,460);g.clip();snow(g,t,.5,.9,1.2,.7);g.restore();
  g.strokeStyle='#050607';g.lineWidth=16;g.strokeRect(620,180,360,460);g.beginPath();g.moveTo(800,180);g.lineTo(800,640);g.moveTo(620,410);g.lineTo(980,410);g.stroke();
  g.save();g.globalAlpha=.6;g.drawImage(F,620,180,360,460);g.restore();
  // desk
  g.fillStyle='#16110d';g.fillRect(0,1350,W,H);
  // map pinned on wall with south marked
  g.fillStyle='#c9bfa8';g.fillRect(90,240,460,380);g.strokeStyle='#6d6553';g.lineWidth=3;
  g.beginPath();g.moveTo(130,300);g.bezierCurveTo(250,280,330,360,420,330);g.bezierCurveTo(500,420,430,520,480,590);g.moveTo(130,300);g.bezierCurveTo(160,420,120,500,200,590);g.stroke();
  g.fillStyle='#8f1d1d';g.font='700 34px Osw';g.textAlign='center';g.fillText('ЮГ',320,580);
  g.beginPath();g.moveTo(320,500);g.lineTo(306,530);g.lineTo(334,530);g.fill();g.fillRect(316,440,8,62);
  g.strokeStyle='#8f1d1d';g.lineWidth=5;g.beginPath();g.moveTo(240,470);g.lineTo(280,510);g.moveTo(280,470);g.lineTo(240,510);g.stroke();
  // radio
  const rx=140,ry=820,rw=800,rh=520;
  g.fillStyle='#3b2a1d';g.fillRect(rx,ry,rw,rh);g.fillStyle='#4e3826';g.fillRect(rx+20,ry+20,rw-40,rh-40);
  // speaker grille
  g.fillStyle='#1d1610';g.beginPath();g.arc(rx+200,ry+260,150,0,6.28);g.fill();g.strokeStyle='#5a4532';g.lineWidth=4;for(let i=-130;i<=130;i+=22){g.beginPath();g.moveTo(rx+200+i,ry+260-Math.sqrt(150*150-i*i)+8);g.lineTo(rx+200+i,ry+260+Math.sqrt(150*150-i*i)-8);g.stroke()}
  // dial
  const dx=rx+400,dy=ry+90,dw=340,dh=160;const glow=.55+.45*(1-p)*(.8+.2*noise1(t*10));
  g.fillStyle=`rgb(${60+120*glow|0},${45+90*glow|0},${20+40*glow|0})`;g.fillRect(dx,dy,dw,dh);
  g.fillStyle='#2a1c10';g.font='500 24px Osw';for(let i=0;i<7;i++){const x=dx+30+i*47;g.fillRect(x,dy+20,3,30);g.fillText(String(4+i),x-6,dy+80)}
  g.fillText('МГц',dx+dw-40,dy+140);
  const nx=dx+60+((Math.sin(t*.9)*.5+.5)*220)*(.3+.7*p);g.fillStyle='#b01818';g.fillRect(nx,dy+10,4,dh-20);
  // signal meter
  g.fillStyle='#120c08';g.fillRect(dx,dy+190,dw,70);const lev=(1-p)*(.6+.4*noise1(t*7));
  for(let i=0;i<10;i++){g.fillStyle=i/10<lev?(i<6?'#6fbf4a':i<8?'#d9b23a':'#d84a3a'):'#2a2018';g.fillRect(dx+12+i*32,dy+204,24,42)}
  // knobs
  g.fillStyle='#1a120c';for(const x of[dx+60,dx+280]){g.beginPath();g.arc(x,dy+340,46,0,6.28);g.fill()}
  // НЕТ СИГНАЛА
  if(p>.75&&Math.floor(t*2.5)%2===0){g.fillStyle='#ff5a4a';g.font='700 58px Osw';g.textAlign='center';g.shadowColor='#ff3020';g.shadowBlur=25;g.fillText('НЕТ СИГНАЛА',W/2,ry-40);g.shadowBlur=0}
  // lamp light
  g.save();g.globalCompositeOperation='lighter';const lg=g.createRadialGradient(dx+170,dy+80,0,dx+170,dy+80,700);lg.addColorStop(0,`rgba(255,170,80,${.22*glow})`);lg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=lg;g.fillRect(0,0,W,H);g.restore();
  label(g,'ДЕКАБРЬ',sm(0,.6,lt),120);vignette(g,.9);
};
// ---- library: add plaque + book pile, keep base
const _lib=S.library;
S.library=(g,lt,d,t)=>{
  _lib(g,lt,d,t);
  const z=1+lt*.025;g.save();g.translate(W/2,H*.65);g.scale(z,z);g.translate(-W/2,-H*.65);
  // brass plaque
  g.fillStyle='#3a2b14';g.fillRect(250,330,580,110);g.strokeStyle='#8a6a2e';g.lineWidth=4;g.strokeRect(262,342,556,86);
  g.fillStyle='#b8924a';g.font='700 52px Cor';g.textAlign='center';g.fillText('БИБЛИОТЕКА',W/2,404);
  // pile of books by the barrel
  const r=rng(4);for(let i=0;i<9;i++){const w=150+r()*60,h=26+r()*10;g.fillStyle=`rgb(${60+r()*50|0},${25+r()*30|0},${20+r()*20|0})`;g.save();g.translate(800+(r()-.5)*20,1700-i*30);g.rotate((r()-.5)*.15);g.fillRect(-w/2,-h,w,h);g.fillStyle='rgba(220,190,120,.35)';g.fillRect(-w/2+10,-h+8,w-20,3);g.restore()}
  g.restore();
  const fl=.85+.15*noise1(t*6);g.save();g.globalCompositeOperation='lighter';const gg=g.createRadialGradient(540,1440,0,540,1440,500);gg.addColorStop(0,`rgba(255,120,40,${.12*fl})`);gg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gg;g.fillRect(0,0,W,H);g.restore();
};
// ---- stairs: frosty footprints descending
const _st=S.stairs;
S.stairs=(g,lt,d,t)=>{
  _st(g,lt,d,t);const p=sm(0,d,lt);const n=13,vy=260;
  const steps=Math.floor(p*9)+1;
  for(let i=0;i<steps;i++){const a=(i+.5)/n,f=Math.pow(a,1.6);const y=lerp(vy,H,f);const w=lerp(140,1150,f);const s=.25+f*1.4;
    const x=W/2+(i%2?1:-1)*w*.12;g.save();g.translate(x,y+10*s);g.globalAlpha=.85*clamp((p*9-i));
    g.fillStyle='#e8f2ff';g.shadowColor='rgba(160,210,255,.9)';g.shadowBlur=12;
    g.beginPath();g.ellipse(0,0,14*s,26*s,0,0,6.28);g.fill();g.beginPath();g.ellipse(0,34*s,11*s,13*s,0,0,6.28);g.fill();g.restore()}
};
// ---- hook: add ladder under the hatch so it reads as a hatch
const _hook=S.hook;
S.hook=(g,lt,d,t)=>{
  _hook(g,lt,d,t);
  const k=knockEnv(t);g.save();g.translate(noise1(t*40)*k*14,noise1(t*40+9)*k*14);
  g.strokeStyle='#2a2f35';g.lineWidth=18;g.beginPath();g.moveTo(400,830);g.lineTo(300,H);g.moveTo(680,830);g.lineTo(780,H);g.stroke();
  g.lineWidth=12;for(let i=0;i<8;i++){const f=i/8,y=lerp(850,H,Math.pow(f,1.2));const xl=lerp(400,300,(y-830)/(H-830)),xr=lerp(680,780,(y-830)/(H-830));if(y>1000&&y<1250)continue;g.beginPath();g.moveTo(xl,y);g.lineTo(xr,y);g.stroke()}
  g.restore();
  // re-draw the −70° over the ladder
  const a=sm(.2,1.0,lt);if(a>0){g.save();g.globalAlpha=a;g.textAlign='center';g.font='700 230px Osw';g.shadowColor='rgba(120,180,255,.8)';g.shadowBlur=50;g.fillStyle='#dcecff';g.fillText('−70°',W/2,1130+noise1(t*20)*3);g.restore()}
  vignette(g,.5);
};
