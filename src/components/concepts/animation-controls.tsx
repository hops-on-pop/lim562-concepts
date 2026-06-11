"use client";

import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { motionTransition } from "@/lib/animation";
import { motion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type AnimationControlsProps = {
  stepLabel?: string;
  canGoBack?: boolean;
  canGoForward?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  showPlay?: boolean;
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  playDisabled?: boolean;
  className?: string;
};

export function AnimationControls({
  stepLabel,
  canGoBack = false,
  canGoForward = false,
  onPrevious,
  onNext,
  showPlay = false,
  isPlaying = false,
  onPlay,
  onPause,
  playDisabled = false,
  className,
}: AnimationControlsProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const playBlocked = playDisabled || prefersReducedMotion;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3",
        className,
      )}
    >
      {stepLabel ? (
        <p className="text-sm text-muted-foreground">{stepLabel}</p>
      ) : (
        <span />
      )}
      <div className="flex flex-wrap gap-2">
        {onPrevious ? (
          <Button
            disabled={!canGoBack}
            onClick={onPrevious}
            type="button"
            variant="outline"
          >
            <SkipBack className="size-4" />
            Previous
          </Button>
        ) : null}
        {showPlay ? (
          <Button
            aria-pressed={isPlaying}
            disabled={playBlocked}
            onClick={isPlaying ? onPause : onPlay}
            title={
              prefersReducedMotion
                ? "Animations are off while reduced motion is enabled"
                : undefined
            }
            type="button"
            variant="outline"
          >
            <motion.span
              animate={{ scale: isPlaying && !prefersReducedMotion ? 1.08 : 1 }}
              className="inline-flex"
              transition={motionTransition(prefersReducedMotion, {
                duration: 0.25,
              })}
            >
              {isPlaying ? (
                <Pause className="size-4" />
              ) : (
                <Play className="size-4" />
              )}
            </motion.span>
            {isPlaying ? "Pause" : "Play"}
          </Button>
        ) : null}
        {onNext ? (
          <Button disabled={!canGoForward} onClick={onNext} type="button">
            Next
            <SkipForward className="size-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
