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

const WORKOUT_ROUTINE = [
  "01. Incline Dumbbell Bench Press",
  "02. Chest-Supported T-Bar Row",
  "03. Machine Chest Fly",
  "04. Wide-Grip Lat Pulldown",
  "05. Standing Machine Lateral Raise",
  "06. Barbell Power Rack Shrug",
  "07. Cable Straight-Arm Pulldown",
  "08. Kneeling Cable Crunch Finisher",
];

export const FloatingOutroCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 180 },
  });

  const scale = interpolate(entrance, [0, 1], [0.88, 1.0]);
  const tracking = interpolate(entrance, [0, 1], [14, 4]);

  const buttonPulse = Math.sin(frame * 0.25) * 0.04 + 1.0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#07080a",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* 🔊 Outro Transition Whoosh */}
      <Audio src={staticFile("sfx/whoosh.wav")} volume={0.4} startFrom={0} />

      {/* Ambient Gym Lighting Glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(255, 170, 0, 0.16) 0%, rgba(7, 8, 10, 0.98) 75%)",
        }}
      />

      {/* Floating Center Content */}
      <div
        style={{
          transform: `scale(${scale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "0 40px",
          zIndex: 10,
          width: "100%",
          maxWidth: 960,
        }}
      >
        {/* Top Tag */}
        <div
          style={{
            fontFamily,
            fontSize: "20px",
            fontWeight: 800,
            letterSpacing: "5px",
            color: "#FFE259",
            marginBottom: "10px",
            textTransform: "uppercase",
            filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.7))",
          }}
        >
          HAMZAWY // COMPLETE PROGRAM
        </div>

        {/* Big Bold Metallic Chrome Title */}
        <div
          style={{
            fontFamily,
            fontSize: "56px",
            fontWeight: 900,
            lineHeight: 1.0,
            letterSpacing: `${tracking}px`,
            textTransform: "uppercase",
            background:
              "linear-gradient(180deg, #FFFFFF 20%, #DCE5ED 60%, #94A3B8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter:
              "drop-shadow(0 0 16px rgba(255, 200, 50, 0.65)) drop-shadow(0 0 35px rgba(255, 140, 0, 0.35))",
          }}
        >
          SESSION SUMMARY
        </div>

        {/* Minimal Transparent Glass List */}
        <div
          style={{
            width: "90%",
            background: "rgba(20, 24, 32, 0.55)",
            border: "1px solid rgba(255, 200, 50, 0.2)",
            borderRadius: "20px",
            padding: "24px 32px",
            marginTop: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            backdropFilter: "blur(16px)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.8)",
          }}
        >
          {WORKOUT_ROUTINE.map((item, idx) => (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontFamily,
                fontSize: "20px",
                fontWeight: 800,
                letterSpacing: "1px",
                color: "#F1F5F9",
                borderBottom:
                  idx === WORKOUT_ROUTINE.length - 1
                    ? "none"
                    : "1px solid rgba(255,255,255,0.06)",
                paddingBottom: "6px",
              }}
            >
              <span>{item}</span>
              <span
                style={{
                  color: "#FFE259",
                  fontSize: "16px",
                  fontWeight: 900,
                  filter: "drop-shadow(0 0 8px rgba(255, 215, 0, 0.7))",
                }}
              >
                ✓ COMPLETED
              </span>
            </div>
          ))}
        </div>

        {/* Pulsing Save Call-To-Action Pill */}
        <div
          style={{
            marginTop: "32px",
            transform: `scale(${buttonPulse})`,
            display: "inline-flex",
            alignItems: "center",
            gap: "14px",
            background: "linear-gradient(135deg, #FFE259 0%, #FF9900 100%)",
            color: "#000",
            padding: "16px 42px",
            borderRadius: "999px",
            fontFamily,
            fontSize: "24px",
            fontWeight: 900,
            letterSpacing: "3px",
            textTransform: "uppercase",
            boxShadow:
              "0 0 24px rgba(255, 170, 0, 0.8), 0 8px 30px rgba(0,0,0,0.7)",
          }}
        >
          <span>🔖 SAVE FOR YOUR NEXT WORKOUT</span>
        </div>
      </div>

      <FloatingFinishingStack />
    </AbsoluteFill>
  );
};
