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
              width: "520px",
              height: "760px",
              display: "flex",
              justifyContent: "space-between",
              top: "60px",
            }}
          >
            {/* Left Laser Guide Rail */}
            <div
              style={{
                width: "5px",
                height: `${trajectoryGrowth}px`,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0) 0%, #FFFFFF 15%, #FFE259 45%, #FFA500 80%, rgba(255,165,0,0) 100%)",
                boxShadow: `0 0 16px rgba(255, 226, 89, ${laserPulse}), 0 0 35px rgba(255, 165, 0, 0.7), 0 0 60px rgba(255, 140, 0, 0.35)`,
                borderRadius: "999px",
              }}
            />

            {/* Right Laser Guide Rail */}
            <div
              style={{
                width: "5px",
                height: `${trajectoryGrowth}px`,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0) 0%, #FFFFFF 15%, #FFE259 45%, #FFA500 80%, rgba(255,165,0,0) 100%)",
                boxShadow: `0 0 16px rgba(255, 226, 89, ${laserPulse}), 0 0 35px rgba(255, 165, 0, 0.7), 0 0 60px rgba(255, 140, 0, 0.35)`,
                borderRadius: "999px",
              }}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* 🌟 2. MAIN 3D FLOATING CHROME TITLE (@erabii viral aesthetic in upper safe zone) */}
      {mainTitleOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            top: "230px",
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: mainTitleOpacity,
            perspective: "1000px",
            transform: `perspective(1000px) rotateX(10deg) scale(${scale})`,
            transformOrigin: "center top",
            zIndex: 50,
          }}
        >
          {/* Subtle contrast diffuser behind 3D floating text */}
          <div
            style={{
              position: "absolute",
              top: "-20px",
              width: "740px",
              height: "340px",
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.20) 50%, transparent 75%)",
              zIndex: -1,
              pointerEvents: "none",
            }}
          />

          {/* Subtle Golden Sub-badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "14px",
              fontFamily,
              fontWeight: 800,
              fontSize: "17px",
              letterSpacing: "4px",
              color: "#FFE259",
              textTransform: "uppercase",
              filter:
                "drop-shadow(0 0 10px rgba(255, 215, 0, 0.75)) drop-shadow(0 2px 4px rgba(0,0,0,0.9))",
            }}
          >
            <span>EXERCISE {exerciseNumber} // {totalExercises}</span>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>•</span>
            <span style={{ color: "#FFF" }}>{muscleTag}</span>
          </div>

          {/* Massive Stacked Kinetic 3D Chrome Typography */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              letterSpacing: "-1.5px",
              fontFamily,
              fontWeight: 900,
              textTransform: "uppercase",
              lineHeight: 0.88,
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
                        ? "70px"
                        : line.length > 9
                        ? "84px"
                        : "96px",
                    background: isHighlight
                      ? "linear-gradient(180deg, #FFFFFF 20%, #FFF4B8 55%, #FFCA28 80%, #FF9800 100%)"
                      : "linear-gradient(180deg, #FFFFFF 25%, #E2E8F0 65%, #94A3B8 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow:
                      "0 1px 0 rgba(255,255,255,0.9), 0 2px 0 #CBD5E1, 0 3px 0 #94A3B8, 0 4px 0 #64748B, 0 6px 12px rgba(0,0,0,0.9)",
                    filter:
                      "drop-shadow(0 0 20px rgba(255, 215, 60, 0.85)) drop-shadow(0 0 45px rgba(255, 150, 0, 0.45)) drop-shadow(0 6px 14px rgba(0, 0, 0, 0.95))",
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
              marginTop: "18px",
              fontFamily,
              fontWeight: 800,
              fontSize: "17px",
              letterSpacing: "3px",
              color: "rgba(255,255,255,0.9)",
              textTransform: "uppercase",
              filter:
                "drop-shadow(0 0 8px rgba(255, 255, 255, 0.5)) drop-shadow(0 2px 6px rgba(0,0,0,0.9))",
            }}
          >
            {intensityTag}
          </div>
        </div>
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
