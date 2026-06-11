"use client";

import type { ConceptSlug } from "@/lib/concepts";

import { AiMlLifecycleExplorer } from "./ai-ml-lifecycle-explorer";
import { AiMlProjectExplorer } from "./ai-ml-project-explorer";
import { ConceptMotionProvider } from "./concept-motion-provider";
import { DevLifecycleExplorer } from "./dev-lifecycle-explorer";
import { PlatformTradeoffsExplorer } from "./platform-tradeoffs-explorer";
import { WebAppArchitectureExplorer } from "./web-app-architecture-explorer";

export function ConceptInteractive({ slug }: { slug: ConceptSlug }) {
  return (
    <ConceptMotionProvider>
      <ConceptModule slug={slug} />
    </ConceptMotionProvider>
  );
}

function ConceptModule({ slug }: { slug: ConceptSlug }) {
  switch (slug) {
    case "dev-lifecycle":
      return <DevLifecycleExplorer />;
    case "web-app-architecture":
      return <WebAppArchitectureExplorer />;
    case "platform-tradeoffs":
      return <PlatformTradeoffsExplorer />;
    case "ai-ml-lifecycle":
      return <AiMlLifecycleExplorer />;
    case "ai-ml-libraries":
      return <AiMlProjectExplorer />;
  }
}
