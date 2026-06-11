"use client";

import { MotionConfig } from "motion/react";

import { MOTION_DURATION, MOTION_EASE } from "@/lib/animation";

export function ConceptMotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{
        duration: MOTION_DURATION.normal,
        ease: MOTION_EASE,
      }}
    >
      {children}
    </MotionConfig>
  );
}
