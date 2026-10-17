import { spring } from "remotion";

/**
 * 🎬 klik-anim motion curves & physics presets
 * Consistent, physically grounded spring parameters across all HUD and video elements.
 */

export const SPRING_PRESETS = {
  // Snappy, authoritative entrance with crisp stop
  snap: {
    damping: 15,
    mass: 0.6,
    stiffness: 140,
  },
  // Bouncy, energetic pop for rep badges & counters
  bounce: {
    damping: 10,
    mass: 0.7,
    stiffness: 160,
  },
  // Smooth, organic travel for cards and panels
  smooth: {
    damping: 18,
    mass: 1.0,
    stiffness: 110,
  },
  // Heavy, weighty feel for big titles & lockout impacts
  heavy: {
    damping: 20,
    mass: 1.4,
    stiffness: 120,
  },
};

export const getSpring = (
  frame: number,
  fps: number = 30,
  preset: keyof typeof SPRING_PRESETS = "smooth",
  delayFrames: number = 0
) => {
  return spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: SPRING_PRESETS[preset],
  });
};
