import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import trackingDatabaseRaw from "../../public/tracking/ai_biomechanics_tracking.json";

interface TrackingFrame {
  frame: number;
  leftWrist: { x: number; y: number };
  rightWrist: { x: number; y: number };
  phase: string;
  velocity: number;
  occlusionPolygon: number[][];
}

interface ExerciseTracking {
  exercise: string;
  filename: string;
  totalFrames: number;
  tracking: TrackingFrame[];
}

const trackingDatabase = trackingDatabaseRaw as Record<string, ExerciseTracking>;

export interface DynamicAIBiomechanicsHUDProps {
  exerciseId: string; // e.g. "01"
  showLaserTracking?: boolean;
}

export const DynamicAIBiomechanicsHUD: React.FC<DynamicAIBiomechanicsHUDProps> = ({
  exerciseId,
  showLaserTracking = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exData = trackingDatabase[exerciseId];
  if (!exData || !exData.tracking || exData.tracking.length === 0) {
    return null;
  }

  // Clamp frame to available tracking frames
  const frameIndex = Math.min(frame, exData.tracking.length - 1);
  const currentTracking = exData.tracking[frameIndex];
  if (!currentTracking) {
    return null;
  }

  const { leftWrist, rightWrist, phase, velocity } = currentTracking;

  // Entrance spring for telemetry
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 180 },
  });

  const hudOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const laserPulse = Math.sin(frame * 0.3) * 0.15 + 0.85;

  // Telemetry Phase Badge Colors
  const isConcentric = phase === "CONCENTRIC_PUSH";
  const isEccentric = phase === "ECCENTRIC_STRETCH";

  const phaseColor = isConcentric ? "#00FFCC" : isEccentric ? "#FFE259" : "#FF9900";
  const phaseLabel = isConcentric
    ? "CONCENTRIC // POWER DRIVE"
    : isEccentric
    ? "ECCENTRIC // TENSION STRETCH"
    : "PEAK CONTRACTION LOCKOUT";

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* ⚡ 1. AI-DRIVEN NEON BIOMECHANICAL LASER RAILS TRACKING DUMBBELLS IN REAL TIME */}
      {showLaserTracking && (
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            overflow: "visible",
          }}
        >
          <defs>
            <linearGradient id="laserRailGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFE259" stopOpacity="0" />
              <stop offset="30%" stopColor="#FFE259" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#FF9900" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#FF5500" stopOpacity="0" />
            </linearGradient>

            <filter id="laserRailGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Left Dumbbell / Wrist Laser Guide Line */}
          <line
            x1={`${leftWrist.x}%`}
            y1={`${Math.max(10, leftWrist.y - 25)}%`}
            x2={`${leftWrist.x}%`}
            y2={`${Math.min(90, leftWrist.y + 25)}%`}
            stroke="url(#laserRailGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#laserRailGlow)"
            opacity={laserPulse * 0.9}
          />
          {/* Left Wrist Tracker Reticle Dot */}
          <circle
            cx={`${leftWrist.x}%`}
            cy={`${leftWrist.y}%`}
            r="6"
            fill="#FFE259"
            filter="url(#laserRailGlow)"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />

          {/* Right Dumbbell / Wrist Laser Guide Line */}
          <line
            x1={`${rightWrist.x}%`}
            y1={`${Math.max(10, rightWrist.y - 25)}%`}
            x2={`${rightWrist.x}%`}
            y2={`${Math.min(90, rightWrist.y + 25)}%`}
            stroke="url(#laserRailGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#laserRailGlow)"
            opacity={laserPulse * 0.9}
          />
          {/* Right Wrist Tracker Reticle Dot */}
          <circle
            cx={`${rightWrist.x}%`}
            cy={`${rightWrist.y}%`}
            r="6"
            fill="#FFE259"
            filter="url(#laserRailGlow)"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
        </svg>
      )}

      {/* 📊 2. AI TELEMETRY HUD (Top Right AR Diagnostics Widget) */}
      <div
        style={{
          position: "absolute",
          top: "120px",
          right: "40px",
          opacity: hudOpacity,
          transform: `scale(${entrance})`,
          transformOrigin: "top right",
          background: "rgba(10, 14, 20, 0.75)",
          border: `1px solid ${phaseColor}66`,
          borderRadius: "14px",
          padding: "12px 18px",
          backdropFilter: "blur(12px)",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          boxShadow: `0 4px 20px rgba(0, 0, 0, 0.8), 0 0 16px ${phaseColor}33`,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: phaseColor,
              boxShadow: `0 0 8px ${phaseColor}`,
            }}
          />
          <span
            style={{
              fontSize: "13px",
              fontWeight: 900,
              letterSpacing: "1.5px",
              color: phaseColor,
              textTransform: "uppercase",
            }}
          >
            {phaseLabel}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", fontSize: "12px", color: "#94A3B8", fontWeight: 700 }}>
          <span>VELOCITY:</span>
          <span style={{ color: "#FFF", fontWeight: 900 }}>{velocity >= 0 ? `+${velocity}` : velocity} px/f</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", fontSize: "12px", color: "#94A3B8", fontWeight: 700 }}>
          <span>AI TRACKING:</span>
          <span style={{ color: "#00FFCC", fontWeight: 900 }}>YOLOv8 ACTIVE</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
