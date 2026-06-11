export type ConceptSlug =
  | "dev-lifecycle"
  | "web-app-architecture"
  | "platform-tradeoffs"
  | "ai-ml-lifecycle"
  | "ai-ml-libraries";

export type Concept = {
  slug: ConceptSlug;
  title: string;
  shortTitle: string;
  deckLabel: string;
  summary: string;
  definition: string;
  example: string;
  whyItMatters: string;
};

export const concepts: Concept[] = [
  {
    slug: "dev-lifecycle",
    title: "The Development Lifecycle",
    shortTitle: "Dev lifecycle",
    deckLabel: "Plan -> maintain",
    summary:
      "Follow the seven SDLC phases as a library catalog improvement moves from planning through deployment and ongoing maintenance.",
    definition:
      "The software development lifecycle (SDLC) is a structured, iterative path teams use to plan, build, deliver, and maintain software that meets stakeholder needs.",
    example:
      "A public services librarian notices patrons struggle to renew checked-out items, so the team prototypes clearer renewal language, tests it, and ships the change.",
    whyItMatters:
      "Libraries depend on technology decisions that are never finished. Seeing the lifecycle helps staff ask better questions at each stage.",
  },
  {
    slug: "web-app-architecture",
    title: "How a Web Application Works",
    shortTitle: "Web apps",
    deckLabel: "Request -> response",
    summary:
      "Step through a catalog search request as it moves between the browser, server logic, database, and response.",
    definition:
      "A web application coordinates interface code, server logic, and stored data so a user action can produce a useful response.",
    example:
      "When a patron searches for Octavia Butler, the browser sends a request, the server validates it, the database finds matching records, and the page updates.",
    whyItMatters:
      "Understanding the moving parts makes outages, integrations, privacy questions, and vendor conversations less mysterious.",
  },
  {
    slug: "platform-tradeoffs",
    title: "Software and Hosting Tradeoffs",
    shortTitle: "Platform tradeoffs",
    deckLabel: "On-prem -> IaaS -> PaaS -> SaaS",
    summary:
      "Compare on-premises, IaaS, PaaS, and SaaS hosting and see how each model shifts who manages the technology stack.",
    definition:
      "Hosting choices sit on a spectrum — on-premises, infrastructure as a service (IaaS), platform as a service (PaaS), and software as a service (SaaS) — and each step hands more of the stack to a provider, while software ownership (open source or proprietary) remains a separate, independent decision.",
    example:
      "A library can run Koha on its own servers, on cloud virtual machines it manages (IaaS), or pay a vendor to deliver it fully hosted — the same open-source software with very different operational responsibilities.",
    whyItMatters:
      "No model is automatically best. The right choice depends on staffing, risk tolerance, privacy needs, budget, and mission fit.",
  },
  {
    slug: "ai-ml-lifecycle",
    title: "The AI/ML Lifecycle",
    shortTitle: "AI/ML lifecycle",
    deckLabel: "Data -> model -> monitoring",
    summary:
      "Trace how an AI project moves from a library problem statement to data work, evaluation, deployment, and revision.",
    definition:
      "The AI/ML lifecycle is the set of practices used to define a problem, prepare data, train or configure a model, evaluate results, deploy it, and monitor how it behaves over time.",
    example:
      "A library might test a model that suggests subject headings, then compare suggestions against cataloger review before using it in production.",
    whyItMatters:
      "AI systems inherit assumptions from goals, data, and evaluation choices, so responsible use requires attention across the whole lifecycle.",
  },
  {
    slug: "ai-ml-libraries",
    title: "AI & Machine Learning in Libraries",
    shortTitle: "AI & ML in libraries",
    deckLabel: "Applications and risks",
    summary:
      "Explore ten library-facing AI and machine learning applications — what each looks like in practice, where the field already uses it, and the risks and review practices it requires.",
    definition:
      "AI and machine learning in libraries span trained models, retrieval and ranking systems, and generative tools that produce or transform content — applied to patron service, collections work, and daily operations.",
    example:
      "A library might test ML-assisted subject headings, deploy discovery search that ranks with learned models, or pilot a chatbot that drafts research starting points — each needing staff review for accuracy, privacy, and bias.",
    whyItMatters:
      "These tools can expand service capacity and speed routine work, but library values require transparent evaluation, explainability, and careful boundaries.",
  },
];

export function getConcept(slug: string) {
  return concepts.find((concept) => concept.slug === slug);
}

export function getConceptNeighbors(slug: ConceptSlug) {
  const index = concepts.findIndex((concept) => concept.slug === slug);

  return {
    previous: concepts[(index - 1 + concepts.length) % concepts.length],
    next: concepts[(index + 1) % concepts.length],
  };
}
