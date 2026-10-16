import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  Easing,
} from "remotion";
import { ExerciseInfo, TikTokHUD } from "./TikTokHUD";

export interface ExerciseClipProps {
  filename: string;
  trimStartSeconds: number;
  durationInFrames: number;
  exercise: ExerciseInfo;
  exerciseIndex: number;
  totalExercises: number;
  expectedReps?: number;
}

export const ExerciseClip: React.FC<ExerciseClipProps> = ({
  filename,
  trimStartSeconds,
  durationInFrames,
  exercise,
  exerciseIndex,
  totalExercises,
  expectedReps = 3,
}) => {
  const frame = useCurrentFrame();

  // Fraction of clip completed (0 to 1)
  const clipProgress = frame / durationInFrames;

  // Calculate current rep number (1 to expectedReps)
  const currentRep = Math.min(
    expectedReps,
    Math.floor(clipProgress * expectedReps) + 1
  );

  // Rep cycle animation: creates a subtle punch-in on each contraction
  const repCycle = (frame % Math.floor(durationInFrames / expectedReps)) / (durationInFrames / expectedReps);
  const repZoom = Math.sin(repCycle * Math.PI) * 0.06;

  // Overall cinematic slow zoom forward across the entire set
  const baseZoom = interpolate(frame, [0, durationInFrames], [1.02, 1.12], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.8, 0.4, 1),
  });

  const finalScale = baseZoom + repZoom;

  // Transition in flash
  const flash = interpolate(frame, [0, 5, 12], [0.55, 0.15, 0], {
    extrapolateRight: "clamp",
  });

  // Sound effects: whoosh at start, subtle thud at rep points
  const isRepStart = frame % Math.floor(durationInFrames / expectedReps) === 2;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {/* Dynamic Sound Effects */}
      <Audio src={staticFile("sfx/whoosh.wav")} volume={0.65} />
      {isRepStart && frame > 10 && (
        <Audio src={staticFile("sfx/thud.wav")} volume={0.6} />
      )}

      {/* Main Video with High-Contrast Gym Color Grade & Smooth Rep Zooms */}
      <div
        style={{
          width: "100%",
          height: "100%",
          scale: finalScale,
          filter: "contrast(1.16) saturate(1.18) brightness(0.97)",
          transformOrigin: "center 45%",
        }}
      >
        <OffthreadVideo
          src={staticFile(filename)}
          startFrom={Math.floor(trimStartSeconds * 30)}
          volume={0.85} // Retain the authentic sound of clanking gym iron and lifter breathing
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Transition Flash */}
      {flash > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#ffffff",
            opacity: flash,
            pointerEvents: "none",
          }}
        />
      )}

      {/* TikTok Cyber-Fitness HUD */}
      <TikTokHUD
        exercise={exercise}
        currentRep={currentRep}
        totalReps={expectedReps}
        exerciseIndex={exerciseIndex}
        totalExercises={totalExercises}
        clipProgress={clipProgress}
      />
    </AbsoluteFill>
  );
};
