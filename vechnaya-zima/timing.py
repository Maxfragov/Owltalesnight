"""Build timeline config: scenes, subtitles, knocks. Usage: timing.py out.json [voice.wav]"""
import json, sys, re
import numpy as np

SENT = [
 ("Снаружи минус семьдесят.", "hook"),
 ("Там никто не может жить.", "hook"),
 ("Тогда кто каждую ночь стучит в мой люк?", "hook"),
 ("Сначала мы радовались снегу в июле.", "july"),
 ("Дети лепили снеговиков, в новостях шутили про «аномалию».", "kids"),
 ("К сентябрю замёрзло море.", "sea"),
 ("К декабрю замолчал юг.", "south"),
 ("Теперь я живу в подвале библиотеки и жгу по книге в день.", "library"),
 ("Сегодня — энциклопедию. Том «Солнце».", "book"),
 ("Вчера ночью в люк постучали.", "knock"),
 ("Три удара. Пауза. Ещё три.", "knock"),
 ("Я не открыл.", "knock"),
 ("Стук повторяется каждую ночь.", "stairs"),
 ("И каждую ночь — ближе к лестнице.", "stairs"),
 ("А сегодня утром я заметил: люк заперт изнутри.", "bolt"),
 ("И у меня изо рта… больше не идёт пар.", "face"),
]
VOICE_OFFSET = 0.5   # knocks first, then voice
END_CARD = 3.3
SR = 16000

def words_of(s):
    return [w for w in s.replace("—", " ").split() if re.search(r"\w", w)]

def estimate():
    t, out = 0.0, []
    for i, (s, _) in enumerate(SENT):
        d = len(s) / 13.5
        out.append((t, t + d))
        t += d + (0.8 if i in (2, 14) else 0.4)
    return out, t

