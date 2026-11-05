# Колыбельная серии: python3 music.py DUR out.wav [rezhim]
# Режимы: kolybelnaya (по умолчанию, как в 01–05) | zhivo (с 07: бодро, с первой секунды) | zhut — «немного страшная» тема:
#   ре минор, медленно (аккорд 7.2 с), челеста/шкатулка с редкими диссонансами (b2, тритон),
#   низкий гул-дрон D1/D2, длинная тёмная реверберация, без резких атак; пик 0.7, те же фейды.
# Режим: 3-й аргумент или переменная окружения MUZYKA; chernovik.sh/make.sh берут его
#   из поля epizod.json "muzyka": "zhut" (нет поля -> старая колыбельная, побайтно как раньше).
import numpy as np, sys, wave, os
SR=44100; DUR=float(sys.argv[1]) if len(sys.argv)>1 else 64; out=sys.argv[2] if len(sys.argv)>2 else 'bed.wav'
N=int(SR*DUR); t=np.arange(N)/SR; rng=np.random.default_rng(3)
def hz(m): return 440*2**((m-69)/12)
def fft_conv(x,h):
    n=len(x)+len(h); n2=1<<(n-1).bit_length()
    return np.fft.irfft(np.fft.rfft(x,n2)*np.fft.rfft(h,n2),n2)[:len(x)]
