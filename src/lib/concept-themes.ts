import type { ConceptSlug } from "@/lib/concepts"

export type ConceptLayoutRhythm =
  | "cycle"
  | "pipeline"
  | "journey"
  | "quadrant"
  | "categories"
  | "stages"

export type ConceptTheme = {
  slug: ConceptSlug
  layout: ConceptLayoutRhythm
  card: string
  shell: string
  header: string
  contentGap: string
  detailPanel: string
  iconBadge: string
  iconBadgeHover: string
  accentText: string
  accentMuted: string
  accentSurface: string
  activeControl: string
  inactiveControl: string
  callout: string
}

const themes: Record<ConceptSlug, ConceptTheme> = {
  "ai-ml-lifecycle": {
    slug: "ai-ml-lifecycle",
    layout: "cycle",
    card: "border-indigo-900/10 bg-indigo-50/35",
    shell: "overflow-hidden rounded-2xl",
    header: "text-center sm:text-left",
    contentGap: "space-y-7",
    detailPanel: "rounded-2xl border bg-white p-5",
    iconBadge: "bg-indigo-700 text-white",
    iconBadgeHover: "hover:bg-indigo-800 hover:text-white",
    accentText: "text-indigo-950",
    accentMuted: "text-indigo-900",
    accentSurface: "bg-indigo-50",
    activeControl: "border-indigo-700 text-indigo-950 shadow-sm",
    inactiveControl: "hover:border-indigo-200 hover:bg-indigo-50/70",
    callout: "rounded-lg bg-indigo-50 p-3 text-sm text-indigo-950",
  },
  "dev-lifecycle": {
    slug: "dev-lifecycle",
    layout: "pipeline",
    card: "border-sky-900/10 bg-sky-50/35",
    shell: "border-l-4 border-l-sky-600/40 rounded-r-xl rounded-l-md",
    header: "border-b border-sky-900/5 pb-4",
    contentGap: "space-y-8",
    detailPanel: "rounded-xl border bg-white p-4",
    iconBadge: "bg-sky-700 text-white",
    iconBadgeHover: "hover:bg-sky-800 hover:text-white",
    accentText: "text-sky-950",
    accentMuted: "text-sky-900",
    accentSurface: "bg-sky-50",
    activeControl: "border-sky-700 bg-white text-sky-950",
    inactiveControl: "",
    callout: "text-sm font-medium text-sky-900",
  },
  "web-app-architecture": {
    slug: "web-app-architecture",
    layout: "journey",
    card: "border-emerald-900/10 bg-emerald-50/35",
    shell: "shadow-sm",
    header: "",
    contentGap: "space-y-5",
    detailPanel: "rounded-xl border bg-white p-5",
    iconBadge: "bg-emerald-700 text-white",
    iconBadgeHover: "hover:bg-emerald-800 hover:text-white",
    accentText: "text-emerald-950",
    accentMuted: "text-emerald-900",
    accentSurface: "bg-emerald-50",
    activeControl: "border-emerald-700 text-emerald-950 shadow-sm",
    inactiveControl: "hover:border-emerald-200 hover:bg-emerald-50/70",
    callout: "text-sm text-emerald-950",
  },
  "platform-tradeoffs": {
    slug: "platform-tradeoffs",
    layout: "quadrant",
    card: "border-orange-900/10 bg-orange-50/35",
    shell: "ring-1 ring-orange-900/5",
    header: "sm:px-1",
    contentGap: "space-y-6",
    detailPanel: "rounded-xl border bg-white p-5",
    iconBadge: "bg-orange-700 text-white",
    iconBadgeHover: "hover:bg-yellow-900 hover:text-white",
    accentText: "text-orange-950",
    accentMuted: "text-orange-900",
    accentSurface: "bg-orange-50",
    activeControl: "border-orange-700 bg-orange-50 text-orange-950",
    inactiveControl: "",
    callout: "text-sm text-orange-950",
  },
  "ai-ml-libraries": {
    slug: "ai-ml-libraries",
    layout: "categories",
    card: "border-rose-900/10 bg-rose-50/35",
    shell: "rounded-xl",
    header: "pt-1",
    contentGap: "space-y-6",
    detailPanel: "rounded-2xl border bg-white p-5 shadow-sm",
    iconBadge: "bg-rose-700 text-white",
    iconBadgeHover: "hover:bg-rose-800 hover:text-white",
    accentText: "text-rose-950",
    accentMuted: "text-rose-900",
    accentSurface: "bg-rose-50",
    activeControl: "border-rose-700 bg-rose-50 text-rose-950 shadow-sm",
    inactiveControl: "hover:border-rose-200 hover:bg-rose-50/70",
    callout: "text-sm text-rose-950",
  },
  "metadata-linked-data": {
    slug: "metadata-linked-data",
    layout: "stages",
    card: "border-lime-900/10 bg-lime-50/35",
    shell: "shadow-sm",
    header: "",
    contentGap: "space-y-5",
    detailPanel: "rounded-xl border bg-white p-5",
    iconBadge: "bg-lime-700 text-white",
    iconBadgeHover: "hover:bg-lime-900 hover:text-white",
    accentText: "text-lime-950",
    accentMuted: "text-lime-900",
    accentSurface: "bg-lime-50",
    activeControl: "border-lime-700 bg-lime-50 text-lime-950 shadow-sm",
    inactiveControl: "hover:border-lime-200 hover:bg-lime-50/70",
    callout: "text-sm text-lime-950",
  },
}

export function getConceptTheme(slug: ConceptSlug): ConceptTheme {
  return themes[slug]
}
