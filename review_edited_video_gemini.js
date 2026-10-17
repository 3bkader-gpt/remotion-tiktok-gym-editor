const fs = require('fs');
const path = require('path');
const { bundle } = require('@remotion/bundler');
const { renderStill, selectComposition } = require('@remotion/renderer');

// Load Gemini API Key
require('dotenv').config();
let API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY && fs.existsSync('.env')) {
  const match = fs.readFileSync('.env', 'utf-8').match(/GEMINI_API_KEY\s*=\s*(.*)/);
  if (match) API_KEY = match[1].trim();
}

if (!API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY not found in environment or .env');
  process.exit(1);
}

// Exercise timing map for chronological timeline context
const EXERCISE_NAMES = [
  "INCLINE DUMBBELL BENCH PRESS",
  "CHEST-SUPPORTED T-BAR ROW",
  "MACHINE CHEST FLY",
  "WIDE-GRIP LAT PULLDOWN",
  "STANDING MACHINE LATERAL RAISE",
  "BARBELL POWER RACK SHRUG",
  "CABLE STRAIGHT-ARM PULLDOWN",
  "KNEELING CABLE CRUNCH"
];

function getTimelinePhase(frameNumber) {
  if (frameNumber < 60) return "00 // INTRO HOOK";
  const exIndex = Math.floor((frameNumber - 60) / 195);
  if (exIndex >= 0 && exIndex < 8) {
    const repInClip = ((frameNumber - 60) % 195) / 195;
    return `EX_${String(exIndex + 1).padStart(2, '0')} // ${EXERCISE_NAMES[exIndex]} (${Math.round(repInClip * 100)}% through set)`;
  }
  return "09 // OUTRO CTA & ROUTINE SUMMARY";
}

