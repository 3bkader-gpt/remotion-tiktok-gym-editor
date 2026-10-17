import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Series,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { FloatingIntroHook } from "./FloatingIntroHook";
import { FloatingExerciseClip } from "./FloatingExerciseClip";
import { FloatingOutroCTA } from "./FloatingOutroCTA";

export interface FloatingWorkoutExerciseItem {
  filename: string;
  trimStartSeconds: number;
  durationInFrames: number;
  expectedReps: number;
  focalCenterXPercent: number;
  focalCenterYPercent: number;
  lifterDrift: "stationary" | "leans_forward" | "shifts_left" | "shifts_right";
  recommendedCameraScale: number;
  exerciseNumber: string;
  titleLines: string[];
  muscleTag: string;
  intensityTag: string;
  showTrajectory?: boolean;
}

export const FLOATING_EXERCISES: FloatingWorkoutExerciseItem[] = [
  {
    filename: "2026_10_06_18_03_56_IMG_7166.mp4",
    trimStartSeconds: 4.0, // ✂️ Starts at first incline press lockout
    durationInFrames: 195, // 6.5s
    expectedReps: 4,
    focalCenterXPercent: 48,
    focalCenterYPercent: 50,
    lifterDrift: "stationary",
    recommendedCameraScale: 1.12,
    exerciseNumber: "01",
    titleLines: ["INCLINE", "DUMBBELL", "PRESS"],
    muscleTag: "UPPER CHEST // CLAVICULAR HEAD",
    intensityTag: "4 SETS × 8-10 REPS • RPE 9.0",
    showTrajectory: true,
  },
  {
    filename: "2026_10_06_18_18_14_IMG_7168.mp4",
    trimStartSeconds: 12.5, // ✂️ Starts right as athlete pulls heavy T-bar row
    durationInFrames: 195, // 6.5s
    expectedReps: 4,
    focalCenterXPercent: 54,
    focalCenterYPercent: 44,
    lifterDrift: "stationary",
    recommendedCameraScale: 1.12,
    exerciseNumber: "02",
    titleLines: ["CHEST-SUPPORTED", "T-BAR ROW"],
    muscleTag: "UPPER BACK & LATS // THICKNESS",
    intensityTag: "4 SETS × 10-12 REPS • DEADLOCK SQUEEZE",
    showTrajectory: false,
  },
  {
    filename: "2026_10_06_18_31_18_IMG_7171.mp4",
    trimStartSeconds: 24.0, // ✂️ Starts right at first explosive chest squeeze
    durationInFrames: 195, // 6.5s
    expectedReps: 4,
    focalCenterXPercent: 49,
    focalCenterYPercent: 44,
    lifterDrift: "stationary",
    recommendedCameraScale: 1.10,
    exerciseNumber: "03",
    titleLines: ["MACHINE", "CHEST FLY"],
    muscleTag: "PECTORALIS MAJOR // INNER CHEST",
    intensityTag: "3 SETS × 12-15 REPS • 2s SQUEEZE",
    showTrajectory: true,
  },
  {
    filename: "2026_10_06_18_52_38_IMG_7202.MP4",
    trimStartSeconds: 5.5, // ✂️ Starts right at first explosive downward lat pull
    durationInFrames: 195, // 6.5s
    expectedReps: 4,
    focalCenterXPercent: 52,
    focalCenterYPercent: 44,
    lifterDrift: "stationary",
    recommendedCameraScale: 1.12,
    exerciseNumber: "04",
    titleLines: ["WIDE-GRIP", "LAT PULLDOWN"],
    muscleTag: "LATISSIMUS DORSI // V-TAPER",
    intensityTag: "4 SETS × 10 REPS • DEEP NEGATIVE STRETCH",
    showTrajectory: true,
  },
  {
    filename: "2026_10_06_19_03_16_IMG_7207.MP4",
    trimStartSeconds: 11.5, // ✂️ Starts right at first lateral raise elevation
    durationInFrames: 195, // 6.5s
    expectedReps: 6,
    focalCenterXPercent: 33,
    focalCenterYPercent: 42,
    lifterDrift: "stationary",
    recommendedCameraScale: 1.14,
    exerciseNumber: "05",
    titleLines: ["STANDING MACHINE", "LATERAL RAISE"],
    muscleTag: "LATERAL DELTOIDS // 3D CAPS",
    intensityTag: "4 SETS × 15 REPS • METABOLIC PUMP",
    showTrajectory: true,
  },
  {
    filename: "2026_10_06_19_14_25_IMG_7213.MP4",
    trimStartSeconds: 30.0, // ✂️ Starts right at heavy power rack shrug reps
    durationInFrames: 195, // 6.5s
    expectedReps: 5,
    focalCenterXPercent: 38,
    focalCenterYPercent: 56,
    lifterDrift: "stationary",
    recommendedCameraScale: 1.10,
    exerciseNumber: "06",
    titleLines: ["POWER RACK", "BARBELL SHRUG"],
    muscleTag: "TRAPEZIUS // UPPER BACK OVERLOAD",
    intensityTag: "4 SETS × 12 REPS • HEAVY ELEVATION",
    showTrajectory: false,
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
    exerciseNumber: "07",
    titleLines: ["STRAIGHT-ARM", "CABLE PULLDOWN"],
    muscleTag: "LATS & SERRATUS ANTERIOR",
    intensityTag: "3 SETS × 12 REPS • FULL ARC TENSION",
    showTrajectory: false,
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
    exerciseNumber: "08",
    titleLines: ["KNEELING", "CABLE CRUNCH"],
    muscleTag: "RECTUS ABDOMINIS // SIX-PACK",
    intensityTag: "3 SETS × 15-20 REPS • CORE FINISHER",
    showTrajectory: false,
  },
];

