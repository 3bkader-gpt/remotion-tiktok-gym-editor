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
  "2026_10_06_18_03_56_IMG_7166.mp4",
  "2026_10_06_18_18_14_IMG_7168.mp4",
  "2026_10_06_18_31_18_IMG_7171.mp4",
  "2026_10_06_18_52_38_IMG_7202.MP4",
  "2026_10_06_19_03_16_IMG_7207.MP4",
  "2026_10_06_19_14_25_IMG_7213.MP4",
  "2026_10_06_19_20_02_IMG_7214.MP4",
  "2026_10_06_19_26_57_IMG_7212.MP4",
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
