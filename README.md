# 🐉 Remotion TikTok Gym Beast // AI Video Editor

An automated, creative video editing pipeline and motion graphics template built with **[Remotion](https://www.remotion.dev)** (React + TypeScript) and **Google Gemini AI Vision**.

Designed for high-retention, viral **TikTok, Shorts, and Instagram Reels (9:16 vertical)** fitness and workout content.

---

## ✨ Features

- **Cyber-Fitness HUD**:
  - Live stage indicator (`STAGE 1 / 7`).
  - Glowing target muscle badge (`🎯 Lats & Rhomboids / المجنص ووسط الظهر`).
  - Real-time intensity indicator (`🔥 RPE 9.5 / HEAVY OVERLOAD`).
  - Dynamic multi-rep tracker bar (`REP 01 OF 4` with smooth progress fill).
- **Cinematic Motion Dynamics**:
  - Punch-in camera zoom & subtle camera shake on peak muscle contraction.
  - Beat-synced whoosh and sub-bass drop audio sound effects.
  - Full TikTok Safe Zone compliance (no overlap with TikTok right icons or bottom caption marquee).
- **AI-Powered Video Analysis (Gemini 3.5/3.7/3.8 Flash)**:
  - Slices video at 1 FPS and extracts second-by-second structured JSON breakdown:
    - Exact start/end timestamps of sets and reps.
    - Identification of lifter, clothes, accessories, and background individuals.
    - Exercise classification in English and Arabic.
- **Master Quality Export**:
  - Preconfigured with `CRF 14` (near-lossless high bitrate) in `remotion.config.ts`.
  - Supports 1080p and Native 4K (`2160x3840`) compositions.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional for Gemini Analysis)
Copy `.env.example` to `.env` and add your Gemini API key:
```env
GEMINI_API_KEY=your_key_here
```

### 3. Launch Remotion Studio Preview
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** to view the live timeline, adjust keyframes, and preview audio.

---

## 🎥 Video Compositions

- **`TikTok-Gym-Beast`**: 1080p Master (1080x1920, 61s, 30fps).
- **`TikTok-Gym-Beast-4K`**: Native 4K Master (2160x3840).
- **`TikTok-Intro-Hook`**: 2-second aggressive intro hook.
- **`TikTok-Outro-CTA`**: 2.5-second save & share checklist card.
- **`Raw-Montage-Vertical`**: Consecutive sequence of all raw clips.

---

## 📦 Export / Render Video

Render the 61-second 1080p master:
```bash
npx remotion render TikTok-Gym-Beast out/tiktok_workout_master.mp4
```

Render in 4K resolution:
```bash
npx remotion render TikTok-Gym-Beast-4K out/tiktok_workout_4k.mp4
```

---

## 🧠 AI Video Intelligence Script

Analyze any raw video file with Gemini:
```bash
node analyze_video_gemini.js
```
Generates a structured `analysis_<video_name>.json` with exact rep timestamps and editing highlights.
