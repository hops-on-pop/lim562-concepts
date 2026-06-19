"use client"

import {
  AlertTriangle,
  Database,
  Monitor,
  Server,
  ShieldCheck,
  SquareTerminal,
} from "lucide-react"
import { useReducedMotion } from "motion/react"
import { useCallback, useEffect, useState } from "react"

import { getConceptTheme } from "@/lib/concept-themes"
import { cn } from "@/lib/utils"

import { AnimationControls } from "./animation-controls"
import { ConceptExplorerShell } from "./concept-explorer-shell"
import {
  type JourneyLayer,
  type JourneyStep,
  RequestJourneyDiagram,
} from "./request-journey-diagram"

type WebAppJourneyStep = JourneyStep & {
  label: string
  detail: string
  snippetLabel: string
  snippet: string
}

type LayerProfile = {
  tech: string[]
  failureSign: string
}

const layers: JourneyLayer[] = [
  { id: "browser", label: "Browser", icon: Monitor },
  { id: "server", label: "Server", icon: Server },
  { id: "logic", label: "App logic", icon: ShieldCheck },
  { id: "database", label: "Database", icon: Database },
]

const layerProfiles: Record<string, LayerProfile> = {
  browser: {
    tech: ["HTML", "CSS", "JavaScript"],
    failureSign:
      "Broken layout, dead buttons, or a page that never updates even though the data arrived.",
  },
  server: {
    tech: ["HTTP", "Routing", "nginx / Apache"],
    failureSign:
      "“Site unreachable” errors, timeouts, or session problems before any application code runs.",
  },
  logic: {
    tech: ["Application code", "Business rules", "Input validation"],
    failureSign:
      "Wrong or oddly formatted results — like raw data leaking straight onto the page.",
  },
  database: {
    tech: ["SQL", "Indexes", "MySQL / PostgreSQL"],
    failureSign:
      "Searches that hang forever, or records that come back missing or stale.",
  },
}

const journeySteps: WebAppJourneyStep[] = [
  {
    layerId: "browser",
    layerIndex: 0,
    payload: '"solar power"',
    leg: "request",
    label: "Browser",
    detail:
      "The patron types a search and presses Enter. The browser packages the words as an HTTP request ( a structured message) that carries the query, and sends it across the network to the server.",
    snippetLabel: "What the browser sends",
    snippet: "GET /catalog/search?q=solar+power",
  },
  {
    layerId: "server",
    layerIndex: 1,
    payload: "HTTP request",
    leg: "request",
    label: "Server",
    detail:
      "The web server is the front door. It accepts the HTTP request, checks the patron's session, and routes the request to the piece of application logic responsible for catalog searches.",
    snippetLabel: "Where the server routes it",
    snippet: "/catalog/search → search handler",
  },
  {
    layerId: "logic",
    layerIndex: 2,
    payload: "validated query",
    leg: "request",
    label: "App logic",
    detail:
      "The application validates the input, applies library rules, such as hiding suppressed records, and translates the patron's words into a precise query the database can execute.",
    snippetLabel: "The query the app prepares",
    snippet: "SELECT title, format, status FROM records WHERE …",
  },
  {
    layerId: "database",
    layerIndex: 3,
    payload: "database rows",
    leg: "request",
    label: "Database",
    detail:
      "The database scans its indexes for matching bibliographic, holdings, and availability records, then returns structured rows.",
    snippetLabel: "What the database returns",
    snippet: "3 matching rows · 12 ms",
  },
  {
    layerId: "logic",
    layerIndex: 2,
    payload: "JSON response",
    leg: "response",
    label: "App logic",
    detail:
      "On the way back, the application reshapes raw data from the database into a response the interface understands (typically  JSON) with titles, availability text, and links,  and hands it to the server to deliver.",
    snippetLabel: "The response the app builds",
    snippet: "200 OK · application/json",
  },
  {
    layerId: "browser",
    layerIndex: 0,
    payload: "rendered results",
    leg: "response",
    label: "Browser",
    detail:
      "The browser receives the response and updates the result list in place. The patron sees titles and availability, without directly seeing the servers, queries, and formatting steps that produced them.",
    snippetLabel: "What the patron sees",
    snippet: "3 results rendered",
  },
]

