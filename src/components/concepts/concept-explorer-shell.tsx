"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getConceptTheme } from "@/lib/concept-themes";
import type { ConceptSlug } from "@/lib/concepts";
import { cn } from "@/lib/utils";

export function ConceptExplorerShell({
  slug,
  title,
  description,
  howItWorks,
  children,
  className,
  contentClassName,
  scrollContent = true,
}: {
  slug: ConceptSlug;
  title?: string;
  description?: string;
  howItWorks?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  scrollContent?: boolean;
}) {
  const theme = getConceptTheme(slug);
  const showHeader = title || howItWorks || description;

  return (
    <Card
      className={cn(
        theme.card,
        theme.shell,
        "flex max-h-[125dvh] flex-col overflow-hidden",
        className,
      )}
    >
      {showHeader ? (
        <CardHeader className={theme.header}>
          {title ? <CardTitle>{title}</CardTitle> : null}
          {howItWorks ? (
            <p className="text-sm leading-6 text-muted-foreground">
              <span className="font-semibold text-foreground">
                How it works:
              </span>{" "}
              {howItWorks}
            </p>
          ) : description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </CardHeader>
      ) : null}
      <CardContent
        className={cn(
          theme.contentGap,
          "flex min-h-0 flex-1 flex-col",
          scrollContent ? "overflow-y-auto" : "overflow-visible",
          contentClassName,
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
}
