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

export type JourneyLayer = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export type JourneyStep = {
  layerId: string;
  layerIndex: number;
  payload: string;
  leg: "request" | "response";
};

const VIEW_WIDTH = 420;
const VIEW_HEIGHT = 300;
const MARKER_ID = "journey-arrow";
const CARD_OFFSET = 42;

/** Path anchors — lines and token travel through these points. */
const stopPositions = [
  { x: 72, y: 78 },
  { x: 168, y: 78 },
  { x: 264, y: 78 },
  { x: 348, y: 150 },
  { x: 264, y: 222 },
  { x: 72, y: 222 },
];

/** Per-stop offset so cards sit beside the path, not on top of it. */
const cardOffsets = [
  { x: -14, y: -CARD_OFFSET },
  { x: 0, y: -CARD_OFFSET },
  { x: 0, y: -CARD_OFFSET },
  { x: CARD_OFFSET, y: 0 },
  { x: 0, y: CARD_OFFSET },
  { x: -14, y: CARD_OFFSET },
];

function cardCenter(index: number) {
  const anchor = stopPositions[index];
  const offset = cardOffsets[index];
  return { x: anchor.x + offset.x, y: anchor.y + offset.y };
}

type RequestJourneyDiagramProps = {
  layers: JourneyLayer[];
  steps: JourneyStep[];
  activeIndex: number;
  prevIndex: number;
  onSelectAction: (index: number) => void;
  theme: ConceptTheme;
};

function buildTravelPath(fromIndex: number, toIndex: number) {
  const start = stopPositions[fromIndex];
  if (fromIndex === toIndex) {
    return `M ${start.x} ${start.y} L ${start.x} ${start.y}`;
  }

  if (toIndex > fromIndex) {
    let path = `M ${start.x} ${start.y}`;
    for (let i = fromIndex + 1; i <= toIndex; i += 1) {
      const point = stopPositions[i];
      path += ` L ${point.x} ${point.y}`;
    }
    return path;
  }

  let path = `M ${start.x} ${start.y}`;
  for (let i = fromIndex - 1; i >= toIndex; i -= 1) {
    const point = stopPositions[i];
    path += ` L ${point.x} ${point.y}`;
  }
  return path;
}

