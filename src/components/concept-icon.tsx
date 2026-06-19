import {
  Binary,
  Brain,
  Globe,
  CloudCog,
  GitBranch,
  Library,
  type LucideIcon,
  Network,
} from "lucide-react"

import type { ConceptSlug } from "@/lib/concepts"

const icons: Record<ConceptSlug, LucideIcon> = {
  "dev-lifecycle": GitBranch,
  "web-app-architecture": Globe,
  "platform-tradeoffs": CloudCog,
  "ai-ml-lifecycle": Binary,
  "ai-ml-libraries": Brain,
  "metadata-linked-data": Library,
}

export function ConceptIcon({
  slug,
  className,
}: {
  slug: ConceptSlug
  className?: string
}) {
  const Icon = icons[slug]

  return <Icon aria-hidden="true" className={className} />
}
