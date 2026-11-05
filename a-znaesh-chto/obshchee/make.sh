#!/bin/bash
# "muzyka" в epizod.json (напр. "zhut") -> 3-й аргумент music.py; нет поля -> колыбельная как раньше
# bash make.sh <папка_выпуска> <voice.mp3> <outdir>  ->  <outdir>/vypusk.mp4
set -e; A=$(cd "$(dirname "$0")" && pwd); EP=$(realpath "$1"); V=$(realpath "$2"); mkdir -p "$3"; cd "$3"
python3 $A/build.py "$EP" . "$V"; DUR=$(python3 -c "import json;print(json.load(open('cfg.json'))['duration'])")
node $A/render.js video.mp4 30 cfg.json "$EP/animatsiya/scene.html" < /dev/null | tail -1
MUZ=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1])).get('muzyka','') or '')" "$EP/epizod.json")
python3 $A/music.py $DUR bed.wav ${MUZ:+"$MUZ"} >/dev/null
python3 $A/ambience.py "$EP" cfg.json amb.wav >/dev/null
ffmpeg -nostdin -loglevel error -y -i amb.wav -af "loudnorm=I=-34:TP=-9,aresample=44100" a2.wav
ffmpeg -nostdin -loglevel error -y -i voice.wav -af "aresample=44100,highpass=f=60,loudnorm=I=-16:TP=-1.5,aresample=44100" -ac 2 v2.wav
ffmpeg -nostdin -loglevel error -y -i bed.wav -af "loudnorm=I=-30:TP=-8,aresample=44100" m2.wav
ffmpeg -nostdin -loglevel error -y -i v2.wav -i m2.wav -i a2.wav -filter_complex "amix=inputs=3:duration=longest:normalize=0,alimiter=limit=0.9" mix.wav
ffmpeg -nostdin -loglevel error -y -i video.mp4 -i mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart vypusk.mp4
echo MADE