async function runDenseTimelineAudit(fpsSample = 1) {
  console.log('\n================================================================');
  console.log('🎬 PIPELINE 2: DENSE SECOND-BY-SECOND AI VIDEO AUDITOR (1 FPS)');
  console.log('================================================================\n');

  const reviewDir = path.resolve('public', 'dense_review_frames');
  if (fs.existsSync(reviewDir)) {
    fs.rmSync(reviewDir, { recursive: true, force: true });
  }
  fs.mkdirSync(reviewDir, { recursive: true });

  // 1. Bundle Remotion Project Once
  console.log('📦 Bundling Remotion project in memory...');
  const serveUrl = await bundle({
    entryPoint: path.resolve('src', 'index.ts'),
    webpackOverride: (config) => config
  });

  const composition = await selectComposition({
    serveUrl,
    id: 'TikTok-Gym-Beast'
  });
  
  const totalFrames = composition.durationInFrames;
  const totalSeconds = (totalFrames / 30).toFixed(1);
  const stepFrames = Math.round(30 / fpsSample); // 30 frames = 1 second

  console.log(`✅ Loaded composition: ${composition.id}`);
  console.log(`⏱️ Duration: ${totalFrames} frames (~${totalSeconds}s)`);
  console.log(`📸 Continuous Sampling Rate: 1 Frame Every Second (~${stepFrames} frames step)\n`);

  // Generate target frame list (1 per second across 100% of duration)
  const targetFrames = [];
  for (let f = 0; f < totalFrames; f += stepFrames) {
    targetFrames.push(f);
  }
  // Ensure the very last frame is included
  if (targetFrames[targetFrames.length - 1] !== totalFrames - 1) {
    targetFrames.push(totalFrames - 1);
  }

  console.log(`Rendering ${targetFrames.length} continuous keyframes across the full video...`);
  const capturedFiles = [];

  for (let i = 0; i < targetFrames.length; i++) {
    const f = targetFrames[i];
    const seconds = (f / 30).toFixed(2);
    const phase = getTimelinePhase(f);
    const outFilename = `dense_sec_${String(i).padStart(2, '0')}_f${f}.jpg`;
    const outPath = path.join(reviewDir, outFilename);

    process.stdout.write(`   [${i + 1}/${targetFrames.length}] Second ${seconds}s (Frame #${f}) -> ${phase.slice(0, 42)}... `);
    await renderStill({
      composition,
      serveUrl,
      frame: f,
      output: outPath,
      imageFormat: 'jpeg',
      jpegQuality: 80,
      scale: 0.54 // 583x1036 (high clarity, lightweight payload for 57 frames)
    });
    console.log('✅');
    capturedFiles.push({ path: outPath, frame: f, seconds, phase });
  }

  // 2. Prepare Detailed Multi-Modal Prompt for Gemini
  console.log(`\n🧠 Preparing Comprehensive Timeline Audit prompt for Gemini 3.7 Flash (${capturedFiles.length} frames)...`);
  const promptTemplate = fs.readFileSync(path.resolve('prompts', 'gemini_video_qa_prompt.md'), 'utf-8');

  let promptContext = promptTemplate + `\n\n### 🎞️ Dense Second-by-Second Video Frames (Total ${capturedFiles.length} frames, 1 per second):\n`;
  capturedFiles.forEach((item, idx) => {
    promptContext += `- Frame ${idx + 1} at ${item.seconds}s: ${item.phase}\n`;
  });
  promptContext += `\nYou are watching the ENTIRE continuous 56.5s video second-by-second. 
Verify:
1. Every cut and transition smoothness between all 8 exercises.
2. Safe Zone clearance across all seconds.
3. Rep counter progression and HUD consistency.
4. Auto-framing centering stability.
5. Overall algorithmic retention appeal.
Output strict JSON matching the schema:`;

  const parts = [{ text: promptContext }];
  for (const item of capturedFiles) {
    const base64Data = fs.readFileSync(item.path).toString('base64');
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Data
      }
    });
  }

  // 3. Request Gemini Vision Evaluation
  const MODELS = ['gemini-3.7-flash', 'gemini-flash-latest', 'gemini-3.5-flash'];
  let auditResult = null;

  for (const model of MODELS) {
    console.log(`📡 Uploading ${capturedFiles.length} frames to ${model} for Full Continuous Timeline Audit...`);
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
      const resJson = await response.json();
      if (resJson.candidates && resJson.candidates[0].content) {
        auditResult = JSON.parse(resJson.candidates[0].content.parts[0].text);
        console.log(`✅ [${model}] Comprehensive Timeline Audit complete!`);
        break;
      } else {
        console.log(`⚠️ ${model} response:`, resJson.error ? resJson.error.message.slice(0, 80) : 'No candidate');
      }
    } catch (e) {
      console.log(`⚠️ ${model} error:`, e.message);
    }
  }

  if (!auditResult) {
    console.error('❌ Failed to obtain review from Gemini.');
    process.exit(1);
  }

  // 4. Save Dense Report
  const reportPath = path.resolve('public', 'dense_timeline_qa_audit_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(auditResult, null, 2), 'utf-8');
  console.log(`\n📄 Full Continuous Timeline Report saved to: ${reportPath}`);

  // 5. Pretty Print Summary
  console.log('\n======================================================');
  console.log(`🏆 OVERALL SCORE: ${auditResult.audit_metadata?.overall_score || 'N/A'} / 10  |  VERDICT: ${auditResult.audit_metadata?.verdict || 'DONE'}`);
  console.log('======================================================');
  console.log(`📝 Critique: ${auditResult.overall_critique}\n`);

  console.log('🛡️ SAFE ZONE AUDIT:');
  console.log(`- Status: ${auditResult.safe_zone_audit?.status}`);
  console.log(`- Top Zone: ${auditResult.safe_zone_audit?.top_safe_zone}`);
  console.log(`- Right Action Zone: ${auditResult.safe_zone_audit?.right_action_zone}`);
  console.log(`- Bottom Caption Zone: ${auditResult.safe_zone_audit?.bottom_caption_zone}\n`);

  console.log('📋 CLIP-BY-CLIP DENSE ANALYSIS:');
  (auditResult.clip_reviews || []).forEach((c) => {
    console.log(`   [${c.clip_index || '#'}] ${c.exercise_name}: ${c.visual_rating} | Framing: ${c.framing_accuracy} | Rec: ${c.specific_recommendations}`);
  });

  console.log('\n🎯 ACTIONABLE RECOMMENDATIONS:');
  (auditResult.actionable_recommendations || []).forEach((rec, i) => {
    console.log(`   ${i + 1}. ${rec}`);
  });
  console.log('======================================================\n');
}

runDenseTimelineAudit(1).catch((err) => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});
