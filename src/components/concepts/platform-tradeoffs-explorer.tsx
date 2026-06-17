"use client"

import type { LucideIcon } from "lucide-react"
import {
  AppWindow,
  Building2,
  CloudCog,
  Layers3,
  ShieldCheck,
} from "lucide-react"
import { useReducedMotion } from "motion/react"
import { Fragment, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { MOTION_EASE, motionTransition } from "@/lib/animation"
import { getConceptTheme } from "@/lib/concept-themes"
import { motion } from "@/lib/motion"
import { cn } from "@/lib/utils"

import { ConceptExplorerShell } from "./concept-explorer-shell"

type HostingModelId = "onprem" | "iaas" | "paas" | "saas"

type Ownership = "open" | "proprietary" | "custom"

type TradeoffLevel = "high" | "medium" | "low"

type TradeoffDimensionId = "control" | "effort" | "vendor" | "upfront"

const stackLayers = [
  { id: "data", label: "Data & policy", note: "Records, patron data, config" },
  { id: "app", label: "Application", note: "The ILS, catalog, or site itself" },
  { id: "runtime", label: "Runtime", note: "Language runtimes, web servers" },
  { id: "os", label: "Operating system", note: "Linux/Windows, patching" },
  {
    id: "infra",
    label: "Servers & network",
    note: "Hardware, storage, uptime",
  },
]

const hostingModels: {
  id: HostingModelId
  label: string
  fullName: string
  providers: string
  icon: LucideIcon
  /** Layers from the top of the stack that the library manages. */
  libraryManages: number
  detail: string
  fit: string
  strengths: string[]
  watch: string[]
  levels: Record<TradeoffDimensionId, TradeoffLevel>
  examples: { name: string; ownership: Ownership }[]
}[] = [
  {
    id: "onprem",
    label: "On-premises",
    fullName: "Self-hosted on library hardware",
    providers: "Your own server room or campus data center",
    icon: Building2,
    libraryManages: 5,
    detail:
      "The library racks its own servers and manages everything from network cables to the catalog interface.",
    fit: "Works when the library values maximum control and has systems staff to run hardware and software end to end.",
    strengths: [
      "Full control of every layer",
      "Data never leaves the building",
      "No ongoing hosting fees",
    ],
    watch: [
      "Hardware purchase and replacement",
      "All patching and backups are local work",
      "Scaling means buying more servers",
    ],
    levels: { control: "high", effort: "high", vendor: "low", upfront: "high" },
    examples: [
      { name: "Koha ILS on library-owned servers", ownership: "open" },
      {
        name: "SirsiDynix Symphony, installed locally",
        ownership: "proprietary",
      },
    ],
  },
  {
    id: "iaas",
    label: "IaaS",
    fullName: "Infrastructure as a Service",
    providers: "AWS EC2, Azure VMs, Google Compute Engine",
    icon: CloudCog,
    libraryManages: 4,
    detail:
      "The library rents virtual servers from a cloud provider but still installs, patches, and runs everything on them.",
    fit: "Works when the library wants cloud flexibility but still needs full control of the software environment.",
    strengths: [
      "No hardware to buy or replace",
      "Capacity scales up and down quickly",
      "Full control from the operating system up",
    ],
    watch: [
      "Staff still patch and secure the OS",
      "Costs grow with usage and need monitoring",
      "The cloud provider becomes a dependency",
    ],
    levels: {
      control: "high",
      effort: "high",
      vendor: "medium",
      upfront: "low",
    },
    examples: [
      { name: "Koha on AWS EC2 virtual machines", ownership: "open" },
      { name: "EZproxy running on a cloud VM", ownership: "proprietary" },
    ],
  },
  {
    id: "paas",
    label: "PaaS",
    fullName: "Platform as a Service",
    providers: "Heroku, Vercel, Google App Engine",
    icon: Layers3,
    libraryManages: 2,
    detail:
      "Developers push application code and the platform runs it — runtime, operating system, and servers are the provider's job.",
    fit: "Works when the library builds custom apps and wants developers focused on code, not servers.",
    strengths: [
      "No server administration at all",
      "Deploys and updates are fast",
      "Platform handles scaling and uptime",
    ],
    watch: [
      "Apps get tied to platform-specific features",
      "Less visibility into the underlying stack",
      "Pricing can shift under the library",
    ],
    levels: {
      control: "medium",
      effort: "medium",
      vendor: "high",
      upfront: "low",
    },
    examples: [
      { name: "Custom room-booking app on Heroku", ownership: "custom" },
      { name: "Digital exhibits site on Vercel", ownership: "custom" },
    ],
  },
  {
    id: "saas",
    label: "SaaS",
    fullName: "Software as a Service",
    providers: "Ex Libris Alma, Springshare LibGuides, OCLC WorldShare",
    icon: AppWindow,
    libraryManages: 1,
    detail:
      "The library signs in and configures — the vendor runs the entire application for every customer.",
    fit: "Works when the library wants a finished service and staffing for systems work is limited.",
    strengths: [
      "Nothing to install or maintain",
      "Vendor handles updates and security",
      "Predictable subscription pricing",
    ],
    watch: [
      "Customization limited to what settings allow",
      "Contract and exit terms are critical",
      "Patron data lives with the vendor",
    ],
    levels: { control: "low", effort: "low", vendor: "high", upfront: "low" },
    examples: [
      { name: "Ex Libris Alma", ownership: "proprietary" },
      { name: "ByWater-hosted Koha", ownership: "open" },
      { name: "Springshare LibGuides", ownership: "proprietary" },
    ],
  },
]

const tradeoffDimensions: {
  id: TradeoffDimensionId
  label: string
  higherIsBetter: boolean
}[] = [
  { id: "control", label: "Control & customization", higherIsBetter: true },
  { id: "effort", label: "Staff technical effort", higherIsBetter: false },
  { id: "vendor", label: "Vendor dependence", higherIsBetter: false },
  {
    id: "upfront",
    label: "Up-front infrastructure cost",
    higherIsBetter: false,
  },
]

const levelLabel: Record<TradeoffLevel, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
}

