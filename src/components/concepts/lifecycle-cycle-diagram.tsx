"use client";

import type { LucideIcon } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import {
  MARKER_HIDE_TRAVEL_FRACTION,
  MOTION_DURATION,
  travelTransition,
} from "@/lib/animation";
import type { ConceptTheme } from "@/lib/concept-themes";
import { motion } from "@/lib/motion";
import { cn } from "@/lib/utils";

const VIEW_SIZE = 400;
const CENTER = VIEW_SIZE / 2;
const NODE_RADIUS = 148;
const ARC_RADIUS = 118;

export type CycleStage = {
  label: string;
  shortLabel: string;
  icon: LucideIcon;
};

type CyclePalette = {
  arc: string;
  arcActive: string;
  arcLoop: string;
  token: string;
  loopText: string;
  arrow: string;
  verticalLoop: string;
};

const palettes = {
  indigo: {
    arc: "stroke-indigo-200",
    arcActive: "stroke-indigo-400",
    arcLoop: "stroke-indigo-500",
    token: "fill-indigo-600",
    loopText: "fill-indigo-700",
    arrow: "#6366f1",
    verticalLoop: "text-indigo-700",
  },
  cyan: {
    arc: "stroke-cyan-200",
    arcActive: "stroke-cyan-400",
    arcLoop: "stroke-cyan-500",
    token: "fill-cyan-600",
    loopText: "fill-cyan-800",
    arrow: "#0891b2",
    verticalLoop: "text-cyan-800",
  },
} satisfies Record<string, CyclePalette>;

type LifecycleCycleDiagramProps = {
  stages: CycleStage[];
  activeIndex: number;
  prevIndex: number;
  onSelectAction: (index: number) => void;
  theme: ConceptTheme;
  palette?: keyof typeof palettes;
  loopLabel?: string;
  markerId: string;
};

function stageAngle(index: number, total: number) {
  return -Math.PI / 2 + (index * 2 * Math.PI) / total;
}

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angle: number,
) {
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, endAngle);
  const sweep = endAngle - startAngle;
  const largeArc = sweep > Math.PI ? 1 : 0;

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function nodePosition(index: number, total: number) {
  const angle = stageAngle(index, total);
  return polarToCartesian(CENTER, CENTER, NODE_RADIUS, angle);
}

function buildTravelPath(fromIndex: number, toIndex: number, total: number) {
  const point = polarToCartesian(
    CENTER,
    CENTER,
    ARC_RADIUS,
    stageAngle(fromIndex, total),
  );
  if (fromIndex === toIndex) {
    return `M ${point.x} ${point.y} L ${point.x} ${point.y}`;
  }

  const steps = (toIndex - fromIndex + total) % total;
  let path = "";
  let current = fromIndex;

  for (let step = 0; step < steps; step += 1) {
    const next = (current + 1) % total;
    const segment = describeArc(
      CENTER,
      CENTER,
      ARC_RADIUS,
      stageAngle(current, total),
      stageAngle(next, total),
    );

    if (step === 0) {
      path = segment;
    } else {
      path += ` ${segment.slice(segment.indexOf("A"))}`;
    }
    current = next;
  }

  return path;
}

