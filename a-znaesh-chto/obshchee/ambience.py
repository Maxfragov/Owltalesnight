# Звукорежиссёр серии: фоновые звуки под тему выпуска.
# python3 ambience.py <папка_выпуска> <cfg.json> <out.wav>
# В epizod.json:
#  "zvuk": {"имя_сцены": ["слой", ...]}            слои: noch, volny, pod_vodoy, puzyri, veter, listya, nora, sneg
#  "sfx":  [{"tip":..., "scene":..., ...}]            события, привязанные к ключам анимации (k из cfg.json, время внутри сцены)
#     tip: serdce | shchelchki | fontan | zvon | shurh | puzyrki
#     "at": ключ или число (с от начала сцены); "times": [ключи/числа]; "every": период; "until": ключ/число (иначе конец сцены)
#     для serdce можно "bpm":[нач, кон], "switch": ключ, "ramp": с — темп меняется как в анимации
#     "gain": громкость события (1 по умолчанию); "shift": сдвиг всех моментов, с
# Арка «немного страшных» выпусков (всё тихое, без резких атак):
#  новые слои: dozhd (дождь за окном), gul (низкий дрон ~41 Гц), chasy (тиканье, 1 с, тик/так),
#              skvoznyak (свист ветра в щели, 700–950 Гц, порывами), kapli (редкие капли с эхом пустой комнаты)
#  новые sfx:  skrip (скрип двери/половицы, 1.5 с), stuk (три тихих стука, ~1 с), shepot (шорох-шёпот, 2.6 с, не речь),
#              grom (далёкий мягкий гром, 6 с), shkatulka (завод + 2–3 ноты шкатулки, 3.6 с),
#              pomehi (шипение плёнки/помех, 2.5 с), plenka (треск проектора 24 к/с, 3.2 с)
#  музыка: "muzyka": "zhut" в epizod.json -> минорная тема music.py (нет поля -> обычная колыбельная)
import numpy as np, sys, json, wave, os
SR=44100
EP=sys.argv[1];CFG=json.load(open(sys.argv[2]));OUT=sys.argv[3]
E=json.load(open(os.path.join(EP,'epizod.json')))
DUR=CFG['duration'];N=int(DUR*SR);rng=np.random.default_rng(11)
SC={n:(a,b) for n,a,b in CFG['scenes']};K=CFG.get('k',{})
def lp(x,fc,o=2):
    X=np.fft.rfft(x);f=np.fft.rfftfreq(len(x),1/SR);X/=np.sqrt(1+(f/fc)**(2*o));return np.fft.irfft(X,len(x))
def hp(x,fc,o=2):
    X=np.fft.rfft(x);f=np.fft.rfftfreq(len(x),1/SR)+1e-9;X/=np.sqrt(1+(fc/f)**(2*o));return np.fft.irfft(X,len(x))
def norm(x,r=0.1):
    q=np.sqrt(np.mean(x**2))+1e-9;return x*r/q
def slow(n,period,depth=0.6,ph=0.0):
    tt=np.arange(n)/SR;return 1-depth*0.5*(1+np.sin(2*np.pi*tt/period+ph))
def brown(n):
    w=np.cumsum(rng.standard_normal(n));w-=np.convolve(w,np.ones(SR)/SR,'same');return w
# ---------- layers (each returns full-length signal) ----------
def L_noch(n):return norm(lp(rng.standard_normal(n),350)*slow(n,9,0.5),0.03)
def L_volny(n):
    x=lp(rng.standard_normal(n),700)*slow(n,7.3,0.9)*slow(n,11.1,0.4,1)
    return norm(x,0.07)
def L_pod_vodoy(n):return norm(lp(brown(n),160,3)*slow(n,6,0.3),0.08)
def blip(f0,L=0.06):
    tt=np.arange(int(L*SR))/SR;f=f0*(1+tt/L*1.4);return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt/(L*0.35))*np.minimum(1,tt/0.002)
def L_puzyri(n,rate=2.5):
    x=np.zeros(n);t=0.3
    while t<n/SR-0.2:
        b=blip(rng.uniform(500,1300),rng.uniform(0.03,0.08))*rng.uniform(0.4,1);a=int(t*SR);x[a:a+len(b)]+=b[:n-a];t+=rng.exponential(1/rate)
    return norm(x,0.04)
