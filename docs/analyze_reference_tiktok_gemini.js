const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Read API Key
const envPath = 'd:/GG/remotion-tiktok-gym-editor/.env';
let key = process.env.GEMINI_API_KEY;
if (fs.existsSync(envPath)) {
  const match = fs.readFileSync(envPath, 'utf-8').match(/GEMINI_API_KEY\s*=\s*(.*)/);
  if (match) key = match[1].trim();
}

if (!key) {
  console.error('❌ GEMINI_API_KEY not found!');
  process.exit(1);
}

// 2. Prepare dense frame extraction (1.5 FPS = 90 frames across 60 seconds)
const videoPath = 'd:/GG/reference_tiktok.mp4';
const framesDir = 'd:/GG/reference_frames_dense';
if (fs.existsSync(framesDir)) {
  fs.rmSync(framesDir, { recursive: true, force: true });
}
fs.mkdirSync(framesDir, { recursive: true });

console.log('🎬 Step 1: Slicing reference video into dense frames (1.5 FPS)...');
execSync(
  `npx --prefix d:/GG/remotion-tiktok-gym-editor remotion ffmpeg -y -i "${videoPath}" -r 1.5 -s 360x640 "${framesDir}/frame_%03d.jpg"`,
  { stdio: 'inherit' }
);

const frameFiles = fs.readdirSync(framesDir).filter(f => f.endsWith('.jpg')).sort();
console.log(`✅ Extracted ${frameFiles.length} dense chronological frames.`);

// 3. Prepare Gemini Multimodal Payload
console.log('📦 Step 2: Packaging frames for Gemini Vision...');
const parts = [];

const promptText = `
You are the world's leading Viral Fitness Video Director and Elite Remotion (React + TypeScript) Motion Graphics Architect.
The user provided ${frameFiles.length} chronological frames extracted from a reference TikTok/Reel video (@erabii / youssefidris).

The user explicitly asked:
"متحللوش بنفسك. قسمه لاكبر عدد من الفريمات و ارفعها ل جيمناي خليها يشرحلك كل حاجه بالتفصيل و ازاي تعملها ب ريموشن"

Analyze these frames in forensic detail and produce an exhaustive, professional breakdown report in JSON format:

{
  "reference_summary": "1-2 sentence high-level summary of the editing style and aesthetic",
  "visual_philosophy": {
    "why_no_clunky_boxes": "Detailed explanation of why this video uses borderless glowing floating text instead of dark caption boxes",
    "color_palette": ["Primary colors with hex codes, glow colors, ambient gym tones"],
    "lighting_and_atmosphere": "Analysis of the dark gym contrast and physical neon floor tubes"
  },
  "typography_breakdown": {
    "font_family_recommendation": "Best matching Google Font available in Remotion (e.g. Anton, Montserrat Black, Bebas Neue, Outfit)",
    "hierarchy_and_stacking": "How the exercise title is broken down into stacked lines (e.g. INCLINE / DUMBBELL / PRESS)",
    "styling_and_effects": "Exact CSS recipe: text-shadow values, gradient fills, letter-spacing, font-weight, stroke/glow details",
    "placement_strategy": "Where text sits on screen (center of screen, depth behind or in front of athlete, safe zones)"
  },
  "vfx_and_annotation_layers": {
    "neon_trajectory_lines": "Detailed breakdown of the neon yellow/gold vertical trajectory guide lines on dumbbells seen in frames (e.g. frame ~38) and how they function",
    "spotlight_and_lighting": "Vignette, lighting accents, optical flares"
  },
  "motion_and_pacing": {
    "transition_style": "How cuts between shots are executed (whip pans, zoom transitions, hard cuts on action)",
    "text_entrance_motion": "How the title appears (spring scale, tracking expansion, optical flash)",
    "pacing_rhythm": "Cut duration per exercise/shot"
  },
  "remotion_implementation_guide": {
    "component_name": "ReferenceWorkoutHUD",
    "code_snippet": "Full, working, copy-pasteable Remotion React component code implementing this exact borderless glowing title style, font, and neon trajectory guidelines using Remotion hooks (useCurrentFrame, interpolate, spring, AbsoluteFill)",
    "step_by_step_remotion_instructions": [
      "Step 1: ...",
      "Step 2: ...",
      "Step 3: ..."
    ]
  }
}
`;

parts.push({ text: promptText });

