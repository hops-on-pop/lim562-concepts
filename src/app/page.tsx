import { ArrowRight, Layers3 } from "lucide-react"
import Link from "next/link"

import { ConceptIcon } from "@/components/concept-icon"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getConceptTheme } from "@/lib/concept-themes"
import { concepts } from "@/lib/concepts"
import { cn } from "@/lib/utils"

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
            </div>
            <Badge className="w-fit gap-1.5" variant="secondary">
              <Layers3 className="size-3.5" />
              {concepts.length} topics
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {concepts.map((concept, index) => {
              const theme = getConceptTheme(concept.slug)

              return (
                <Card
                  className="group bg-white/90 transition-colors hover:border-primary/30"
                  key={concept.slug}
                >
                  <CardHeader>
                    <div className="mb-3 flex items-center gap-3">
                      <span
                        className={cn(
                          "flex size-10 items-center justify-center rounded-lg",
                          theme.iconBadge,
                        )}
                      >
                        <ConceptIcon className="size-5" slug={concept.slug} />
                      </span>

                      <CardTitle className="text-lg leading-tight flex items-center">
                        {concept.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-4">
                    <p className="min-h-24 text-sm leading-6 text-muted-foreground">
                      {concept.definition}
                    </p>
                    <Link
                      className={cn(
                        buttonVariants({
                          className:
                            "mt-auto w-full justify-between text-base font-bold",
                          variant: "ghost",
                        }),
                        theme.iconBadge,
                        theme.iconBadgeHover,
                      )}
                      href={`/concepts/${concept.slug}`}
                    >
                      Open topic
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
        <div>
          To view the source code, visit the{" "}
          <Link
            href="https://github.com/hops-on-pop/lim562-concepts"
            className="text-blue-500 underline hover:text-blue-800"
          >
            GitHub repository
          </Link>
          .
        </div>
      </div>
    </main>
  )
}
