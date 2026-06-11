"use client";

import {
  BarChart3,
  BookOpen,
  ClipboardList,
  DatabaseZap,
  FlaskConical,
  History,
  Rocket,
} from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getConceptTheme } from "@/lib/concept-themes";
import { cn } from "@/lib/utils";
import { AnimationControls } from "./animation-controls";
import { ConceptExplorerShell } from "./concept-explorer-shell";
import { LifecycleCycleDiagram } from "./lifecycle-cycle-diagram";

const lifecycle = [
  {
    label: "Plan",
    shortLabel: "Plan",
    icon: ClipboardList,
    question: "What library problem is worth solving?",
    detail:
      "Define the task in service terms before choosing a model. For subject headings, the goal might be faster review, not automatic replacement of cataloging judgment.",
  },
  {
    label: "Data",
    shortLabel: "Data",
    icon: DatabaseZap,
    question: "What examples, features, and limits shape the system?",
    detail:
      "Gather records, labels, policies, and exclusions. Feature engineering turns raw catalog fields into inputs the model can learn from—such as title keywords, format codes, or neighboring subject terms. Data quality, consent, representation, and privacy boundaries matter before training begins.",
  },
  {
    label: "Model",
    shortLabel: "Model",
    icon: FlaskConical,
    question: "What system will make predictions or suggestions?",
    detail:
      "The team trains, fine-tunes, configures, or prompts a model. The choice should match the task, data sensitivity, budget, and maintainability.",
  },
  {
    label: "Evaluate",
    shortLabel: "Evaluate",
    icon: BarChart3,
    question: "How do we know it is useful and fair enough?",
    detail:
      "Compare outputs with expert review, accessibility needs, error patterns, and patron impact. Accuracy alone is not the full evaluation.",
  },
  {
    label: "Deploy",
    shortLabel: "Deploy",
    icon: Rocket,
    question: "Where does it enter the workflow?",
    detail:
      "Deploy with human review, documentation, fallback paths, and clear labels so staff know when to trust, question, or ignore output.",
  },
  {
    label: "Monitor",
    shortLabel: "Monitor",
    icon: History,
    question: "What changes after launch?",
    detail:
      "Track drift, complaints, false confidence, changed collections, and policy updates. Monitoring turns AI from a demo into a governed service.",
  },
];

const keyTerms = [
  {
    term: "Problem framing",
    stage: "Plan",
    definition:
      "Translating a library service need into a task a model can attempt without skipping governance questions.",
  },
  {
    term: "Feature engineering",
    stage: "Data",
    definition:
      "Selecting and shaping raw inputs—MARC fields, authority links, circulation counts—into signals a model can learn from.",
  },
  {
    term: "Training data",
    stage: "Data",
    definition:
      "Labeled or curated examples the system learns patterns from; quality and representativeness matter more than volume alone.",
  },
  {
    term: "Model",
    stage: "Model",
    definition:
      "The learned system that maps inputs—catalog fields, search queries, metadata—to outputs such as subject suggestions or rankings. It encodes patterns discovered during training.",
  },
  {
    term: "Training",
    stage: "Model",
    definition:
      "The process of fitting a model to training data so it learns useful patterns. Weights, rules, or embeddings adjust until performance improves on held-out examples.",
  },
  {
    term: "Fine-tuning",
    stage: "Model",
    definition:
      "Adapting a general model to library-specific records, terminology, or policies instead of using it out of the box.",
  },
  {
    term: "Inference",
    stage: "Model",
    definition:
      "The model producing a suggestion or prediction at the moment a cataloger or patron needs it.",
  },
  {
    term: "Ground truth",
    stage: "Evaluate",
    definition:
      "The trusted reference—expert-reviewed headings, policy text—that outputs are compared against during evaluation.",
  },
  {
    term: "Human-in-the-loop",
    stage: "Deploy",
    definition:
      "Keeping staff review, override, and escalation paths in the workflow rather than fully automating decisions.",
  },
  {
    term: "Model drift",
    stage: "Monitor",
    definition:
      "Performance degrading over time as collections, language, or patron needs change faster than the training data.",
  },
];