def lowpass(x,fc):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR); X*=1/(1+(f/fc)**4); return np.fft.irfft(X,len(x))
MODE=(sys.argv[3] if len(sys.argv)>3 and sys.argv[3] else os.environ.get('MUZYKA','')).strip().lower() or 'kolybelnaya'
if MODE=='zhut':
    # ---------- «немного страшная» тема: ре минор, медленно, челеста/шкатулка + дрон ----------
    rng=np.random.default_rng(13)
    def norm(x): return x/(np.max(np.abs(x))+1e-12)
    # аккорды по 7.2 с: Dm, Bb(add9), Gm6, A7(b9) — мягкая минорная сказка
    chords=[[50,53,57,62],[46,53,58,60],[43,50,55,64],[45,52,55,61]]
    CL=7.2; pad=np.zeros(N)
    for i in range(int(DUR/CL)+1):
        ch=chords[i%4]; st=i*CL; ln=CL+3.5
        a=int(st*SR); b=min(N,int((st+ln)*SR))
        if a>=N: break
        tt=np.arange(b-a)/SR
        env=np.minimum(1,tt/3.0)*np.clip((ln-tt)/3.5,0,1)
        s=np.zeros(b-a)
        for m in ch:
            for d in (-0.18,0.18):
                f=hz(m)*2**(d/12/10); s+=np.sin(2*np.pi*f*tt+rng.uniform(0,6))*0.4
        pad[a:b]+=s*env
    pad=lowpass(pad,600)
    # низкий гул-дрон: D1/D2 + квинта, медленные биения и «дыхание»
    dr=(np.sin(2*np.pi*hz(38)*t)*0.8+np.sin(2*np.pi*hz(38)*1.003*t+1)*0.6+np.sin(2*np.pi*hz(50)*t+2)*0.5
        +np.sin(2*np.pi*hz(57)*0.998*t+0.5)*0.25)
    dr*=0.75+0.25*np.sin(2*np.pi*t/13.0)**2
    dr=lowpass(dr+lowpass(rng.standard_normal(N),120)*0.15,220)
    # шкатулка/челеста: ре минор (натуральный) + редкие «чужие» ноты (b2, тритон)
    scale=[62,64,65,67,69,70,72,74,77]; odd=[63,68,75]
    mel=np.zeros(N); tm=2.5; idx=4
    def tine(f,L):
        tt=np.arange(L)/SR
        env=np.exp(-tt/1.6)*np.minimum(1,tt/0.008)
        return (np.sin(2*np.pi*f*tt)+0.3*np.sin(2*np.pi*2.0*f*tt)*np.exp(-tt/0.5)
                +0.12*np.sin(2*np.pi*2.76*f*tt)*np.exp(-tt/0.25)+0.05*np.sin(2*np.pi*5.4*f*tt)*np.exp(-tt/0.12))*env*(1+0.004*np.sin(2*np.pi*5*tt))
    while tm<DUR-5:
        if rng.uniform()<0.12: m=int(rng.choice(odd))
        else:
            idx=int(np.clip(idx+rng.choice([-2,-1,-1,1,1,2,0,-3]),0,len(scale)-1)); m=scale[idx]
        f=hz(m+12)*2**(rng.uniform(-6,6)/1200); a=int(tm*SR); L=min(N-a,int(5*SR))
        mel[a:a+L]+=tine(f,L)*rng.uniform(0.5,0.9)
        if rng.uniform()<0.15 and a+int(0.35*SR)<N:   # тихий «призрачный» отзвук на полтона выше
            a2=a+int(0.35*SR); L2=min(N-a2,int(4*SR)); mel[a2:a2+L2]+=tine(f*2**(1/12),L2)*0.22
        tm+=rng.choice([2.4,2.4,3.6,1.8,4.8,3.0])
    # длинная тёмная реверберация
    L=int(4.5*SR); ir=rng.standard_normal(L)*np.exp(-np.arange(L)/SR/1.4); ir=lowpass(ir,2500); ir/=np.sqrt((ir**2).sum())
    padv=norm(pad); melv=norm(mel); drv=norm(dr)
    src=melv*0.7+padv*0.3
    wetL=norm(fft_conv(src,ir)); wetR=norm(fft_conv(src,np.roll(ir,457)))
    musL=padv*0.25+melv*0.18+wetL*0.42+drv*0.22; musR=padv*0.25+melv*0.16+wetR*0.42+drv*0.22
    # фон: тихий тёмный «воздух» комнаты вместо моря
    sw=lambda ph,p: 0.6+0.4*np.sin(2*np.pi*t/p+ph)**2
    airL=norm(lowpass(rng.standard_normal(N),400))*sw(0,11.3); airR=norm(lowpass(rng.standard_normal(N),400))*sw(1.7,12.9)
    L_=musL*0.85+airL*0.15; R_=musR*0.85+airR*0.15
    fade=np.minimum(1,t/2.5)*np.clip((DUR-t)/4,0,1)
    st=np.stack([L_*fade,R_*fade],1); st=st/np.max(np.abs(st))*0.7
    with wave.open(out,'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st*32767).astype('<i2').tobytes())
    print('ok',out,'zhut'); sys.exit(0)
if MODE=='zhivo':
    # ---------- «живая» тема для коротких выпусков с хуком (с 07): соль мажор, ~100 уд/мин, маримба + пицикато-бас + шейкер ----------
    # звучит с первой секунды (фейд 0.3 с), без долгого вступления; пик 0.7
    rng=np.random.default_rng(21); BPM=100; B=60/BPM
    def norm(x): return x/(np.max(np.abs(x))+1e-12)
    chords=[[55,59,62,67],[52,55,59,64],[48,52,55,60],[50,54,57,62]]   # G Em C D
    def mar(f,L,dec=0.35):
        tt=np.arange(L)/SR; env=np.exp(-tt/dec)*np.minimum(1,tt/0.003)
        return (np.sin(2*np.pi*f*tt)+0.35*np.sin(2*np.pi*4.0*f*tt)*np.exp(-tt/0.05)+0.15*np.sin(2*np.pi*10*f*tt)*np.exp(-tt/0.015))*env
    mel=np.zeros(N); bass=np.zeros(N); sh=np.zeros(N); pad=np.zeros(N)
    pat=[0,2,1,3,2,1,3,2]   # арпеджио восьмыми
    i=0; tm=0.0
    while tm<DUR:
        bar=int(tm/(4*B)); ch=chords[bar%4]; step=i%8
        a=int(tm*SR); L=min(N-a,int(1.2*SR))
        if L>0:
            m=ch[pat[step]]+12+(12 if (step==4 and bar%2) else 0)
            mel[a:a+L]+=mar(hz(m),L)*(0.9 if step%2==0 else 0.6)*rng.uniform(0.85,1)
            if step in (0,3,4,6):
                Lb=min(N-a,int(0.6*SR)); tb=np.arange(Lb)/SR
                bass[a:a+Lb]+=np.sin(2*np.pi*hz(ch[0]-12)*tb)*np.exp(-tb/0.22)*np.minimum(1,tb/0.004)*(1 if step==0 else 0.7)
            Ls=min(N-a,int(0.08*SR)); sh[a:a+Ls]+=rng.standard_normal(Ls)*np.exp(-np.arange(Ls)/SR/0.02)*(0.6 if step%2 else 1)
        if step==0 and L>0:
            Lp=min(N-a,int(4*B*SR)+int(0.5*SR)); tp=np.arange(Lp)/SR; e=np.minimum(1,tp/0.4)*np.clip((4*B+0.5-tp)/0.5,0,1)
            pad[a:a+Lp]+=sum(np.sin(2*np.pi*hz(m)*tp) for m in ch)*e
        i+=1; tm+=B/2
    pad=lowpass(pad,1200); sh=norm(lowpass(np.diff(np.r_[0,sh]),9000)); 
    L=int(1.2*SR); ir=rng.standard_normal(L)*np.exp(-np.arange(L)/SR/0.35); ir=lowpass(ir,5000); ir/=np.sqrt((ir**2).sum())
    melv=norm(mel); wet=norm(fft_conv(melv,ir))
    musL=melv*0.5+wet*0.25+norm(bass)*0.35+norm(pad)*0.12+sh*0.05
    musR=melv*0.45+norm(fft_conv(melv,np.roll(ir,211)))*0.25+norm(bass)*0.35+norm(pad)*0.12+np.roll(sh,300)*0.05
    fade=np.minimum(1,t/0.3)*np.clip((DUR-t)/2.5,0,1)
    st=np.stack([musL*fade,musR*fade],1); st=st/np.max(np.abs(st))*0.7
    with wave.open(out,'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st*32767).astype('<i2').tobytes())
    print('ok',out,'zhivo'); sys.exit(0)
# chords (midi), 4.8 s each
chords=[[53,57,60,64],[52,55,60,67],[50,57,60,65],[46,53,57,62]]
CL=4.8
pad=np.zeros(N)
for i in range(int(DUR/CL)+1):
    ch=chords[i%4]; st=i*CL; ln=CL+2.5
    a=int(st*SR); b=min(N,int((st+ln)*SR))
    if a>=N: break
    tt=np.arange(b-a)/SR
    env=np.minimum(1,tt/1.8)*np.clip((ln-tt)/2.5,0,1)
    s=np.zeros(b-a)
    for m in ch:
        for d in (-0.12,0.12):
            f=hz(m)*2**(d/12/10); s+=np.sin(2*np.pi*f*tt+rng.uniform(0,6))*0.5
    s+=0.6*np.sin(2*np.pi*hz(ch[0]-12)*tt)
    pad[a:b]+=s*env
pad=lowpass(pad,900)
# music box melody: F major pentatonic
scale=[65,67,69,72,74,77,79,81]
mel=np.zeros(N); tm=1.2; idx=3
while tm<DUR-3:
    idx=int(np.clip(idx+rng.choice([-2,-1,-1,1,1,2,0]),0,len(scale)-1))
    f=hz(scale[idx]); a=int(tm*SR); L=min(N-a,int(3*SR)); tt=np.arange(L)/SR
    env=np.exp(-tt/0.9)*np.minimum(1,tt/0.004)
    s=(np.sin(2*np.pi*f*tt)+0.25*np.sin(2*np.pi*2*f*tt)*np.exp(-tt/0.3)+0.08*np.sin(2*np.pi*3.01*f*tt)*np.exp(-tt/0.15))*env
    mel[a:a+L]+=s*rng.uniform(0.6,1.0)
    tm+=rng.choice([1.2,1.2,2.4,0.6,1.8])
# reverb
L=int(3.0*SR); ir=rng.standard_normal(L)*np.exp(-np.arange(L)/SR/0.9); ir=lowpass(ir,3500); ir/=np.sqrt((ir**2).sum())
def norm(x): return x/np.max(np.abs(x))
padL=norm(pad); melv=norm(mel)
wetL=norm(fft_conv(melv*0.7+padL*0.3,ir)); wetR=norm(fft_conv(melv*0.7+padL*0.3,np.roll(ir,331)))
musL=padL*0.35+melv*0.25+wetL*0.4; musR=padL*0.35+melv*0.22+wetR*0.4
# sea: brown noise with slow swells
def brown(n):
    w=rng.standard_normal(n); b=np.cumsum(w); b-=lowpass(b,0.5) if False else np.convolve(b,np.ones(4410)/4410,'same'); return norm(b)
seaL=lowpass(rng.standard_normal(N),600); seaR=lowpass(rng.standard_normal(N),600)
sw=lambda ph,p: 0.55+0.45*np.sin(2*np.pi*t/p+ph)**2
seaL=norm(seaL)*sw(0,8.3)*0.9+norm(lowpass(rng.standard_normal(N),2500))*0.15*sw(1,8.3)
seaR=norm(seaR)*sw(1.3,9.1)*0.9+norm(lowpass(rng.standard_normal(N),2500))*0.15*sw(2,9.1)
L_=musL*0.75+norm(seaL)*0.25; R_=musR*0.75+norm(seaR)*0.25
fade=np.minimum(1,t/2.5)*np.clip((DUR-t)/4,0,1)
st=np.stack([L_*fade,R_*fade],1); st=st/np.max(np.abs(st))*0.7
with wave.open(out,'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st*32767).astype('<i2').tobytes())
print('ok',out)
