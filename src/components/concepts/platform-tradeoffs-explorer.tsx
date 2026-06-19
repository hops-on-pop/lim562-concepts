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
import type { ReactNode } from "react"
import { Fragment, useState } from "react"

import { MOTION_EASE, motionTransition } from "@/lib/animation"
import { getConceptTheme } from "@/lib/concept-themes"
import { motion } from "@/lib/motion"
import { cn } from "@/lib/utils"

import { ConceptExplorerShell } from "./concept-explorer-shell"

type HostingModelId = "onprem" | "iaas" | "paas" | "saas"

type Ownership = "open" | "proprietary"

type TradeoffLevel = "high" | "medium" | "low"

type TradeoffDimensionId = "control" | "effort" | "vendor" | "upfront"

type StackLayerId = "data" | "app" | "runtime" | "os" | "infra"

type ResponsibleParty = "library" | "shared" | "vendor"

type PlatformCombination = {
  ownership: Ownership
  hosting: HostingModelId
  title: string
  detail: string
  fit: string
  label: string
  note: string
  providers: string
  strengths: string[]
  watch: string[]
  levels: Record<TradeoffDimensionId, TradeoffLevel>
}

const stackLayers: {
  id: StackLayerId
  label: string
  note: string
}[] = [
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
  /** Layers from the top that the library operates before ownership-specific overrides. */
  libraryManages: number
}[] = [
  {
    id: "onprem",
    label: "On-premises",
    fullName: "Self-hosted on library hardware",
    providers: "Your own server room or campus data center",
    icon: Building2,
    libraryManages: 5,
  },
  {
    id: "iaas",
    label: "IaaS",
    fullName: "Infrastructure as a Service",
    providers: "AWS EC2, Azure VMs, Google Compute Engine",
    icon: CloudCog,
    libraryManages: 4,
  },
  {
    id: "paas",
    label: "PaaS",
    fullName: "Platform as a Service",
    providers: "Heroku, Vercel, Google App Engine",
    icon: Layers3,
    libraryManages: 2,
  },
  {
    id: "saas",
    label: "SaaS",
    fullName: "Software as a Service",
    providers: "Ex Libris Alma, Springshare LibGuides, OCLC WorldShare",
    icon: AppWindow,
    libraryManages: 1,
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
    label: "Up-front and license cost",
    higherIsBetter: false,
  },
]

const ownershipOptions: Record<Ownership, { label: string; detail: string }> = {
  open: {
    label: "Open source",
    detail:
      "The library can inspect, modify, and move the software, even when another organization hosts it.",
  },
  proprietary: {
    label: "Proprietary",
    detail:
      "The vendor controls the code, roadmap, licensing, and support model while the library configures what the product exposes.",
  },
}

const unavailableCombinations: Partial<
  Record<Ownership, Partial<Record<HostingModelId, string>>>
> = {
  proprietary: {
    paas: "PaaS is usually for deploying application code to a managed runtime. Proprietary library systems are more commonly delivered as a licensed local install, an application on a VM, or a full SaaS product.",
  },
}

