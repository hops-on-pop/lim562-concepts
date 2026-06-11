"use client";

import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

export type SequencePlaybackOptions = {
  length: number;
  intervalMs?: number;
  loop?: boolean;
  onLoop?: () => void;
};

export function useSequencePlayback({
  length,
  intervalMs = 2400,
  loop = false,
  onLoop,
}: SequencePlaybackOptions) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const clamp = useCallback(
    (value: number) => Math.max(0, Math.min(length - 1, value)),
    [length],
  );

  const goTo = useCallback(
    (value: number) => {
      setIndex(clamp(value));
      setIsPlaying(false);
    },
    [clamp],
  );

  const previous = useCallback(() => goTo(index - 1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  const play = useCallback(() => {
    if (prefersReducedMotion || length <= 1) {
      return;
    }
    setIsPlaying(true);
  }, [prefersReducedMotion, length]);

  const pause = useCallback(() => setIsPlaying(false), []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
      return;
    }
    play();
  }, [isPlaying, pause, play]);

  useEffect(() => {
    if (!isPlaying || prefersReducedMotion) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndex((current) => {
        if (current >= length - 1) {
          if (loop) {
            onLoop?.();
            return 0;
          }
          setIsPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [isPlaying, prefersReducedMotion, length, intervalMs, loop, onLoop]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsPlaying(false);
    }
  }, [prefersReducedMotion]);

  return {
    index,
    isPlaying,
    prefersReducedMotion,
    canGoBack: index > 0,
    canGoForward: index < length - 1,
    goTo,
    previous,
    next,
    play,
    pause,
    togglePlay,
  };
}
