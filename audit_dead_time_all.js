const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config();

let API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY && fs.existsSync('.env')) {
  const match = fs.readFileSync('.env', 'utf-8').match(/GEMINI_API_KEY\s*=\s*(.*)/);
  if (match) API_KEY = match[1].trim();
}

const remaining = [
  { file: '2026_10_06_19_03_16_IMG_7207.MP4', name: 'STANDING MACHINE LATERAL RAISE' },
  { file: '2026_10_06_19_14_25_IMG_7213.MP4', name: 'BARBELL POWER RACK SHRUG' },
  { file: '2026_10_06_19_20_02_IMG_7214.MP4', name: 'CABLE STRAIGHT-ARM PULLDOWN' },
  { file: '2026_10_06_19_26_57_IMG_7212.MP4', name: 'KNEELING CABLE CRUNCH' }
];

async function runRemaining() {
  const tmpDir = path.resolve('.dead_time_audit');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  for (let i = 0; i < remaining.length; i++) {
    const v = remaining[i];
    console.log(`\n======================================================`);
    console.log(`🔍 [${i + 5}/8] Auditing: ${v.name}`);
    console.log(`======================================================`);

    const videoName = path.parse(v.file).name;
    const outPattern = path.join(tmpDir, `${videoName}_%02d.jpg`);
    const cmd = `npx remotion ffmpeg -y -i "public/${v.file}" -ss 0 -t 25 -r 1 -vf "scale=320:-2" "${outPattern}"`;
    execSync(cmd, { stdio: 'ignore' });

    const frameFiles = fs.readdirSync(tmpDir).filter(f => f.startsWith(videoName)).sort();
    console.log(`📸 Extracted ${frameFiles.length} seconds of footage.`);

    const promptText = `Analyze gym video frames for ${v.name}. Identify exact second where setup/gripping/positioning ends and athlete executes FIRST WORKING REP under load. Return strict JSON:
{
  "setup_end_second": number,
  "optimal_6_5s_clip_start": number,
  "optimal_6_5s_clip_end": number,
  "description": string
}`;

    const parts = [{ text: promptText }];
    for (const f of frameFiles) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: fs.readFileSync(path.join(tmpDir, f)).toString('base64')
        }
      });
    }

    // Wait 5 seconds between requests
    await new Promise(r => setTimeout(r, 5000));

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });
    const json = await res.json();
    if (json.candidates && json.candidates[0]) {
      const parsed = JSON.parse(json.candidates[0].content.parts[0].text);
      console.log(`✅ ${v.name} -> Setup ends at: ${parsed.setup_end_second}s | Recommended 6.5s: ${parsed.optimal_6_5s_clip_start}s -> ${parsed.optimal_6_5s_clip_end}s`);
      console.log(`📝 Note: ${parsed.description}`);
    } else {
      console.log('⚠️ Error:', json.error ? json.error.message : json);
    }
  }
}

runRemaining().catch(console.error);
