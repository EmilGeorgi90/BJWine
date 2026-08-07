import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { PortableText } from "@portabletext/react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import {
  sanityClient,
  aboutPageQuery,
  type AboutPage as AboutPageData,
} from "@/lib/sanity";

const aboutQueryOptions = queryOptions({
  queryKey: ["aboutPage"],
  queryFn: () => sanityClient.fetch<AboutPageData | null>(aboutPageQuery),
  staleTime: 60_000,
});

export const Route = createFileRoute("/om")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(aboutQueryOptions),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Suspense fallback={<div className="container-editorial py-20" />}>
        <AboutContent />
      </Suspense>
      <SiteFooter />
    </div>
  );
}

function AboutContent() {
  const { data } = useSuspenseQuery(aboutQueryOptions);
  const eyebrow = data?.eyebrow ?? "Om butikken";
  const title = data?.title ?? "En lille vinhandel";
  const accent = data?.titleAccent;
  const asideTitle = data?.asideTitle;
  const asideBody = data?.asideBody;

  return (
    <section className="container-editorial py-20">
      <p className="eyebrow mb-6">{eyebrow}</p>
      <h1 className="font-display text-5xl leading-tight text-primary sm:text-6xl">
        {title}
        {accent && (
          <>
            {" "}
            <span className="italic text-brass">{accent}</span>
          </>
        )}
      </h1>
      <div className="mt-12 grid gap-12 md:grid-cols-[2fr_1fr]">
        <div className="prose-editorial space-y-6 text-lg leading-relaxed text-foreground/85">
          {data?.body ? (
            <PortableText value={data.body} />
          ) : (
            <p>Tilføj indhold i CMS'et.</p>
          )}
        </div>
        {(asideTitle || asideBody) && (
          <aside className="border border-border/70 bg-paper p-8">
            {asideTitle && <p className="eyebrow mb-3">{asideTitle}</p>}
            {asideBody && (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {asideBody}
              </p>
            )}
          </aside>
        )}
      </div>
    </section>
  );
}
