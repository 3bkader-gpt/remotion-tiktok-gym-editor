import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
  Easing,
} from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { CinematicFinishingStack } from "./CinematicFinishingStack";

const { fontFamily: bebasFont } = loadBebas();

export const IntroHook: React.FC = () => {
  const frame = useCurrentFrame();

  // Fast pulse & zoom
  const scale = interpolate(frame, [0, 45, 60], [1.15, 1, 1.05], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const flash = interpolate(frame, [0, 6, 12, 18], [0.4, 0, 0.2, 0], {
    extrapolateRight: "clamp",
  });

  const textScale = interpolate(frame, [0, 15], [0.85, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });

  const subTextOpacity = interpolate(frame, [15, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#08080c",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 🔊 Cinematic Sub-Bass Impact on Intro Hook */}
      <Audio src={staticFile("sfx/bass_hit.wav")} volume={0.65} startFrom={0} />

      <CinematicFinishingStack />

      {/* Background Graphic with Fiery Glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, rgba(255, 69, 0, 0.45) 0%, rgba(10, 5, 5, 0.95) 75%)",
          scale,
        }}
      />

      {/* Grid Tech Lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.6,
        }}
      />

      {/* Center Hook Typography */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 40px",
          zIndex: 10,
          scale: textScale,
        }}
      >
        {/* Top Tag */}
        <div
          style={{
            fontFamily: bebasFont,
            fontSize: 32,
            letterSpacing: 8,
            color: "#ff8c00",
            textTransform: "uppercase",
            marginBottom: 8,
            textShadow: "0 0 20px rgba(255, 140, 0, 0.8)",
          }}
        >
          HAMZAWY // ATHLETE PROTOCOL
        </div>

        {/* Main Title */}
        <div
          style={{
            fontFamily: bebasFont,
            fontSize: 105,
            fontWeight: 900,
            lineHeight: 0.95,
            color: "#ffffff",
            letterSpacing: 4,
            textTransform: "uppercase",
            textShadow:
              "0 0 30px rgba(255, 69, 0, 0.9), 0 0 60px rgba(255, 0, 0, 0.6)",
          }}
        >
          UPPER BODY
          <br />
          <span
            style={{
              background: "linear-gradient(180deg, #fff7ad 0%, #ffa100 60%, #ff3b00 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            OVERLOAD
          </span>
        </div>

        {/* High-Energy Tech Hook */}
        <div
          style={{
            marginTop: 24,
            fontFamily: bebasFont,
            fontSize: 40,
            letterSpacing: 3,
            color: "#ffffff",
            opacity: subTextOpacity,
            textShadow: "0 4px 20px rgba(0,0,0,0.9)",
            background: "rgba(0, 0, 0, 0.65)",
            padding: "8px 28px",
            borderRadius: 16,
            border: "1px solid rgba(255, 140, 0, 0.5)",
            boxShadow: "0 0 25px rgba(255, 69, 0, 0.4)",
          }}
        >
          FULL 8-EXERCISE PROTOCOL // RPE 9.5 🔥
        </div>
      </div>

      {/* White Flash overlay on beat */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#ffffff",
          opacity: flash,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
