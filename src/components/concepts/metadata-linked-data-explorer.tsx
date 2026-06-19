"use client"

import {
  BookOpen,
  Braces,
  Database,
  FileText,
  Fingerprint,
  GitBranch,
  Link2,
  type LucideIcon,
  Network,
  Shapes,
  SquareTerminal,
  Tag,
} from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getConceptTheme } from "@/lib/concept-themes"
import { cn } from "@/lib/utils"

import { ConceptExplorerShell } from "./concept-explorer-shell"

type StageId = "metadata" | "dublin-core" | "marc" | "bibframe" | "linked-data"

type Stage = {
  id: StageId
  label: string
  shortLabel: string
  icon: LucideIcon
  description: string
  snippetLabel: string
  snippet: string[]
  use: string
}

const resourceFacts = [
  { label: "Title", value: "Riverside Community Cookbook" },
  { label: "Creator", value: "Riverside Public Library Friends" },
  { label: "Published", value: "Riverside, 1984" },
  { label: "Subjects", value: "Community cookbooks; Local history" },
  { label: "Format", value: "Print book" },
]

const dublinCoreElements = [
  { label: "dc:title", value: "Riverside Community Cookbook" },
  { label: "dc:creator", value: "Riverside Public Library Friends" },
  { label: "dc:date", value: "1984" },
  { label: "dc:subject", value: "Community cookbooks; Local history" },
  { label: "dc:type", value: "Text" },
]

const bibframeEntities = [
  {
    label: "Work",
    value: "Riverside Community Cookbook",
    detail: "the intellectual content",
  },
  {
    label: "Agent",
    value: "Riverside Public Library Friends",
    detail: "the creator",
  },
  {
    label: "Instance",
    value: "1984 print publication",
    detail: "the edition/manifestation",
  },
  {
    label: "Item",
    value: "Local copy, barcode 39087012244901",
    detail: "the library's copy",
  },
  {
    label: "Subject",
    value: "Community cookbooks",
    detail: "what the work is about",
  },
]

const linkedDataStatements = [
  {
    subject: "lib:work/river-cookbook",
    predicate: "bf:contribution",
    object: "lib:agent/rpl-friends",
  },
  {
    subject: "lib:instance/river-cookbook-1984",
    predicate: "bf:instanceOf",
    object: "lib:work/river-cookbook",
  },
  {
    subject: "lib:work/river-cookbook",
    predicate: "bf:subject",
    object: "id.loc.gov/authorities/subjects/sh85031810",
  },
]

const stages: Stage[] = [
  {
    id: "metadata",
    label: "Metadata",
    shortLabel: "Metadata",
    icon: Tag,
    description: `Metadata is "data about data." It is structured information that describes or provides context for an object or other data, making it easier to search, organize, and understand.`,
    snippetLabel: "Human-readable description",
    snippet: [
      "Title: Riverside Community Cookbook",
      "Creator: Riverside Public Library Friends",
      "Subject: Community cookbooks",
    ],
    use: "Good for explaining what is known about the resource before choosing any particular encoding or data model.",
  },
  {
    id: "dublin-core",
    label: "Dublin Core",
    shortLabel: "Dublin Core",
    icon: FileText,
    description:
      "Dublin Core is a simple, cross-domain metadata schema. It uses broad elements such as title, creator, subject, date, type, and identifier so many kinds of digital resources can be described consistently.",
    snippetLabel: "Representative Dublin Core elements",
    snippet: [
      "dc:title = Riverside Community Cookbook",
      "dc:creator = Riverside Public Library Friends",
      "dc:date = 1984",
      "dc:subject = Community cookbooks",
    ],
    use: "Good for simple resource description, repositories, digital collections, and metadata that needs to travel across different systems and communities.",
  },
  {
    id: "marc",
    label: "MARC record",
    shortLabel: "MARC",
    icon: Database,
    description:
      "MARC packages information about a resource inside a catalog record. Catalogers and library systems read meaning from tags, indicators, and subfields to create a structured description of the resource.",
    snippetLabel: "Representative MARC fields",
    snippet: [
      "245 10 $a Riverside Community Cookbook",
      "110 2_ $a Riverside Public Library Friends",
      "264 _1 $a Riverside : $b RPL Friends, $c 1984",
      "650 _0 $a Community cookbooks",
    ],
    use: "Good for exchanging and managing traditional catalog records in systems that expect MARC fields.",
  },
  {
    id: "bibframe",
    label: "BIBFRAME entities",
    shortLabel: "BIBFRAME",
    icon: Shapes,
    description:
      "    BIBFRAME is a successor to MARC that shifts library cataloging from record-based descriptions to relationship-based linked data, making connections between resources more explicit and machine-readable.",
    snippetLabel: "Entity relationships",
    snippet: [
      "Work: Riverside Community Cookbook",
      "Work -> contribution -> Agent",
      "Instance -> instanceOf -> Work",
      "Item -> itemOf -> Instance",
    ],
    use: "Good for making bibliographic relationships explicit instead of burying them inside a single record.",
  },
  {
    id: "linked-data",
    label: "Linked data graph",
    shortLabel: "Linked data",
    icon: Network,
    description:
      "Linked data is an approach to organizing metadata that uses unique identifiers and explicit relationships to connect information within a system and across external systems, making data more discoverable, reusable, and interoperable.",
    snippetLabel: "RDF-like statements",
    snippet: [
      "lib:work/river-cookbook bf:subject id.loc.gov/.../sh85031810",
      "lib:instance/river-cookbook-1984 bf:instanceOf lib:work/river-cookbook",
      "lib:agent/rpl-friends owl:sameAs wikidata:Q-local-example",
    ],
    use: "    Linked data enables library resources, authors, subjects, and organizations to be connected and shared through machine-readable relationships",
  },
]

