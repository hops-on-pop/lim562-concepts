"use client"

import {
  Check,
  ChevronDown,
  Info,
  Landmark,
  Layers3,
  type LucideIcon,
  PanelRightOpen,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react"
import {
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import definitionData from "@/data/definitions.json"
import applicationsData from "@/data/library_ai_applications.json"
import { getConceptTheme } from "@/lib/concept-themes"
import { cn } from "@/lib/utils"

import { ConceptExplorerShell } from "./concept-explorer-shell"

type Application = {
  application: string
  primaryArea: string
  aiType: string
  technologyTags: string[]
  maturity: string
  keyConcerns: string[]
  applicationDefinition: string
  libraryExample: string
  relatedConcepts: string[]
}

type DefinitionEntry = {
  term: string
  definition: string
  type: string
}

type FacetKey = "primaryArea" | "aiType" | "maturity"

type FacetSelection = Record<FacetKey, Set<string>>

type TermPopoverState = {
  left: number
  top: number
  width: number
}

type FacetMeta = {
  key: FacetKey
  label: string
  description: string
  icon: LucideIcon
}

type Maturity = "Established" | "Emerging" | "Experimental"

const applications = applicationsData as Application[]
const sortedApplications = [...applications].sort((left, right) =>
  left.application.localeCompare(right.application, undefined, {
    sensitivity: "base",
  }),
)
const definitions = definitionData as DefinitionEntry[]
const definitionIndex = new Map(definitions.map((entry) => [entry.term, entry]))

const maturityOrder: Maturity[] = ["Established", "Emerging", "Experimental"]

const maturityMeta: Record<
  Maturity,
  { chip: string; dot: string; text: string; card: string }
> = {
  Established: {
    chip: "border-emerald-300 bg-emerald-100 text-emerald-950",
    dot: "bg-emerald-500",
    text: "Widely used and well understood",
    card: "border-emerald-200/70",
  },
  Emerging: {
    chip: "border-amber-300 bg-amber-100 text-amber-950",
    dot: "bg-amber-500",
    text: "Growing adoption, still evolving",
    card: "border-amber-200/70",
  },
  Experimental: {
    chip: "border-violet-300 bg-violet-100 text-violet-950",
    dot: "bg-violet-500",
    text: "Limited deployment, pilots, or research",
    card: "border-violet-200/70",
  },
}

const facetMeta: FacetMeta[] = [
  {
    key: "primaryArea",
    label: "Primary area",
    description: "Where the application fits in library work.",
    icon: Landmark,
  },
  {
    key: "aiType",
    label: "AI type",
    description: "The AI/ML approach behind the idea.",
    icon: Sparkles,
  },
  {
    key: "maturity",
    label: "Maturity",
    description: "How established the use case is in practice.",
    icon: Layers3,
  },
]

const facetOptions: Record<FacetKey, string[]> = {
  primaryArea: uniqueValues(applications.map((item) => item.primaryArea)),
  aiType: uniqueValues(applications.map((item) => item.aiType)),
  maturity: maturityOrder,
}

const theme = getConceptTheme("ai-ml-libraries")
const drawerPanelClassName = "rounded-2xl border bg-white/90 p-4"
const termChipClassName =
  "border-transparent bg-muted/30 text-foreground hover:border-foreground hover:bg-muted/60 focus-visible:border-foreground"

export function AiMlLibraryBrowser() {
  const drawerRef = useRef<HTMLDivElement | null>(null)
  const filtersRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null)
  const [draftFilters, setDraftFilters] = useState<FacetSelection>(() =>
    createEmptySelection(),
  )
  const [appliedFilters, setAppliedFilters] = useState<FacetSelection>(() =>
    createEmptySelection(),
  )
  const [activeTerm, setActiveTerm] = useState<string | null>(null)
  const [termPopover, setTermPopover] = useState<TermPopoverState | null>(null)
  const [openFacet, setOpenFacet] = useState<FacetKey | null>(null)

  const closeTermDefinition = useCallback(() => {
    setActiveTerm(null)
    setTermPopover(null)
  }, [])

  const filteredApplications = useMemo(
    () =>
      sortedApplications.filter((application) => {
        return (
          matchesFacet(application.primaryArea, appliedFilters.primaryArea) &&
          matchesFacet(application.aiType, appliedFilters.aiType) &&
          matchesFacet(application.maturity, appliedFilters.maturity)
        )
      }),
    [appliedFilters],
  )

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node | null

      if (
        !target ||
        drawerRef.current?.contains(target) ||
        filtersRef.current?.contains(target)
      ) {
        return
      }

      closeTermDefinition()
      setOpenFacet(null)
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeTermDefinition()
        setOpenFacet(null)
      }
    }

    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [closeTermDefinition])

  const dirty = facetMeta.some((facet) => {
    return !setsEqual(draftFilters[facet.key], appliedFilters[facet.key])
  })

  const selectedMatchesFilter =
    selectedApplication &&
    filteredApplications.some(
      (application) =>
        application.application === selectedApplication.application,
    )

  const displayedApplication = selectedMatchesFilter
    ? selectedApplication
    : null
  const selectedDefinition = activeTerm ? definitionIndex.get(activeTerm) : null
  const activeDefinition =
    selectedDefinition ??
    (activeTerm
      ? {
          term: activeTerm,
          definition: "Definition pending.",
          type: "concept",
        }
      : null)

  function updateDraftFilter(key: FacetKey, value: string) {
    setDraftFilters((current) => {
      const next = cloneSelection(current)
      const bucket = next[key]

      if (bucket.has(value)) {
        bucket.delete(value)
      } else {
        bucket.add(value)
      }

      return next
    })
  }

  function applyFilters() {
    setAppliedFilters(cloneSelection(draftFilters))
    closeTermDefinition()
    setOpenFacet(null)

    if (
      selectedApplication &&
      !matchesApplication(selectedApplication, draftFilters)
    ) {
      setSelectedApplication(null)
    }
  }

  function clearFilters() {
    const empty = createEmptySelection()
    setDraftFilters(empty)
    setAppliedFilters(empty)
    closeTermDefinition()
    setOpenFacet(null)
  }

  function openTermDefinition(
    term: string,
    event: MouseEvent<HTMLButtonElement>,
  ) {
    if (activeTerm === term) {
      closeTermDefinition()
      return
    }

    const contentBox = contentRef.current?.getBoundingClientRect()
    const triggerBox = event.currentTarget.getBoundingClientRect()
    const width = contentBox
      ? Math.max(220, Math.min(320, contentBox.width - 24))
      : 320
    const leftOffset = contentBox
      ? clamp(
          triggerBox.left - contentBox.left,
          12,
          contentBox.width - width - 12,
        )
      : 12

    setActiveTerm(term)
    setTermPopover({
      left: leftOffset,
      top: contentBox
        ? triggerBox.bottom - contentBox.top + 10
        : triggerBox.bottom + 10,
      width,
    })
  }

  return (
    <ConceptExplorerShell
      howItWorks="Stage any combination of filters, then apply them to narrow the list. Open one application at a time in the side drawer, and click any term chip to reveal its definition."
      slug="ai-ml-libraries"
    >
      <div className="space-y-6">
        <section
          aria-label="Browse filters"
          className="rounded-2xl border bg-white/90"
        >
          <CardHeader className="pb-4"></CardHeader>
          <CardContent className="space-y-5 p-4">
            <div ref={filtersRef} className="grid gap-4 xl:grid-cols-3">
              {facetMeta.map((facet) => (
                <FacetDropdown
                  key={facet.key}
                  facet={facet}
                  onToggle={updateDraftFilter}
                  isOpen={openFacet === facet.key}
                  onOpenChange={(nextOpen) =>
                    setOpenFacet(nextOpen ? facet.key : null)
                  }
                  selectedValues={draftFilters[facet.key]}
                  options={facetOptions[facet.key]}
                />
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  className={buttonVariants({ variant: "default" })}
                  disabled={!dirty}
                  onClick={applyFilters}
                  type="button"
                >
                  Apply filters
                </button>
                <button
                  className={buttonVariants({ variant: "outline" })}
                  onClick={clearFilters}
                  type="button"
                >
                  <X className="size-4" />
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap justify-end gap-3 pt-2">
                <Badge className="gap-1.5" variant="secondary">
                  <Sparkles className="size-3.5" />
                  {filteredApplications.length} / {applications.length} ideas
                </Badge>
              </div>
            </div>
          </CardContent>
        </section>

        <div
          className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)] lg:items-start"
          ref={contentRef}
        >
          <section className="space-y-4">
            {filteredApplications.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredApplications.map((application) => (
                  <ApplicationCard
                    application={application}
                    key={application.application}
                    isSelected={
                      displayedApplication?.application ===
                      application.application
                    }
                    onSelect={() => {
                      setSelectedApplication(application)
                      closeTermDefinition()
                    }}
                    onTermClick={openTermDefinition}
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-white/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="size-4" />
                    No matches
                  </CardTitle>
                  <CardDescription>
                    Clear one or more filters to bring the list back.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </section>

          <aside
            aria-label="Application drawer"
            className={cn(
              theme.detailPanel,
              "relative self-start overflow-visible lg:sticky lg:top-6",
            )}
            ref={drawerRef}
          >
            {displayedApplication ? (
              <ApplicationDrawer
                application={displayedApplication}
                onTermClick={openTermDefinition}
              />
            ) : (
              <EmptyDrawer />
            )}
          </aside>

          {activeDefinition && termPopover ? (
            <TermPopover
              definition={activeDefinition}
              position={termPopover}
              onClose={closeTermDefinition}
            />
          ) : null}
        </div>
      </div>
    </ConceptExplorerShell>
  )
}

function FacetDropdown({
  facet,
  options,
  onToggle,
  selectedValues,
  isOpen,
  onOpenChange,
}: {
  facet: FacetMeta
  options: string[]
  onToggle: (key: FacetKey, value: string) => void
  selectedValues: Set<string>
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  const Icon = facet.icon
  const summary = facetSummary(facet.key, selectedValues)
  const selectedCount = selectedValues.size
  const headingId = `facet-${facet.key}-heading`
  const listboxId = `facet-${facet.key}-listbox`

  return (
    <section className="relative rounded-2xl border border-border/70 bg-rose-50/35 p-4">
      <div className="mb-3 flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-rose-700 text-white">
          <Icon className="size-4" />
        </span>
        <div>
          <h4 className="text-sm font-semibold" id={headingId}>
            {facet.label}
          </h4>
          <p className="text-xs leading-5 text-muted-foreground">
            {facet.description}
          </p>
        </div>
      </div>

      <button
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`${facet.label}: ${summary}`}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-auto min-h-11 w-full justify-between gap-3 whitespace-normal border-border/80 bg-white px-3 py-2 text-left",
          isOpen ? "border-rose-700 ring-2 ring-rose-500/10" : "",
        )}
        onClick={() => onOpenChange(!isOpen)}
        type="button"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-xs uppercase tracking-wide text-muted-foreground">
            {facet.label}
          </span>
          <span className="block truncate text-sm font-medium text-foreground">
            {summary}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {selectedCount > 0 ? (
            <Badge variant="secondary">{selectedCount}</Badge>
          ) : null}
          <ChevronDown
            className={cn(
              "size-4 transition-transform",
              isOpen ? "rotate-180" : "",
            )}
          />
        </span>
      </button>

      {isOpen ? (
        <div
          aria-label={`${facet.label} options`}
          aria-multiselectable="true"
          className="absolute left-4 right-4 top-[calc(100%-0.25rem)] z-20 rounded-2xl border border-border/80 bg-white p-2 shadow-xl"
          id={listboxId}
          role="listbox"
        >
          <div className="max-h-64 overflow-auto pr-1">
            <ul className="space-y-1">
              {options.map((option) => {
                const selected = selectedValues.has(option)
                const isMaturity = facet.key === "maturity"

                return (
                  <li key={option}>
                    <button
                      aria-selected={selected}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                        selected
                          ? "bg-rose-50 text-rose-950"
                          : "text-foreground",
                      )}
                      onClick={() => onToggle(facet.key, option)}
                      role="option"
                      type="button"
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex size-4 items-center justify-center rounded border",
                          selected
                            ? "border-rose-600 bg-rose-600 text-white"
                            : "border-border bg-white",
                        )}
                      >
                        {selected ? <Check className="size-3" /> : null}
                      </span>
                      {isMaturity ? (
                        <span
                          aria-hidden="true"
                          className={cn(
                            "size-2 rounded-full",
                            getMaturityMeta(option).dot,
                          )}
                        />
                      ) : null}
                      <span className="flex-1">{option}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function ApplicationCard({
  application,
  isSelected,
  onSelect,
  onTermClick,
}: {
  application: Application
  isSelected: boolean
  onSelect: () => void
  onTermClick: (term: string, event: MouseEvent<HTMLButtonElement>) => void
}) {
  return (
    <div className="group relative h-full">
      <button
        aria-label={`Open details for ${application.application}`}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
        onClick={onSelect}
        type="button"
      />
      <Card
        className={cn(
          "flex h-full flex-col border transition-all duration-200 pb-0",
          getMaturityMeta(application.maturity).card,
          isSelected
            ? "border-rose-500 shadow-md ring-2 ring-rose-500/20"
            : "hover:border-rose-200 hover:shadow-sm",
        )}
      >
        <CardHeader className="space-y-3">
          <div className="min-w-0">
            <CardTitle className="text-base leading-6">
              {application.application}
            </CardTitle>
            <CardDescription className="mt-1 text-xs uppercase tracking-wide text-gray-800">
              {application.primaryArea}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3 pb-4">
          <CardDescription className="text-sm leading-6 text-foreground">
            {application.applicationDefinition}
          </CardDescription>
          <p className="text-xs leading-6 text-muted-foreground">
            <span className="font-semibold text-foreground">Type:</span>{" "}
            <button
              className="relative z-20 font-medium text-foreground underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              onClick={(event) => onTermClick(application.aiType, event)}
              type="button"
            >
              {application.aiType}
            </button>
          </p>
          <div className="mt-auto flex justify-end">
            <Badge
              className={cn(
                "relative z-20",
                getMaturityMeta(application.maturity).chip,
              )}
            >
              {application.maturity}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ApplicationDrawer({
  application,
  onTermClick,
}: {
  application: Application
  onTermClick: (term: string, event: MouseEvent<HTMLButtonElement>) => void
}) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <h3 className="text-xl font-semibold tracking-normal text-balance">
              {application.application}
            </h3>
            <p className="text-sm font-medium text-muted-foreground">
              {application.primaryArea}
            </p>
          </div>
          <span
            className={cn(
              "inline-flex h-6 shrink-0 items-center rounded-4xl border px-2.5 py-0.5 text-xs font-medium",
              getMaturityMeta(application.maturity).chip,
            )}
          >
            {application.maturity}
          </span>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          {application.applicationDefinition}
        </p>
      </div>

      <DrawerSection
        boxClassName="rounded-2xl bg-muted/40 p-4"
        label="Library Example"
      >
        <p className="text-sm leading-6 text-muted-foreground">
          {application.libraryExample}
        </p>
      </DrawerSection>

      <DrawerSection label="AI type">
        <TermButton onTermClick={onTermClick} term={application.aiType} />
      </DrawerSection>

      <DrawerSection label="What to watch" icon={ShieldAlert}>
        <ul className="flex flex-wrap gap-2">
          {application.keyConcerns.map((concern) => (
            <li key={concern}>
              <TermButton onTermClick={onTermClick} term={concern} />
            </li>
          ))}
        </ul>
      </DrawerSection>

      <TermGroup
        label="Technology"
        onTermClick={onTermClick}
        terms={application.technologyTags}
      />
      <TermGroup
        label="Related concepts"
        onTermClick={onTermClick}
        terms={application.relatedConcepts}
      />
    </div>
  )
}

function DrawerSection({
  boxClassName = drawerPanelClassName,
  children,
  icon: Icon,
  label,
}: {
  boxClassName?: string
  children: ReactNode
  icon?: LucideIcon
  label: string
}) {
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        {Icon ? <Icon className="size-4 text-muted-foreground" /> : null}
        <span>{label}</span>
      </div>
      <div className={boxClassName}>{children}</div>
    </section>
  )
}

function TermButton({
  onTermClick,
  term,
}: {
  onTermClick: (term: string, event: MouseEvent<HTMLButtonElement>) => void
  term: string
}) {
  return (
    <button
      className={cn(
        buttonVariants({
          size: "sm",
          variant: "outline",
        }),
        termChipClassName,
      )}
      onClick={(event) => onTermClick(term, event)}
      type="button"
    >
      {term}
    </button>
  )
}

function TermGroup({
  label,
  terms,
  onTermClick,
}: {
  label: string
  terms: string[]
  onTermClick: (term: string, event: MouseEvent<HTMLButtonElement>) => void
}) {
  return (
    <DrawerSection label={label}>
      <ul className="flex flex-wrap gap-2">
        {terms.map((term) => (
          <li key={term}>
            <TermButton onTermClick={onTermClick} term={term} />
          </li>
        ))}
      </ul>
    </DrawerSection>
  )
}

function EmptyDrawer() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold tracking-normal text-balance">
          Application Details
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Select an application card to view more details.
        </p>
      </div>
    </div>
  )
}

function TermPopover({
  definition,
  position,
  onClose,
}: {
  definition: DefinitionEntry
  position: TermPopoverState
  onClose: () => void
}) {
  return (
    <div
      className="absolute z-20"
      style={{
        left: position.left,
        top: position.top,
        width: position.width,
      }}
    >
      <div className="rounded-2xl border border-border/80 bg-white p-4 shadow-xl">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="text-sm font-semibold">{definition.term}</div>
          <button
            aria-label={`Close definition for ${definition.term}`}
            className={buttonVariants({ size: "icon-xs", variant: "ghost" })}
            onClick={onClose}
            type="button"
          >
            <X className="size-4" />
          </button>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          {definition.definition}
        </p>
      </div>
    </div>
  )
}

function facetSummary(key: FacetKey, selectedValues: Set<string>) {
  if (selectedValues.size === 0) {
    switch (key) {
      case "primaryArea":
        return "Any primary area"
      case "aiType":
        return "Any AI type"
      case "maturity":
        return "Any maturity"
    }
  }

  const values = [...selectedValues]

  if (values.length === 1) {
    return values[0]
  }

  return `${values.length} selected`
}

function createEmptySelection(): FacetSelection {
  return {
    primaryArea: new Set<string>(),
    aiType: new Set<string>(),
    maturity: new Set<string>(),
  }
}

function cloneSelection(selection: FacetSelection): FacetSelection {
  return {
    primaryArea: new Set(selection.primaryArea),
    aiType: new Set(selection.aiType),
    maturity: new Set(selection.maturity),
  }
}

function setsEqual(left: Set<string>, right: Set<string>) {
  if (left.size !== right.size) {
    return false
  }

  for (const value of left) {
    if (!right.has(value)) {
      return false
    }
  }

  return true
}

function matchesFacet(value: string, selection: Set<string>) {
  return selection.size === 0 || selection.has(value)
}

function matchesApplication(
  application: Application,
  selection: FacetSelection,
) {
  return (
    matchesFacet(application.primaryArea, selection.primaryArea) &&
    matchesFacet(application.aiType, selection.aiType) &&
    matchesFacet(application.maturity, selection.maturity)
  )
}

function uniqueValues(values: string[]) {
  return [...new Set(values)].sort((left, right) =>
    left.localeCompare(right, undefined, { sensitivity: "base" }),
  )
}

function clamp(value: number, min: number, max: number) {
  if (max < min) {
    return min
  }

  return Math.min(Math.max(value, min), max)
}

function getMaturityMeta(value: string) {
  return maturityMeta[isMaturity(value) ? value : "Emerging"]
}

function isMaturity(value: string): value is Maturity {
  return maturityOrder.includes(value as Maturity)
}
