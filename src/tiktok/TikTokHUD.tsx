import React from "react";
import {
  interpolate,
  useCurrentFrame,
} from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { getSpring } from "../motion";

const { fontFamily: bebasFont } = loadBebas();

export interface ExerciseInfo {
  number: string;
  name: string;
  nameArabic?: string;
  muscle: string;
  muscleArabic?: string;
  intensity: string;
}

export const TikTokHUD: React.FC<{
  exercise: ExerciseInfo;
  currentRep?: number;
  totalReps?: number;
  totalExercises?: number;
  exerciseIndex?: number;
  clipProgress?: number; // 0 to 1
  isPeakContraction?: boolean;
}> = ({
  exercise,
  currentRep = 1,
  totalReps = 4,
  totalExercises = 8,
  exerciseIndex = 1,
  clipProgress = 0,
}) => {
  const frame = useCurrentFrame();

  // 🎬 1. Kinetic Staggered Springs (Smooth, rock-solid entrance without oscillation)
  const headerSpring = getSpring(frame, 30, "snap", 0);
  const cardSpring = getSpring(frame, 30, "smooth", 3);

  // Header slide down
  const headerY = interpolate(headerSpring, [0, 1], [-80, 0]);
  const headerOpacity = interpolate(headerSpring, [0, 1], [0, 1]);

  // Main Card slide up & fade
  const cardY = interpolate(cardSpring, [0, 1], [50, 0]);
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);

  // 💫 2. Holographic Metallic Sheen Sweep across Card (Frame 16 to 36)
  const sheenProgress = interpolate(frame, [16, 36], [-100, 200], {
    extrapolateLeft: "clamp",
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
      {/* 🔝 Top Header Bar (TikTok Safe Top: 130px from top) */}
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
          transform: `translateY(${headerY}px)`,
          opacity: headerOpacity,
        }}
      >
        {/* Athlete Master Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(10, 12, 18, 0.78)",
            padding: "8px 22px",
            borderRadius: 30,
            border: "1px solid rgba(0, 255, 204, 0.35)",
            backdropFilter: "blur(14px)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.6), 0 0 10px rgba(0, 255, 204, 0.2)",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#00ffcc",
              boxShadow: "0 0 10px #00ffcc",
            }}
          />
          <span style={{ color: "#ffffff", fontSize: 24, letterSpacing: 2 }}>
            HAMZAWY // ATHLETE PROTOCOL
          </span>
        </div>

        {/* Dynamic Exercise Counter Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(10, 12, 18, 0.78)",
            padding: "8px 22px",
            borderRadius: 30,
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#ffffff",
            fontSize: 24,
            letterSpacing: 2,
            backdropFilter: "blur(14px)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.6)",
          }}
        >
          <span style={{ color: "#ff8c00" }}>EXERCISE</span>
          <span style={{ color: "#ffffff" }}>{exerciseIndex}</span>
          <span style={{ color: "rgba(255,255,255,0.4)" }}>/</span>
          <span style={{ color: "rgba(255,255,255,0.6)" }}>{totalExercises}</span>
        </div>
      </div>

      {/* 🔽 Unified Cyber-Glass Monolith HUD (TikTok Safe Bottom: 310px above screen base) */}
      <div
        style={{
          position: "absolute",
          bottom: 310,
          left: 50,
          right: 140, // Keeps space clear for TikTok right action icons
          transform: `translateY(${cardY}px)`,
          opacity: cardOpacity,
        }}
      >
        <div
          style={{
            position: "relative",
            background:
              "linear-gradient(145deg, rgba(16, 20, 30, 0.92) 0%, rgba(8, 10, 16, 0.95) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            borderTop: "1px solid rgba(255, 255, 255, 0.28)",
            borderRadius: 20,
            padding: "20px 24px 18px 24px",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {/* Top Neon Accent Line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background:
                "linear-gradient(90deg, #ff4500 0%, #ff8c00 50%, #00ffcc 100%)",
              boxShadow: "0 0 12px rgba(255, 69, 0, 0.8)",
            }}
          />

          {/* Holographic Sheen Sweep Layer */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.0) 38%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.0) 62%, transparent 80%)",
              transform: `translateX(${sheenProgress}%)`,
              pointerEvents: "none",
            }}
          />

          {/* 🏷️ Top Meta Tier: Target Muscle & Intensity Pills */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {/* Target Muscle Pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255, 69, 0, 0.14)",
                border: "1px solid rgba(255, 69, 0, 0.45)",
                padding: "4px 14px",
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#ff8c00",
                  boxShadow: "0 0 8px #ff8c00",
                }}
              />
              <span
                style={{
                  color: "#ff8c00",
                  fontFamily: bebasFont,
                  fontSize: 22,
                  letterSpacing: 1.8,
                }}
              >
                {exercise.muscle}
              </span>
            </div>

            {/* Intensity Pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(255, 50, 50, 0.12)",
                border: "1px solid rgba(255, 50, 50, 0.35)",
                padding: "4px 12px",
                borderRadius: 8,
              }}
            >
              <span
                style={{
                  color: "#ff5555",
                  fontFamily: bebasFont,
                  fontSize: 21,
                  letterSpacing: 1.5,
                }}
              >
                🔥 {exercise.intensity}
              </span>
            </div>
          </div>

          {/* 🏆 Hero Title Tier */}
          <div
            style={{
              fontFamily: bebasFont,
              fontSize: 52,
              lineHeight: 1.05,
              color: "#ffffff",
              letterSpacing: 2.2,
              textShadow: "0 2px 20px rgba(0, 0, 0, 0.9)",
              position: "relative",
              zIndex: 2,
              marginTop: 2,
            }}
          >
            {exercise.name}
          </div>

          {/* ⚡ Bottom Telemetry Tier: Segmented Rep Pips + Progress */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              paddingTop: 10,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            {/* Rep Readout */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: bebasFont,
                fontSize: 26,
                letterSpacing: 1.8,
                color: "#00ffcc",
                textShadow: "0 0 10px rgba(0, 255, 204, 0.6)",
                whiteSpace: "nowrap",
              }}
            >
              <span>REP</span>
              <span style={{ color: "#ffffff", fontSize: 28 }}>
                0{currentRep}
              </span>
              <span style={{ color: "rgba(255,255,255,0.3)" }}>/</span>
              <span style={{ color: "rgba(255,255,255,0.6)" }}>
                0{totalReps}
              </span>
            </div>

            {/* Segmented Rep Pips (Athletic Visual Blocks) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                flex: 1,
                maxWidth: 220,
              }}
            >
              {Array.from({ length: totalReps }).map((_, i) => {
                const isCompletedOrCurrent = i + 1 <= currentRep;
                const isCurrent = i + 1 === currentRep;
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: isCurrent
                        ? "#00ffcc"
                        : isCompletedOrCurrent
                        ? "rgba(0, 255, 204, 0.5)"
                        : "rgba(255, 255, 255, 0.12)",
                      boxShadow: isCurrent
                        ? "0 0 10px #00ffcc"
                        : "none",
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Precision Fluid Bottom Progress Bar */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              backgroundColor: "rgba(255, 255, 255, 0.06)",
            }}
          >
            <div
              style={{
                width: `${Math.min(100, Math.max(3, clipProgress * 100))}%`,
                height: "100%",
                background: "linear-gradient(90deg, #ff4500, #ff8c00, #00ffcc)",
                boxShadow: "0 0 8px #00ffcc",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
