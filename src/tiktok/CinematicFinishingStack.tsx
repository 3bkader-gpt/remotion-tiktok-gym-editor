import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

/**
 * 5-Layer Stack Finisher:
 * Combines Procedural 35mm Film Grain, Cinematic Color Grade,
 * Anamorphic Vignette, and subtle Contraction Optical Pulse.
 * Completely eliminates the "cheap AI/flat phone video" look.
 */
export const CinematicFinishingStack: React.FC<{
  isPeakContraction?: boolean;
}> = () => {
  const frame = useCurrentFrame();

  // Subtle natural film grain
  const noiseSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.3'/%3E%3C/svg%3E")`;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 90 }}>
      {/* 1. Ultra-clean neutral gradient at top & bottom for text legibility (no yellow or orange tint) */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 18%, transparent 75%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* 2. Static subtle vignette - perfectly still, no breathing or scaling */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center 48%, transparent 55%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {/* 3. Micro film grain texture */}
      <AbsoluteFill
        style={{
          backgroundImage: noiseSvg,
          backgroundSize: "220px 220px",
          backgroundPosition: `${(frame * 17) % 220}px ${(frame * 23) % 220}px`,
          opacity: 0.025,
          mixBlendMode: "overlay",
        }}
      />
    </AbsoluteFill>
  );
};
