import { ArrowRight, Layers3 } from "lucide-react"
import Link from "next/link"

import { ConceptIcon } from "@/components/concept-icon"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { concepts } from "@/lib/concepts"

export default function Home() {
  return (
    <main className="page-shell page-shell-dashboard">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-6 sm:px-8 lg:px-10">
        <header className="border-b pb-8">
          <div className="w-full">
            <h1 className="text-3xl font-semibold tracking-normal text-balance sm:text-4xl lg:text-5xl">
              LIM562: Transformative Technologies in LIS
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              Interactive concept topics for reviewing how library technology
              systems are planned, built, evaluated, hosted, and governed.
            </p>
          </div>
        </header>

        <section aria-labelledby="concepts-heading" className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                className="text-xl font-semibold tracking-normal"
                id="concepts-heading"
              >
                Concept topics
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Each topic combines a short class recap with a clickable diagram
                or comparison activity.
              </p>
            </div>
            <Badge className="w-fit gap-1.5" variant="secondary">
              <Layers3 className="size-3.5" />
              {concepts.length} topics
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {concepts.map((concept, index) => (
              <Card
                className="group bg-white/90 transition-colors hover:border-primary/30"
                key={concept.slug}
              >
                <CardHeader>
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <ConceptIcon className="size-5" slug={concept.slug} />
                    </span>
                    <Badge variant="outline">
                      {String(index + 1).padStart(2, "0")}
                    </Badge>
                  </div>
                  <CardTitle>{concept.title}</CardTitle>
                  <CardDescription>{concept.deckLabel}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  <p className="min-h-24 text-sm leading-6 text-muted-foreground">
                    {concept.definition}
                  </p>
                  <Link
                    className={buttonVariants({
                      className: "mt-auto w-full justify-between",
                      variant: "secondary",
                    })}
                    href={`/concepts/${concept.slug}`}
                  >
                    Open topic
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
