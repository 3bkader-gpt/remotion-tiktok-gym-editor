const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read API key from environment variable or .env
require('dotenv').config?.();
let API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY && fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf-8');
  const match = envContent.match(/GEMINI_API_KEY\s*=\s*(.*)/);
  if (match) API_KEY = match[1].trim();
}
const MODELS = ['gemini-3.7-flash', 'gemini-3.5-flash', 'gemini-flash-latest', 'gemini-3.8-flash'];

async function analyzeVideo(videoFilename, fps = 3) {
  console.log(`\n========================================`);
  console.log(`🎬 Processing Video: ${videoFilename}`);
  console.log(`========================================`);

  const videoPath = path.resolve('public', videoFilename);
  const tempFramesDir = path.resolve('.gemini_frames', path.parse(videoFilename).name);
  
  if (fs.existsSync(tempFramesDir)) {
    fs.rmSync(tempFramesDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempFramesDir, { recursive: true });

  // 1. Slice video into 3 frames per second (~333ms per frame)
  console.log(`📸 Slicing video into ${fps} frame(s) per second...`);
  const outPattern = path.join(tempFramesDir, 'frame_%04d.jpg');
  const ffmpegCmd = `npx remotion ffmpeg -y -i "${videoPath}" -r ${fps} -vf "scale=480:-2" "${outPattern}"`;
  execSync(ffmpegCmd, { stdio: 'ignore' });

  const frameFiles = fs.readdirSync(tempFramesDir).filter(f => f.endsWith('.jpg')).sort();
  console.log(`✅ Extracted ${frameFiles.length} frames.`);

  // 2. Build multi-modal request parts
  console.log(`🧠 Uploading ${frameFiles.length} frames to Gemini 3.7 Flash for granular biomechanical analysis...`);

  const promptTemplatePath = path.resolve('prompts', 'gemini_biomechanics_analysis_prompt.md');
  let promptText = fs.readFileSync(promptTemplatePath, 'utf-8');
  promptText = promptText.replace(/\$\{filename\}/g, videoFilename);
  promptText += `\n\n### 📹 Current File Data:\n- Video File: ${videoFilename}\n- Total Frames: ${frameFiles.length}\n- Sampling Rate: ${fps} FPS (1 frame every ${(1 / fps).toFixed(3)}s)\nAnalyze and output the strict JSON matching the schema above:`;

  const parts = [{ text: promptText }];

  // Add all frame images as inlineData
  for (let i = 0; i < frameFiles.length; i++) {
    const frameFile = frameFiles[i];
    const imageBase64 = fs.readFileSync(path.join(tempFramesDir, frameFile)).toString('base64');
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageBase64
      }
    });
  }

  // 3. Call Gemini API with automatic model fallback
  let data = null;
  for (const model of MODELS) {
    console.log(`📡 Sending request to ${model}...`);
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      });
      const resJson = await response.json();
      if (resJson.candidates && resJson.candidates[0].content) {
        data = resJson;
        console.log(`✅ ${model} responded successfully!`);
        break;
      } else {
        console.log(`⚠️ ${model} error:`, resJson.error ? resJson.error.message.slice(0, 70) : 'unknown error');
      }
    } catch (e) {
      console.log(`⚠️ ${model} network error:`, e.message);
    }
  }
  if (data.candidates && data.candidates[0].content) {
    const jsonText = data.candidates[0].content.parts[0].text;
    const parsed = JSON.parse(jsonText);
    
    // Save report
    const reportPath = path.resolve(`analysis_${path.parse(videoFilename).name}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(parsed, null, 2), 'utf-8');
    
    console.log(`\n🎉 ANALYSIS COMPLETE for ${videoFilename}!`);
    console.log(`📄 Saved to: ${reportPath}`);
    console.log(`📊 Summary:`);
    console.log(`- Exercise: ${parsed.exercise_details?.name || parsed.exercise_details?.name_english}`);
    console.log(`- Muscle: ${parsed.exercise_details?.primary_muscle || parsed.exercise_details?.targeted_muscle}`);
    if (parsed.auto_framing) {
      console.log(`- Auto-Framing: Center (${parsed.auto_framing.focal_center_x_percent}%, ${parsed.auto_framing.focal_center_y_percent}%) | Drift: ${parsed.auto_framing.lifter_drift} | Scale: ${parsed.auto_framing.recommended_camera_scale}`);
    }
    const reps = parsed.timeline?.active_workout_set?.total_reps_completed ?? parsed.timeline?.workout_set?.total_reps_completed;
    console.log(`- Total Reps: ${reps}`);
    const activeInterval = parsed.timeline?.active_workout_set || parsed.timeline?.workout_set;
    if (activeInterval) {
      console.log(`- Set Active Interval: ${activeInterval.start_seconds}s ➜ ${activeInterval.end_seconds}s`);
    }
    const recommendation = parsed.editing_recommendation;
    if (recommendation) {
      console.log(`- Recommended Highlight: ${recommendation.trim_start_seconds ?? recommendation.best_clip_start_seconds}s ➜ ${recommendation.trim_end_seconds ?? recommendation.best_clip_end_seconds}s`);
    }
    return parsed;
  } else {
    console.error('API Error:', data.error ? data.error.message : data);
    return null;
  }
}

// Accept video from CLI argument or default
const targetVideo = process.argv[2] || '2026_10_06_19_20_02_IMG_7214.MP4';
analyzeVideo(targetVideo, 3);