const ownershipBadge: Record<Ownership, { label: string; className: string }> =
  {
    open: {
      label: "Open source",
      className: "border-emerald-300 bg-emerald-50 text-emerald-900",
    },
    proprietary: {
      label: "Proprietary",
      className: "border-slate-300 bg-slate-100 text-slate-800",
    },
    custom: {
      label: "Custom code",
      className: "border-sky-300 bg-sky-50 text-sky-900",
    },
  }

function tradeoffLevelStyles(level: TradeoffLevel, higherIsBetter: boolean) {
  const isFavorable = higherIsBetter ? level === "high" : level === "low"
  const isUnfavorable = higherIsBetter ? level === "low" : level === "high"

  if (isFavorable) {
    return "border-emerald-300 bg-emerald-100 text-emerald-950"
  }
  if (isUnfavorable) {
    return "border-rose-300 bg-rose-100 text-rose-950"
  }
  return "border-amber-300 bg-amber-100 text-amber-950"
}

const theme = getConceptTheme("platform-tradeoffs")

export function PlatformTradeoffsExplorer() {
  const prefersReducedMotion = useReducedMotion() ?? false
  const [activeId, setActiveId] = useState<HostingModelId>("iaas")
  const model =
    hostingModels.find((entry) => entry.id === activeId) ?? hostingModels[0]

  return (
    <ConceptExplorerShell
      howItWorks="Pick a hosting model to see who manages each layer of the technology stack — the boundary between library work and vendor work slides as you move from on-premises toward SaaS. Software ownership is a separate, independent choice: the example badges show open source and proprietary systems at every point on the spectrum."
      slug="platform-tradeoffs"
    >
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)] lg:items-start">
          <div className="min-w-0 space-y-3">
            <ResponsibilityMatrix
              activeId={activeId}
              onSelect={setActiveId}
              prefersReducedMotion={prefersReducedMotion}
            />
            <SelectedStack model={model} onSelect={setActiveId} />
            <p
              className={cn(
                "flex items-start gap-2 rounded-lg p-3 text-xs leading-5",
                theme.accentSurface,
                theme.accentText,
              )}
            >
              <ShieldCheck className="mt-0.5 size-4 shrink-0" />
              Whoever hosts, the top row never moves: the library still owns its
              data, records, and policy decisions.
            </p>
          </div>

          <TradeoffLabels levels={model.levels} />
        </div>

        <aside
          className={cn(
            theme.detailPanel,
            "grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4",
          )}
        >
          <div className="sm:col-span-2 xl:col-span-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {model.fullName}
            </p>
            <h3 className="text-lg font-semibold">{model.label}</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {model.detail}
            </p>
            <p className={cn("mt-2 text-sm leading-6", theme.accentText)}>
              {model.fit}
            </p>
          </div>

          <TradeoffList
            items={model.strengths}
            label="Benefits"
            tone="benefit"
          />
          <TradeoffList items={model.watch} label="Watch points" />

          <div className="sm:col-span-2 xl:col-span-2">
            <Badge variant="outline">Library examples</Badge>
            <ul className="mt-3 space-y-2">
              {model.examples.map((example) => {
                const badge = ownershipBadge[example.ownership]

                return (
                  <li
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/60 px-3 py-2 text-sm leading-6 text-muted-foreground"
                    key={example.name}
                  >
                    {example.name}
                    <span
                      className={cn(
                        "shrink-0 rounded-md border px-1.5 py-0.5 text-[0.65rem] font-medium",
                        badge.className,
                      )}
                    >
                      {badge.label}
                    </span>
                  </li>
                )
              })}
            </ul>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Typical providers: {model.providers}
            </p>
          </div>
        </aside>
      </div>

      <OwnershipStrip />
    </ConceptExplorerShell>
  )
}

