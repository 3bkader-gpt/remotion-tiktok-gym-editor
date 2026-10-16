import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Series,
  staticFile,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const VIDEO_FILES = [
  "2026_10_04_21_08_54_IMG_7069.MOV",
  "2026_10_04_21_23_24_IMG_7071.MOV",
  "2026_10_04_21_33_56_IMG_7073.MOV",
  "2026_10_04_21_54_13_IMG_7081.MOV",
  "2026_10_04_22_13_29_IMG_7091.MOV",
  "2026_10_04_22_27_13_IMG_7103.MOV",
  "2026_10_04_22_41_30_IMG_7117.MOV",
];

// Single Video Player Component
export const SingleVideoPlayer: React.FC<{
  filename: string;
  title?: string;
}> = ({ filename, title }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo
        src={staticFile(filename)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
      {title && (
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 40,
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            padding: "12px 24px",
            borderRadius: 12,
            color: "#ffffff",
            fontSize: 28,
            fontFamily: "system-ui, sans-serif",
            opacity,
            backdropFilter: "blur(8px)",
          }}
        >
          {title}
        </div>
      )}
    </AbsoluteFill>
  );
};

// Sequenced Video Montage Component
export const SequencedMontage: React.FC<{
  clipDurationInFrames?: number;
}> = ({ clipDurationInFrames = 150 }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Series>
        {VIDEO_FILES.map((file, index) => (
          <Series.Sequence
            key={file}
            durationInFrames={clipDurationInFrames}
          >
            <SingleVideoPlayer
              filename={file}
              title={`Clip ${index + 1}: ${file.split("_IMG_")[1] || file}`}
            />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