const platformCombinations: PlatformCombination[] = [
  {
    ownership: "open",
    hosting: "onprem",
    title: "Open source, self-hosted",
    detail:
      "The library runs open-source software on local hardware and manages the full technical stack.",
    fit: "Works when the library wants maximum control and has staff or a support partner who can operate servers and software.",
    label: "Koha ILS on library-owned servers",
    note: "The library can inspect and modify the code, but it also owns patching, backups, upgrades, and uptime.",
    providers: "Library-owned servers or a campus data center",
    strengths: [
      "Maximum local control over code, data, integrations, and timing",
      "No vendor lock-in to a hosted platform",
      "Data can remain fully inside local infrastructure",
    ],
    watch: [
      "Requires server administration and application expertise",
      "Upgrades, security patches, and recovery planning are local responsibilities",
      "Hardware replacement and capacity planning stay with the library",
    ],
    levels: { control: "high", effort: "high", vendor: "low", upfront: "high" },
  },
  {
    ownership: "open",
    hosting: "iaas",
    title: "Open source on IaaS",
    detail:
      "The library runs open-source software on rented cloud virtual machines while still managing the operating system and application stack.",
    fit: "Works when the library wants cloud infrastructure without giving up control of the software environment.",
    label: "Koha on AWS EC2 virtual machines",
    note: "The cloud provider supplies virtual hardware; the library or support vendor still maintains the application and server environment.",
    providers: "AWS EC2, Azure VMs, Google Compute Engine",
    strengths: [
      "Avoids buying physical hardware",
      "Keeps strong control over configuration and integrations",
      "Capacity can scale more flexibly than local servers",
    ],
    watch: [
      "Staff still manage OS patches, backups, monitoring, and security",
      "Cloud costs need active governance",
      "The cloud provider becomes an infrastructure dependency",
    ],
    levels: {
      control: "high",
      effort: "high",
      vendor: "medium",
      upfront: "low",
    },
  },
  {
    ownership: "open",
    hosting: "paas",
    title: "Open source on PaaS",
    detail:
      "The library deploys open-source application code to a platform that manages runtime, operating system, and servers.",
    fit: "Works best for library-built or web-publishing applications where developers need to focus on code rather than server operations.",
    label: "Omeka S exhibit site on Pantheon",
    note: "The application remains open source, while the platform takes over much of the operational stack below the app.",
    providers: "Pantheon, Heroku, Platform.sh, Google App Engine",
    strengths: [
      "Less server administration than self-hosting or IaaS",
      "Faster deployments and easier scaling for web applications",
      "Code remains inspectable and portable in principle",
    ],
    watch: [
      "Not every library system fits a PaaS deployment model",
      "Platform-specific features can reduce portability",
      "Runtime limits and pricing rules shape architecture choices",
    ],
    levels: {
      control: "medium",
      effort: "medium",
      vendor: "medium",
      upfront: "low",
    },
  },
  {
    ownership: "open",
    hosting: "saas",
    title: "Open source as SaaS",
    detail:
      "A vendor operates open-source software as a hosted service while the library configures and uses the system. The application code remains open, but the hosted instance is vendor-operated.",
    fit: "Works when the library wants the values and portability of open source without running the infrastructure itself.",
    label: "ByWater-hosted Koha",
    note: "The application layer is shared in practice: the codebase is open, while hosting, updates, monitoring, and operational support are handled by the service provider.",
    providers:
      "ByWater Solutions, PTFS Europe, Equinox Open Library Initiative",
    strengths: [
      "Much lower local operations burden",
      "More exit options than many closed SaaS products",
      "Support vendor can handle routine maintenance and hosting",
    ],
    watch: [
      "Customization may be limited by the hosting arrangement",
      "Data export, upgrade timing, and support terms still matter",
      "The library depends on the vendor's service quality",
    ],
    levels: {
      control: "medium",
      effort: "low",
      vendor: "medium",
      upfront: "low",
    },
  },
  {
    ownership: "proprietary",
    hosting: "onprem",
    title: "Proprietary, self-hosted",
    detail:
      "The library runs licensed vendor software on local infrastructure, while the vendor controls the application code and product roadmap.",
    fit: "Works when a library needs local infrastructure control but accepts vendor ownership of the software itself.",
    label: "SirsiDynix Symphony, installed locally",
    note: "The library manages servers and local operations; the vendor provides the licensed application and supported update path.",
    providers: "Local servers or a campus data center plus the product vendor",
    strengths: [
      "Local control over infrastructure and some operational timing",
      "Vendor documentation and product support are available",
      "Can fit institutions with strict local hosting requirements",
    ],
    watch: [
      "The code and roadmap remain vendor-controlled",
      "Local staff still handle infrastructure, backups, and uptime",
      "Licensing, support, and upgrade terms shape long-term flexibility",
    ],
    levels: {
      control: "medium",
      effort: "high",
      vendor: "medium",
      upfront: "high",
    },
  },
  {
    ownership: "proprietary",
    hosting: "iaas",
    title: "Proprietary on IaaS",
    detail:
      "The library runs licensed software on cloud virtual machines, separating infrastructure hosting from software ownership.",
    fit: "Works when a proprietary product can be installed on a VM and the library wants cloud infrastructure rather than local hardware.",
    label: "EZproxy running on a cloud VM",
    note: "The product is licensed, while the library still manages the virtual machine, operating system, updates, and monitoring.",
    providers:
      "AWS EC2, Azure VMs, Google Compute Engine plus the product vendor",
    strengths: [
      "Avoids local hardware while preserving a familiar server-based deployment",
      "Vendor support covers the product layer",
      "Cloud capacity can be adjusted more easily than local infrastructure",
    ],
    watch: [
      "The library still owns VM security, backups, and monitoring",
      "There are two dependencies: the product vendor and the cloud provider",
      "License terms may constrain how the software can be hosted",
    ],
    levels: {
      control: "medium",
      effort: "medium",
      vendor: "high",
      upfront: "low",
    },
  },
  {
    ownership: "proprietary",
    hosting: "saas",
    title: "Proprietary SaaS",
    detail:
      "The vendor owns and operates the full application, and the library accesses it as a subscribed service.",
    fit: "Works when the library wants a finished system with minimal local systems administration.",
    label: "Ex Libris Alma",
    note: "The vendor controls the application, hosting, roadmap, and update process; the library configures within the product and contract.",
    providers: "Ex Libris Alma, OCLC WorldShare, Springshare LibGuides",
    strengths: [
      "Lowest local infrastructure and maintenance burden",
      "Vendor handles hosting, updates, security, and uptime commitments",
      "Implementation and support processes are standardized",
    ],
    watch: [
      "Customization is limited to supported settings and integrations",
      "Exit planning depends on data export and contract terms",
      "Subscription, renewal, and add-on costs need careful review",
    ],
    levels: { control: "low", effort: "low", vendor: "high", upfront: "low" },
  },
]