const theme = getConceptTheme("metadata-linked-data")

export function MetadataLinkedDataExplorer() {
  const [active, setActive] = useState(0)
  const stage = stages[active]
  const StageIcon = stage.icon

  function goTo(index: number) {
    setActive(index)
  }

  return (
    <ConceptExplorerShell
      howItWorks="Select a view to compare five distinct ways of shaping the same library resource: plain description, Dublin Core elements, MARC fields, BIBFRAME entities, and linked data statements."
      slug="metadata-linked-data"
    >
      <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(270px,340px)] lg:items-start">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
            {stages.map((item, index) => {
              const Icon = item.icon
              const isActive = index === active

              return (
                <Button
                  aria-pressed={isActive}
                  className={cn(
                    "h-auto justify-start whitespace-normal p-3 text-left",
                    isActive ? theme.activeControl : theme.inactiveControl,
                  )}
                  key={item.id}
                  onClick={() => goTo(index)}
                  type="button"
                  variant="outline"
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{item.shortLabel}</span>
                </Button>
              )
            })}
          </div>

          <div className="grid gap-4 rounded-xl border bg-white/90 p-4 md:grid-cols-[minmax(0,1fr)_minmax(230px,0.7fr)]">
            <StageVisual stageId={stage.id} />

            <div className="flex min-w-0 flex-col gap-3 rounded-lg border bg-slate-950 p-3">
              <p className="flex items-center gap-1.5 text-[0.65rem] font-medium uppercase tracking-wide text-slate-400">
                <SquareTerminal className="size-3.5 shrink-0" />
                {stage.snippetLabel}
              </p>
              <pre className="min-w-0 overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs leading-5 text-cyan-200">
                {stage.snippet.join("\n")}
              </pre>
            </div>
          </div>
        </div>

        <aside className={cn(theme.detailPanel, "flex h-full flex-col")}>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-lg",
                theme.iconBadge,
              )}
            >
              <StageIcon className="size-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Selected concept
              </p>
              <h3 className="text-lg font-semibold">{stage.label}</h3>
            </div>
          </div>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {stage.description}
          </p>

          <div
            className={cn(
              "mt-4 flex gap-2 rounded-lg p-3",
              theme.accentSurface,
            )}
          >
            <p className={cn("text-xs leading-5", theme.accentText)}>
              <span className="font-semibold">What this is good for:</span>{" "}
              {stage.use}
            </p>
          </div>
        </aside>
      </div>
    </ConceptExplorerShell>
  )
}