def L_veter(n):return norm(lp(hp(rng.standard_normal(n),200),900)*slow(n,8.5,0.8)*slow(n,3.1,0.3),0.05)
def L_listya(n):
    x=hp(rng.standard_normal(n),1800)*slow(n,2.3,0.9)*slow(n,7,0.6);return norm(lp(x,6000),0.025)
def L_nora(n):return norm(lp(brown(n),110,3),0.06)
def L_sneg(n):return norm(lp(hp(rng.standard_normal(n),3000),8000)*slow(n,5,0.5),0.012)
# --- «немного страшные» слои (арка ужасов): всё тихо, без резких атак ---
def env_ad(L,att,rel):
    tt=np.arange(L)/SR;return np.minimum(1,tt/att)*np.clip((L/SR-tt)/rel,0,1)
def drops(n,rate,fmin,fmax,dec=0.05):
    x=np.zeros(n);t=0.2+rng.uniform(0,1/rate)
    while t<n/SR-0.3:
        L=int(rng.uniform(0.04,0.09)*SR);tt=np.arange(L)/SR;f0=rng.uniform(fmin,fmax);f=f0*(1+0.8*tt/(L/SR))
        b=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt/dec)*np.minimum(1,tt/0.004)
        a=int(t*SR);x[a:a+L]+=b[:n-a]*rng.uniform(0.3,1);t+=rng.exponential(1/rate)
    return x
def L_dozhd(n):
    x=lp(hp(rng.standard_normal(n),700),5000)*slow(n,13,0.35)*slow(n,4.7,0.15,2)
    return norm(x,0.022)+norm(lp(drops(n,9,1200,2600,0.02),5000),0.004)
def L_gul(n):
    tt=np.arange(n)/SR
    x=np.sin(2*np.pi*41.2*tt)+0.7*np.sin(2*np.pi*41.5*tt+1)+0.35*np.sin(2*np.pi*61.8*tt+2)
    x=x*slow(n,11,0.4)+lp(rng.standard_normal(n),90,3)*6
    return norm(lp(x,160,3),0.05)
def L_chasy(n,per=1.0):
    x=np.zeros(n);L=int(0.06*SR);tt=np.arange(L)/SR;k=0;t=0.4
    while t<n/SR-0.1:
        f=2300 if k%2==0 else 1900
        c=(np.sin(2*np.pi*f*tt)*0.6+hp(rng.standard_normal(L),1500)*0.4)*np.exp(-tt/0.008)*np.minimum(1,tt/0.0015)
        a=int(t*SR);x[a:a+L]+=c[:n-a]*(1 if k%2==0 else 0.8);t+=per;k+=1
    return norm(lp(x,4000),0.006)
def L_skvoznyak(n):
    tt=np.arange(n)/SR;gust=slow(n,9.7,0.85)*slow(n,4.3,0.4,1)
    f=820+120*np.sin(2*np.pi*tt/6.1)+40*np.sin(2*np.pi*tt/1.7+1)
    s=np.sin(2*np.pi*np.cumsum(f)/SR)+0.4*np.sin(2*np.pi*np.cumsum(f*1.5)/SR+1)
    ns=lp(hp(rng.standard_normal(n),500),1500)
    return norm(s*gust**2*0.5+ns*gust,0.016)
def L_kapli(n):
    x=drops(n,0.45,700,1500,0.04);L=int(1.4*SR);ir=rng.standard_normal(L)*np.exp(-np.arange(L)/SR/0.35);ir/=np.sqrt((ir**2).sum())
    m=len(x)+L;m2=1<<(m-1).bit_length();wet=np.fft.irfft(np.fft.rfft(x,m2)*np.fft.rfft(ir,m2),m2)[:n]
    return norm(lp(x*0.6+wet*0.5,5000),0.012)
LAY={k[2:]:v for k,v in globals().items() if k.startswith('L_')}
# ---------- events ----------
def ev_serdce(g=1):
    tt=np.arange(int(0.5*SR))/SR
    th=lambda d,f,a:np.where(tt>=d,np.sin(2*np.pi*f*(tt-d))*np.exp(-(tt-d)/0.07)*a,0)
    return (th(0,55,1)+th(0.17,48,0.6))*g
def ev_shchelchok(g=1):
    L=int(0.25*SR);x=np.zeros(L);c=hp(rng.standard_normal(int(0.004*SR)),1500)*np.hanning(int(0.004*SR))
    for d,a in [(0,1),(0.045,0.35),(0.11,0.15)]:i=int(d*SR);x[i:i+len(c)]+=c*a
    return lp(x,5000)*g*0.6
