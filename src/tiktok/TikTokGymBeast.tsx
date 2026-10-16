import React from "react";
import { AbsoluteFill, Series, useCurrentFrame } from "remotion";
import { IntroHook } from "./IntroHook";
import { ExerciseClip } from "./ExerciseClip";
import { OutroCTA } from "./OutroCTA";
import { ExerciseInfo } from "./TikTokHUD";

// 🎯 Timestamps calibrated by Gemini Vision AI to cut 100% of dead time
const EXERCISES: Array<{
  filename: string;
  trimStartSeconds: number;
  durationInFrames: number;
  expectedReps: number;
  exercise: ExerciseInfo;
}> = [
  {
    filename: "2026_10_04_21_08_54_IMG_7069.MOV",
    trimStartSeconds: 7.5, // ✂️ Cut 0-7s strap setup dead-time -> starts right at Rep 1
    durationInFrames: 255, // 8.5s (4 complete reps: Reps 1-4)
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
    trimStartSeconds: 2.0, // ✂️ Cut 0-1.5s initial setup -> starts right at Rep 1
    durationInFrames: 225, // 7.5s (4 clean reps)
    expectedReps: 4,
    exercise: {
      number: "02",
      name: "STRAIGHT-ARM CABLE PULLDOWN",
      nameArabic: "سحب ذراع مستقيمة على الكيبل",
      muscle: "LATERALIS & TERES MAJOR",
      muscleArabic: "عزل المجنص السفلي",
      intensity: "PEAK CONTRACTION",
    },
  },
  {
    filename: "2026_10_04_21_33_56_IMG_7073.MOV",
    trimStartSeconds: 4.0, // ✂️ Cut 0-4s sitting down dead-time -> starts directly at pull
    durationInFrames: 225, // 7.5s (4 full contractions)
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
    trimStartSeconds: 2.5, // ✂️ Cut 0-2s cable grip dead-time -> starts on first flye
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
    trimStartSeconds: 5.0, // ✂️ Cut 0-4.5s grip adjustment dead-time -> starts right at first pulldown
    durationInFrames: 240, // 8.0s (4 complete reps)
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
    trimStartSeconds: 5.0, // ✂️ Cut 0-4.5s dumbbell pickup and turn dead-time -> starts right at heavy reps
    durationInFrames: 240, // 8.0s (4 heavy reps)
    expectedReps: 4,
    exercise: {
      number: "06",
      name: "HEAVY DUMBBELL SHRUGS",
      nameArabic: "شراجز دمبلز ثقيل - ترابيس حديد",
      muscle: "TRAPEZIUS & UPPER NECK",
      muscleArabic: "تفجير عضلات الترابيس",
      intensity: "RPE 10 // PURE GRIT",
    },
  },
  {
    filename: "2026_10_04_21_54_13_IMG_7081.MOV",
    trimStartSeconds: 54.0, // ✂️ Cut 0-53s (skips waiting / background person) -> starts right at main lifter set
    durationInFrames: 285, // 9.5s (4 complete reps facing camera)
    expectedReps: 4,
    exercise: {
      number: "07",
      name: "LOW-TO-HIGH CABLE CHEST FLY",
      nameArabic: "تجميع صدر وسواعد بالكيبل - إنهاء الجلسة",
      muscle: "CHEST & FOREARMS BURNOUT",
      muscleArabic: "حرق السواعد والصدر بالكامل",
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