/** Desktop matrix: all four models side by side, canonical responsibility chart. */
function ResponsibilityMatrix({
  activeId,
  onSelect,
  prefersReducedMotion,
}: {
  activeId: HostingModelId
  onSelect: (id: HostingModelId) => void
  prefersReducedMotion: boolean
}) {
  return (
    <div className="hidden grid-cols-[minmax(6rem,auto)_repeat(4,minmax(0,1fr))] gap-1.5 md:grid">
      <span aria-hidden="true" />
      {hostingModels.map((model) => {
        const Icon = model.icon
        const isActive = model.id === activeId

        return (
          <button
            aria-pressed={isActive}
            className={cn(
              "relative flex flex-col items-center gap-1 rounded-xl border bg-white px-2 py-2 text-center transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
              isActive
                ? "border-amber-700 text-amber-950"
                : "hover:bg-amber-50",
            )}
            key={model.id}
            onClick={() => onSelect(model.id)}
            type="button"
          >
            {isActive ? (
              <motion.span
                aria-hidden="true"
                className="absolute -inset-px rounded-xl border-2 border-amber-700 shadow-sm"
                layoutId="platform-active-model"
                transition={motionTransition(prefersReducedMotion, {
                  duration: 0.3,
                  ease: MOTION_EASE,
                })}
              />
            ) : null}
            <Icon className="size-4 shrink-0" />
            <span className="text-xs font-semibold leading-tight">
              {model.label}
            </span>
          </button>
        )
      })}

      {stackLayers.map((layer, layerIndex) => (
        <Fragment key={layer.id}>
          <span className="flex flex-col justify-center rounded-lg px-2 py-1">
            <span className="text-xs font-medium leading-tight">
              {layer.label}
            </span>
            <span className="hidden text-[0.6rem] leading-tight text-muted-foreground xl:block">
              {layer.note}
            </span>
          </span>
          {hostingModels.map((model) => {
            const libraryManaged = layerIndex < model.libraryManages
            const isActive = model.id === activeId

            return (
              <span
                className={cn(
                  "flex min-h-9 items-center justify-center rounded-lg border text-[0.65rem] font-medium transition-opacity",
                  libraryManaged
                    ? "border-amber-300 bg-amber-100 text-amber-950"
                    : "border-border bg-muted text-muted-foreground",
                  isActive ? "opacity-100" : "opacity-55",
                )}
                key={`${model.id}-${layer.id}`}
              >
                {libraryManaged ? "Library" : "Vendor"}
              </span>
            )
          })}
        </Fragment>
      ))}
    </div>
  )
}

