"use client";

import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import type { ConceptTheme } from "@/lib/concept-themes";
import { cn } from "@/lib/utils";

type OrderStagesActivityProps = {
  stages: { label: string }[];
  theme: ConceptTheme;
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function OrderStagesActivity({
  stages,
  theme,
}: OrderStagesActivityProps) {
  const correctOrder = useMemo(
    () => stages.map((stage) => stage.label),
    [stages],
  );
  const [shuffled, setShuffled] = useState(() => shuffle(stages));
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const completed = step >= stages.length;

  const reset = () => {
    setShuffled(shuffle(stages));
    setStep(0);
    setPicked([]);
    setFeedback(null);
  };

  const handlePick = (label: string) => {
    if (completed || picked.includes(label)) {
      return;
    }

    const expected = correctOrder[step];
    if (label === expected) {
      const nextStep = step + 1;
      setPicked((current) => [...current, label]);
      setStep(nextStep);
      setFeedback(
        nextStep >= stages.length
          ? "Nice work — that is the full path from idea to feedback and back around."
          : null,
      );
      return;
    }

    setFeedback(
      step === 0
        ? `Start with ${expected} — the lifecycle begins with the observed need.`
        : `Not quite — after ${correctOrder[step - 1]}, teams usually move to ${expected}.`,
    );
  };

  return (
    <section
      aria-labelledby="order-stages-heading"
      className={cn(
        "rounded-xl border bg-white p-4 sm:p-5",
        theme.accentSurface,
      )}
    >
      <h3 className="text-base font-semibold" id="order-stages-heading">
        Order the stages
      </h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Stages are shuffled below. Tap them in the order a catalog improvement
        would move — from first step to last.
      </p>

      <fieldset className="mt-4 grid gap-2 border-0 p-0 sm:grid-cols-2">
        <legend className="sr-only">Shuffled lifecycle stages</legend>
        {shuffled.map((stage) => {
          const isPicked = picked.includes(stage.label);

          return (
            <Button
              aria-pressed={isPicked}
              className={cn(
                "h-auto min-h-11 justify-start whitespace-normal px-3 py-2.5 text-left",
                isPicked && theme.activeControl,
              )}
              disabled={isPicked || completed}
              key={stage.label}
              onClick={() => handlePick(stage.label)}
              type="button"
              variant="outline"
            >
              {stage.label}
            </Button>
          );
        })}
      </fieldset>

      {feedback ? (
        <p
          aria-live="polite"
          className={cn(
            "mt-4 rounded-lg border bg-white p-3 text-sm leading-6",
            completed ? theme.accentText : "text-muted-foreground",
          )}
        >
          {feedback}
        </p>
      ) : null}

      <div className="mt-3">
        <Button onClick={reset} type="button" variant="ghost">
          <RotateCcw className="size-4" />
          Shuffle and try again
        </Button>
      </div>
    </section>
  );
}
