"""Generate SFX bed for the timeline. Usage: sfx.py cfg.json out.wav"""
import json, sys
import numpy as np
from scipy import signal

SR = 48000
cfg = json.load(open(sys.argv[1]))
D = cfg["duration"]; N = int(D * SR) + SR
m = cfg["marks"]
rng = np.random.default_rng(1)
L = np.zeros(N); R = np.zeros(N)
t = np.arange(N) / SR

def lp(x, f, o=2): return signal.sosfilt(signal.butter(o, f, "low", fs=SR, output="sos"), x)
def hp(x, f, o=2): return signal.sosfilt(signal.butter(o, f, "high", fs=SR, output="sos"), x)
def bp(x, a, b, o=2): return signal.sosfilt(signal.butter(o, [a, b], "band", fs=SR, output="sos"), x)
def env(a, b, fi=0.5, fo=0.5):
    e = np.clip((t - a) / max(fi, 1e-3), 0, 1) * np.clip((b - t) / max(fo, 1e-3), 0, 1)
    return e * e * (3 - 2 * e)
def add(x, at, gain=1.0, pan=0.0):
    i = int(at * SR); n = min(len(x), N - i)
    if n <= 0: return
    L[i:i+n] += x[:n] * gain * (1 - max(pan, 0)); R[i:i+n] += x[:n] * gain * (1 + min(pan, 0))

# reverb IR
ir_n = int(2.2 * SR); ir = rng.standard_normal(ir_n) * np.exp(-np.arange(ir_n) / SR * 3.2); ir = lp(ir, 3500); ir /= np.abs(ir).sum() ** .5 * 6
def verb(x, wet=.35): return x * (1 - wet) + signal.fftconvolve(x, ir)[:len(x)] * wet * 6

# --- wind: whole piece, gusting, stronger outdoors
w = rng.standard_normal(N)
gust = 0.55 + 0.45 * np.sin(2 * np.pi * 0.07 * t + 1) * np.sin(2 * np.pi * 0.023 * t + 2)
wl = bp(w, 180, 900) * gust; wh = bp(rng.standard_normal(N), 900, 2600) * gust ** 2 * .35
# whistle: resonant narrow band sweeping
wh2 = np.zeros(N)
for f0, ph in ((620, 0), (930, 1.7)):
    sos = signal.butter(2, [f0 * .97, f0 * 1.03], "band", fs=SR, output="sos")
    wh2 += signal.sosfilt(sos, rng.standard_normal(N)) * (0.5 + 0.5 * np.sin(2 * np.pi * .11 * t + ph)) * 2.2
wind = (wl + wh + wh2 * .4)
outdoor = env(m["sea"] - 8.5, m["fire_s"], 1.0, 1.0) + env(m["end"], D + 1, 1.0, 2.0)
indoor = 1 - np.clip(outdoor, 0, 1)
wind_g = 0.10 * outdoor + 0.035 * indoor
L += wind * wind_g; R += np.roll(wind, 2400) * wind_g

# --- drone: low dread, swelling towards the end
drone = np.zeros(N)
for f, a in ((41.2, 1), (41.6, .8), (61.7, .45), (82.4, .25), (123.5, .12)):
    drone += a * np.sin(2 * np.pi * f * t + rng.random() * 6)
swell = 0.35 + 0.65 * np.clip((t - m["fire_e"]) / (m["end"] - m["fire_e"]), 0, 1)
dr = drone * 0.06 * swell * env(0, D, 0.3, 2.5)
# dissonant high tone for the twist
hi = (np.sin(2 * np.pi * 1318.5 * t) + np.sin(2 * np.pi * 1396.9 * t)) * .5
dr += hi * 0.012 * env(m["bolt"], m["end"] + 1.5, 1.5, 2.0)
L += dr; R += dr

# --- knocks: heavy hollow metal hatch
def knock(level=1.0, dist=0.0):
    n = int(.6 * SR); tt = np.arange(n) / SR
    body = (np.sin(2 * np.pi * 72 * tt) * np.exp(-tt * 18) + .6 * np.sin(2 * np.pi * 131 * tt) * np.exp(-tt * 25)
            + .25 * np.sin(2 * np.pi * 347 * tt) * np.exp(-tt * 40))
    click = lp(rng.standard_normal(n), 2500) * np.exp(-tt * 120) * .6
    x = body + click
    x = lp(x, 1800 - 1200 * dist)
    return verb(np.concatenate([x, np.zeros(SR)]), .3 + .4 * dist) * level
