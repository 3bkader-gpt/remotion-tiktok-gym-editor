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

async function analyzeVideo(videoFilename, fps = 1) {
  console.log(`\n========================================`);
  console.log(`🎬 Processing Video: ${videoFilename}`);
  console.log(`========================================`);

  const videoPath = path.resolve('public', videoFilename);
  const tempFramesDir = path.resolve('.gemini_frames', path.parse(videoFilename).name);
  
  if (fs.existsSync(tempFramesDir)) {
    fs.rmSync(tempFramesDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempFramesDir, { recursive: true });

  // 1. Slice video into 1 frame per second
  console.log(`📸 Slicing video into ${fps} frame(s) per second...`);
  const outPattern = path.join(tempFramesDir, 'frame_%04d.jpg');
  const ffmpegCmd = `npx remotion ffmpeg -y -i "${videoPath}" -r ${fps} -vf "scale=480:-2" "${outPattern}"`;
  execSync(ffmpegCmd, { stdio: 'ignore' });

  const frameFiles = fs.readdirSync(tempFramesDir).filter(f => f.endsWith('.jpg')).sort();
  console.log(`✅ Extracted ${frameFiles.length} frames.`);

  // 2. Build multi-modal request parts
  console.log(`🧠 Uploading ${frameFiles.length} frames to Gemini 3.8 Flash for granular analysis...`);

  const parts = [
    {
      text: `You are an expert video editor and fitness coach analyzing a gym video for a dynamic TikTok/Reels edit.
Attached are ${frameFiles.length} sequential frames extracted at 1 frame per second (1 FPS).
Frame frame_0001 corresponds to second 1 (00:01), frame_0002 corresponds to second 2 (00:02), and so on.

Analyze the video across time and return a STRICT JSON object with this exact structure:
{
  "video_summary": "1-2 sentence overview of the video",
  "lifter_profile": {
    "primary_lifter_appearance": "details of clothing, physique, hair",
    "other_people_visible": ["list any other people who appear, what they wear, and at what timestamps"]
  },
  "exercise_details": {
    "name_english": "Standard exercise name",
    "name_arabic": "Arabic name with gym dialect",
    "machine_or_equipment": "Description of machine or weights",
    "targeted_muscle": "Primary muscle group in English & Arabic"
  },
  "timeline": {
    "setup_phase": { "start_seconds": 0, "end_seconds": 0, "description": "walking in, adjusting weight, setting up" },
    "workout_set": {
      "start_seconds": 0,
      "end_seconds": 0,
      "total_reps_completed": 0,
      "reps": [
        {
          "rep_number": 1,
          "start_seconds": 0,
          "peak_contraction_seconds": 0,
          "end_seconds": 0,
          "quality": "clean / struggle / partial"
        }
      ]
    },
    "exit_phase": { "start_seconds": 0, "end_seconds": 0, "description": "dropping weight, resting" }
  },
  "editing_recommendation": {
    "best_clip_start_seconds": 0,
    "best_clip_end_seconds": 0,
    "recommended_duration_seconds": 0,
    "notes_for_editor": "Specific advice on where the peak pump/action is"
  }
}`
    }
  ];

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
    console.log(`- Exercise: ${parsed.exercise_details.name_english} (${parsed.exercise_details.name_arabic})`);
    console.log(`- Total Reps: ${parsed.timeline.workout_set.total_reps_completed}`);
    console.log(`- Set Active Interval: ${parsed.timeline.workout_set.start_seconds}s ➜ ${parsed.timeline.workout_set.end_seconds}s`);
    console.log(`- Recommended Highlight: ${parsed.editing_recommendation.best_clip_start_seconds}s ➜ ${parsed.editing_recommendation.best_clip_end_seconds}s`);
    console.log(`- Lifter: ${parsed.lifter_profile.primary_lifter_appearance}`);
    if (parsed.lifter_profile.other_people_visible.length > 0) {
      console.log(`- Other people: ${parsed.lifter_profile.other_people_visible.join(', ')}`);
    }
    return parsed;
  } else {
    console.error('API Error:', data.error ? data.error.message : data);
    return null;
  }
}

// Test on IMG_7071 (28s video = 28 frames)
analyzeVideo('2026_10_04_21_23_24_IMG_7071.MOV', 1);
