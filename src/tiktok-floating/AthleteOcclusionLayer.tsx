import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import trackingDatabaseRaw from "../../public/tracking/ai_biomechanics_tracking.json";

interface TrackingFrame {
  frame: number;
  occlusionPolygon?: number[][];
}

interface ExerciseTracking {
  tracking: TrackingFrame[];
}

const trackingDatabase = trackingDatabaseRaw as Record<string, ExerciseTracking>;

interface AthleteOcclusionLayerProps {
  exerciseId: string;
  children: React.ReactNode;
}

export const AthleteOcclusionLayer: React.FC<AthleteOcclusionLayerProps> = ({
  exerciseId,
  children,
}) => {
  const frame = useCurrentFrame();

  const exData = trackingDatabase[exerciseId];
  if (!exData || !exData.tracking) {
    return <>{children}</>;
  }

  // Find tracking frame or nearest frame
  const frameIndex = Math.min(frame, exData.tracking.length - 1);
  const currentTracking = exData.tracking[frameIndex];
  const polygon = currentTracking?.occlusionPolygon;

  // If no polygon detected, render children normally
  if (!polygon || polygon.length < 4) {
    return <>{children}</>;
  }

  // Construct SVG evenodd path: Outer rectangle minus inner athlete silhouette
  // This cuts a hole in the text layer precisely where Hamzawy is standing!
  const clipId = `athlete-occlusion-${exerciseId}`;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse" clipRule="evenodd">
            {/* Outer canvas (covers entire 1080x1920) */}
            <path
              d={`M 0 0 H 1080 V 1920 H 0 Z M ${polygon
                .map((pt) => `${(pt[0] / 100) * 1080} ${(pt[1] / 100) * 1920}`)
                .join(" L ")} Z`}
              fillRule="evenodd"
            />
          </clipPath>
        </defs>
      </svg>

      {/* Layer with athlete body cutout applied */}
      <div
        style={{
          width: "100%",
          height: "100%",
          clipPath: `url(#${clipId})`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
