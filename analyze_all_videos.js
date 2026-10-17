const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read API key from .env
let API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY && fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf-8');
  const match = envContent.match(/GEMINI_API_KEY\s*=\s*(.*)/);
  if (match) API_KEY = match[1].trim();
}

if (!API_KEY) {
  console.error('Error: GEMINI_API_KEY not found in .env');
  process.exit(1);
}

const MODELS = ['gemini-3.7-flash', 'gemini-3.5-flash', 'gemini-flash-latest', 'gemini-3.8-flash'];
const FPS_RATE = 3; // 3 frames per second (1 frame every 0.333s for precise kinematic analysis & peak contraction)

const VIDEO_FILES = [
  "2026_10_06_18_03_56_IMG_7166.MOV",
  "2026_10_06_18_18_14_IMG_7168.MOV",
  "2026_10_06_18_31_18_IMG_7171.MOV",
  "2026_10_06_18_52_38_IMG_7202.MP4",
  "2026_10_06_19_03_16_IMG_7207.MP4",
  "2026_10_06_19_14_25_IMG_7213.MP4",
  "2026_10_06_19_20_02_IMG_7214.MP4",
  "2026_10_06_19_26_57_IMG_7212.MP4"
];

async function callGemini(parts) {
  for (const model of MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });
      const data = await response.json();
      if (data.candidates && data.candidates[0].content) {
        return { data: JSON.parse(data.candidates[0].content.parts[0].text), model };
      } else {
        console.warn(`[${model}] warning:`, data.error ? data.error.message.slice(0, 60) : 'no content');
      }
    } catch (e) {
      console.warn(`[${model}] error:`, e.message);
    }
  }
  return null;
}

async function processVideo(filename, index, total) {
  console.log(`\n======================================================`);
  console.log(`🎬 [${index}/${total}] Analyzing: ${filename}`);
  console.log(`======================================================`);

  const videoPath = path.resolve('public', filename);
  const tempDir = path.resolve('.gemini_frames', path.parse(filename).name);
  if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });

  console.log(`📸 Extracting frames at ${FPS_RATE} FPS (1 frame every ~333ms)...`);
  const outPattern = path.join(tempDir, 'frame_%04d.jpg');
  execSync(`npx remotion ffmpeg -y -i "${videoPath}" -r ${FPS_RATE} -vf "scale=480:-2" "${outPattern}"`, { stdio: 'ignore' });

  const frameFiles = fs.readdirSync(tempDir).filter(f => f.endsWith('.jpg')).sort();
  console.log(`✅ Extracted ${frameFiles.length} frames.`);

  const promptTemplatePath = path.resolve('prompts', 'gemini_biomechanics_analysis_prompt.md');
  let promptText = fs.readFileSync(promptTemplatePath, 'utf-8');
  promptText = promptText.replace(/\$\{filename\}/g, filename);
  promptText += `\n\n### 📹 Current File Data:\n- Video File: ${filename}\n- Total Frames: ${frameFiles.length}\n- Sampling Rate: ${FPS_RATE} FPS (1 frame every ${(1 / FPS_RATE).toFixed(3)}s)\nAnalyze and output the strict JSON matching the schema above:`;

  const parts = [{ text: promptText }];

  for (const frameFile of frameFiles) {
    const base64 = fs.readFileSync(path.join(tempDir, frameFile)).toString('base64');
    parts.push({
      inlineData: { mimeType: 'image/jpeg', data: base64 }
    });
  }

  console.log(`🧠 Uploading to Gemini AI (${frameFiles.length} frames)...`);
  const result = await callGemini(parts);

  // Clean up extracted frames
  fs.rmSync(tempDir, { recursive: true, force: true });

  if (result) {
    const d = result.data;
    console.log(`✅ [${result.model}] Analysis successful!`);
    console.log(`- Exercise: ${d.exercise_details?.name || d.exercise_name}`);
    console.log(`- Muscle: ${d.exercise_details?.primary_muscle || d.targeted_muscle}`);
    if (d.auto_framing) {
      console.log(`- Auto-Framing: Center (${d.auto_framing.focal_center_x_percent}%, ${d.auto_framing.focal_center_y_percent}%) | Drift: ${d.auto_framing.lifter_drift}`);
    }
    const act = d.timeline?.active_workout_set || d.active_workout_set;
    if (act) {
      console.log(`- Active Set: ${act.start_seconds}s ➜ ${act.end_seconds}s (Total Reps: ${act.total_reps_completed ?? act.total_reps})`);
    }
    const rec = d.editing_recommendation || d.recommended_montage_slice;
    if (rec) {
      console.log(`- Recommended Highlight: ${rec.trim_start_seconds ?? rec.start_seconds}s ➜ ${rec.trim_end_seconds ?? rec.end_seconds}s`);
    }
    return result.data;
  } else {
    console.error(`❌ Failed to analyze ${filename}`);
    return null;
  }
}

async function runAll() {
  const fullAnalysis = [];
  for (let i = 0; i < VIDEO_FILES.length; i++) {
    const data = await processVideo(VIDEO_FILES[i], i + 1, VIDEO_FILES.length);
    if (data) fullAnalysis.push(data);
    // Pause briefly between calls to respect RPM
    await new Promise(r => setTimeout(r, 2000));
  }

  const outPath = path.resolve('public', 'full_workout_analysis.json');
  fs.writeFileSync(outPath, JSON.stringify(fullAnalysis, null, 2), 'utf-8');
  console.log(`\n🎉 ALL ${VIDEO_FILES.length} VIDEOS ANALYZED! Full report saved to: ${outPath}`);
}

runAll();
