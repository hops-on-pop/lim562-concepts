"use client";

import type { LucideIcon } from "lucide-react";

import type { ConceptTheme } from "@/lib/concept-themes";
import { cn } from "@/lib/utils";

export type CategoryProject = {
  id: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  /** Small status dot (e.g., field readiness); Tailwind background class. */
  indicatorClassName?: string;
};

export type CategoryAccent = {
  container: string;
  heading: string;
  iconBadge: string;
  activeChip: string;
  chipIcon: string;
};

export type GenAiCategory = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  projects: CategoryProject[];
  accent?: CategoryAccent;
};

type GenAiCategoryMapProps = {
  categories: GenAiCategory[];
  activeId: string;
  onSelect: (id: string) => void;
  theme: ConceptTheme;
};

export function GenAiCategoryMap({
  categories,
  activeId,
  onSelect,
  theme,
}: GenAiCategoryMapProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:items-stretch">
      {categories.map((category) => {
        const CategoryIcon = category.icon;
        const accent = category.accent;

        return (
          <section
            aria-labelledby={`genai-category-${category.id}`}
            className={cn(
              "h-full rounded-xl border p-4",
              accent?.container ?? "border-rose-200/80 bg-white/90",
            )}
            key={category.id}
          >
            <div className="mb-3 flex items-start gap-3">
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg",
                  accent?.iconBadge ?? theme.iconBadge,
                )}
              >
                <CategoryIcon className="size-4" />
              </span>
              <div>
                <h3
                  className={cn(
                    "text-sm font-semibold",
                    accent?.heading ?? "text-rose-950",
                  )}
                  id={`genai-category-${category.id}`}
                >
                  {category.label}
                </h3>
                <p className="text-xs leading-5 text-muted-foreground">
                  {category.description}
                </p>
              </div>
            </div>

            <ul className="flex flex-wrap gap-2">
              {category.projects.map((project) => {
                const Icon = project.icon;
                const isActive = project.id === activeId;

                return (
                  <li key={project.id}>
                    <button
                      aria-pressed={isActive}
                      className={cn(
                        "flex min-h-11 items-center gap-2 rounded-xl border bg-white px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                        isActive
                          ? (accent?.activeChip ?? theme.activeControl)
                          : theme.inactiveControl,
                      )}
                      onClick={() => onSelect(project.id)}
                      type="button"
                    >
                      <Icon
                        className={cn(
                          "size-4 shrink-0",
                          accent?.chipIcon ?? "text-rose-900",
                        )}
                      />
                      <span className="text-sm font-medium">
                        {project.label}
                      </span>
                      {project.indicatorClassName ? (
                        <span
                          aria-hidden="true"
                          className={cn(
                            "size-1.5 shrink-0 rounded-full",
                            project.indicatorClassName,
                          )}
                        />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
