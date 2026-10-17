import React from "react";
import { AbsoluteFill } from "remotion";

export const FloatingFinishingStack: React.FC = () => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* 1. Cinematic Edge Vignette (Keeps focus locked in the center 75%) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, transparent 60%, rgba(0, 0, 0, 0.42) 100%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* 2. Top & Bottom Ambient Falloff (Ensures UI & typography readability) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "180px",
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "220px",
          background:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, transparent 100%)",
        }}
      />

      {/* 3. Subtle Warm Ambient Halation (Gym Floor Light Tube Accent) */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "300px",
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(255, 170, 0, 0.08) 0%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};