export const TOTAL_FLOATING_FRAMES =
  60 + FLOATING_EXERCISES.reduce((acc, curr) => acc + curr.durationInFrames, 0) + 75;

export const TikTokGymFloating: React.FC<{
  quranAudioFile?: string;
}> = ({ quranAudioFile }) => {
  const frame = useCurrentFrame();
  const overallProgress = Math.min(
    100,
    Math.max(0, (frame / TOTAL_FLOATING_FRAMES) * 100)
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* 📖 Quran Background Audio Layer (Fade-in / Fade-out) */}
      {quranAudioFile && (
        <Audio
          src={staticFile(quranAudioFile)}
          volume={(f) =>
            interpolate(
              f,
              [0, 30, TOTAL_FLOATING_FRAMES - 45, TOTAL_FLOATING_FRAMES],
              [0, 0.85, 0.85, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            )
          }
        />
      )}

      {/* ⚡ Global Top Energy Progress Bar (Amber / Gold @erabii palette) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 100,
        }}
      >
        <div
          style={{
            width: `${overallProgress}%`,
            height: "100%",
            background: "linear-gradient(90deg, #FFE259 0%, #FF9900 60%, #FF5500 100%)",
            boxShadow: "0 0 14px rgba(255, 170, 0, 0.85)",
          }}
        />
      </div>

      <Series>
        {/* 1. Kinetic Intro Hook (2.0s) */}
        <Series.Sequence durationInFrames={60}>
          <FloatingIntroHook />
        </Series.Sequence>

        {/* 2. 8 Full Exercise Sets with Floating Chrome Typography & Trajectory Lines */}
        {FLOATING_EXERCISES.map((item) => (
          <Series.Sequence
            key={item.filename}
            durationInFrames={item.durationInFrames}
          >
            <FloatingExerciseClip
              filename={item.filename}
              trimStartSeconds={item.trimStartSeconds}
              durationInFrames={item.durationInFrames}
              exerciseNumber={item.exerciseNumber}
              totalExercises={FLOATING_EXERCISES.length}
              expectedReps={item.expectedReps}
              titleLines={item.titleLines}
              muscleTag={item.muscleTag}
              intensityTag={item.intensityTag}
              showTrajectory={item.showTrajectory}
              focalCenterXPercent={item.focalCenterXPercent}
              focalCenterYPercent={item.focalCenterYPercent}
              lifterDrift={item.lifterDrift}
              recommendedCameraScale={item.recommendedCameraScale}
            />
          </Series.Sequence>
        ))}

        {/* 3. Floating Outro Workout Summary & Save CTA (2.5s) */}
        <Series.Sequence durationInFrames={75}>
          <FloatingOutroCTA />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
