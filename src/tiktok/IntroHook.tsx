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
import { loadFont as loadCairo } from "@remotion/google-fonts/Cairo";

const { fontFamily: bebasFont } = loadBebas();
const { fontFamily: cairoFont } = loadCairo("normal", {
  weights: ["700", "900"],
  ignoreTooManyRequestsWarning: true,
});

export const IntroHook: React.FC = () => {
  const frame = useCurrentFrame();

  // Fast pulse & zoom
  const scale = interpolate(frame, [0, 45, 60], [1.15, 1, 1.05], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const flash = interpolate(frame, [0, 6, 12, 18], [1, 0, 0.6, 0], {
    extrapolateRight: "clamp",
  });

  const textScale = interpolate(frame, [0, 15], [0.8, 1], {
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
      {/* Bass Impact Audio */}
      <Audio src={staticFile("sfx/bass_hit.wav")} volume={1} />

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
          DRAGON'S LAIR // PULL DAY
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
          UNLEASH
          <br />
          <span
            style={{
              background: "linear-gradient(180deg, #fff7ad 0%, #ffa100 60%, #ff3b00 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            THE DRAGON
          </span>
        </div>

        {/* Arabic Viral Hook */}
        <div
          style={{
            marginTop: 24,
            fontFamily: cairoFont,
            fontSize: 42,
            fontWeight: 900,
            color: "#ffffff",
            opacity: subTextOpacity,
            direction: "rtl",
            textShadow: "0 4px 20px rgba(0,0,0,0.9)",
            background: "rgba(0, 0, 0, 0.6)",
            padding: "8px 24px",
            borderRadius: 16,
            border: "1px solid rgba(255, 140, 0, 0.4)",
          }}
        >
          تمرينة ظهر وسواعد تفجير 🔥
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
