import type { Transition, Variants } from "motion/react";

export const MOTION_DURATION = {
  fast: 0.2,
  normal: 0.45,
  slow: 0.85,
  travel: 1.1,
} as const;

/** Hide cycle arrow markers this far through the token travel (0–1). */
export const MARKER_HIDE_TRAVEL_FRACTION = 0.85;

export const MOTION_EASE = [0.4, 0, 0.2, 1] as const;

export function motionTransition(
  prefersReducedMotion: boolean,
  transition?: Transition,
): Transition {
  if (prefersReducedMotion) {
    return { duration: 0 };
  }

  return (
    transition ?? {
      duration: MOTION_DURATION.normal,
      ease: MOTION_EASE,
    }
  );
}

export function travelTransition(prefersReducedMotion: boolean): Transition {
  return motionTransition(prefersReducedMotion, {
    duration: MOTION_DURATION.travel,
    ease: MOTION_EASE,
  });
}

export function fadeInVariants(prefersReducedMotion: boolean): Variants {
  return {
    hidden: { opacity: prefersReducedMotion ? 1 : 0 },
    visible: { opacity: 1 },
  };
}
