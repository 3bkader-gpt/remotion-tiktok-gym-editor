import { Composition, Folder } from "remotion";
import { TikTokGymBeast, TOTAL_TIKTOK_FRAMES } from "./tiktok/TikTokGymBeast";
import { IntroHook } from "./tiktok/IntroHook";
import { OutroCTA } from "./tiktok/OutroCTA";
import {
  TikTokGymFloating,
  TOTAL_FLOATING_FRAMES,
} from "./tiktok-floating/TikTokGymFloating";
import { FloatingWorkoutHUD } from "./tiktok-floating/FloatingWorkoutHUD";
import { FloatingIntroHook } from "./tiktok-floating/FloatingIntroHook";
import { FloatingOutroCTA } from "./tiktok-floating/FloatingOutroCTA";
import { SequencedMontage, SingleVideoPlayer, VIDEO_FILES } from "./VideoEditor";

const FloatingHUDPreview: React.FC = () => (
  <FloatingWorkoutHUD
    exerciseNumber="01"
    totalExercises={8}
    titleLines={["INCLINE", "DUMBBELL", "PRESS"]}
    muscleTag="UPPER CHEST // CLAVICULAR HEAD"
    intensityTag="4 SETS × 8-10 REPS • RPE 9.0"
    showTrajectory={true}
    currentRep={2}
    totalReps={4}
  />
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 🌟 New Reference Aesthetic: Floating Chrome & Neon Guide Rails (@erabii style) */}
      <Composition
        id="TikTok-Gym-Floating"
        component={TikTokGymFloating}
        durationInFrames={TOTAL_FLOATING_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="TikTok-Gym-Floating-4K"
        component={TikTokGymFloating}
        durationInFrames={TOTAL_FLOATING_FRAMES}
        fps={30}
        width={2160}
        height={3840}
      />

      {/* 🚀 Original Feature: 1080p Ultra-Quality TikTok Edit (1080x1920, 61s) */}
      <Composition
        id="TikTok-Gym-Beast"
        component={TikTokGymBeast}
        durationInFrames={TOTAL_TIKTOK_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 💎 4K Master Ultra-Quality (Native 2160x3840 iPhone 15 Pro Max Resolution) */}
      <Composition
        id="TikTok-Gym-Beast-4K"
        component={TikTokGymBeast}
        durationInFrames={TOTAL_TIKTOK_FRAMES}
        fps={30}
        width={2160}
        height={3840}
      />

      {/* Individual Modular TikTok Components */}
      <Folder name="TikTok-Components">
        <Composition
          id="TikTok-Intro-Hook"
          component={IntroHook}
          durationInFrames={60}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="TikTok-Outro-CTA"
          component={OutroCTA}
          durationInFrames={75}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>

      {/* Floating Style Modular Components (@erabii aesthetic) */}
      <Folder name="TikTok-Floating-Components">
        <Composition
          id="Floating-Intro-Hook"
          component={FloatingIntroHook}
          durationInFrames={60}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Floating-Workout-HUD-Preview"
          component={FloatingHUDPreview}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Floating-Outro-CTA"
          component={FloatingOutroCTA}
          durationInFrames={75}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>

      {/* Raw Montages & Single Clip Review */}
      <Folder name="Raw-Clips-Montage">
        <Composition
          id="Raw-Montage-Vertical"
          component={SequencedMontage}
          durationInFrames={VIDEO_FILES.length * 150}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            clipDurationInFrames: 150,
          }}
        />
        <Composition
          id="Raw-Montage-Horizontal"
          component={SequencedMontage}
          durationInFrames={VIDEO_FILES.length * 150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            clipDurationInFrames: 150,
          }}
        />
        {VIDEO_FILES.map((filename, idx) => {
          const cleanName = filename.replace(".MOV", "").replace(/[^a-zA-Z0-9-]/g, "-");
          return (
            <Composition
              key={filename}
              id={`Clip-${idx + 1}-${cleanName}`}
              component={SingleVideoPlayer}
              durationInFrames={300}
              fps={30}
              width={1080}
              height={1920}
              defaultProps={{
                filename,
                title: `Clip ${idx + 1} (${cleanName})`,
              }}
            />
          );
        })}
      </Folder>
    </>
  );
};
