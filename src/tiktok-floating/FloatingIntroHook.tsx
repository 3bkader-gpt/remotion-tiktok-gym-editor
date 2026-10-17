import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { FloatingFinishingStack } from "./FloatingFinishingStack";

const { fontFamily } = loadFont("normal", {
  weights: ["800", "900"],
});

export const FloatingIntroHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring entrance for title
  const springVal = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 180 },
  });

  const scale = interpolate(springVal, [0, 1], [0.85, 1.0]);
  const tracking = interpolate(springVal, [0, 1], [18, 6]);

  const subOpacity = interpolate(frame, [18, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Ambient laser oscillation
  const laserPulse = Math.sin(frame * 0.3) * 0.15 + 0.85;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#07080a",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 🔊 Cinematic Bass Impact */}
      <Audio src={staticFile("sfx/bass_hit.wav")} volume={0.65} startFrom={0} />

      {/* Atmospheric Dark Gym Background with Subtle Amber Core */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(255, 170, 0, 0.18) 0%, rgba(7, 8, 10, 0.95) 70%)",
        }}
      />

      {/* Vertical Laser Guidance Lines */}
      <div
        style={{
          position: "absolute",
          width: "560px",
          height: "800px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: 0.85,
        }}
      >
        <div
          style={{
            width: "3px",
            height: "100%",
            background:
              "linear-gradient(180deg, transparent 0%, #FFE259 30%, #FFA500 70%, transparent 100%)",
            boxShadow: `0 0 16px rgba(255, 180, 0, ${laserPulse})`,
          }}
        />
        <div
          style={{
            width: "3px",
            height: "100%",
            background:
              "linear-gradient(180deg, transparent 0%, #FFE259 30%, #FFA500 70%, transparent 100%)",
            boxShadow: `0 0 16px rgba(255, 180, 0, ${laserPulse})`,
          }}
        />
      </div>

      {/* Floating Center Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          transform: `scale(${scale})`,
          letterSpacing: `${tracking}px`,
          zIndex: 10,
        }}
      >
        {/* Athlete Monogram Tag */}
        <div
          style={{
            fontFamily,
            fontSize: "20px",
            fontWeight: 800,
            letterSpacing: "6px",
            color: "#FFE259",
            textTransform: "uppercase",
            marginBottom: "16px",
            filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.7))",
          }}
        >
          HAMZAWY // ATHLETE SERIES
        </div>

        {/* Big Bold Metallic Chrome Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily,
            fontWeight: 900,
            textTransform: "uppercase",
            lineHeight: 0.92,
          }}
        >
          <span
            style={{
              fontSize: "82px",
              background: "linear-gradient(180deg, #FFFFFF 20%, #DCE5ED 65%, #94A3B8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter:
                "drop-shadow(0 0 16px rgba(255, 200, 50, 0.65)) drop-shadow(0 0 36px rgba(255, 140, 0, 0.35)) drop-shadow(0 4px 12px rgba(0,0,0,0.95))",
            }}
          >
            UPPER BODY
          </span>
          <span
            style={{
              fontSize: "92px",
              background: "linear-gradient(180deg, #FFFFFF 15%, #FFE259 60%, #FFA500 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter:
                "drop-shadow(0 0 18px rgba(255, 200, 50, 0.85)) drop-shadow(0 0 42px rgba(255, 140, 0, 0.45)) drop-shadow(0 4px 12px rgba(0,0,0,0.95))",
            }}
          >
            OVERLOAD
          </span>
        </div>

        {/* Micro Subtitle */}
        <div
          style={{
            marginTop: "24px",
            fontFamily,
            fontSize: "19px",
            fontWeight: 800,
            letterSpacing: "4px",
            color: "#00E5FF",
            textTransform: "uppercase",
            opacity: subOpacity,
            filter: "drop-shadow(0 0 10px rgba(0, 229, 255, 0.6))",
          }}
        >
          8 EXERCISES • COMPLETE ROUTINE
        </div>
      </div>

      <FloatingFinishingStack />
    </AbsoluteFill>
  );
};
