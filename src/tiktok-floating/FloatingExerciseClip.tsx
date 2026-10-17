import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { FloatingWorkoutHUD } from "./FloatingWorkoutHUD";
import { FloatingFinishingStack } from "./FloatingFinishingStack";
import { getSpring } from "../motion";

export interface FloatingExerciseClipProps {
  filename: string;
  trimStartSeconds: number;
  durationInFrames: number;
  exerciseNumber: string;
  totalExercises: number;
  expectedReps?: number;
  titleLines: string[];
  muscleTag: string;
  intensityTag: string;
  showTrajectory?: boolean;
  focalCenterXPercent?: number;
  focalCenterYPercent?: number;
  lifterDrift?: "stationary" | "leans_forward" | "shifts_left" | "shifts_right";
  recommendedCameraScale?: number;
}

export const FloatingExerciseClip: React.FC<FloatingExerciseClipProps> = ({
  filename,
  trimStartSeconds,
  durationInFrames,
  exerciseNumber,
  totalExercises,
  expectedReps = 4,
  titleLines,
  muscleTag,
  intensityTag,
  showTrajectory = true,
  focalCenterXPercent = 50,
  focalCenterYPercent = 44,
  lifterDrift = "stationary",
  recommendedCameraScale = 1.10,
}) => {
  const frame = useCurrentFrame();

  // ⏱️ Cadence and Rep tracking
  const clipProgress = frame / durationInFrames;
  const currentRep = Math.min(
    expectedReps,
    Math.floor(clipProgress * expectedReps) + 1
  );

  // 🎬 1. Kinetic Whip-Pan & Speed-Ramp Transition Arrival
  const whipSpring = getSpring(frame, 30, "snap", 0);
  const whipX = interpolate(whipSpring, [0, 1], [70, 0]);
  const whipScaleRamp = interpolate(
    whipSpring,
    [0, 1],
    [recommendedCameraScale + 0.06, recommendedCameraScale]
  );

  // Optical cut flash streak
  const opticalFlash = interpolate(frame, [0, 6], [0.45, 0], {
    extrapolateRight: "clamp",
  });

  // 🎥 2. Center-Locked Virtual Tracking (Rock-Solid Camera)
  let dynamicFocalX = focalCenterXPercent;
  const dynamicFocalY = focalCenterYPercent;

  if (lifterDrift === "shifts_left") {
    dynamicFocalX -= interpolate(frame, [0, durationInFrames], [0, 5], {
      extrapolateRight: "clamp",
    });
  } else if (lifterDrift === "shifts_right") {
    dynamicFocalX += interpolate(frame, [0, durationInFrames], [0, 5], {
      extrapolateRight: "clamp",
    });
  }

  const autoPanX = interpolate(dynamicFocalX - 50, [-25, 25], [60, -60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const autoPanY = interpolate(dynamicFocalY - 44, [-20, 20], [45, -45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {/* 🔊 1. Sound Design: Energetic whoosh on transition entrance */}
      <Audio
        src={staticFile("sfx/whoosh.wav")}
        volume={0.30}
        startFrom={0}
      />

      {/* 🎥 2. High-Performance Video Layer (No camera shaking, rock-solid framing) */}
      <div
        style={{
          width: "100%",
          height: "100%",
          filter: "contrast(1.03) saturate(1.02) brightness(1.0)",
          transformOrigin: `${dynamicFocalX}% ${dynamicFocalY}%`,
          transform: `translate3d(${autoPanX + whipX}px, ${autoPanY}px, 0px) scale(${whipScaleRamp})`,
        }}
      >
        <OffthreadVideo
          src={staticFile(filename)}
          startFrom={Math.floor(trimStartSeconds * 30)}
          volume={0.35} // Natural gym ambience & lifting acoustic
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* ⚡ 3. Anamorphic Cut Flash Streak */}
      {opticalFlash > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 45%, rgba(255, 220, 100, 0.45) 0%, rgba(255, 255, 255, 0.25) 30%, transparent 70%)",
            opacity: opticalFlash,
            pointerEvents: "none",
            mixBlendMode: "screen",
          }}
        />
      )}

      {/* 📱 4. Floating Workout HUD (Reference Video Aesthetic with Neon Trajectory Rails) */}
      <FloatingWorkoutHUD
        exerciseNumber={exerciseNumber}
        totalExercises={totalExercises}
        titleLines={titleLines}
        muscleTag={muscleTag}
        intensityTag={intensityTag}
        showTrajectory={showTrajectory}
        currentRep={currentRep}
        totalReps={expectedReps}
      />

      {/* 🎞️ 5. Cinematic Vignette and Ambient Halation */}
      <FloatingFinishingStack />
    </AbsoluteFill>
  );
};
