import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadCairo } from "@remotion/google-fonts/Cairo";

const { fontFamily: bebasFont } = loadBebas();
const { fontFamily: cairoFont } = loadCairo("normal", {
  weights: ["700", "900"],
  ignoreTooManyRequestsWarning: true,
});

export interface ExerciseInfo {
  number: string;
  name: string;
  nameArabic: string;
  muscle: string;
  muscleArabic: string;
  intensity: string;
}

export const TikTokHUD: React.FC<{
  exercise: ExerciseInfo;
  currentRep?: number;
  totalReps?: number;
  totalExercises?: number;
  exerciseIndex?: number;
  clipProgress?: number; // 0 to 1
}> = ({
  exercise,
  currentRep = 1,
  totalReps = 4,
  totalExercises = 7,
  exerciseIndex = 1,
  clipProgress = 0,
}) => {
  const frame = useCurrentFrame();

  // Pulse animation for recording dot
  const pulse = Math.sin(frame / 4) * 0.2 + 0.8;
  const slideIn = interpolate(frame, [0, 10], [50, 0], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      {/* Cinematic Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* Top Header Bar (TikTok Safe Top: 130px from top) */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 50,
          right: 50,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: bebasFont,
        }}
      >
        {/* REC indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(0, 0, 0, 0.65)",
            padding: "8px 20px",
            borderRadius: 30,
            border: "1px solid rgba(255, 68, 68, 0.5)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: "#ff3b30",
              boxShadow: "0 0 14px #ff3b30",
              opacity: pulse,
            }}
          />
          <span style={{ color: "#fff", fontSize: 24, letterSpacing: 2 }}>
            DRAGON'S LAIR // 4K MASTER
          </span>
        </div>

        {/* Exercise Counter Badge */}
        <div
          style={{
            background: "rgba(0, 0, 0, 0.65)",
            padding: "8px 20px",
            borderRadius: 30,
            border: "1px solid rgba(255, 170, 0, 0.5)",
            color: "#ffaa00",
            fontSize: 24,
            letterSpacing: 2,
            backdropFilter: "blur(12px)",
          }}
        >
          EXERCISE {exerciseIndex} / {totalExercises}
        </div>
      </div>

      {/* Four Corner Viewfinder Brackets */}
      <div
        style={{
          position: "absolute",
          top: 195,
          left: 45,
          width: 35,
          height: 35,
          borderTop: "3px solid rgba(255,255,255,0.75)",
          borderLeft: "3px solid rgba(255,255,255,0.75)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 195,
          right: 45,
          width: 35,
          height: 35,
          borderTop: "3px solid rgba(255,255,255,0.75)",
          borderRight: "3px solid rgba(255,255,255,0.75)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 300,
          left: 45,
          width: 35,
          height: 35,
          borderBottom: "3px solid rgba(255,255,255,0.75)",
          borderLeft: "3px solid rgba(255,255,255,0.75)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 300,
          right: 45,
          width: 35,
          height: 35,
          borderBottom: "3px solid rgba(255,255,255,0.75)",
          borderRight: "3px solid rgba(255,255,255,0.75)",
        }}
      />

      {/* Lower Exercise Info HUD (TikTok Safe Bottom: above 300px) */}
      <div
        style={{
          position: "absolute",
          bottom: 320,
          left: 50,
          right: 140, // Space for TikTok right action buttons (like, comment, share)
          transform: `translateY(${slideIn}px)`,
          opacity,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* Muscle Target & Intensity Badges */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "linear-gradient(90deg, #ff4500, #ff8c00)",
              padding: "6px 18px",
              borderRadius: 8,
              boxShadow: "0 0 16px rgba(255, 69, 0, 0.6)",
            }}
          >
            <span
              style={{
                color: "#ffffff",
                fontFamily: cairoFont,
                fontWeight: 900,
                fontSize: 22,
                direction: "rtl",
              }}
            >
              🎯 {exercise.muscleArabic}
            </span>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(0, 0, 0, 0.75)",
              border: "1px solid #ff3333",
              padding: "6px 14px",
              borderRadius: 8,
              color: "#ff4444",
              fontFamily: bebasFont,
              fontSize: 24,
              letterSpacing: 1.5,
              backdropFilter: "blur(8px)",
            }}
          >
            🔥 {exercise.intensity}
          </div>
        </div>

        {/* Exercise Main Title (English & Arabic) */}
        <div
          style={{
            background: "rgba(10, 10, 15, 0.85)",
            borderLeft: "6px solid #ff4500",
            padding: "16px 22px",
            borderRadius: "0 16px 16px 0",
            backdropFilter: "blur(14px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.7)",
          }}
        >
          <div
            style={{
              fontFamily: bebasFont,
              fontSize: 54,
              lineHeight: 1,
              color: "#ffffff",
              letterSpacing: 2,
              textShadow: "0 2px 15px rgba(0,0,0,0.8)",
            }}
          >
            {exercise.name}
          </div>
          <div
            style={{
              fontFamily: cairoFont,
              fontSize: 26,
              fontWeight: 800,
              color: "#ffc83b",
              marginTop: 4,
              direction: "rtl",
              textAlign: "right",
            }}
          >
            {exercise.nameArabic}
          </div>
        </div>

        {/* Live Dynamic Multi-Rep Counter Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 15,
            marginTop: 4,
          }}
        >
          <div
            style={{
              fontFamily: bebasFont,
              fontSize: 28,
              color: "#00ffcc",
              letterSpacing: 1.5,
              textShadow: "0 0 10px rgba(0, 255, 204, 0.7)",
              minWidth: 150,
            }}
          >
            REP // 0{currentRep} OF {totalReps}
          </div>
          <div
            style={{
              flex: 1,
              height: 8,
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.min(100, Math.max(5, clipProgress * 100))}%`,
                height: "100%",
                background: "linear-gradient(90deg, #00ffcc, #ffaa00, #ff4500)",
                boxShadow: "0 0 10px #00ffcc",
                transition: "width 0.1s ease-out",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