for i, k in enumerate(cfg["knocks"]):
    lvl = [1.0] * 3 + [.55] * 6 + [1.1] * 3
    add(knock(lvl[i] if i < len(lvl) else .8, 0.4 if 3 <= i < 9 else 0.0), k, 0.55)

# --- hook impact at start: sub boom + noise riser down
n = int(2.5 * SR); tt = np.arange(n) / SR
boom = np.sin(2 * np.pi * (55 * np.exp(-tt * .6)) * tt) * np.exp(-tt * 2.2) + lp(rng.standard_normal(n), 400) * np.exp(-tt * 4) * .5
add(verb(boom, .3), 0.0, 0.32)

# --- ice cracking (sea)
for j in range(9):
    at = m["sea"] + 0.2 + j * 0.27 + rng.random() * .2
    n = int(.35 * SR); tt = np.arange(n) / SR
    cr = hp(rng.standard_normal(n), 1500) * np.exp(-tt * 30) * (rng.random(n) > .7)
    cr += np.sin(2 * np.pi * (900 + rng.random() * 600) * tt) * np.exp(-tt * 45) * .5
    add(verb(cr, .45), at, .22, pan=rng.uniform(-.6, .6))

# --- radio static + dying beeps (south)
a = m["south"]; n = int(2.6 * SR); tt = np.arange(n) / SR
st = bp(rng.standard_normal(n), 1200, 5000) * (0.6 + .4 * (rng.random(n) > .995)) * np.exp(-tt * .9)
beep = np.sin(2 * np.pi * 1000 * tt) * ((tt % .5) < .12) * np.exp(-tt * .8)
add(st * .08 + beep * .05, a)

# --- fire crackle (library / book; also faint in face scene)
fire = lp(rng.standard_normal(N), 900) * .25
cr = np.zeros(N); pos = rng.integers(0, N, int(D * 14))
for p in pos:
    n = int(SR * .012);
    if p + n < N: cr[p:p+n] += hp(rng.standard_normal(n), 2000) * np.exp(-np.arange(n) / n * 5) * rng.uniform(.3, 1)
fx = (fire + cr) * (0.12 * env(m["fire_s"], m["fire_e"], .4, .6) + 0.05 * env(m["face"], m["end"], .6, .8))
L += fx; R += np.roll(fx, 300)
# whoosh of book catching fire
book_s = [x for x in cfg["tl"] if x["scene"] == "book"][0]["s"]
n = int(1.4 * SR); tt = np.arange(n) / SR
add(bp(rng.standard_normal(n), 200, 2500) * np.sin(np.pi * tt / 1.4) ** 2, book_s - .2, .12)

# --- creak on stairs
st_s = [x for x in cfg["tl"] if x["scene"] == "stairs"][0]["s"]
n = int(1.1 * SR); tt = np.arange(n) / SR
f = 180 + 60 * np.sin(2 * np.pi * 1.3 * tt)
creak = signal.sawtooth(2 * np.pi * np.cumsum(f) / SR) * (rng.random(n) > .6) * np.sin(np.pi * tt / 1.1)
add(verb(lp(creak, 1500), .5), st_s + .3, .05)

# --- bolt: metallic clank
n = int(1.2 * SR); tt = np.arange(n) / SR
clank = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * d) for f, d in ((523, 6), (1187, 9), (2210, 14), (3170, 20))) + hp(rng.standard_normal(n), 3000) * np.exp(-tt * 80)
add(verb(clank, .5), m["bolt"] + .1, .12)

# --- final sting on the last word + silence drop
n = int(4 * SR); tt = np.arange(n) / SR
sting = (np.sin(2 * np.pi * 36 * tt) * np.exp(-tt * .9) + lp(rng.standard_normal(n), 300) * np.exp(-tt * 2) * .6
         + .25 * np.sin(2 * np.pi * 2093 * tt) * np.exp(-tt * 1.2) * np.sin(2 * np.pi * 6 * tt))
add(verb(sting, .5), m["last_word"] + .35, .35)

out = np.stack([L, R], 1)[:int(D * SR)]
fade = np.clip((D - t[:len(out)]) / 1.5, 0, 1); out *= fade[:, None]
out /= np.abs(out).max() / 0.9
import wave
with wave.open(sys.argv[2], "wb") as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR)
    f.writeframes((out * 32767).astype(np.int16).tobytes())
print("ok", D)
