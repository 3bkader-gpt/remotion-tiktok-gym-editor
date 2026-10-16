import React from "react";
import { AbsoluteFill, Series, useCurrentFrame } from "remotion";
import { IntroHook } from "./IntroHook";
import { ExerciseClip } from "./ExerciseClip";
import { OutroCTA } from "./OutroCTA";
import { ExerciseInfo } from "./TikTokHUD";

const EXERCISES: Array<{
  filename: string;
  trimStartSeconds: number;
  durationInFrames: number;
  expectedReps: number;
  exercise: ExerciseInfo;
}> = [
  {
    filename: "2026_10_04_21_08_54_IMG_7069.MOV",
    trimStartSeconds: 3.0,
    durationInFrames: 255, // 8.5s (4 complete reps)
    expectedReps: 4,
    exercise: {
      number: "01",
      name: "T-BAR ROW (CHEST SUPPORTED)",
      nameArabic: "سحب تي بار بالجهاز - تركيز وضخ دم كامل",
      muscle: "LATS & RHOMBOIDS",
      muscleArabic: "المجنص ووسط الظهر",
      intensity: "RPE 9.5 // HEAVY OVERLOAD",
    },
  },
  {
    filename: "2026_10_04_21_23_24_IMG_7071.MOV",
    trimStartSeconds: 3.0,
    durationInFrames: 225, // 7.5s (4 complete reps)
    expectedReps: 4,
    exercise: {
      number: "02",
      name: "STRAIGHT-ARM CABLE PULLDOWN",
      nameArabic: "كيبل بول داون ذراع مستقيم - أقصى تمدد",
      muscle: "LATERALIS & TERES MAJOR",
      muscleArabic: "عزل المجنص السفلي",
      intensity: "PEAK CONTRACTION",
    },
  },
  {
    filename: "2026_10_04_21_33_56_IMG_7073.MOV",
    trimStartSeconds: 1.5,
    durationInFrames: 225, // 7.5s (4 complete reps)
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
    trimStartSeconds: 3.0,
    durationInFrames: 225, // 7.5s (4 complete reps)
    expectedReps: 4,
    exercise: {
      number: "04",
      name: "REAR DELT CABLE CROSSOVER",
      nameArabic: "كروس أوفر كيبل كتف خلفي - عزل كامل",
      muscle: "POSTERIOR DELTOIDS",
      muscleArabic: "تفجير الكتف الخلفي 3D",
      intensity: "MAX PUMP & CONTROL",
    },
  },
  {
    filename: "2026_10_04_22_41_30_IMG_7117.MOV",
    trimStartSeconds: 3.5,
    durationInFrames: 240, // 8.0s (4 complete reps)
    expectedReps: 4,
    exercise: {
      number: "05",
      name: "CLOSE-GRIP LAT PULLDOWN",
      nameArabic: "سحب عالي قبضة ضيقة - بناء العرض",
      muscle: "UPPER LATS // V-TAPER",
      muscleArabic: "عرض الظهر V-Taper",
      intensity: "DEEP NEGATIVE STRETCH",
    },
  },
  {
    filename: "2026_10_04_22_27_13_IMG_7103.MOV",
    trimStartSeconds: 2.5,
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
    trimStartSeconds: 54.0, // 🎯 Starts at 54s where the main lifter steps in with full focus!
    durationInFrames: 285, // 9.5s (4 complete reps)
    expectedReps: 4,
    exercise: {
      number: "07",
      name: "CABLE LATERALS & FOREARMS BURNOUT",
      nameArabic: "سحب جانبي وسواعد بالكيبل - إنهاء الجلسة",
      muscle: "FOREARMS & DELTS BURNOUT",
      muscleArabic: "حرق السواعد والذراع بالكامل",
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

        {/* 2. 7 Full Exercise Sets with Multiple Reps (each 7.5 - 9.5s) */}
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
