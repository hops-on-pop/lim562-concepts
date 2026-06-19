"use client";

import type { ConceptSlug } from "@/lib/concepts";
import { AiMlLibraryBrowser } from "./ai-ml-library-browser";
import { AiMlLifecycleExplorer } from "./ai-ml-lifecycle-explorer";
import { ConceptMotionProvider } from "./concept-motion-provider";
import { DevLifecycleExplorer } from "./dev-lifecycle-explorer";
import { MetadataLinkedDataExplorer } from "./metadata-linked-data-explorer";
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
      return <AiMlLibraryBrowser />;
    case "metadata-linked-data":
      return <MetadataLinkedDataExplorer />;
  }
}
