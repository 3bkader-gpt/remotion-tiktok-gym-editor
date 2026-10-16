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

const MODELS = ['gemini-3.5-flash', 'gemini-3.7-flash', 'gemini-flash-latest', 'gemini-3.8-flash'];
const FPS_RATE = 2; // 2 frames per second (1 frame every 0.5s for peak & stretch detection)

const VIDEO_FILES = [
  "2026_10_04_21_08_54_IMG_7069.MOV",
  "2026_10_04_21_23_24_IMG_7071.MOV",
  "2026_10_04_21_33_56_IMG_7073.MOV",
  "2026_10_04_21_54_13_IMG_7081.MOV",
  "2026_10_04_22_13_29_IMG_7091.MOV",
  "2026_10_04_22_27_13_IMG_7103.MOV",
  "2026_10_04_22_41_30_IMG_7117.MOV"
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

  console.log(`📸 Extracting frames at ${FPS_RATE} FPS (1 frame every 0.5s)...`);
  const outPattern = path.join(tempDir, 'frame_%04d.jpg');
  execSync(`npx remotion ffmpeg -y -i "${videoPath}" -r ${FPS_RATE} -vf "scale=480:-2" "${outPattern}"`, { stdio: 'ignore' });

  const frameFiles = fs.readdirSync(tempDir).filter(f => f.endsWith('.jpg')).sort();
  console.log(`✅ Extracted ${frameFiles.length} frames.`);

  const parts = [
    {
      text: `You are an elite video editor and fitness coach analyzing gym workout footage for high-impact TikTok/Reels editing.
Attached are ${frameFiles.length} sequential frames sampled at ${FPS_RATE} frames per second (1 frame every 0.5 seconds).
- frame_0001 is at 0.0s, frame_0002 is at 0.5s, frame_0003 is at 1.0s, etc.
Timestamp = (frame_number - 1) / ${FPS_RATE} seconds.

Tasks:
1. Identify the exact setup/dead-time at the start that has no lifting action (walking in, adjusting weights, getting in position) so we can CUT IT OUT.
2. Identify the exact start timestamp when the active lifting set begins (first rep pull/push).
3. Identify the exact end timestamp when the set finishes (weights dropped/re-racked) so we can CUT OUT the walking away dead-time.
4. Count the EXACT number of completed repetitions, and list the timestamp of peak contraction (max squeeze) for each rep.
5. Identify the lifter(s) and any other persons visible.
6. Provide exact editing cut points: start_seconds, end_seconds, and recommended montage snippet.

Return STRICT JSON:
{
  "file": "${filename}",
  "exercise_name": "English exercise name",
  "exercise_name_arabic": "Arabic dialect name",
  "targeted_muscle": "Muscle group in English & Arabic",
  "machine_or_equipment": "Machine name",
  "lifter_description": "Outfit and physique details",
  "setup_dead_time": {
    "start_seconds": 0.0,
    "end_seconds": 0.0,
    "description": "What happens during setup"
  },
  "active_workout_set": {
    "start_seconds": 0.0,
    "end_seconds": 0.0,
    "total_reps": 0,
    "reps": [
      {
        "rep_number": 1,
        "start_seconds": 0.0,
        "peak_contraction_seconds": 0.0,
        "end_seconds": 0.0
      }
    ]
  },
  "exit_dead_time": {
    "start_seconds": 0.0,
    "end_seconds": 0.0,
    "description": "What happens during exit/rest"
  },
  "recommended_montage_slice": {
    "start_seconds": 0.0,
    "end_seconds": 0.0,
    "duration_seconds": 0.0,
    "reps_included": 4,
    "notes": "Advice for video editor"
  }
}`
    }
  ];

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
    console.log(`✅ [${result.model}] Analysis successful!`);
    console.log(`- Exercise: ${result.data.exercise_name} (${result.data.exercise_name_arabic})`);
    console.log(`- Active Set: ${result.data.active_workout_set.start_seconds}s ➜ ${result.data.active_workout_set.end_seconds}s (Total Reps: ${result.data.active_workout_set.total_reps})`);
    console.log(`- Cut Setup: 0s ➜ ${result.data.setup_dead_time.end_seconds}s | Cut Exit: ${result.data.exit_dead_time.start_seconds}s+`);
    console.log(`- Recommended Highlight: ${result.data.recommended_montage_slice.start_seconds}s ➜ ${result.data.recommended_montage_slice.end_seconds}s`);
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
  console.log(`\n🎉 ALL 7 VIDEOS ANALYZED! Full report saved to: ${outPath}`);
}

runAll();
