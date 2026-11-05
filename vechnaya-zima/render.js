// node render.js cfg.json out.mp4 [fps] [--stills t1,t2,...] [--cover cover.jpg]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { spawn } = require('child_process');
(async () => {
  const [cfgPath, out] = process.argv.slice(2);
  const fps = +(process.argv.find(a => /^\d+$/.test(a)) || 30);
  const stillsArg = process.argv.indexOf('--stills');
  const coverArg = process.argv.indexOf('--cover');
  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.join(__dirname, 'render.html'));
  await page.evaluate(() => window.ready);
  await page.evaluate(c => window.setup(c), cfg);
  const grab = async () => Buffer.from((await page.evaluate(() => document.getElementById('c').toDataURL('image/jpeg', 0.93))).split(',')[1], 'base64');
  if (coverArg > 0) {
    await page.evaluate(() => window.cover());
    fs.writeFileSync(process.argv[coverArg + 1], await grab());
  }
  if (stillsArg > 0) {
    for (const t of process.argv[stillsArg + 1].split(',').map(Number)) {
      await page.evaluate(t => window.draw(t), t);
      fs.writeFileSync(`${out}_${t.toFixed(1)}.jpg`, await grab());
    }
  }
  if (out && stillsArg < 0 && coverArg < 0 || process.argv.includes('--video')) {
    const n = Math.ceil(cfg.duration * fps);
    const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = 0; i < n; i++) {
      await page.evaluate(t => window.draw(t), i / fps);
      const buf = await grab();
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 150 === 0) console.log('frame', i, '/', n);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
