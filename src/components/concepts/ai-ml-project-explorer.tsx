"use client";

import {
  Accessibility,
  Archive,
  AudioLines,
  BookHeart,
  BotMessageSquare,
  ClipboardList,
  FileText,
  GraduationCap,
  Landmark,
  MessageCircleQuestion,
  NotebookPen,
  Presentation,
  ScrollText,
  Search,
  ShieldAlert,
  Tags,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { getConceptTheme } from "@/lib/concept-themes";
import { cn } from "@/lib/utils";

import { ConceptExplorerShell } from "./concept-explorer-shell";
import { type GenAiCategory, GenAiCategoryMap } from "./genai-category-map";

type RiskSeverity = "high" | "medium" | "low";

type Readiness = "established" | "emerging" | "experimental";

type GenAiProject = {
  id: string;
  categoryId: string;
  label: string;
  shortLabel: string;
  icon: typeof Search;
  readiness: Readiness;
  value: string;
  scenario: string;
  inTheField: string;
  risks: { text: string; severity: RiskSeverity }[];
  review: string;
};

const projects: GenAiProject[] = [
  {
    id: "discovery",
    categoryId: "lis-expert",
    label: "Discovery helper",
    shortLabel: "Discovery",
    icon: Search,
    readiness: "established",
    value:
      "Helps patrons turn vague questions into search strategies, suggests starting points, and explains why results match.",
    scenario:
      "A student types “I need sources about food deserts in rural America.” The assistant suggests subject terms, two narrower questions, and three databases to try — with the librarian-built research guide linked alongside.",
    inTheField:
      "Primo Research Assistant (Clarivate) and EBSCO's natural-language search ship inside major discovery products, and JSTOR's generative AI research assistant summarizes results and suggests related material.",
    risks: [
      { text: "Overconfident answers", severity: "high" },
      { text: "Weak citations", severity: "high" },
      { text: "Hidden ranking bias", severity: "medium" },
    ],
    review:
      "Require source links, uncertainty language, and librarian-tested prompts.",
  },
  {
    id: "chat",
    categoryId: "lis-expert",
    label: "Chat assistant",
    shortLabel: "Chat",
    icon: BotMessageSquare,
    readiness: "emerging",
    value:
      "Answers routine service questions — hours, renewals, room bookings — when staff are unavailable, and hands harder questions to people.",
    scenario:
      "At 11 pm a patron asks how to renew an interlibrary loan. The bot answers from the library's own FAQ pages, links the exact policy, and offers to email the question to staff for the morning.",
    inTheField:
      "Universities run Ivy.ai and custom chatbots grounded in library FAQ content, and Springshare has added AI-drafted responses to its LibAnswers platform.",
    risks: [
      { text: "Privacy leakage", severity: "high" },
      { text: "Policy mistakes", severity: "high" },
      { text: "Escalation failures", severity: "medium" },
    ],
    review:
      "Limit data collection, publish boundaries, and route complex questions to staff.",
  },
  {
    id: "research-summaries",
    categoryId: "lis-expert",
    label: "Research summaries",
    shortLabel: "Lit triage",
    icon: ScrollText,
    readiness: "established",
    value:
      "Summarizes articles, extracts claims, and helps researchers triage what to read first across a large literature.",
    scenario:
      "A graduate student pastes ten abstracts and asks which address measurement validity. The tool groups them and flags two for close reading — and the librarian teaches the student to verify each claim against the full text.",
    inTheField:
      "Elicit and Consensus build literature-review workflows on language models, and JSTOR and EBSCO embed article summaries directly in their platforms.",
    risks: [
      { text: "Fabricated citations", severity: "high" },
      { text: "Oversimplified findings", severity: "medium" },
      { text: "Skipped methodology context", severity: "medium" },
    ],
    review:
      "Teach verification against the full text, and frame summaries as a reading map — never as the reading.",
  },
  {
    id: "readers-advisory",
    categoryId: "lis-expert",
    label: "Readers' advisory",
    shortLabel: "recommendations",
    icon: BookHeart,
    readiness: "experimental",
    value:
      "Suggests reccomended readings and themed lists from natural-language descriptions of what a reader enjoyed.",
    scenario:
      "A patron wants “something like Project Hail Mary but more hopeful.” Staff use a prompt template to generate candidates, then curate the list against the local collection and what they know about community tastes.",
    inTheField:
      "Mostly experimental so far: libraries prototype prompt-based readers' advisory at service desks while catalog and discovery vendors test AI recommendation features.",
    risks: [
      { text: "Invented titles", severity: "high" },
      { text: "Homogenized suggestions", severity: "medium" },
      { text: "Disconnect from local collection", severity: "medium" },
    ],
    review:
      "Check that suggested titles exist and are held locally; keep staff taste and community knowledge in the loop.",
  },
  {
    id: "ai-literacy",
    categoryId: "lis-expert",
    label: "AI literacy instruction",
    shortLabel: "AI literacy",
    icon: Presentation,
    readiness: "emerging",
    value:
      "Generates practice examples, quiz drafts, and live demonstrations for teaching patrons how AI works — and where it fails.",
    scenario:
      "An instruction librarian generates three hallucinated-citation examples live in class, then has students trace why each reference fails. The failure is the lesson.",
    inTheField:
      "Information-literacy programs are adding AI evaluation modules, and ACRL communities share lesson plans that use model output as the object of critique.",
    risks: [
      { text: "Demos fail unpredictably", severity: "medium" },
      { text: "Reinforcing hype or fear", severity: "medium" },
      { text: "Unequal tool access", severity: "low" },
    ],
    review:
      "Test demonstrations beforehand, frame outputs as artifacts to examine, and pair every demo with a verification exercise.",
  },
  {
    id: "metadata",
    categoryId: "lis-practitioner",
    label: "Metadata drafting",
    shortLabel: "Metadata",
    icon: Tags,
    readiness: "emerging",
    value:
      "Suggests descriptions, keywords, or subject terms for human review.",
    scenario:
      "A cataloger pastes a thesis abstract and the tool proposes three subject headings with rationale. The cataloger accepts one, edits another, rejects the third — and logs the rejection pattern for the next review.",
    inTheField:
      "The National Library of Finland's open-source Annif automates subject suggestion in production, and the Library of Congress has tested computational MARC description through its Labs experiments.",
    risks: [
      { text: "Biased language", severity: "medium" },
      { text: "Invented details", severity: "high" },
      { text: "Inconsistent standards", severity: "medium" },
    ],
    review:
      "Keep cataloger approval, compare against local standards, and log rejected patterns.",
  },
  {
    id: "transcription",
    categoryId: "lis-practitioner",
    label: "Transcription & OCR cleanup",
    shortLabel: "Transcription",
    icon: AudioLines,
    readiness: "established",
    value:
      "Transcribes oral histories and AV collections, and cleans up messy OCR from digitized text and handwriting.",
    scenario:
      "An archive runs sixty hours of oral-history audio through a speech model, then has volunteers correct the names, places, and dialect the model missed before transcripts are published.",
    inTheField:
      "OpenAI's Whisper is widely used for oral-history transcription, and Transkribus reads handwritten documents in archival digitization projects across the field.",
    risks: [
      { text: "Misheard names and places", severity: "high" },
      { text: "Dialect and accent errors", severity: "medium" },
      { text: "Speaker attribution mistakes", severity: "medium" },
    ],
    review:
      "Human-correct transcripts before publication, prioritizing names, dates, and culturally specific language.",
  },
  {
    id: "summarization",
    categoryId: "lis-practitioner",
    label: "Summarization",
    shortLabel: "Summaries",
    icon: FileText,
    readiness: "emerging",
    value:
      "Creates plain-language summaries of long policies, guides, or transcripts.",
    scenario:
      "Staff draft a plain-language version of the meeting-room policy. The original stays linked beside the summary so patrons can always check the exact rules.",
    inTheField:
      "Libraries summarize policies, board minutes, and research guides, and many of the content platforms libraries license now bundle summarization features.",
    risks: [
      { text: "Lost nuance", severity: "medium" },
      { text: "Accessibility gaps", severity: "medium" },
      { text: "Context collapse", severity: "high" },
    ],
    review:
      "Check summaries against original documents and provide the original nearby.",
  },
  {
    id: "accessibility",
    categoryId: "lis-practitioner",
    label: "Accessibility support",
    shortLabel: "Access",
    icon: Accessibility,
    readiness: "emerging",
    value:
      "Drafts alt text, reading-level variants, captions, or translation starting points.",
    scenario:
      "A digital collections team drafts alt text for two thousand photographs with an image-description model, then routes every description through human review before it reaches the catalog.",
    inTheField:
      "Digital collections pilots use image-description services for alt-text drafts, and accessibility offices consistently stress review by the communities the descriptions serve.",
    risks: [
      { text: "Cultural mismatch", severity: "medium" },
      { text: "Incorrect descriptions", severity: "high" },
      { text: "Uneven quality", severity: "low" },
    ],
    review:
      "Use affected-user review where possible and treat output as a draft.",
  },
  {
    id: "archives",
    categoryId: "lis-practitioner",
    label: "Archival description",
    shortLabel: "Archives",
    icon: Archive,
    readiness: "experimental",
    value:
      "Drafts scope-and-content notes, biographical sketches, and folder-level description to chip away at processing backlogs.",
    scenario:
      "A processing archivist feeds a container list and sample correspondence to a model for a draft scope note, then rewrites it against the actual materials — faster than starting from a blank page.",
    inTheField:
      "Experimental: Library of Congress Labs and university archives are piloting model-drafted description, with active professional debate about disclosure and quality.",
    risks: [
      { text: "Plausible but wrong description", severity: "high" },
      { text: "Flattened community context", severity: "medium" },
      { text: "Undisclosed AI involvement", severity: "medium" },
    ],
    review:
      "Verify drafts against the materials, disclose AI assistance in processing notes, and keep archivist judgment final.",
  },
];

const categoryMeta: Omit<GenAiCategory, "projects">[] = [
  {
    id: "lis-expert",
    label: "LIS expert",
    description:
      "Tools that extend reference and patron service — helping people find, understand, and use information.",
    icon: GraduationCap,
    accent: {
      container: "border-rose-200 bg-rose-50/70",
      heading: "text-rose-950",
      iconBadge: "bg-rose-700 text-white",
      activeChip: "border-rose-700 bg-white text-rose-950 shadow-sm",
      chipIcon: "text-rose-900",
    },
  },
  {
    id: "lis-practitioner",
    label: "LIS practitioner",
    description:
      "Tools that support daily operations — cataloging, digitization, publishing, and keeping collections usable.",
    icon: ClipboardList,
    accent: {
      container: "border-violet-200 bg-violet-50/70",
      heading: "text-violet-950",
      iconBadge: "bg-violet-700 text-white",
      activeChip: "border-violet-700 bg-white text-violet-950 shadow-sm",
      chipIcon: "text-violet-900",
    },
  },
];

const severityMeta: Record<
  RiskSeverity,
  { label: string; chipClassName: string; swatchClassName: string }
> = {
  high: {
    label: "High",
    chipClassName: "border-rose-300 bg-rose-100 text-rose-950",
    swatchClassName: "bg-rose-400",
  },
  medium: {
    label: "Medium",
    chipClassName: "border-amber-300 bg-amber-100 text-amber-950",
    swatchClassName: "bg-amber-400",
  },
  low: {
    label: "Low",
    chipClassName: "border-slate-300 bg-slate-100 text-slate-800",
    swatchClassName: "bg-slate-400",
  },
};

const readinessMeta: Record<
  Readiness,
  { label: string; badgeClassName: string; dotClassName: string; blurb: string }
> = {
  established: {
    label: "Established",
    badgeClassName: "border-emerald-300 bg-emerald-100 text-emerald-950",
    dotClassName: "bg-emerald-500",
    blurb: "shipping in products libraries already license",
  },
  emerging: {
    label: "Emerging",
    badgeClassName: "border-amber-300 bg-amber-100 text-amber-950",
    dotClassName: "bg-amber-500",
    blurb: "active pilots with growing practice to learn from",
  },
  experimental: {
    label: "Experimental",
    badgeClassName: "border-violet-300 bg-violet-100 text-violet-950",
    dotClassName: "bg-violet-500",
    blurb: "early prototypes the field is still debating",
  },
};

const theme = getConceptTheme("ai-ml-libraries");

export function AiMlProjectExplorer() {
  const [activeId, setActiveId] = useState(projects[0].id);

  const categories = useMemo<GenAiCategory[]>(
    () =>
      categoryMeta.map((category) => ({
        ...category,
        projects: projects
          .filter((project) => project.categoryId === category.id)
          .map(({ id, label, shortLabel, icon, readiness }) => ({
            id,
            label,
            shortLabel,
            icon,
            indicatorClassName: readinessMeta[readiness].dotClassName,
          })),
      })),
    [],
  );

  const project = projects.find((item) => item.id === activeId) ?? projects[0];
  const Icon = project.icon;
  const readiness = readinessMeta[project.readiness];

  return (
    <ConceptExplorerShell
      howItWorks="Browse ten AI and machine learning project ideas by role — LIS expert tools for reference and patron help, LIS practitioner tools for daily operations. Each one shows where the field already uses it, what it looks like in practice, how mature it is, and the risks staff must review."
      slug="ai-ml-libraries"
    >
      <GenAiCategoryMap
        activeId={activeId}
        categories={categories}
        onSelect={setActiveId}
        theme={theme}
      />
      <ReadinessLegend />

      <section
        aria-label={`${project.label} details`}
        className={cn(theme.detailPanel, "space-y-4")}
      >
        <div className="flex flex-wrap items-start gap-3">
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-lg",
              theme.iconBadge,
            )}
          >
            <Icon className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Project idea
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold">{project.label}</h3>
              <span
                className={cn(
                  "rounded-md border px-1.5 py-0.5 text-[0.65rem] font-medium",
                  readiness.badgeClassName,
                )}
              >
                {readiness.label}
              </span>
            </div>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {project.value}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ReviewPanel
            icon={<NotebookPen className="size-4" />}
            label="In practice"
          >
            {project.scenario}
          </ReviewPanel>

          <ReviewPanel
            icon={<Landmark className="size-4" />}
            label="In the field"
          >
            {project.inTheField}
            <span className="mt-2 block text-xs text-muted-foreground/80">
              {readiness.label}: {readiness.blurb}.
            </span>
          </ReviewPanel>

          <div className="h-full rounded-lg bg-muted/60 p-4">
            <Badge className="mb-2 gap-1" variant="outline">
              <ShieldAlert className="size-4" />
              Risks to review
            </Badge>
            <SeverityLegend />
            <ul className="mt-3 flex flex-wrap content-start gap-2">
              {project.risks.map((risk) => (
                <li key={risk.text}>
                  <span
                    className={cn(
                      "inline-flex rounded-md border px-2 py-1 text-xs font-medium",
                      severityMeta[risk.severity].chipClassName,
                    )}
                  >
                    <span className="sr-only">
                      {severityMeta[risk.severity].label} risk:{" "}
                    </span>
                    {risk.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <ReviewPanel
            icon={<MessageCircleQuestion className="size-4" />}
            label="Staff practice"
          >
            {project.review}
          </ReviewPanel>
        </div>

        <p className="text-sm leading-6 text-muted-foreground">
          AI and machine learning project planning should pair the use case with
          an evaluation habit. The question is not only whether the tool can
          produce useful output, but whether the library can review, explain,
          and improve that output responsibly.
        </p>
      </section>
    </ConceptExplorerShell>
  );
}

function SeverityLegend() {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
      {(Object.keys(severityMeta) as RiskSeverity[]).map((key) => (
        <span className="inline-flex items-center gap-1.5" key={key}>
          <span
            aria-hidden="true"
            className={cn(
              "size-2 shrink-0 rounded-full",
              severityMeta[key].swatchClassName,
            )}
          />
          {severityMeta[key].label}
        </span>
      ))}
    </p>
  );
}

function ReadinessLegend() {
  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-xs text-muted-foreground">
      <span className="font-medium">Field readiness:</span>
      {(Object.keys(readinessMeta) as Readiness[]).map((key) => (
        <span className="inline-flex items-center gap-1.5" key={key}>
          <span
            aria-hidden="true"
            className={cn(
              "size-2 shrink-0 rounded-full",
              readinessMeta[key].dotClassName,
            )}
          />
          {readinessMeta[key].label}
        </span>
      ))}
    </p>
  );
}

function ReviewPanel({
  children,
  icon,
  label,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="h-full rounded-lg bg-muted/60 p-4">
      <Badge className="mb-3 gap-1" variant="outline">
        {icon}
        {label}
      </Badge>
      <div className="text-sm leading-6 text-muted-foreground">{children}</div>
    </div>
  );
}