def ev_fontan(g=1):
    L=int(1.6*SR);tt=np.arange(L)/SR;x=lp(hp(rng.standard_normal(L),600),3500)*np.minimum(1,tt/0.08)*np.exp(-tt/0.6);return x*g*0.35
def ev_zvon(g=1):
    L=int(2.5*SR);tt=np.arange(L)/SR;x=np.zeros(L)
    for f in rng.choice([1568,1760,2093,2349,2637],3,replace=False):
        d=int(rng.uniform(0,0.4)*SR);s=np.sin(2*np.pi*f*tt[:L-d])*np.exp(-tt[:L-d]/0.8)*np.minimum(1,tt[:L-d]/0.003);x[d:]+=s*0.3
    return x*g*0.12
def ev_shurh(g=1):
    L=int(0.9*SR);tt=np.arange(L)/SR;return hp(rng.standard_normal(L),1500)*np.sin(np.pi*tt/0.9)**2*g*0.05
def ev_puzyrki(g=1):
    L=int(1.2*SR);x=np.zeros(L)
    for i in range(7):b=blip(rng.uniform(600,1400));a=int(rng.uniform(0,1.0)*SR);x[a:a+len(b)]+=b[:L-a]*0.5
    return x*g*0.08
# --- «немного страшные» события: мягкие атаки (>=5 мс), тихо ---
def ev_skrip(g=1):
    L=int(1.5*SR);tt=np.arange(L)/SR
    rate=45+35*np.sin(np.pi*tt/1.5)+lp(rng.standard_normal(L),8)*40
    ph=np.cumsum(np.clip(rate,15,120))/SR;p=np.sin(np.pi*ph)**24
    x=lp(hp(p+0.05*rng.standard_normal(L),500),2600)*np.sin(np.pi*tt/1.5)**2
    return x/(np.max(np.abs(x))+1e-9)*g*0.07
def ev_stuk(g=1):
    L=int(1.3*SR);x=np.zeros(L);M=int(0.25*SR);tt=np.arange(M)/SR
    for d,a in [(0,1),(0.36,0.85),(0.72,0.7)]:
        k=(np.sin(2*np.pi*95*tt)+0.5*np.sin(2*np.pi*170*tt)+0.3*lp(rng.standard_normal(M),400))*np.exp(-tt/0.045)*np.minimum(1,tt/0.006)
        i=int(d*SR);x[i:i+M]+=k*a
    x=lp(x,900);return x/(np.max(np.abs(x))+1e-9)*g*0.1
def ev_shepot(g=1):
    L=int(2.6*SR);tt=np.arange(L)/SR
    syl=np.clip(lp(rng.standard_normal(L),5),0,None);syl=syl/(np.max(syl)+1e-9)
    x=lp(hp(rng.standard_normal(L),1800),6000)*(0.25+syl)+0.4*lp(hp(rng.standard_normal(L),900),2200)*syl
    x*=np.sin(np.pi*tt/2.6)**2;return x/(np.max(np.abs(x))+1e-9)*g*0.08
def ev_grom(g=1):
    L=int(6*SR);tt=np.arange(L)/SR;b=np.cumsum(rng.standard_normal(L));b=hp(b,20)
    e=np.zeros(L)
    for d,a in [(0,1),(0.7,0.7),(1.6,0.5),(2.5,0.3)]:e+=a*np.where(tt>=d,np.minimum(1,(tt-d)/0.5)*np.exp(-np.clip(tt-d,0,None)/1.2),0)
    x=lp(b,140,3)*e*np.clip((6-tt)/1.5,0,1);return x/(np.max(np.abs(x))+1e-9)*g*0.12
def ev_shkatulka(g=1):
    L=int(3.6*SR);tt=np.arange(L)/SR;x=np.zeros(L);C=int(0.012*SR);tc=np.arange(C)/SR
    for i in range(5):
        c=hp(rng.standard_normal(C),2000)*np.hanning(C);a=int(i*0.09*SR);x[a:a+C]+=c*0.08
    for d,m in [(0.7,74),(1.3,77),(2.0,73)][:int(rng.integers(2,4))]:
        f=440*2**((m+12-69)/12);a=int(d*SR);u=tt[:L-a]
        s=(np.sin(2*np.pi*f*u)+0.3*np.sin(2*np.pi*2*f*u)*np.exp(-u/0.4)+0.1*np.sin(2*np.pi*2.76*f*u)*np.exp(-u/0.2))*np.exp(-u/1.1)*np.minimum(1,u/0.006)
        x[a:]+=s*0.5
    x=lp(x,7000);return x/(np.max(np.abs(x))+1e-9)*g*0.1