function StageVisual({ stageId }: { stageId: StageId }) {
  if (stageId === "metadata") {
    return (
      <section aria-label="Metadata facts" className="min-w-0">
        <div className="mb-3 flex items-center gap-2">
          <BookOpen className={cn("size-5", theme.accentMuted)} />
          <h4 className="font-semibold">One resource, described as facts</h4>
        </div>
        <dl className="grid gap-2">
          {resourceFacts.map((fact) => (
            <div
              className="grid gap-1 rounded-lg border bg-muted/30 p-3 sm:grid-cols-[110px_1fr]"
              key={fact.label}
            >
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {fact.label}
              </dt>
              <dd className="text-sm leading-6">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    )
  }

  if (stageId === "marc") {
    return (
      <section aria-label="MARC record fields" className="min-w-0">
        <div className="mb-3 flex items-center gap-2">
          <Database className={cn("size-5", theme.accentMuted)} />
          <h4 className="font-semibold">One catalog record</h4>
        </div>
        <div className="grid gap-2">
          {[
            ["245", "$a title statement"],
            ["110", "$a corporate creator"],
            ["264", "$a place $b publisher $c date"],
            ["650", "$a topical subject"],
          ].map(([field, meaning]) => (
            <div
              className="grid grid-cols-[64px_1fr] items-center gap-3 rounded-lg border bg-muted/30 p-3"
              key={field}
            >
              <Badge className="justify-center font-mono" variant="outline">
                {field}
              </Badge>
              <p className="text-sm leading-6 text-muted-foreground">
                {meaning}
              </p>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (stageId === "dublin-core") {
    return (
      <section aria-label="Dublin Core elements" className="min-w-0">
        <div className="mb-3 flex items-center gap-2">
          <FileText className={cn("size-5", theme.accentMuted)} />
          <h4 className="font-semibold">A simple cross-domain schema</h4>
        </div>
        <div className="grid gap-2">
          {dublinCoreElements.map((element) => (
            <div
              className="grid gap-1 rounded-lg border bg-muted/30 p-3 sm:grid-cols-[120px_1fr]"
              key={element.label}
            >
              <Badge className="justify-center font-mono" variant="outline">
                {element.label}
              </Badge>
              <p className="text-sm leading-6">{element.value}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (stageId === "bibframe") {
    return (
      <section aria-label="BIBFRAME entities" className="min-w-0">
        <div className="mb-3 flex items-center gap-2">
          <Shapes className={cn("size-5", theme.accentMuted)} />
          <h4 className="font-semibold">The record becomes entities</h4>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {bibframeEntities.map((entity) => (
            <div
              className="rounded-lg border bg-muted/30 p-3"
              key={entity.label}
            >
              <Badge className="mb-2" variant="secondary">
                {entity.label}
              </Badge>
              <p className="text-sm font-medium leading-5">{entity.value}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {entity.detail}
              </p>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section aria-label="Linked data statements" className="min-w-0">
      <div className="mb-3 flex items-center gap-2">
        <Network className={cn("size-5", theme.accentMuted)} />
        <h4 className="font-semibold">Identifiers connect the graph</h4>
      </div>
      <div className="grid gap-3">
        {linkedDataStatements.map((statement) => (
          <div
            className="grid gap-2 rounded-lg border bg-muted/30 p-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center"
            key={`${statement.subject}-${statement.predicate}`}
          >
            <GraphToken icon={Fingerprint} label={statement.subject} />
            <Link2
              className={cn("hidden size-4 sm:block", theme.accentMuted)}
            />
            <GraphToken icon={GitBranch} label={statement.predicate} />
            <Link2
              className={cn("hidden size-4 sm:block", theme.accentMuted)}
            />
            <GraphToken icon={Braces} label={statement.object} />
          </div>
        ))}
      </div>
    </section>
  )
}

function GraphToken({
  icon: Icon,
  label,
}: {
  icon: LucideIcon
  label: string
}) {
  return (
    <span className="flex min-w-0 items-center gap-2 rounded-md bg-white px-2 py-1.5 text-xs ring-1 ring-border">
      <Icon className={cn("size-3.5 shrink-0", theme.accentMuted)} />
      <span className="min-w-0 break-words font-mono">{label}</span>
    </span>
  )
}
