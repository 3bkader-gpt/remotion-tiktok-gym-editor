import { Easing } from "remotion";

export const theme = {
  colors: {
    bgDark: "#08080c",
    surfaceDark: "rgba(12, 12, 18, 0.85)",
    surfaceBorder: "rgba(255, 69, 0, 0.35)",
    hero: "#ff4500", // Vibrant flame orange
    heroGlow: "rgba(255, 69, 0, 0.6)",
    accent: "#00ffcc", // Electric cyan for metrics
    accentGlow: "rgba(0, 255, 204, 0.7)",
    warning: "#ffaa00",
    textPrimary: "#ffffff",
    textMuted: "#a0a0b0",
  },
  springs: {
    snappy: { damping: 14, stiffness: 140, mass: 0.8 },
    smooth: { damping: 18, stiffness: 90, mass: 1 },
    heavy: { damping: 20, stiffness: 70, mass: 1.2 },
    punch: { damping: 10, stiffness: 180, mass: 0.6 },
  },
  easings: {
    outExpo: Easing.bezier(0.16, 1, 0.3, 1),
    inOutCubic: Easing.bezier(0.65, 0, 0.35, 1),
    smoothZoom: Easing.bezier(0.25, 0.1, 0.25, 1),
  },
  fonts: {
    display: "Bebas Neue, sans-serif",
    body: "Inter, system-ui, -apple-system, sans-serif",
  },
};