const levelLabel: Record<TradeoffLevel, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
}

const responsibilityCellStyles = {
  library: "border-orange-300 bg-orange-100 text-orange-950",
  shared: "border-sky-300 bg-sky-50 text-sky-950",
  vendor: "border-slate-400 bg-slate-200 text-slate-950",
} as const

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
  return "border-orange-300 bg-orange-100 text-orange-950"
}

function getResponsibleParty({
  layerId,
  layerIndex,
  model,
  ownership,
}: {
  layerId: StackLayerId
  layerIndex: number
  model: (typeof hostingModels)[number]
  ownership: Ownership
}): ResponsibleParty {
  if (layerId === "data") {
    return "library"
  }

  if (layerId === "app" && ownership === "open" && model.id === "saas") {
    return "shared"
  }

  if (layerId === "app" && ownership === "proprietary") {
    return "vendor"
  }

  return layerIndex < model.libraryManages ? "library" : "vendor"
}

function responsiblePartyLabel(party: ResponsibleParty) {
  if (party === "library") {
    return "Library"
  }
  if (party === "shared") {
    return "Shared"
  }
  return "Vendor"
}

const theme = getConceptTheme("platform-tradeoffs")

export function PlatformTradeoffsExplorer() {
  const prefersReducedMotion = useReducedMotion() ?? false
  const [activeId, setActiveId] = useState<HostingModelId>("iaas")
  const [ownership, setOwnership] = useState<Ownership>("open")
  const model =
    hostingModels.find((entry) => entry.id === activeId) ?? hostingModels[0]
  const exampleBadge = ownershipBadge[ownership]
  const combination =
    platformCombinations.find(
      (entry) => entry.ownership === ownership && entry.hosting === activeId,
    ) ?? platformCombinations[0]

  function selectOwnership(nextOwnership: Ownership) {
    setOwnership(nextOwnership)
    if (unavailableCombinations[nextOwnership]?.[activeId]) {
      setActiveId("saas")
    }
  }

  return (
    <ConceptExplorerShell
      howItWorks="Choose the software ownership model first, then choose a hosting model. The stack, tradeoffs, example, advantages, and watch points all describe that specific combination."
      slug="platform-tradeoffs"
    >
      <div className="space-y-6">
        <SelectionPanel
          activeId={activeId}
          onHostingSelect={setActiveId}
          onOwnershipSelect={selectOwnership}
          ownership={ownership}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:items-start">
          <div className="min-w-0 space-y-3">
            <ResponsibilityMatrix
              activeId={activeId}
              ownership={ownership}
              onSelect={setActiveId}
              prefersReducedMotion={prefersReducedMotion}
            />
            <SelectedStack
              model={model}
              onSelect={setActiveId}
              ownership={ownership}
            />
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
            <TradeoffLabels levels={combination.levels} />
          </div>

          <CombinationSidebar
            combination={combination}
            exampleBadge={exampleBadge}
            hostingLabel={model.label}
            ownershipLabel={ownershipOptions[ownership].label}
          />
        </div>
      </div>
    </ConceptExplorerShell>
  )
}

