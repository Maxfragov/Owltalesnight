# build.py <папка_выпуска> <outdir> [voice.mp3]
# В папке выпуска: scenariy.md (строки «N. текст») и epizod.json:
# {"scenes":[["sky",0],...] (имя сцены, номер первой строки с 0), "keys":{"имя":[строка, сдвиг_с, "start"|"mid"|"end"]}, "pauses":[12 чисел]}
# Без голоса: оценочные тайминги для черновика. С голосом (один файл ElevenLabs целиком):
# находит паузы, раскладывает куски по 13 строкам сценария (DP по длине текста) -> voice.wav + cfg.json
import numpy as np,wave,re,json,sys,subprocess,os
EP=os.path.abspath(sys.argv[1]);E=json.load(open(os.path.join(EP,'epizod.json')))
out=sys.argv[2];os.makedirs(out,exist_ok=True)
lines=[l.split('. ',1)[1] for l in open(os.path.join(EP,'scenariy.md')).read().splitlines() if re.match(r'^\d+\. ',l)]
SR=24000;LEAD=E.get('lead',1.2);TAIL=E.get('tail',4.5);MAXD=E.get('maxDur',61)  # короткие выпуски: lead/tail/maxDur в epizod.json
# сцены: [имя, индекс первой строки]
SCN=[tuple(x) for x in E['scenes']]
def stretch(seg,gaps):
    # растягивает внутренние паузы строки (по порядку) до заданных длин, с
    hh=int(SR*0.02);m=len(seg)//hh;ee=20*np.log10(np.sqrt((seg[:m*hh].reshape(m,hh)**2).mean(1))+1e-6);q=ee<np.percentile(ee,90)-25
    runs=[];j=0
    while j<m:
        if q[j]:
            k=j
            while k<m and q[k]:k+=1
            if (k-j)*hh/SR>0.12 and j>0 and k<m:runs.append((j,k))
            j=k
        else:j+=1
    runs=sorted(sorted(runs,key=lambda r:r[0]-r[1])[:len(gaps)])
    out=[];p=0
    for (a,b),g in zip(runs,gaps):out+= [seg[p:a*hh],np.zeros(int(g*SR))];p=b*hh
    out.append(seg[p:]);return np.concatenate(out)
if len(sys.argv)>3:
    tmp=os.path.join(out,'_in.wav')
    subprocess.run(['ffmpeg','-nostdin','-loglevel','error','-y','-i',sys.argv[3],'-ac','1','-ar',str(SR),tmp],check=True)
    w=wave.open(tmp);x=np.frombuffer(w.readframes(w.getnframes()),'<i2')/32768
    h=int(SR*0.02);n=len(x)//h;e=20*np.log10(np.sqrt((x[:n*h].reshape(n,h)**2).mean(1))+1e-6)
    thr=np.percentile(e,95)-22;sp=e>thr
    # speech segments, merge gaps < 0.35 s
    segs=[];i=0
    while i<n:
        if sp[i]:
            j=i
            while j<n and sp[j]:j+=1
            if segs and (i-segs[-1][1])*h/SR<0.28:segs[-1][1]=j
            else:segs.append([i,j])
            i=j
        else:i+=1
    segs=[s for s in segs if (s[1]-s[0])*h/SR>0.12]
    S=[(a*h/SR,b*h/SR) for a,b in segs];M=len(S);N=len(lines)
    assert M>=N,f'кусков речи {M} меньше строк {N}'
    w_=np.array([len(l) for l in lines],float);
    rate=sum(b-a for a,b in S)/w_.sum()
    INF=1e9;D=np.full((N+1,M+1),INF);P=np.zeros((N+1,M+1),int);D[0,0]=0
    for li in range(1,N+1):
        for m in range(li,M+1):
            for k in range(li-1,m):
                if D[li-1,k]>=INF:continue
                dur=S[m-1][1]-S[k][0];exp=w_[li-1]*rate
                gap=(S[k][0]-S[k-1][1]) if k>0 else 2
                cost=D[li-1,k]+((dur-exp)/exp)**2-0.3*min(gap,2.5)
                if cost<D[li,m]:D[li,m]=cost;P[li,m]=k
    b=[];m=M
    for li in range(N,0,-1):k=P[li,m];b.append((S[k][0],S[m-1][1]));m=k
    b=b[::-1]
    # ElevenLabs v3/v4 может игнорировать <break>: ставим паузы между строками сами, ужимая под maxDur (~61 с)
    PZ=E['pauses']
    speech=sum(e_-s_+0.25 for s_,e_ in b);sc=float(np.clip((MAXD-LEAD-TAIL-speech)/sum(PZ),0.45,1.0))
    parts=[np.zeros(int(LEAD*SR))];T=LEAD;cues=[]
    for i,((s_,e_),l) in enumerate(zip(b,lines)):
        a_=int(max(0,s_-0.08)*SR);z_=int(min(len(x)/SR,e_+0.17)*SR);seg=x[a_:z_].copy()
        if str(i) in E.get('stretch',{}):seg=stretch(seg,E['stretch'][str(i)])
        f=int(0.02*SR);seg[:f]*=np.linspace(0,1,f);seg[-f:]*=np.linspace(1,0,f)
        du=len(seg)/SR;cues.append([round(T,2),round(T+du+0.3,2),l]);parts.append(seg);T+=du
        if i<len(PZ):p=PZ[i]*sc;parts.append(np.zeros(int(p*SR)));T+=p
    parts.append(np.zeros(int(TAIL*SR)));v=np.concatenate(parts);T=len(v)/SR
    print('pause scale',round(sc,2))
    with wave.open(out+'/voice.wav','wb') as ww:ww.setnchannels(1);ww.setsampwidth(2);ww.setframerate(SR);ww.writeframes((np.clip(v,-1,1)*32767).astype('<i2').tobytes())
    hh=SR//30;nn=len(v)//hh;db=20*np.log10(np.sqrt((v[:nn*hh].reshape(nn,hh)**2).mean(1))+1e-6)
    amp=np.convolve(np.clip((db+45)/30,0,1),[0.25,0.5,0.25],'same');amp=[round(float(q),2) for q in amp]
    os.remove(tmp)
else:
    pz=E['pauses']
    T=LEAD;cues=[]
    for i,l in enumerate(lines):
        d=len(l.split())*0.38+0.4+sum(E.get('stretch',{}).get(str(i),[]));cues.append([round(T,2),round(T+d+0.3,2),l]);T+=d+(pz[i] if i<len(pz) else 0)
    T+=TAIL;amp=None
s=[c[0] for c in cues];e=[c[1] for c in cues]
sc=[]
for i,(nm,li) in enumerate(SCN):
    a=0 if i==0 else s[li]-0.8
    bnd=T if i==len(SCN)-1 else s[SCN[i+1][1]]-0.3
    sc.append([nm,round(a,2),round(bnd,2)])
st={n:a for n,a,_ in sc}
scene_of=lambda li:[n for n,f in SCN if f<=li][-1]
k={};ka={}
for nm,(li,off,mode) in E['keys'].items():
    base={'start':s[li],'mid':(s[li]+e[li])/2,'end':e[li]}[mode]
    k[nm]=base+off-st[scene_of(li)];ka[nm]=base+off
cfg={'scenes':sc,'cues':cues,'duration':round(T,2),'k':{a:round(b,2) for a,b in k.items()},'ka':{a:round(b,2) for a,b in ka.items()}}
if amp:cfg['amp']=amp
json.dump(cfg,open(out+'/cfg.json','w'),ensure_ascii=False)
print('duration',round(T,2),cfg['k'])