/** Mobile: model picker plus the selected model's stack as a single column. */
function SelectedStack({
  model,
  onSelect,
}: {
  model: (typeof hostingModels)[number]
  onSelect: (id: HostingModelId) => void
}) {
  return (
    <div className="space-y-3 md:hidden">
      <div className="grid grid-cols-2 gap-1.5">
        {hostingModels.map((entry) => {
          const Icon = entry.icon
          const isActive = entry.id === model.id

          return (
            <button
              aria-pressed={isActive}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-lg border bg-white px-2 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                isActive
                  ? "border-amber-700 text-amber-950 shadow-sm"
                  : "hover:bg-amber-50",
              )}
              key={entry.id}
              onClick={() => onSelect(entry.id)}
              type="button"
            >
              <Icon className="size-3.5 shrink-0" />
              {entry.label}
            </button>
          )
        })}
      </div>
      <ul className="space-y-1.5">
        {stackLayers.map((layer, layerIndex) => {
          const libraryManaged = layerIndex < model.libraryManages

          return (
            <li
              className="flex items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2"
              key={layer.id}
            >
              <span className="text-xs font-medium">{layer.label}</span>
              <span
                className={cn(
                  "shrink-0 rounded-md border px-2 py-0.5 text-[0.65rem] font-medium",
                  libraryManaged
                    ? "border-amber-300 bg-amber-100 text-amber-950"
                    : "border-border bg-muted text-muted-foreground",
                )}
              >
                {libraryManaged ? "Library" : "Vendor"}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function OwnershipStrip() {
  return (
    <section
      aria-labelledby="ownership-strip-heading"
      className={cn("rounded-xl border bg-white p-4", theme.accentSurface)}
    >
      <h3 className="text-base font-semibold" id="ownership-strip-heading">
        Ownership is a separate choice
      </h3>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        Open source and proprietary software can each sit anywhere on the
        hosting spectrum.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <OwnershipCard
          items={[
            "Code is inspectable and modifiable",
            "Community-driven roadmap",
            "Support from community or paid vendors",
          ]}
          ownership="open"
        />
        <OwnershipCard
          items={[
            "Vendor-managed roadmap and support",
            "Licensing costs and contract terms",
            "Less visibility into the code",
          ]}
          ownership="proprietary"
        />
      </div>
    </section>
  )
}

function OwnershipCard({
  ownership,
  items,
}: {
  ownership: Ownership
  items: string[]
}) {
  const badge = ownershipBadge[ownership]

  return (
    <div className="rounded-lg border bg-white p-3">
      <span
        className={cn(
          "rounded-md border px-1.5 py-0.5 text-[0.65rem] font-medium",
          badge.className,
        )}
      >
        {badge.label}
      </span>
      <ul className="mt-2 space-y-1 text-sm leading-6 text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

function TradeoffLabels({
  levels,
}: {
  levels: Record<TradeoffDimensionId, TradeoffLevel>
}) {
  return (
    <div
      className={cn(
        "space-y-4 rounded-xl border bg-white p-4",
        theme.accentSurface,
      )}
    >
      <div>
        <p className="text-lg font-semibold">Tradeoffs</p>
      </div>
      {tradeoffDimensions.map((dimension) => {
        const level = levels[dimension.id]

        return (
          <div
            className="flex items-center justify-between gap-2"
            key={dimension.id}
          >
            <span className="text-sm leading-6 text-muted-foreground">
              {dimension.label}
            </span>
            <span
              className={cn(
                "shrink-0 rounded-md border px-2 py-0.5 text-sm font-semibold",
                tradeoffLevelStyles(level, dimension.higherIsBetter),
              )}
            >
              {levelLabel[level]}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function TradeoffList({
  items,
  label,
  tone = "watch",
}: {
  items: string[]
  label: string
  tone?: "benefit" | "watch"
}) {
  return (
    <div>
      <Badge variant={tone === "benefit" ? "default" : "outline"}>
        {label}
      </Badge>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
        {items.map((item) => (
          <li className="rounded-lg bg-muted/60 px-3 py-2" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
