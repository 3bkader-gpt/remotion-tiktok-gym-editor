import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import fontRawData from "../../public/fonts/helvetiker_bold.typeface.json";

// Parse font once globally
const loader = new FontLoader();
const font = loader.parse(fontRawData);

interface Floating3DChromeTextProps {
  titleLines: string[];
}

const TextMeshLine: React.FC<{
  text: string;
  yOffset: number;
  isHighlight: boolean;
  frame: number;
  fps: number;
  index: number;
}> = ({ text, yOffset, isHighlight, frame, fps, index }) => {
  // Stagger entrance per line
  const entrance = spring({
    frame: frame - index * 2,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 180 },
  });

  const scale = interpolate(entrance, [0, 1], [0.82, 1.0]);
  const rotY = interpolate(entrance, [0, 1], [0.35, 0.0]) + Math.sin((frame + index * 5) * 0.04) * 0.04;
  const rotX = Math.sin((frame + index * 4) * 0.035) * 0.025;

  const geometry = useMemo(() => {
    // Dynamic size based on word length to prevent overflow
    const maxLen = text.length;
    const textSize = maxLen > 12 ? 0.65 : maxLen > 8 ? 0.78 : 0.90;

    const geo = new TextGeometry(text, {
      font,
      size: textSize,
      depth: 0.22,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4,
    });
    geo.computeBoundingBox();
    geo.center(); // Center around origin for clean rotation
    return geo;
  }, [text]);

  const material = useMemo(() => {
    if (isHighlight) {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xffe259),
        metalness: 0.95,
        roughness: 0.12,
        emissive: new THREE.Color(0xffaa00),
        emissiveIntensity: 0.25,
      });
    }
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xffffff),
      metalness: 0.95,
      roughness: 0.12,
      emissive: new THREE.Color(0x88aacc),
      emissiveIntensity: 0.12,
    });
  }, [isHighlight]);

  return (
    <mesh
      geometry={geometry}
      material={material}
      position={[0, yOffset, 0]}
      rotation={[rotX, rotY, 0]}
      scale={[scale, scale, scale]}
    />
  );
};

const ThreeScene: React.FC<{ titleLines: string[] }> = ({ titleLines }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dynamic light oscillation for metallic glints across the letters
  const lightX = Math.sin(frame * 0.06) * 7.0;
  const lightY = Math.cos(frame * 0.05) * 6.0 + 3.0;

  const totalLines = titleLines.length;
  const lineSpacing = 1.35;
  const startY = ((totalLines - 1) * lineSpacing) / 2;

  return (
    <>
      {/* 💡 Cinematic 3D Lighting Setup */}
      {/* Ambient Cool Fill Light */}
      <ambientLight color={0xaabbcc} intensity={1.4} />

      {/* Front Specular Highlight Light */}
      <directionalLight position={[0, 4, 12]} color={0xffffff} intensity={3.5} />

      {/* Warm Golden Key Light (Glints across bevels) */}
      <pointLight position={[lightX, lightY, 10]} color={0xffe259} intensity={5.0} distance={30} />

      {/* Cool Cyan Rim Light (Hollywood Chiaroscuro Edge Separation) */}
      <pointLight position={[-8, -5, 8]} color={0x00e5ff} intensity={3.5} distance={26} />

      {/* Bottom Amber Bounce (Simulates the gym floor LED tube) */}
      <pointLight position={[0, -8, 6]} color={0xff8800} intensity={4.0} distance={25} />

      {/* Render 3D Text Lines */}
      {titleLines.map((line, idx) => {
        const yOffset = startY - idx * lineSpacing;
        const isHighlight = idx === totalLines - 1 || totalLines === 1;
        return (
          <TextMeshLine
            key={line + idx}
            text={line}
            yOffset={yOffset}
            isHighlight={isHighlight}
            frame={frame}
            fps={fps}
            index={idx}
          />
        );
      })}
    </>
  );
};

export const Floating3DChromeText: React.FC<Floating3DChromeTextProps> = ({ titleLines }) => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <ThreeCanvas
        width={1080}
        height={1920}
        camera={{ position: [0, 0, 18.0], fov: 40 }}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <ThreeScene titleLines={titleLines} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