def ev_pomehi(g=1):
    L=int(2.5*SR);x=lp(hp(rng.standard_normal(L),2500),9000)*(0.7+0.3*slow(L,0.37,0.6))
    for i in range(int(rng.integers(4,9))):
        C=int(0.003*SR);a=int(rng.uniform(0.1,2.3)*SR);x[a:a+C]+=hp(rng.standard_normal(C),3000)*np.hanning(C)*1.5
    x=lp(x,7000)*env_ad(L,0.35,0.6);return x/(np.max(np.abs(x))+1e-9)*g*0.055
def ev_plenka(g=1):
    L=int(3.2*SR);tt=np.arange(L)/SR;x=np.zeros(L);C=int(0.004*SR);c=np.hanning(C)
    t=0.0
    while t<3.15:a=int(t*SR);x[a:a+C]+=hp(rng.standard_normal(C),1200)*c*rng.uniform(0.25,0.45);t+=1/24
    for i in range(int(rng.integers(3,7))):
        a=int(rng.uniform(0.1,3.0)*SR);x[a:a+C]+=hp(rng.standard_normal(C),2500)*c
    x=lp(x,3500)+0.15*lp(rng.standard_normal(L),300)*np.sin(2*np.pi*48*tt)
    x*=env_ad(L,0.4,0.8);return x/(np.max(np.abs(x))+1e-9)*g*0.08
EV={'serdce':ev_serdce,'shchelchki':ev_shchelchok,'fontan':ev_fontan,'zvon':ev_zvon,'shurh':ev_shurh,'puzyrki':ev_puzyrki,
    'skrip':ev_skrip,'stuk':ev_stuk,'shepot':ev_shepot,'grom':ev_grom,'shkatulka':ev_shkatulka,'pomehi':ev_pomehi,'plenka':ev_plenka}
# ---------- build ----------
SH=0
def tloc(scene,v):return (v if isinstance(v,(int,float)) else K.get(v,99))+SH
mix=np.zeros(N)
fade=int(0.8*SR)
for scn,layers in E.get('zvuk',{}).items():
    if scn not in SC:continue
    a,b=SC[scn];ia,ib=int(a*SR),min(N,int(b*SR))
    env=np.zeros(N);env[ia:ib]=1;r=np.linspace(0,1,fade)
    env[ia:ia+fade]*=r[:len(env[ia:ia+fade])];e2=env[max(ia,ib-fade):ib];e2*=r[::-1][-len(e2):]
    for l in layers:mix+=LAY[l](N)*env
def place(sig,t):
    i=int(t*SR)
    if i<0 or i>=N:return
    mix[i:i+len(sig)]+=sig[:N-i]
for s in E.get('sfx',[]):
    SH=0;a,b=SC[s['scene']];g=s.get('gain',1);end=a+tloc(s['scene'],s['until']) if 'until' in s else b
    f=EV[s['tip']];SH=s.get('shift',0)
    if 'times' in s:
        for v in s['times']:place(f(g),a+tloc(s['scene'],v))
        t=a+tloc(s['scene'],s['times'][-1])
        if 'every' in s:
            t+=s['every']
            while t<end:place(f(g),t);t+=s['every']
    elif 'bpm' in s:
        t=a+tloc(s['scene'],s['at']);sw=a+tloc(s['scene'],s['switch']);rp=s.get('ramp',1.5);b0,b1=s['bpm']
        while t<end:
            place(f(g),t);u=np.clip((t-sw)/rp,0,1);u=u*u*(3-2*u);t+=60/(b0+(b1-b0)*u)
    else:
        t=a+tloc(s['scene'],s['at'])
        while t<end:
            place(f(g),t)
            if 'every' not in s:break
            t+=s['every']
mix=lp(mix,9000)
fi=int(1.0*SR);mix[:fi]*=np.linspace(0,1,fi);mix[-int(2*SR):]*=np.linspace(1,0,int(2*SR))
mix=mix/(np.max(np.abs(mix))+1e-9)*0.7
st=np.stack([mix,np.roll(mix,int(0.011*SR))],1)
with wave.open(OUT,'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((st*32767).astype('<i2').tobytes())
print('ambience',OUT,round(DUR,1))