def load(path):
    import subprocess
    raw = subprocess.run(["ffmpeg", "-v", "quiet", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768

def align(path):
    """Silence-based alignment of known sentences to the recording."""
    x = load(path)
    hop = int(SR * 0.01)
    rms = np.sqrt(np.convolve(x ** 2, np.ones(hop * 3) / (hop * 3), "same"))[::hop]
    db = 20 * np.log10(rms + 1e-9)
    thr = max(np.percentile(db, 15) + 8, np.percentile(db, 90) - 30)
    sp = db > thr
    idx = np.where(sp)[0]
    s0, s1 = idx[0] * 0.01, idx[-1] * 0.01 + 0.01
    # silent runs (candidate boundaries)
    gaps, i, n = [], idx[0], idx[-1]
    while i < n:
        if not sp[i]:
            j = i
            while j < n and not sp[j]:
                j += 1
            if (j - i) >= 12:
                gaps.append((i * 0.01, j * 0.01))
            i = j
        else:
            i += 1
    L = np.array([len(s) for s, _ in SENT], float)
    K = len(SENT) - 1
    # expected boundary times proportional to chars (speech time only)
    total_gap = sum(b - a for a, b in gaps)
    speech = (s1 - s0) - total_gap * 0.6
    cum = np.cumsum(L)[:-1] / L.sum()
    # DP: pick K gaps in order minimizing deviation, reward longer gaps
    G = len(gaps)
    if G < K:
        bounds = [(s0 + c * (s1 - s0),) * 2 for c in cum]
    else:
        mids = np.array([(a + b) / 2 for a, b in gaps])
        lens = np.array([b - a for a, b in gaps])
        exp_t = s0 + cum * (s1 - s0)
        INF = 1e18
        D = np.full((K + 1, G + 1), INF); P = np.zeros((K + 1, G + 1), int)
        D[0, :] = 0
        for k in range(1, K + 1):
            best, barg = INF, -1
            for g in range(1, G + 1):
                if D[k - 1, g - 1] < best:
                    best, barg = D[k - 1, g - 1], g - 1
                cost = ((mids[g - 1] - exp_t[k - 1]) / 1.2) ** 2 - 2.5 * min(lens[g - 1], 1.0)
                if best < INF:
                    D[k, g] = best + cost; P[k, g] = barg
        g = int(np.argmin(D[K, 1:])) + 1
        sel = []
        for k in range(K, 0, -1):
            sel.append(g - 1); g = P[k, g]
        sel = sel[::-1]
        bounds = [gaps[j] for j in sel]
    out, st = [], s0
    for a, b in bounds:
        out.append((st, a)); st = b
    out.append((st, s1))
    return out, len(x) / SR

def build(sent_times, voice_dur, extra_knocks=True, wtimes=None):
    off = VOICE_OFFSET
    subs, word_t, tl = [], [], []
    for (s, scene), (a, b) in zip(SENT, sent_times):
        a += off; b += off
        ws = words_of(s)
        wl = np.array([len(re.sub(r"\W", "", w)) + 1.5 for w in ws], float)
        edges = a + np.concatenate([[0], np.cumsum(wl)]) / wl.sum() * (b - a)
        wt = [{"w": w, "s": float(edges[i]), "e": float(edges[i + 1])} for i, w in enumerate(ws)]
        if wtimes is not None:
            wt = [{"w": w, "s": wtimes[len(word_t)][i][0] + off, "e": wtimes[len(word_t)][i][1] + off} for i, w in enumerate(ws)]
        word_t.append(wt)
        # chunk: up to 3 words / 20 chars, break after punctuation
        ch = []
        for w in wt:
            ch.append(w)
            txt = " ".join(c["w"] for c in ch)
            if len(ch) >= 3 or len(txt) >= 17 or re.search(r"[.,:?!…»]$", w["w"]):
                subs.append({"s": ch[0]["s"], "e": ch[-1]["e"], "words": ch}); ch = []
        if ch:
            subs.append({"s": ch[0]["s"], "e": ch[-1]["e"], "words": ch})
    # extend each chunk to next chunk start (no flicker), max +0.6s
    for i in range(len(subs) - 1):
        subs[i]["e"] = min(subs[i + 1]["s"], subs[i]["e"] + 0.6)
    subs[-1]["e"] += 1.0
    # scenes: start at first sentence's start (scene cut a bit before speech)
    times = [(scene, a + off, b + off) for (s, scene), (a, b) in zip(SENT, sent_times)]
    for scene, a, b in times:
        if tl and tl[-1]["scene"] == scene:
            tl[-1]["e"] = b
        else:
            if tl:
                cut = (tl[-1]["e"] + a) / 2
                tl[-1]["e"] = cut; a = cut
            tl.append({"scene": scene, "s": a, "e": b})
    tl[0]["s"] = 0.0
    end_s = times[-1][2] + 1.1
    tl[-1]["e"] = end_s
    tl.append({"scene": "end", "s": end_s, "e": end_s + END_CARD})
    # knocks
    k = [0.0, 0.17, 0.34]
    w10 = word_t[10]   # "Три удара. Пауза. Ещё три."
    t1 = w10[1]["e"] + 0.05
    k += [t1, t1 + 0.24, t1 + 0.48]
    t2 = w10[-1]["e"] + 0.05
    k += [t2, t2 + 0.24, t2 + 0.48]
    t3 = word_t[13][0]["s"]
    k += [t3, t3 + 0.22, t3 + 0.44]
    marks = {
        "sea": tl[[x["scene"] for x in tl].index("sea")]["s"],
        "south": tl[[x["scene"] for x in tl].index("south")]["s"],
        "fire_s": tl[[x["scene"] for x in tl].index("library")]["s"],
        "fire_e": tl[[x["scene"] for x in tl].index("knock")]["s"],
        "face": tl[[x["scene"] for x in tl].index("face")]["s"],
        "last_word": word_t[15][-1]["s"],
        "bolt": word_t[14][-1]["s"],
        "end": end_s,
    }
    return {"tl": tl, "subs": subs, "knocks": k, "duration": end_s + END_CARD,
            "voice_offset": off, "marks": marks}

if __name__ == "__main__":
    out = sys.argv[1]
    wtimes = None
    if len(sys.argv) > 2 and sys.argv[2].endswith('.json'):
        W = json.load(open(sys.argv[2])); k = 0; wtimes = []; st = []
        for s, _ in SENT:
            n = len(words_of(s)); seg = W[k:k + n]; k += n
            wtimes.append([(a, b) for a, b, _ in seg]); st.append((seg[0][0], seg[-1][1]))
        assert k == len(W), (k, len(W))
        vd = W[-1][1]
    elif len(sys.argv) > 2:
        st, vd = align(sys.argv[2])
    else:
        st, vd = estimate()
    cfg = build(st, vd, wtimes=wtimes)
    json.dump(cfg, open(out, "w"), ensure_ascii=False, indent=1)
    print("duration", round(cfg["duration"], 2))
    for s, (a, b) in zip(SENT, st):
        print(f"{a:6.2f}-{b:6.2f} {s[0]}")
