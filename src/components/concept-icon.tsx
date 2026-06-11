import {
  Binary,
  Brain,
  CloudCog,
  GitBranch,
  type LucideIcon,
  Network,
} from "lucide-react";

import type { ConceptSlug } from "@/lib/concepts";

const icons: Record<ConceptSlug, LucideIcon> = {
  "dev-lifecycle": GitBranch,
  "web-app-architecture": Network,
  "platform-tradeoffs": CloudCog,
  "ai-ml-lifecycle": Binary,
  "ai-ml-libraries": Brain,
};

export function ConceptIcon({
  slug,
  className,
}: {
  slug: ConceptSlug;
  className?: string;
}) {
  const Icon = icons[slug];

  return <Icon aria-hidden="true" className={className} />;
}
