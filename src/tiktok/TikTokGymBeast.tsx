import React from "react";
import { AbsoluteFill, Series, useCurrentFrame } from "remotion";
import { IntroHook } from "./IntroHook";
import { ExerciseClip } from "./ExerciseClip";
import { OutroCTA } from "./OutroCTA";
import { ExerciseInfo } from "./TikTokHUD";

// 🎯 Timestamps calibrated to exact motion frames - 0% dead-time / 100% active reps
const EXERCISES: Array<{
  filename: string;
  trimStartSeconds: number;
  durationInFrames: number;
  expectedReps: number;
  exercise: ExerciseInfo;
}> = [
  {
    filename: "2026_10_04_21_08_54_IMG_7069.MOV",
    trimStartSeconds: 12.5, // ✂️ Cut 0-12s strap wrapping -> starts right when locked onto pad under load
    durationInFrames: 240, // 8.0s (full active set)
    expectedReps: 4,
    exercise: {
      number: "01",
      name: "CHEST-SUPPORTED T-BAR ROW",
      nameArabic: "سحب ظهر جهاز بدعم الصدر",
      muscle: "LATS & RHOMBOIDS",
      muscleArabic: "المجنص ووسط الظهر",
      intensity: "RPE 9.5 // HEAVY OVERLOAD",
    },
  },
  {
    filename: "2026_10_04_21_23_24_IMG_7071.MOV",
    trimStartSeconds: 2.5, // ✂️ Cut dead-time -> starts right at Rep 1 triceps contraction
    durationInFrames: 225, // 7.5s (4 clean reps)
    expectedReps: 4,
    exercise: {
      number: "02",
      name: "CABLE OVERHEAD TRICEPS EXTENSION",
      nameArabic: "ترايسبس كابل خلف الرأس بالمسطرة",
      muscle: "TRICEPS // LONG HEAD",
      muscleArabic: "تفجير عضلة الترايسبس بالكامل",
      intensity: "PEAK CONTRACTION",
    },
  },
  {
    filename: "2026_10_04_21_33_56_IMG_7073.MOV",
    trimStartSeconds: 6.5, // ✂️ Cut 0-6s sitting/waiting -> starts right at first explosive pull
    durationInFrames: 225, // 7.5s (4 deep row contractions)
    expectedReps: 4,
    exercise: {
      number: "03",
      name: "SEATED MACHINE ROW",
      nameArabic: "سحب أرضي بالجهاز - قوة وثبات الظهر",
      muscle: "MID-BACK & LATS",
      muscleArabic: "سمك الظهر الداخلي",
      intensity: "RPE 10 // PURE FAILURE",
    },
  },
  {
    filename: "2026_10_04_22_13_29_IMG_7091.MOV",
    trimStartSeconds: 6.5, // ✂️ Cut 0-6s grip adjustment -> starts right when arms spread into rear delt fly
    durationInFrames: 225, // 7.5s (4 complete reps)
    expectedReps: 4,
    exercise: {
      number: "04",
      name: "REAR DELT CABLE CROSSOVER",
      nameArabic: "فراشة خلفي كيبل - عزل كامل",
      muscle: "POSTERIOR DELTOIDS",
      muscleArabic: "تفجير الكتف الخلفي 3D",
      intensity: "MAX PUMP & CONTROL",
    },
  },
  {
    filename: "2026_10_04_22_41_30_IMG_7117.MOV",
    trimStartSeconds: 20.0, // ✂️ Cut 0-19s sitting/gripping bar -> starts right when bar pulls down to chest!
    durationInFrames: 240, // 8.0s (clean full contractions)
    expectedReps: 4,
    exercise: {
      number: "05",
      name: "WIDE-GRIP LAT PULLDOWN",
      nameArabic: "سحب ظهر عالي بالجهاز",
      muscle: "UPPER LATS // V-TAPER",
      muscleArabic: "عرض الظهر V-Taper",
      intensity: "DEEP NEGATIVE STRETCH",
    },
  },
  {
    filename: "2026_10_04_22_27_13_IMG_7103.MOV",
    trimStartSeconds: 8.0, // ✂️ Cut 0-7.5s picking up dumbbells -> starts right at Rep 1 bicep curl
    durationInFrames: 240, // 8.0s (4 heavy curls)
    expectedReps: 4,
    exercise: {
      number: "06",
      name: "ALTERNATING DUMBBELL BICEP CURLS",
      nameArabic: "تبادل دمبلز بايسبس - قوة وتفجير الذراع",
      muscle: "BICEPS BRACHII & BRACHIALIS",
      muscleArabic: "تفجير كور عضلات البايسبس",
      intensity: "RPE 10 // HEAVY GAINS",
    },
  },
  {
    filename: "2026_10_04_21_54_13_IMG_7081.MOV",
    trimStartSeconds: 64.5, // ✂️ Cut 0-64s setup/smiling -> starts directly at REVX lifter cable reps!
    durationInFrames: 255, // 8.5s (full contractions on camera)
    expectedReps: 4,
    exercise: {
      number: "07",
      name: "LOW CABLE CHEST FLY & BICEP BURNOUT",
      nameArabic: "تجميع وسحب كيبل سفلي - إنهاء الجلسة",
      muscle: "CHEST & BICEPS BURNOUT",
      muscleArabic: "حرق الصدر والبايسبس بالكامل",
      intensity: "FINAL BURNOUT SET",
    },
  },
];

export const TOTAL_TIKTOK_FRAMES =
  60 + EXERCISES.reduce((acc, curr) => acc + curr.durationInFrames, 0) + 75;

export const TikTokGymBeast: React.FC = () => {
  const frame = useCurrentFrame();
  const overallProgress = Math.min(100, Math.max(0, (frame / TOTAL_TIKTOK_FRAMES) * 100));

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Global Top Energy Progress Bar (TikTok Indicator) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: 100,
        }}
      >
        <div
          style={{
            width: `${overallProgress}%`,
            height: "100%",
            background: "linear-gradient(90deg, #ff4500, #ff8c00, #00ffcc)",
            boxShadow: "0 0 12px #ff4500",
          }}
        />
      </div>

      <Series>
        {/* 1. Aggressive Intro Hook (2.0s) */}
        <Series.Sequence durationInFrames={60}>
          <IntroHook />
        </Series.Sequence>

        {/* 2. 7 Full Exercise Sets with Zero Dead-Time (AI Optimized) */}
        {EXERCISES.map((item, idx) => (
          <Series.Sequence key={item.filename} durationInFrames={item.durationInFrames}>
            <ExerciseClip
              filename={item.filename}
              trimStartSeconds={item.trimStartSeconds}
              durationInFrames={item.durationInFrames}
              exercise={item.exercise}
              exerciseIndex={idx + 1}
              totalExercises={EXERCISES.length}
              expectedReps={item.expectedReps}
            />
          </Series.Sequence>
        ))}

        {/* 3. Outro Workout Checklist & Save Call-To-Action (2.5s) */}
        <Series.Sequence durationInFrames={75}>
          <OutroCTA />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