const theme = getConceptTheme("web-app-architecture")
const PLAY_INTERVAL_MS = 2600
const LAST_INDEX = journeySteps.length - 1

export function WebAppArchitectureExplorer() {
  const prefersReducedMotion = useReducedMotion() ?? false
  const [active, setActive] = useState(0)
  const [prevActive, setPrevActive] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const step = journeySteps[active]
  const layer = layers[step.layerIndex]
  const profile = layerProfiles[step.layerId]
  const LayerIcon = layer.icon

  const goTo = useCallback((index: number) => {
    setIsPlaying(false)
    setActive((current) => {
      if (index === current) {
        return current
      }
      setPrevActive(current)
      return index
    })
  }, [])

  const next = useCallback(() => {
    setActive((current) => {
      setPrevActive(current)
      return current === LAST_INDEX ? 0 : current + 1
    })
    setIsPlaying(false)
  }, [])

  const previous = useCallback(() => {
    setActive((current) => {
      setPrevActive(current)
      return current === 0 ? LAST_INDEX : current - 1
    })
    setIsPlaying(false)
  }, [])

  const play = useCallback(() => {
    if (prefersReducedMotion) {
      return
    }
    setActive((current) => (current === LAST_INDEX ? 0 : current))
    setIsPlaying(true)
  }, [prefersReducedMotion])

  const pause = useCallback(() => setIsPlaying(false), [])

  useEffect(() => {
    if (!isPlaying || prefersReducedMotion) {
      return
    }

    const timer = window.setInterval(() => {
      setActive((current) => {
        if (current === LAST_INDEX) {
          return current
        }
        setPrevActive(current)
        return current + 1
      })
    }, PLAY_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [isPlaying, prefersReducedMotion])

  useEffect(() => {
    if (isPlaying && active === LAST_INDEX) {
      setIsPlaying(false)
    }
  }, [isPlaying, active])

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsPlaying(false)
    }
  }, [prefersReducedMotion])

  return (
    <ConceptExplorerShell
      howItWorks="Play or step through a catalog search as the payload changes shape at each stop — request out across the top, response back along the bottom. Click any labeled point to jump there."
      slug="web-app-architecture"
    >
      <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] lg:items-start">
        <RequestJourneyDiagram
          activeIndex={active}
          layers={layers}
          onSelectAction={goTo}
          prevIndex={prevActive}
          steps={journeySteps}
          theme={theme}
        />

        <aside className={cn(theme.detailPanel, "flex h-full flex-col")}>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-lg",
                theme.iconBadge,
              )}
            >
              <LayerIcon className="size-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {step.leg === "request" ? "Request leg" : "Response leg"}
              </p>
              <h3 className="text-lg font-semibold">{step.label}</h3>
            </div>
          </div>

          <p
            className={cn(
              "mt-3 rounded-lg border px-3 py-2 font-mono text-sm",
              theme.accentSurface,
              theme.accentText,
            )}
          >
            {step.payload}
          </p>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {step.detail}
          </p>

          <div className="mt-4 rounded-lg border bg-slate-950 p-3">
            <p className="flex items-center gap-1.5 text-[0.65rem] font-medium uppercase tracking-wide text-slate-400">
              <SquareTerminal className="size-3.5 shrink-0" />
              {step.snippetLabel}
            </p>
            <p className="mt-1.5 break-all font-mono text-xs leading-5 text-emerald-300">
              {step.snippet}
            </p>
          </div>

          <div
            className={cn(
              "mt-4 flex gap-2 rounded-lg p-3",
              theme.accentSurface,
            )}
          >
            <AlertTriangle
              className={cn("mt-0.5 size-4 shrink-0", theme.accentMuted)}
            />
            <p className={cn("text-xs leading-5", theme.accentText)}>
              <span className="font-semibold">If this layer fails:</span>{" "}
              {profile.failureSign}
            </p>
          </div>
        </aside>
      </div>

      <AnimationControls
        canGoBack={active > 0}
        canGoForward={active < LAST_INDEX}
        isPlaying={isPlaying}
        onNext={next}
        onPause={pause}
        onPlay={play}
        onPrevious={previous}
        showPlay
        stepLabel={`${step.label} · step ${active + 1} of ${journeySteps.length}`}
      />
    </ConceptExplorerShell>
  )
}
