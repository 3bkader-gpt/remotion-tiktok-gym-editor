import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { ExerciseInfo, TikTokHUD } from "./TikTokHUD";
import { CinematicFinishingStack } from "./CinematicFinishingStack";
import { getSpring } from "../motion";

export interface ExerciseClipProps {
  filename: string;
  trimStartSeconds: number;
  durationInFrames: number;
  exercise: ExerciseInfo;
  exerciseIndex: number;
  totalExercises: number;
  expectedReps?: number;
  // 🎯 Auto-Framing & Lifter Tracking Coordinates
  focalCenterXPercent?: number; // 0-100 (horizontal center of lifter, default 50)
  focalCenterYPercent?: number; // 0-100 (vertical center of action, default 42)
  lifterDrift?: "stationary" | "leans_forward" | "shifts_left" | "shifts_right";
  recommendedCameraScale?: number;
}

export const ExerciseClip: React.FC<ExerciseClipProps> = ({
  filename,
  trimStartSeconds,
  durationInFrames,
  exercise,
  exerciseIndex,
  totalExercises,
  expectedReps = 3,
  focalCenterXPercent = 50,
  focalCenterYPercent = 42,
  lifterDrift = "stationary",
  recommendedCameraScale = 1.08,
}) => {
  const frame = useCurrentFrame();

  // ⏱️ Timing & Cadence Arithmetic
  const clipProgress = frame / durationInFrames;
  const repDuration = Math.max(1, Math.floor(durationInFrames / expectedReps));
  const currentRep = Math.min(
    expectedReps,
    Math.floor(clipProgress * expectedReps) + 1
  );

  // Rep cycle: normalized 0 to 1 within each repetition
  const repProgress = (frame % repDuration) / repDuration;

  // Peak contraction happens near the top of the concentric squeeze (around 42%-60% of rep)
  const isPeakContraction = repProgress >= 0.42 && repProgress <= 0.60;

  // 🎬 1. Kinetic Whip-Pan & Speed-Ramp Transition (klik-anim transition law)
  // Replaces dead static cuts with energetic, camera-driven whip arrival
  const whipSpring = getSpring(frame, 30, "snap", 0);
  const whipX = interpolate(whipSpring, [0, 1], [80, 0]);
  const whipScaleRamp = interpolate(
    whipSpring,
    [0, 1],
    [recommendedCameraScale + 0.08, recommendedCameraScale]
  );

  // Optical cut flash streak (anamorphic glint across screen)
  const opticalFlash = interpolate(frame, [0, 6], [0.55, 0], {
    extrapolateRight: "clamp",
  });

  // 🎥 2. Dynamic Auto-Centering & Center-Locked Virtual Tracking
  let dynamicFocalX = focalCenterXPercent;
  let dynamicFocalY = focalCenterYPercent;

  if (lifterDrift === "leans_forward") {
    dynamicFocalY += Math.sin(repProgress * Math.PI) * 4.5;
  } else if (lifterDrift === "shifts_left") {
    dynamicFocalX -= interpolate(frame, [0, durationInFrames], [0, 6], {
      extrapolateRight: "clamp",
    });
  } else if (lifterDrift === "shifts_right") {
    dynamicFocalX += interpolate(frame, [0, durationInFrames], [0, 6], {
      extrapolateRight: "clamp",
    });
  }

  const autoPanX = interpolate(dynamicFocalX - 50, [-25, 25], [70, -70], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const autoPanY = interpolate(dynamicFocalY - 42, [-20, 20], [50, -50], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 🎥 3. Camera Framing: Clean and rock-solid without jarring pulsation
  const totalScale = whipScaleRamp;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {/* 🔊 1. Sound Design: Energetic whoosh on transition entrance */}
      <Audio
        src={staticFile("sfx/whoosh.wav")}
        volume={0.32}
        startFrom={0}
      />

      {/* 🎥 3. Video Layer with Active Auto-Framing + Kinetic Whip Transform */}
      <div
        style={{
          width: "100%",
          height: "100%",
          filter: "contrast(1.02) saturate(0.98) brightness(1.0)",
          transformOrigin: `${dynamicFocalX}% ${dynamicFocalY}%`,
          transform: `translate3d(${autoPanX + whipX}px, ${autoPanY}px, 0px) scale(${totalScale})`,
        }}
      >
        <OffthreadVideo
          src={staticFile(filename)}
          startFrom={Math.floor(trimStartSeconds * 30)}
          volume={0.35} // Natural iron acoustics & breathing
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* ⚡ 4. Optical Anamorphic Cut Flash (Cyan & White Streaks on Transition) */}
      {opticalFlash > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 45%, rgba(0, 255, 204, 0.45) 0%, rgba(255, 255, 255, 0.3) 25%, transparent 70%)",
            opacity: opticalFlash,
            pointerEvents: "none",
            mixBlendMode: "screen",
          }}
        />
      )}

      {/* 📱 5. TikTok Cyber-Fitness HUD (Kinetic Springs + Sheen + Rep Pop) */}
      <TikTokHUD
        exercise={exercise}
        currentRep={currentRep}
        totalReps={expectedReps}
        exerciseIndex={exerciseIndex}
        totalExercises={totalExercises}
        clipProgress={clipProgress}
        isPeakContraction={isPeakContraction}
      />

      {/* 🎞️ 6. 5-Layer Cinematic Finishing Stack */}
      <CinematicFinishingStack isPeakContraction={isPeakContraction} />
    </AbsoluteFill>
  );
};
