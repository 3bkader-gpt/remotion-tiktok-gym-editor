import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Series,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { IntroHook } from "./IntroHook";
import { ExerciseClip } from "./ExerciseClip";
import { OutroCTA } from "./OutroCTA";
import { ExerciseInfo } from "./TikTokHUD";

// 🎯 Timestamps and Biomechanics calibrated via Gemini 3.7 Flash analysis
export interface WorkoutExerciseItem {
  filename: string;
  trimStartSeconds: number;
  durationInFrames: number;
  expectedReps: number;
  focalCenterXPercent: number;
  focalCenterYPercent: number;
  lifterDrift: "stationary" | "leans_forward" | "shifts_left" | "shifts_right";
  recommendedCameraScale: number;
  exercise: ExerciseInfo;
}

export const EXERCISES: WorkoutExerciseItem[] = [
  {
    filename: "2026_10_06_18_03_56_IMG_7166.mp4",
    trimStartSeconds: 4.0, // ✂️ Cut 0-4s setup -> starts right at first incline press lockout
    durationInFrames: 195, // 6.5s
    expectedReps: 4,
    focalCenterXPercent: 48,
    focalCenterYPercent: 50,
    lifterDrift: "stationary",
    recommendedCameraScale: 1.12,
    exercise: {
      number: "01",
      name: "INCLINE DUMBBELL BENCH PRESS",
      muscle: "UPPER CHEST // CLAVICULAR HEAD",
      intensity: "RPE 9.0 // HEAVY OVERLOAD",
    },
  },
  {
    filename: "2026_10_06_18_18_14_IMG_7168.mp4",
    trimStartSeconds: 12.5, // ✂️ Cut 0-12s strap wrapping & waiting -> starts right as athlete pulls heavy T-bar row
    durationInFrames: 195, // 6.5s
    expectedReps: 4,
    focalCenterXPercent: 54,
    focalCenterYPercent: 44,
    lifterDrift: "stationary",
    recommendedCameraScale: 1.12,
    exercise: {
      number: "02",
      name: "CHEST-SUPPORTED T-BAR ROW",
      muscle: "UPPER BACK & LATS // THICKNESS",
      intensity: "RPE 9.5 // DEADLOCK SQUEEZE",
    },
  },
  {
    filename: "2026_10_06_18_31_18_IMG_7171.mp4",
    trimStartSeconds: 24.0, // ✂️ Cut 0-23.5s reaching back & grabbing handles -> starts right at first explosive chest squeeze
    durationInFrames: 195, // 6.5s (24.0s - 30.5s: 4 full working reps)
    expectedReps: 4,
    focalCenterXPercent: 49,
    focalCenterYPercent: 44,
    lifterDrift: "stationary",
    recommendedCameraScale: 1.10,
    exercise: {
      number: "03",
      name: "MACHINE CHEST FLY",
      muscle: "PECTORALIS MAJOR // INNER CHEST",
      intensity: "PEAK CONTRACTION ISOLATION",
    },
  },
  {
    filename: "2026_10_06_18_52_38_IMG_7202.MP4",
    trimStartSeconds: 5.5, // ✂️ Cut 0-5s seating -> starts right at first explosive downward lat pull
    durationInFrames: 195, // 6.5s
    expectedReps: 4,
    focalCenterXPercent: 52,
    focalCenterYPercent: 44,
    lifterDrift: "stationary",
    recommendedCameraScale: 1.12,
    exercise: {
      number: "04",
      name: "WIDE-GRIP LAT PULLDOWN",
      muscle: "LATISSIMUS DORSI // V-TAPER",
      intensity: "DEEP NEGATIVE STRETCH",
    },
  },
  {
    filename: "2026_10_06_19_03_16_IMG_7207.MP4",
    trimStartSeconds: 11.5, // ✂️ Cut 0-11s platform setup & grip -> starts right at first lateral raise elevation
    durationInFrames: 195, // 6.5s
    expectedReps: 6,
    focalCenterXPercent: 33,
    focalCenterYPercent: 42,
    lifterDrift: "stationary",
    recommendedCameraScale: 1.14,
    exercise: {
      number: "05",
      name: "STANDING MACHINE LATERAL RAISE",
      muscle: "LATERAL DELTOIDS // 3D CAPS",
      intensity: "METABOLIC PUMP BURNOUT",
    },
  },
  {
    filename: "2026_10_06_19_14_25_IMG_7213.MP4",
    trimStartSeconds: 30.0, // ✂️ Cut 0-29s obstructed view & setup -> starts right at rapid heavy power rack shrug reps
    durationInFrames: 195, // 6.5s
    expectedReps: 5,
    focalCenterXPercent: 38,
    focalCenterYPercent: 56,
    lifterDrift: "stationary",
    recommendedCameraScale: 1.10,
    exercise: {
      number: "06",
      name: "BARBELL POWER RACK SHRUG",
      muscle: "TRAPEZIUS // UPPER BACK OVERLOAD",
      intensity: "RPE 9.0 // HEAVY POWER ELEVATION",
    },
  },
  {
    filename: "2026_10_06_19_20_02_IMG_7214.MP4",
    trimStartSeconds: 1.0, // ✂️ Starts immediately as bar sweeps down into lat arc
    durationInFrames: 195, // 6.5s
    expectedReps: 4,
    focalCenterXPercent: 57,
    focalCenterYPercent: 48,
    lifterDrift: "stationary",
    recommendedCameraScale: 1.10,
    exercise: {
      number: "07",
      name: "CABLE STRAIGHT-ARM PULLDOWN",
      muscle: "LATS & SERRATUS ANTERIOR",
      intensity: "FULL ARC CONTRACTION",
    },
  },
  {
    filename: "2026_10_06_19_26_57_IMG_7212.MP4",
    trimStartSeconds: 1.5, // ✂️ Starts right as spine flexes into deep kneeling cable crunch
    durationInFrames: 195, // 6.5s
    expectedReps: 5,
    focalCenterXPercent: 38,
    focalCenterYPercent: 58,
    lifterDrift: "stationary",
    recommendedCameraScale: 1.12,
    exercise: {
      number: "08",
      name: "KNEELING CABLE CRUNCH",
      muscle: "RECTUS ABDOMINIS // SIX-PACK",
      intensity: "RPE 10 // CORE FINISHER",
    },
  },
];

export const TOTAL_TIKTOK_FRAMES =
  60 + EXERCISES.reduce((acc, curr) => acc + curr.durationInFrames, 0) + 75;

export const TikTokGymBeast: React.FC<{
  quranAudioFile?: string;
}> = ({ quranAudioFile }) => {
  const frame = useCurrentFrame();
  const overallProgress = Math.min(100, Math.max(0, (frame / TOTAL_TIKTOK_FRAMES) * 100));

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* 📖 Quran Background Audio Layer (Respectful Fade-in / Fade-out) */}
      {quranAudioFile && (
        <Audio
          src={staticFile(quranAudioFile)}
          volume={(f) =>
            interpolate(
              f,
              [0, 30, TOTAL_TIKTOK_FRAMES - 45, TOTAL_TIKTOK_FRAMES],
              [0, 0.85, 0.85, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            )
          }
        />
      )}
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

        {/* 2. 7 Full Exercise Sets with Zero Dead-Time & Auto-Framing (AI Calibrated) */}
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
              focalCenterXPercent={item.focalCenterXPercent}
              focalCenterYPercent={item.focalCenterYPercent}
              lifterDrift={item.lifterDrift}
              recommendedCameraScale={item.recommendedCameraScale}
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
