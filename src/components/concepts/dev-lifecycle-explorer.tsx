"use client";

import {
  ClipboardList,
  Code2,
  FileSearch,
  PenTool,
  Rocket,
  SearchCheck,
  Wrench,
} from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { getConceptTheme } from "@/lib/concept-themes";
import { cn } from "@/lib/utils";

import { AnimationControls } from "./animation-controls";
import { ConceptExplorerShell } from "./concept-explorer-shell";
import { LifecycleCycleDiagram } from "./lifecycle-cycle-diagram";

const stages = [
  {
    label: "Planning",
    shortLabel: "Plan",
    icon: ClipboardList,
    actor: "Patrons and staff",
    deliverable: "Initial project plan",
    detail:
      "The team scopes a catalog renewal improvement—what problem it solves, who uses it, and what is out of scope—before committing resources. A community needs assessment is planned and conducted to better understand the community's needs and goals.",
  },
  {
    label: "Analysis",
    shortLabel: "Analyze",
    icon: FileSearch,
    actor: "Librarians and analysts",
    deliverable: "Requirements documentation",
    detail:
      "Staff gather patron pain points, policy rules, and workflow constraints, turning the high-level idea into detailed requirements.",
  },
  {
    label: "Design",
    shortLabel: "Design",
    icon: PenTool,
    actor: "Developers and UX",
    deliverable: "Software design document",
    detail:
      "The team defines how renewal screens, navigation, and integrations will work—often captured in a design document before coding begins.",
  },
  {
    label: "Coding",
    shortLabel: "Code",
    icon: Code2,
    actor: "Developers",
    deliverable: "Functional software prototype",
    detail:
      "Engineers write the code for a working prototype: renewal labels, API hooks, and supporting interfaces the catalog needs.",
  },
  {
    label: "Testing",
    shortLabel: "Test",
    icon: SearchCheck,
    actor: "Mixed review group",
    deliverable: "Refined, tested software",
    detail:
      "Quality checks catch bugs and accessibility gaps through unit, integration, and acceptance testing until the flow is reliable.",
  },
  {
    label: "Deployment",
    shortLabel: "Deploy",
    icon: Rocket,
    actor: "Operations",
    deliverable: "Software available to patrons",
    detail:
      "The update ships to production with training or release notes so patrons and staff can use the clearer renewal experience.",
  },
  {
    label: "Maintenance",
    shortLabel: "Maintain",
    icon: Wrench,
    actor: "Operations and developers",
    deliverable: "Updated and optimized code",
    detail:
      "After launch, the team patches issues, handles new use cases, and plans the next round—maintenance feeds back into planning in iterative models.",
  },
];

const theme = getConceptTheme("dev-lifecycle");
const PLAY_INTERVAL_MS = 2800;
const LAST_INDEX = stages.length - 1;

export function DevLifecycleExplorer() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);
  const [prevActive, setPrevActive] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const stage = stages[active];
  const Icon = stage.icon;

  const goTo = useCallback((index: number) => {
    setIsPlaying(false);
    setActive((current) => {
      if (index === current) {
        return current;
      }
      setPrevActive(current);
      return index;
    });
  }, []);

  const next = useCallback(() => {
    setActive((current) => {
      setPrevActive(current);
      return current === LAST_INDEX ? 0 : current + 1;
    });
    setIsPlaying(false);
  }, []);

  const previous = useCallback(() => {
    setActive((current) => {
      setPrevActive(current);
      return current === 0 ? LAST_INDEX : current - 1;
    });
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (prefersReducedMotion) {
      return;
    }
    setIsPlaying(true);
  }, [prefersReducedMotion]);

  const pause = useCallback(() => setIsPlaying(false), []);

  useEffect(() => {
    if (!isPlaying || prefersReducedMotion) {
      return;
    }

    const timer = window.setInterval(() => {
      setActive((current) => {
        setPrevActive(current);
        return current === LAST_INDEX ? 0 : current + 1;
      });
    }, PLAY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [isPlaying, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsPlaying(false);
    }
  }, [prefersReducedMotion]);

  return (
    <ConceptExplorerShell
      className="flex flex-col"
      howItWorks="Select a phase around the Software Development Lifecycle (SDLC) — each step produces a deliverable that guides the next, and maintenance loops back to planning."
      slug="dev-lifecycle"
    >
      <div className="grid min-h-0 flex-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] md:items-start">
        <LifecycleCycleDiagram
          activeIndex={active}
          loopLabel="iterate"
          markerId="dev-sdlc-cycle-arrow"
          onSelect={goTo}
          palette="cyan"
          prevIndex={prevActive}
          stages={stages}
          theme={theme}
        />

        <aside className={cn(theme.detailPanel, "flex h-full flex-col")}>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "flex size-11 items-center justify-center rounded-lg",
                theme.iconBadge,
              )}
            >
              <Icon className="size-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold">{stage.label}</h3>
              <Badge className="mt-1" variant="outline">
                {stage.actor}
              </Badge>
            </div>
          </div>
          <p className="mt-3 text-sm font-medium text-cyan-950">
            Deliverable: {stage.deliverable}
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {stage.detail}
          </p>
        </aside>
      </div>

      <AnimationControls
        isPlaying={isPlaying}
        onNext={next}
        onPause={pause}
        onPlay={play}
        onPrevious={previous}
        showPlay
        stepLabel={`${stage.label} · phase ${active + 1} of ${stages.length}`}
      />
    </ConceptExplorerShell>
  );
}