const theme = getConceptTheme("ai-ml-lifecycle");
const PLAY_INTERVAL_MS = 2800;

export function AiMlLifecycleExplorer() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);
  const [prevActive, setPrevActive] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const current = lifecycle[active];
  const Icon = current.icon;
  const monitorIndex = lifecycle.length - 1;

  const goTo = useCallback((index: number) => {
    setIsPlaying(false);
    setActive((currentIndex) => {
      if (index === currentIndex) {
        return currentIndex;
      }
      setPrevActive(currentIndex);
      return index;
    });
  }, []);

  const next = useCallback(() => {
    setActive((currentIndex) => {
      setPrevActive(currentIndex);
      if (currentIndex === monitorIndex) {
        return 0;
      }
      return currentIndex + 1;
    });
    setIsPlaying(false);
  }, [monitorIndex]);

  const previous = useCallback(() => {
    setActive((currentIndex) => {
      setPrevActive(currentIndex);
      if (currentIndex === 0) {
        return monitorIndex;
      }
      return currentIndex - 1;
    });
    setIsPlaying(false);
  }, [monitorIndex]);

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
      setActive((currentIndex) => {
        setPrevActive(currentIndex);
        if (currentIndex === monitorIndex) {
          return 0;
        }
        return currentIndex + 1;
      });
    }, PLAY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [isPlaying, prefersReducedMotion, monitorIndex]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsPlaying(false);
    }
  }, [prefersReducedMotion]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)] lg:items-stretch">
      <ConceptExplorerShell
        className="flex h-full min-h-0 flex-col"
        howItWorks="Select a stage or step around the lifecycle — AI/ML work revisits earlier stages in a continuous cycle."
        slug="ai-ml-lifecycle"
      >
        <div className="grid min-h-0 flex-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] md:items-stretch">
          <LifecycleCycleDiagram
            activeIndex={active}
            loopLabel="revise"
            markerId="ai-ml-cycle-arrow"
            onSelectAction={goTo}
            palette="indigo"
            prevIndex={prevActive}
            stages={lifecycle}
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
                <h3 className="text-lg font-semibold">{current.label}</h3>
              </div>
            </div>
            <p className={cn("mt-3 text-sm font-medium", theme.accentText)}>
              {current.question}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {current.detail}
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
          stepLabel={`${current.label} · cycle step ${active + 1} of ${lifecycle.length}`}
        />
      </ConceptExplorerShell>

      <KeyTermsPanel activeStage={current.label} />
    </div>
  );
}

function KeyTermsPanel({ activeStage }: { activeStage: string }) {
  return (
    <section
      aria-labelledby="ml-key-terms-heading"
      className={cn(
        "flex h-full min-h-0 flex-col rounded-xl border bg-white/90 p-4 shadow-xs",
        theme.accentSurface,
      )}
    >
      <h3
        className="flex shrink-0 items-center gap-2 text-sm font-semibold"
        id="ml-key-terms-heading"
      >
        <BookOpen className="size-4 shrink-0" />
        Key AI/ML terms
      </h3>
      <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
        <Accordion className="w-full" multiple>
          {keyTerms.map((item) => {
            const isRelevant = item.stage === activeStage;

            return (
              <AccordionItem
                className={cn(
                  "rounded-lg border border-transparent px-1 transition-colors",
                  isRelevant && "border-indigo-200 bg-white",
                )}
                key={item.term}
                value={item.term}
              >
                <AccordionTrigger
                  className={cn(
                    "px-2 py-2 hover:no-underline",
                    isRelevant ? theme.accentText : "text-foreground",
                  )}
                >
                  <span>
                    {item.term}
                    {isRelevant ? (
                      <span className="sr-only">
                        {" "}
                        (relevant to current stage)
                      </span>
                    ) : null}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-2">
                  <p className="text-xs leading-5 text-muted-foreground">
                    {item.definition}
                  </p>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}