function pathMidpoint(fromIndex: number, toIndex: number) {
  const a = stopPositions[fromIndex];
  const b = stopPositions[toIndex];
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/** Nudge a label from a path segment toward the interior of the U. */
function labelInside(fromIndex: number, toIndex: number, offsetY: number) {
  const mid = pathMidpoint(fromIndex, toIndex);
  return { x: mid.x, y: mid.y + offsetY };
}

function LegLabel({ x, y, label }: { x: number; y: number; label: string }) {
  const width = label.length * 6.5 + 14;

  return (
    <g>
      <rect
        className="fill-white/90"
        height={14}
        rx={3}
        width={width}
        x={x - width / 2}
        y={y - 10}
      />
      <text
        className="fill-emerald-800 text-[11px] font-semibold"
        textAnchor="middle"
        x={x}
        y={y}
      >
        {label}
      </text>
    </g>
  );
}

/** Shorten segments at junctions so strokes do not pile up at corners. */
const LINE_TRIM = 2;

function trimSegment(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  trimStart: number,
  trimEnd: number,
) {
  const dx = bx - ax;
  const dy = by - ay;
  const length = Math.hypot(dx, dy);

  if (length <= trimStart + trimEnd) {
    return { x1: ax, y1: ay, x2: bx, y2: by };
  }

  const ux = dx / length;
  const uy = dy / length;

  return {
    x1: ax + ux * trimStart,
    y1: ay + uy * trimStart,
    x2: bx - ux * trimEnd,
    y2: by - uy * trimEnd,
  };
}

export function RequestJourneyDiagram({
  layers,
  steps,
  activeIndex,
  prevIndex,
  onSelectAction,
  theme,
}: RequestJourneyDiagramProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const isTraveling = !prefersReducedMotion && prevIndex !== activeIndex;
  const [markerHiddenAt, setMarkerHiddenAt] = useState(activeIndex);
  const travelPath = buildTravelPath(prevIndex, activeIndex);
  const markerRef = `url(#${MARKER_ID})`;

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

  const requestLabel = labelInside(1, 2, 18);
  const responseLabel = labelInside(4, 5, -18);

  return (
    <div className="mx-auto w-full max-w-lg min-[401px]:max-w-2xl">
      <div
        className="relative mx-auto hidden w-full min-[401px]:block"
        style={{ aspectRatio: `${VIEW_WIDTH} / ${VIEW_HEIGHT}` }}
      >
        <svg
          aria-hidden="true"
          className="absolute inset-0 size-full"
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        >
          <defs>
            <marker
              id={MARKER_ID}
              markerHeight="6"
              markerUnits="strokeWidth"
              markerWidth="6"
              orient="auto"
              refX="4"
              refY="3"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill="#10b981" />
            </marker>
          </defs>

          {steps.map((step, index) => {
            if (index === steps.length - 1) {
              return null;
            }

            const next = index + 1;
            const a = stopPositions[index];
            const b = stopPositions[next];
            const isResponse = index >= 3;
            const isActive = activeIndex === index || activeIndex === next;
            const trimStart = index === 0 ? 3 : LINE_TRIM;
            const trimEnd = next === steps.length - 1 ? 3 : LINE_TRIM;
            const { x1, y1, x2, y2 } = trimSegment(
              a.x,
              a.y,
              b.x,
              b.y,
              trimStart,
              trimEnd,
            );

            return (
              <line
                className={cn(
                  isResponse ? "stroke-emerald-500" : "stroke-emerald-200",
                  isActive ? "stroke-emerald-400" : "",
                )}
                key={`segment-${step.layerId}-${step.leg}`}
                markerEnd={markerHiddenAt === next ? undefined : markerRef}
                strokeDasharray={isResponse ? "6 4" : undefined}
                strokeLinecap="round"
                strokeWidth={isResponse ? 2.5 : 1.75}
                x1={x1}
                x2={x2}
                y1={y1}
                y2={y2}
              />
            );
          })}

          <LegLabel label="request" x={requestLabel.x} y={requestLabel.y} />
          <LegLabel label="response" x={responseLabel.x} y={responseLabel.y} />

          <circle
            className="fill-emerald-600"
            cx={stopPositions[0].x}
            cy={stopPositions[0].y}
            r={4}
          />

          {(() => {
            const tokenAt = stopPositions[activeIndex];
            if (isTraveling) {
              return (
                <motion.circle
                  animate={{ offsetDistance: "100%" }}
                  className="fill-emerald-600"
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
                className="fill-emerald-600"
                cx={tokenAt.x}
                cy={tokenAt.y}
                r={7}
              />
            );
          })()}
        </svg>

        {steps.map((step, index) => {
          const layer = layers[step.layerIndex];
          const Icon = layer.icon;
          const { x, y } = cardCenter(index);
          const isActive = index === activeIndex;
          const isVisited = index < activeIndex;

          return (
            <button
              aria-label={`Stop ${index + 1}: ${layer.label}, ${step.leg} — ${step.payload}`}
              aria-pressed={isActive}
              className={cn(
                "absolute flex min-w-19 max-w-22 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 rounded-xl border bg-white px-1.5 py-1.5 text-center transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 sm:min-w-[5.25rem] sm:max-w-[6rem]",
                isActive
                  ? theme.activeControl
                  : isVisited
                    ? "border-emerald-200 bg-emerald-50/60"
                    : theme.inactiveControl,
              )}
              key={`${step.layerId}-${step.leg}`}
              onClick={() => onSelectAction(index)}
              style={{
                left: `${(x / VIEW_WIDTH) * 100}%`,
                top: `${(y / VIEW_HEIGHT) * 100}%`,
              }}
              type="button"
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-[0.6rem] font-semibold",
                  isActive
                    ? "bg-emerald-600 text-white"
                    : isVisited
                      ? "bg-emerald-100 text-emerald-900"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {index + 1}
              </span>
              <Icon className="size-3.5 shrink-0 text-emerald-900" />
              <span className="w-full truncate text-[0.6rem] font-medium leading-tight sm:text-[0.65rem]">
                {layer.label}
              </span>
              <span
                className={cn(
                  "w-full truncate rounded px-1 py-0.5 font-mono text-[0.55rem] leading-tight sm:text-[0.6rem]",
                  isActive
                    ? "bg-emerald-50 text-emerald-950"
                    : "text-muted-foreground",
                )}
              ></span>
            </button>
          );
        })}
      </div>

      <VerticalJourney
        activeIndex={activeIndex}
        layers={layers}
        onSelect={onSelectAction}
        steps={steps}
        theme={theme}
      />
    </div>
  );
}

function VerticalJourney({
  steps,
  layers,
  activeIndex,
  onSelect,
  theme,
}: {
  steps: JourneyStep[];
  layers: JourneyLayer[];
  activeIndex: number;
  onSelect: (index: number) => void;
  theme: ConceptTheme;
}) {
  return (
    <div className="flex flex-col items-center gap-1 min-[401px]:hidden">
      {steps.map((step, index) => {
        const layer = layers[step.layerIndex];
        const Icon = layer.icon;
        const isActive = index === activeIndex;
        const isVisited = index < activeIndex;
        const prevLeg = index > 0 ? steps[index - 1].leg : null;
        const showLegLabel = prevLeg !== null && prevLeg !== step.leg;

        return (
          <div
            className="flex w-full max-w-xs flex-col items-center"
            key={`${step.layerId}-${step.leg}`}
          >
            {index > 0 ? (
              <div className="flex flex-col items-center py-0.5 text-emerald-700">
                <span aria-hidden="true" className="text-lg leading-none">
                  ↓
                </span>
                {showLegLabel ? (
                  <span className="text-xs font-semibold">{step.leg}</span>
                ) : null}
              </div>
            ) : null}
            <button
              aria-label={`Stop ${index + 1}: ${layer.label}, ${step.leg} — ${step.payload}`}
              aria-pressed={isActive}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border bg-white px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                isActive
                  ? theme.activeControl
                  : isVisited
                    ? "border-emerald-200 bg-emerald-50/60"
                    : theme.inactiveControl,
              )}
              onClick={() => onSelect(index)}
              type="button"
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  isActive
                    ? "bg-emerald-600 text-white"
                    : isVisited
                      ? "bg-emerald-100 text-emerald-900"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {index + 1}
              </span>
              <Icon className="size-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{layer.label}</p>
                <p className="truncate font-mono text-xs text-muted-foreground">
                  {step.payload}
                </p>
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}
