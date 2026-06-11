import { ArrowLeft, ArrowRight, Home, Lightbulb } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ConceptIcon } from "@/components/concept-icon";
import { ConceptInteractive } from "@/components/concepts/concept-interactive";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { concepts, getConcept, getConceptNeighbors } from "@/lib/concepts";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return concepts.map((concept) => ({
    slug: concept.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const concept = getConcept(slug);

  if (!concept) {
    return {
      title: "Concept not found | LIM 562",
    };
  }

  return {
    title: concept.title,
    description: concept.definition,
  };
}

export default async function ConceptPage({ params }: PageProps) {
  const { slug } = await params;
  const concept = getConcept(slug);

  if (!concept) {
    notFound();
  }

  const { previous, next } = getConceptNeighbors(concept.slug);

  return (
    <main className="page-shell page-shell-concept">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-6 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link className={buttonVariants({ variant: "outline" })} href="/">
            <Home className="size-4" />
            Topics
          </Link>
        </div>

        <header className="grid gap-5 rounded-xl border bg-white/90 p-5 shadow-xs lg:grid-cols-[1fr_360px]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ConceptIcon className="size-5" slug={concept.slug} />
              </span>
              <h1 className="text-3xl font-semibold tracking-normal text-balance sm:text-4xl">
                {concept.title}
              </h1>
            </div>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
              {concept.definition}
            </p>
          </div>
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="size-5" />
                Why it matters
              </CardTitle>
              <CardDescription>{concept.whyItMatters}</CardDescription>
            </CardHeader>
          </Card>
        </header>

        <section
          aria-label={`${concept.title} interactive diagram`}
          className="min-w-0"
        >
          <ConceptInteractive slug={concept.slug} />
        </section>

        <nav
          aria-label="Previous and next concepts"
          className="grid gap-3 sm:grid-cols-2"
        >
          <Link
            className={buttonVariants({
              className: "h-auto justify-start whitespace-normal p-4",
              variant: "outline",
            })}
            href={`/concepts/${previous.slug}`}
          >
            <ArrowLeft className="size-4" />
            <span className="text-left">
              <span className="block text-xs text-muted-foreground">
                Previous
              </span>
              <span className="block">{previous.shortTitle}</span>
            </span>
          </Link>
          <Link
            className={buttonVariants({
              className: "h-auto justify-between whitespace-normal p-4",
              variant: "outline",
            })}
            href={`/concepts/${next.slug}`}
          >
            <span className="text-left">
              <span className="block text-xs text-muted-foreground">Next</span>
              <span className="block">{next.shortTitle}</span>
            </span>
            <ArrowRight className="size-4" />
          </Link>
        </nav>
      </div>
    </main>
  );
}

function _RecapCard({
  icon,
  label,
  text,
  title,
}: {
  icon: React.ReactNode;
  label: string;
  text: string;
  title: string;
}) {
  return (
    <Card className="bg-white/90">
      <CardHeader>
        <Badge className="mb-2 w-fit gap-1" variant="secondary">
          {icon}
          {label}
        </Badge>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  );
}
