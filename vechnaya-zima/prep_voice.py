"""Compress long pauses, speed up voice, remap word timings."""
import json, subprocess, numpy as np, wave
SR=48000; TEMPO=1.15
raw=subprocess.run(["ffmpeg","-v","quiet","-i","voice.mp3","-ac","1","-ar",str(SR),"-f","s16le","-"],capture_output=True,check=True).stdout
x=np.frombuffer(raw,np.int16).astype(np.float32)/32768
W=json.load(open("words.json"))
hop=SR//100
rms=np.sqrt(np.convolve(x**2,np.ones(hop*3)/(hop*3),"same"))[::hop]; db=20*np.log10(rms+1e-9)
sp=db>np.percentile(db,90)-32
# silent runs
runs=[];i=0;n=len(sp)
while i<n:
    if not sp[i]:
        j=i
        while j<n and not sp[j]: j+=1
        runs.append((i/100,j/100)); i=j
    else: i+=1
drama={"Сначала":.6,"А":.55,"Больше":.6}
starts={w[0]:w[2] for w in W}
keep=[];cuts=[]  # cut intervals
for a,b in runs:
    if a==0: cuts.append((0,max(0,b-0.05)));continue
    if b>=n/100-0.01: cuts.append((a+0.3,b));continue
    nxt=[w for w in W if w[0]>=a-0.25]
    lim=0.3
    if nxt and nxt[0][2] in drama and abs(nxt[0][0]-b)<0.6: lim=drama[nxt[0][2]]
    if b-a>lim: cuts.append((a+lim/2,b-lim/2))
def mp(t):
    s=0
    for a,b in cuts:
        if t>=b: s+=b-a
        elif t>a: s+=t-a
    return (t-s)/TEMPO
segs=[];last=0
for a,b in cuts:
    segs.append(x[int(last*SR):int(a*SR)]);last=b
segs.append(x[int(last*SR):])
fade=int(.01*SR)
for s in segs:
    if len(s)>2*fade: s[:fade]*=np.linspace(0,1,fade); s[-fade:]*=np.linspace(1,0,fade)
y=np.concatenate(segs)
with wave.open("voice_cut.wav","wb") as f:
    f.setnchannels(1);f.setsampwidth(2);f.setframerate(SR);f.writeframes((np.clip(y,-1,1)*32767).astype(np.int16).tobytes())
subprocess.run(["ffmpeg","-y","-v","error","-i","voice_cut.wav","-af",f"atempo={TEMPO}","voice_proc.wav"],check=True)
W2=[(round(mp(a),3),round(mp(b),3),w) for a,b,w in W]
json.dump(W2,open("words_proc.json","w"),ensure_ascii=False)
print("cut total",round(sum(b-a for a,b in cuts),2),"new dur",round(len(y)/SR/TEMPO,2))
