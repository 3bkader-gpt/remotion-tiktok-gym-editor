import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

// 🔤 Load ultra-bold Montserrat (800 / 900) as identified in @erabii reference
const { fontFamily } = loadFont("normal", {
  weights: ["800", "900"],
});

export interface FloatingWorkoutHUDProps {
  exerciseNumber: string; // e.g. "01"
  totalExercises: number; // e.g. 8
  titleLines: string[]; // e.g. ["INCLINE", "DUMBBELL", "PRESS"]
  muscleTag: string; // e.g. "UPPER CHEST // CLAVICULAR HEAD"
  intensityTag: string; // e.g. "4 SETS × 8-10 REPS • RPE 9.0"
  showTrajectory?: boolean;
  currentRep?: number;
  totalReps?: number;
}

export const FloatingWorkoutHUD: React.FC<FloatingWorkoutHUDProps> = ({
  exerciseNumber,
  totalExercises,
  titleLines,
  muscleTag,
  intensityTag,
  showTrajectory = true,
  currentRep = 1,
  totalReps = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ⚡ 1. Spring-driven entrance for the title typography
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 180 },
  });

  const scale = interpolate(entrance, [0, 1], [0.86, 1.0]);
  const tracking = interpolate(entrance, [0, 1], [16, 5]);

  // Entrance opacity: quick snap in (frames 0 to 8)
  const fadeIn = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  // ⏱️ Dynamic Fade-out (Reference Video Style):
  // Big floating title displays prominently for ~2.8s (frames 0 to 75),
  // then gracefully fades out into a minimal HUD so viewer focuses 100% on lifter form!
  const titleFadeOut = interpolate(frame, [72, 88], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const mainTitleOpacity = fadeIn * titleFadeOut;

  // Persistent minimal corner badge fades in as the main title fades out
  const minimalBadgeOpacity = interpolate(frame, [80, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ⚡ 2. Neon Vertical Trajectory Guide Rails (Dumbbell & Barbell Path Tracking)
  const trajectoryGrowth = interpolate(frame, [12, 32], [0, 680], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Laser electrical oscillation
  const laserPulse = Math.sin(frame * 0.28) * 0.16 + 0.84;
  const trajectoryFadeOut = interpolate(frame, [75, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* ⚡ 1. NEON BIOMECHANICAL TRAJECTORY GUIDE RAILS (Frames 12 - 90) */}
      {showTrajectory && trajectoryFadeOut > 0.01 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: trajectoryFadeOut,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "460px",
              height: "720px",
              display: "flex",
              justifyContent: "space-between",
              top: "-20px",
            }}
          >
            {/* Left Laser Guide Rail */}
            <div
              style={{
                width: "4px",
                height: `${trajectoryGrowth}px`,
                background:
                  "linear-gradient(180deg, rgba(255,220,120,0) 0%, #FFE259 25%, #FFA500 75%, rgba(255,165,0,0) 100%)",
                boxShadow: `0 0 14px rgba(255, 180, 0, ${laserPulse}), 0 0 32px rgba(255, 140, 0, 0.55)`,
                borderRadius: "999px",
              }}
            />

            {/* Right Laser Guide Rail */}
            <div
              style={{
                width: "4px",
                height: `${trajectoryGrowth}px`,
                background:
                  "linear-gradient(180deg, rgba(255,220,120,0) 0%, #FFE259 25%, #FFA500 75%, rgba(255,165,0,0) 100%)",
                boxShadow: `0 0 14px rgba(255, 180, 0, ${laserPulse}), 0 0 32px rgba(255, 140, 0, 0.55)`,
                borderRadius: "999px",
              }}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* 🌟 2. MAIN BORDERLESS FLOATING CHROME TITLE (Mid-Chest Safe Zone Y: ~54%) */}
      {mainTitleOpacity > 0.01 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            top: "80px",
            opacity: mainTitleOpacity,
            transform: `scale(${scale})`,
          }}
        >
          {/* Top Pill / Muscle Tag */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px",
              fontFamily,
              fontWeight: 800,
              fontSize: "20px",
              letterSpacing: "4px",
              color: "#FFE259",
              textTransform: "uppercase",
              filter:
                "drop-shadow(0 0 12px rgba(255, 215, 0, 0.8)) drop-shadow(0 2px 6px rgba(0,0,0,0.9))",
            }}
          >
            <span>EXERCISE {exerciseNumber} // {totalExercises}</span>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>•</span>
            <span style={{ color: "#00E5FF" }}>{muscleTag}</span>
          </div>

          {/* Stacked Kinetic Bold Chrome Typography */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              letterSpacing: `${tracking}px`,
              fontFamily,
              fontWeight: 900,
              textTransform: "uppercase",
              lineHeight: 0.92,
            }}
          >
            {titleLines.map((line, idx) => {
              const isHighlight =
                idx === titleLines.length - 1 || titleLines.length === 1;
              return (
                <span
                  key={idx}
                  style={{
                    fontSize:
                      line.length > 14
                        ? "58px"
                        : line.length > 9
                        ? "68px"
                        : "78px",
                    background: isHighlight
                      ? "linear-gradient(180deg, #FFFFFF 15%, #FFE259 60%, #FFA500 100%)"
                      : "linear-gradient(180deg, #FFFFFF 20%, #DCE5ED 65%, #94A3B8 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter:
                      "drop-shadow(0 0 16px rgba(255, 200, 50, 0.65)) drop-shadow(0 0 38px rgba(255, 140, 0, 0.35)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.95))",
                    display: "inline-block",
                  }}
                >
                  {line}
                </span>
              );
            })}
          </div>

          {/* Bottom Intensity / Prescription Line */}
          <div
            style={{
              marginTop: "20px",
              fontFamily,
              fontWeight: 800,
              fontSize: "19px",
              letterSpacing: "3px",
              color: "#FFFFFF",
              textTransform: "uppercase",
              filter:
                "drop-shadow(0 0 8px rgba(255, 255, 255, 0.6)) drop-shadow(0 2px 8px rgba(0,0,0,0.9))",
            }}
          >
            {intensityTag}
          </div>
        </AbsoluteFill>
      )}

      {/* 📌 3. PERSISTENT MINIMAL FLOATING BADGE (Visible after main title fades out) */}
      {minimalBadgeOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            top: "120px",
            left: "40px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            opacity: minimalBadgeOpacity,
            fontFamily,
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.85))",
          }}
        >
          {/* Glowing Exercise Number Dot */}
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FFE259, #FF9900)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#000",
              fontWeight: 900,
              fontSize: "16px",
              boxShadow: "0 0 14px rgba(255, 180, 0, 0.7)",
            }}
          >
            {exerciseNumber}
          </div>

          {/* Minimal Exercise Name */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "2px",
                textTransform: "uppercase",
                filter: "drop-shadow(0 0 8px rgba(255,200,50,0.5))",
              }}
            >
              {titleLines.join(" ")}
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 800,
                color: "#FFE259",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              {muscleTag}
            </span>
          </div>
        </div>
      )}

      {/* 🔢 4. FLOATING REP PIPS COUNTER (Bottom Left Safe Area, Above TikTok Captions) */}
      <div
        style={{
          position: "absolute",
          bottom: "220px",
          left: "40px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontFamily,
          filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.9))",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "6px",
            alignItems: "center",
          }}
        >
          {Array.from({ length: totalReps }).map((_, rIdx) => {
            const isCompleted = rIdx < currentRep;
            const isCurrent = rIdx === currentRep - 1;
            return (
              <div
                key={rIdx}
                style={{
                  width: isCurrent ? "24px" : "14px",
                  height: "8px",
                  borderRadius: "4px",
                  background: isCompleted
                    ? "linear-gradient(90deg, #FFE259, #FFA500)"
                    : "rgba(255, 255, 255, 0.25)",
                  boxShadow: isCurrent
                    ? "0 0 12px rgba(255, 180, 0, 0.9)"
                    : "none",
                }}
              />
            );
          })}
        </div>

        <span
          style={{
            fontSize: "15px",
            fontWeight: 800,
            color: "#FFF",
            letterSpacing: "1.5px",
          }}
        >
          REP {currentRep}/{totalReps}
        </span>
      </div>
    </AbsoluteFill>
  );
};
