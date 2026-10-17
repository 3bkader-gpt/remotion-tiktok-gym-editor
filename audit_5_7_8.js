const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

const videos = [
  { file: '2026_10_06_19_03_16_IMG_7207.MP4', name: 'STANDING MACHINE LATERAL RAISE' },
  { file: '2026_10_06_19_20_02_IMG_7214.MP4', name: 'CABLE STRAIGHT-ARM PULLDOWN' },
  { file: '2026_10_06_19_26_57_IMG_7212.MP4', name: 'KNEELING CABLE CRUNCH' }
];

async function run() {
  const tmpDir = path.resolve('.dead_time_audit');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  for (const v of videos) {
    const videoName = path.parse(v.file).name;
    const outPattern = path.join(tmpDir, `${videoName}_%02d.jpg`);
    const cmd = `npx remotion ffmpeg -y -i "public/${v.file}" -ss 0 -t 20 -r 1 -vf "scale=320:-2" "${outPattern}"`;
    execSync(cmd, { stdio: 'ignore' });
    const frames = fs.readdirSync(tmpDir).filter(f => f.startsWith(videoName)).sort();

    const parts = [{
      text: `Analyze gym video frames for ${v.name}. State the EXACT second where all setup/gripping/waiting ends and the athlete executes the FIRST WORKING REP under load. Return JSON: {"setup_end_second": number, "optimal_start": number, "description": string}`
    }];
    for (const f of frames) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: fs.readFileSync(path.join(tmpDir, f)).toString('base64')
        }
      });
    }

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });
    const j = await res.json();
    if (j.candidates && j.candidates[0]) {
      console.log(`✅ ${v.name}:`, j.candidates[0].content.parts[0].text);
    } else {
      console.log(`⚠️ ${v.name} error:`, j.error ? j.error.message : j);
    }
  }
}
run().catch(console.error);