function SelectionPanel({
  activeId,
  ownership,
  onHostingSelect,
  onOwnershipSelect,
}: {
  activeId: HostingModelId
  ownership: Ownership
  onHostingSelect: (id: HostingModelId) => void
  onOwnershipSelect: (ownership: Ownership) => void
}) {
  const disabledNote = unavailableCombinations[ownership]?.paas

  return (
    <div className={cn("rounded-xl border bg-white p-4", theme.accentSurface)}>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Software ownership
        </p>
        <div
          aria-label="Choose software ownership"
          className="mt-2 grid gap-2 sm:grid-cols-2"
          role="group"
        >
          {(["open", "proprietary"] as const).map((option) => {
            const isActive = ownership === option
            const badge = ownershipBadge[option]

            return (
              <button
                aria-pressed={isActive}
                className={cn(
                  "rounded-lg border bg-white p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                  isActive
                    ? "border-orange-700 shadow-sm"
                    : "hover:border-orange-200 hover:bg-orange-50/60",
                )}
                key={option}
                onClick={() => onOwnershipSelect(option)}
                type="button"
              >
                <span
                  className={cn(
                    "rounded-md border px-1.5 py-0.5 text-[0.65rem] font-medium",
                    badge.className,
                  )}
                >
                  {badge.label}
                </span>
                <span className="mt-2 block text-sm leading-6 text-muted-foreground">
                  {ownershipOptions[option].detail}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-4">
        {disabledNote ? (
          <p className="mt-2 rounded-lg border border-orange-200 bg-white px-3 py-2 text-xs leading-5 text-muted-foreground">
            {disabledNote}
          </p>
        ) : null}
      </div>
    </div>
  )
}

/** Desktop matrix: all four models side by side, canonical responsibility chart. */
function ResponsibilityMatrix({
  activeId,
  ownership,
  onSelect,
  prefersReducedMotion,
}: {
  activeId: HostingModelId
  ownership: Ownership
  onSelect: (id: HostingModelId) => void
  prefersReducedMotion: boolean
}) {
  return (
    <div className="hidden grid-cols-[minmax(6rem,auto)_repeat(4,minmax(0,1fr))] gap-1.5 md:grid">
      <span aria-hidden="true" />
      {hostingModels.map((model) => {
        const Icon = model.icon
        const isActive = model.id === activeId
        const isUnavailable = Boolean(
          unavailableCombinations[ownership]?.[model.id],
        )

        return (
          <button
            aria-disabled={isUnavailable}
            aria-pressed={isActive && !isUnavailable}
            className={cn(
              "relative flex flex-col items-center gap-1 rounded-xl border bg-white px-2 py-2 text-center transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
              isActive && !isUnavailable
                ? "border-orange-700 text-orange-950"
                : "hover:bg-orange-50",
              isUnavailable
                ? "cursor-not-allowed border-dashed bg-muted/50 text-muted-foreground hover:bg-muted/50"
                : "",
            )}
            disabled={isUnavailable}
            key={model.id}
            onClick={() => onSelect(model.id)}
            type="button"
          >
            {isActive && !isUnavailable ? (
              <motion.span
                aria-hidden="true"
                className="absolute -inset-px rounded-xl border-2 border-orange-700 shadow-sm"
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
            {isUnavailable ? (
              <span className="text-[0.6rem] font-medium leading-tight">
                Not typical
              </span>
            ) : null}
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
            const isActive = model.id === activeId
            const isUnavailable = Boolean(
              unavailableCombinations[ownership]?.[model.id],
            )
            const responsibleParty = getResponsibleParty({
              layerId: layer.id,
              layerIndex,
              model,
              ownership,
            })

            return (
              <span
                className={cn(
                  "flex min-h-9 items-center justify-center rounded-lg border text-[0.65rem] font-medium transition-opacity",
                  responsibilityCellStyles[responsibleParty],
                  isActive && !isUnavailable ? "opacity-100" : "opacity-80",
                  isUnavailable ? "opacity-35" : "",
                )}
                key={`${model.id}-${layer.id}`}
              >
                {responsiblePartyLabel(responsibleParty)}
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
  ownership,
}: {
  model: (typeof hostingModels)[number]
  onSelect: (id: HostingModelId) => void
  ownership: Ownership
}) {
  return (
    <div className="space-y-3 md:hidden">
      <div className="grid grid-cols-2 gap-1.5">
        {hostingModels.map((entry) => {
          const Icon = entry.icon
          const isActive = entry.id === model.id
          const isUnavailable = Boolean(
            unavailableCombinations[ownership]?.[entry.id],
          )

          return (
            <button
              aria-disabled={isUnavailable}
              aria-pressed={isActive && !isUnavailable}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-lg border bg-white px-2 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                isActive && !isUnavailable
                  ? "border-orange-700 text-orange-950 shadow-sm"
                  : "hover:bg-orange-50",
                isUnavailable
                  ? "cursor-not-allowed border-dashed bg-muted/50 text-muted-foreground hover:bg-muted/50"
                  : "",
              )}
              disabled={isUnavailable}
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
          const responsibleParty = getResponsibleParty({
            layerId: layer.id,
            layerIndex,
            model,
            ownership,
          })

          return (
            <li
              className="flex items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2"
              key={layer.id}
            >
              <span className="text-xs font-medium">{layer.label}</span>
              <span
                className={cn(
                  "shrink-0 rounded-md border px-2 py-0.5 text-[0.65rem] font-medium",
                  responsibilityCellStyles[responsibleParty],
                )}
              >
                {responsiblePartyLabel(responsibleParty)}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function CombinationSidebar({
  combination,
  exampleBadge,
  hostingLabel,
  ownershipLabel,
}: {
  combination: PlatformCombination
  exampleBadge: { label: string; className: string }
  hostingLabel: string
  ownershipLabel: string
}) {
  return (
    <aside className="space-y-4 rounded-2xl border bg-orange-50 p-4">
      <section className="space-y-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {ownershipLabel} / {hostingLabel}
          </p>
          <h2 className="text-lg font-semibold">{combination.title}</h2>
        </div>
        <div className="rounded-2xl border bg-white/90 p-4">
          <p className="text-sm leading-6 text-foreground">
            {combination.detail}
          </p>
          <p className={cn("mt-2 text-sm leading-6", theme.accentText)}>
            {combination.fit}
          </p>
        </div>
      </section>
      <SidebarSection label="Advantages">
        <SidebarList items={combination.strengths} />
      </SidebarSection>
      <SidebarSection label="Watch points">
        <SidebarList items={combination.watch} />
      </SidebarSection>
      <SidebarSection label={`${ownershipLabel} example`}>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm leading-6 text-foreground">
            <span>{combination.label}</span>
            <span
              className={cn(
                "shrink-0 rounded-md border px-1.5 py-0.5 text-[0.65rem] font-medium",
                exampleBadge.className,
              )}
            >
              {exampleBadge.label}
            </span>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            {combination.note}
          </p>
          <p className="text-xs leading-5 text-muted-foreground">
            Typical providers: {combination.providers}
          </p>
        </div>
      </SidebarSection>
    </aside>
  )
}

function SidebarSection({
  children,
  label,
}: {
  children: ReactNode
  label: string
}) {
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <span>{label}</span>
      </div>
      <div className="rounded-2xl border bg-white/90 p-4">{children}</div>
    </section>
  )
}

function SidebarList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm leading-6 text-foreground">
      {items.map((item) => (
        <li className="rounded-lg bg-muted/60 px-3 py-2" key={item}>
          {item}
        </li>
      ))}
    </ul>
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
        "space-y-4 rounded-2xl border bg-white/90 p-4",
        theme.accentSurface,
      )}
    >
      <div>
        <p className="text-lg font-semibold">Selected tradeoffs</p>
        <p className="text-xs leading-5 text-muted-foreground">
          Responsibility, staffing, dependency, and cost
        </p>
      </div>
      {tradeoffDimensions.map((dimension) => {
        const level = levels[dimension.id]

        return (
          <div
            className="flex items-center justify-between gap-2"
            key={dimension.id}
          >
            <span className="text-sm leading-6 text-foreground">
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
