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

const WORKOUT_ROUTINE = [
  "01. T-Bar Row (Lats / Thickness)",
  "02. Straight-Arm Cable Pulldown",
  "03. Seated Dragon Machine Row",
  "04. Rear Delt Cable Crossover",
  "05. Close-Grip Lat Pulldown",
  "06. Heavy Dumbbell Shrugs",
  "07. Cable Crossover Burnout",
];

export const OutroCTA: React.FC = () => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [0, 20], [0.88, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.4)),
  });

  const pulse = Math.sin(frame / 5) * 0.05 + 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#060609",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Audio src={staticFile("sfx/bass_hit.wav")} volume={0.9} />

      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, rgba(255, 69, 0, 0.4) 0%, rgba(5, 5, 8, 0.98) 80%)",
        }}
      />

      {/* Center Outro Card */}
      <div
        style={{
          scale,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "0 40px",
          zIndex: 10,
          width: "100%",
          maxWidth: 900,
        }}
      >
        <div
          style={{
            fontFamily: bebasFont,
            fontSize: 32,
            letterSpacing: 4,
            color: "#ffaa00",
            marginBottom: 6,
          }}
        >
          DRAGON'S LAIR // ROUTINE SUMMARY
        </div>

        <div
          style={{
            fontFamily: bebasFont,
            fontSize: 72,
            lineHeight: 1,
            color: "#ffffff",
            letterSpacing: 3,
            textShadow: "0 0 30px rgba(255, 69, 0, 0.9)",
          }}
        >
          FULL PULL DAY PROTOCOL
        </div>

        {/* Workout Routine Checklist Box */}
        <div
          style={{
            width: "88%",
            background: "rgba(15, 15, 22, 0.85)",
            border: "1px solid rgba(255, 140, 0, 0.35)",
            borderRadius: 18,
            padding: "18px 24px",
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
          }}
        >
          {WORKOUT_ROUTINE.map((item, i) => (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontFamily: bebasFont,
                fontSize: 26,
                letterSpacing: 1.5,
                color: "#e0e0e0",
                borderBottom:
                  i === WORKOUT_ROUTINE.length - 1
                    ? "none"
                    : "1px solid rgba(255,255,255,0.08)",
                paddingBottom: 4,
              }}
            >
              <span>{item}</span>
              <span style={{ color: "#00ffcc" }}>✓ DONE</span>
            </div>
          ))}
        </div>

        {/* Arabic Call-To-Action Button */}
        <div
          style={{
            marginTop: 25,
            fontFamily: cairoFont,
            fontSize: 36,
            fontWeight: 900,
            color: "#ffffff",
            direction: "rtl",
            background: "linear-gradient(90deg, #ff4500, #ff8c00)",
            padding: "12px 38px",
            borderRadius: 20,
            boxShadow: "0 0 30px rgba(255, 69, 0, 0.8)",
            transform: `scale(${pulse})`,
          }}
        >
          احفظ التمرينة للتدريب الجاي 💾🔥
        </div>

        <div
          style={{
            marginTop: 18,
            fontFamily: bebasFont,
            fontSize: 24,
            color: "#888",
            letterSpacing: 2,
          }}
        >
          FOLLOW FOR MORE GYM WORKOUTS // @DRAGON.GYM
        </div>
      </div>
    </AbsoluteFill>
  );
};