export function LifecycleCycleDiagram({
  stages,
  activeIndex,
  prevIndex,
  onSelectAction,
  theme,
  palette = "indigo",
  loopLabel = "revise",
  markerId,
}: LifecycleCycleDiagramProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const colors = palettes[palette];
  const total = stages.length;
  const isTraveling = !prefersReducedMotion && prevIndex !== activeIndex;
  const [markerHiddenAt, setMarkerHiddenAt] = useState(activeIndex);
  const travelPath = buildTravelPath(prevIndex, activeIndex, total);

  useEffect(() => {
    if (!isTraveling) {
      setMarkerHiddenAt(activeIndex);
      return;
    }

    setMarkerHiddenAt(prevIndex);
    const hideMs = MOTION_DURATION.travel * MARKER_HIDE_TRAVEL_FRACTION * 1000;
    const timer = window.setTimeout(
      () => setMarkerHiddenAt(activeIndex),
      hideMs,
    );

    return () => window.clearTimeout(timer);
  }, [activeIndex, prevIndex, isTraveling]);
  const reviseMid = polarToCartesian(
    CENTER,
    CENTER,
    ARC_RADIUS + 22,
    stageAngle(total - 1, total) + Math.PI / total,
  );
  const markerRef = `url(#${markerId})`;

  return (
    <div className="mx-auto w-full max-w-md min-[401px]:max-w-xl">
      <div className="relative mx-auto hidden aspect-square w-full min-[401px]:block">
        <svg
          aria-hidden="true"
          className="absolute inset-0 size-full"
          viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
        >
          <defs>
            <marker
              id={markerId}
              markerHeight="6"
              markerUnits="strokeWidth"
              markerWidth="6"
              orient="auto"
              refX="4"
              refY="3"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill={colors.arrow} />
            </marker>
          </defs>

          {stages.map((stage, index) => {
            const next = (index + 1) % total;
            const isLoop = index === total - 1;
            const path = describeArc(
              CENTER,
              CENTER,
              ARC_RADIUS,
              stageAngle(index, total),
              stageAngle(next, total),
            );

            return (
              <path
                className={cn(
                  isLoop ? colors.arcLoop : colors.arc,
                  activeIndex === index || activeIndex === next
                    ? colors.arcActive
                    : "",
                )}
                d={path}
                fill="none"
                key={`arc-${stage.label}`}
                markerEnd={markerHiddenAt === next ? undefined : markerRef}
                strokeDasharray={isLoop ? "6 4" : undefined}
                strokeWidth={isLoop ? 2.5 : 1.75}
              />
            );
          })}

          <text
            className={cn("text-[11px] font-semibold", colors.loopText)}
            textAnchor="middle"
            x={reviseMid.x}
            y={reviseMid.y}
          >
            {loopLabel}
          </text>

          {(() => {
            const tokenAt = polarToCartesian(
              CENTER,
              CENTER,
              ARC_RADIUS,
              stageAngle(activeIndex, total),
            );
            if (isTraveling) {
              return (
                <motion.circle
                  animate={{ offsetDistance: "100%" }}
                  className={colors.token}
                  initial={{ offsetDistance: "0%" }}
                  key={`${prevIndex}-${activeIndex}`}
                  r={7}
                  style={{ offsetPath: `path('${travelPath}')` }}
                  transition={travelTransition(prefersReducedMotion)}
                />
              );
            }

            return (
              <circle
                className={colors.token}
                cx={tokenAt.x}
                cy={tokenAt.y}
                r={7}
              />
            );
          })()}
        </svg>

        {stages.map((stage, index) => {
          const { x, y } = nodePosition(index, total);
          const isActive = index === activeIndex;
          const Icon = stage.icon;
          const left = `${(x / VIEW_SIZE) * 100}%`;
          const top = `${(y / VIEW_SIZE) * 100}%`;

          return (
            <button
              aria-label={`${stage.label} stage`}
              aria-pressed={isActive}
              className={cn(
                "absolute flex min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-xl border bg-white px-1.5 py-1.5 text-center transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                isActive ? theme.activeControl : theme.inactiveControl,
              )}
              key={stage.label}
              onClick={() => onSelectAction(index)}
              style={{ left, top }}
              type="button"
            >
              <Icon className="size-4 shrink-0" />
              <span className="text-[0.6rem] font-medium leading-tight sm:text-[0.65rem]">
                {stage.shortLabel}
              </span>
            </button>
          );
        })}
      </div>

      <VerticalCycle
        activeIndex={activeIndex}
        loopLabel={loopLabel}
        onSelect={onSelectAction}
        stages={stages}
        theme={theme}
        verticalLoopClass={colors.verticalLoop}
      />
    </div>
  );
}

function VerticalCycle({
  stages,
  activeIndex,
  onSelect,
  theme,
  loopLabel,
  verticalLoopClass,
}: {
  stages: CycleStage[];
  activeIndex: number;
  onSelect: (index: number) => void;
  theme: ConceptTheme;
  loopLabel: string;
  verticalLoopClass: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 min-[401px]:hidden">
      {stages.map((stage, index) => {
        const Icon = stage.icon;
        const isActive = index === activeIndex;
        const isLast = index === stages.length - 1;

        return (
          <div
            className="flex w-full max-w-xs flex-col items-center"
            key={stage.label}
          >
            <button
              aria-label={`${stage.label} stage`}
              aria-pressed={isActive}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border bg-white px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                isActive ? theme.activeControl : theme.inactiveControl,
              )}
              onClick={() => onSelect(index)}
              type="button"
            >
              <Icon className="size-5 shrink-0" />
              <span className="text-sm font-medium">{stage.label}</span>
            </button>
            {isLast ? (
              <div
                className={cn(
                  "flex flex-col items-center py-1",
                  verticalLoopClass,
                )}
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  ↺
                </span>
                <span className="text-xs font-semibold">{loopLabel}</span>
              </div>
            ) : (
              <span aria-hidden="true" className="py-0.5 text-muted-foreground">
                ↓
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