frameFiles.forEach((file, idx) => {
  const filePath = path.join(framesDir, file);
  const data = fs.readFileSync(filePath).toString('base64');
  const timestampSec = (idx / 1.5).toFixed(2);
  parts.push({ text: `[FRAME ${idx + 1} // Timestamp: ${timestampSec}s]` });
  parts.push({
    inlineData: {
      mimeType: 'image/jpeg',
      data
    }
  });
});

async function callGemini() {
  const models = ['gemini-3.7-flash', 'gemini-3.8-flash', 'gemini-3.6-flash'];
  let result = null;

  for (const model of models) {
    console.log(`📡 Step 3: Sending ${frameFiles.length} frames to ${model}...`);
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        })
      });

      const resJson = await res.json();
      if (resJson.candidates && resJson.candidates[0].content) {
        result = JSON.parse(resJson.candidates[0].content.parts[0].text);
        console.log(`✅ [${model}] Analysis completed successfully!`);
        break;
      } else {
        console.log(`⚠️ ${model} notice:`, resJson.error ? resJson.error.message.slice(0, 120) : 'No candidate');
      }
    } catch (err) {
      console.log(`⚠️ ${model} fetch failed:`, err.message);
    }
  }

  if (!result) {
    console.error('❌ Could not complete analysis with Gemini models.');
    process.exit(1);
  }

  // Save JSON report
  fs.writeFileSync('d:/GG/gemini_reference_analysis.json', JSON.stringify(result, null, 2), 'utf-8');
  console.log('📄 Saved JSON analysis to d:/GG/gemini_reference_analysis.json');

  // Generate detailed Markdown report
  let md = `# 🎬 تحليل جيمناي الشامل لفيديو التيك توك المرجعي (@erabii)

## 📌 ملخص النمط الإخراجي (Visual Summary)
${result.reference_summary}

---

## 🎨 1. الفلسفة البصرية وتصميم النصوص (Visual Philosophy)
- **لماذا لا توجد بوكسات خلفية كئيبة (No Clunky Boxes):**
${result.visual_philosophy?.why_no_clunky_boxes}

- **باليت الألوان (Color Palette):**
${result.visual_philosophy?.color_palette?.map(c => `- \`${c}\``).join('\n')}

- **الإضاءة والجو العام (Lighting & Atmosphere):**
${result.visual_philosophy?.lighting_and_atmosphere}

---

## 🔤 2. تصميم التيبوغرافي والنصوص (Typography & Styling)
- **الخط الموصى به في ريموشن (Font Family):** **${result.typography_breakdown?.font_family_recommendation}**
- **تقسيم الكلمات (Stacking):** ${result.typography_breakdown?.hierarchy_and_stacking}
- **التأثيرات والإضاءة الخلفية (Styling & Glow):**
${result.typography_breakdown?.styling_and_effects}
- **مكان التمركز على الشاشة (Placement):** ${result.typography_breakdown?.placement_strategy}

---

## ⚡ 3. المؤثرات البصرية وخطوط المسار الحركي (VFX & Biomechanical Annotations)
- **خطوط مسار الدامبلز النيون (Neon Trajectory Lines):**
${result.vfx_and_annotation_layers?.neon_trajectory_lines}
- **الفوكس والإضاءة (Spotlight & Lighting):** ${result.vfx_and_annotation_layers?.spotlight_and_lighting}

---

## ⏱️ 4. الإيقاع والانتقالات (Pacing & Motion)
- **طريقة الانتقال (Transitions):** ${result.motion_and_pacing?.transition_style}
- **حركة دخول النصوص (Text Entrance):** ${result.motion_and_pacing?.text_entrance_motion}
- **مدة اللقطات (Pacing Rhythm):** ${result.motion_and_pacing?.pacing_rhythm}

---

## 💻 5. كود التنفيذ في ريموشن (Remotion Implementation)

\`\`\`tsx
${result.remotion_implementation_guide?.code_snippet}
\`\`\`

### خطوات التطبيق:
${result.remotion_implementation_guide?.step_by_step_remotion_instructions?.map(s => `- ${s}`).join('\n')}
`;

  fs.writeFileSync('d:/GG/gemini_reference_analysis.md', md, 'utf-8');
  console.log('📄 Saved Markdown report to d:/GG/gemini_reference_analysis.md');
}

callGemini();
