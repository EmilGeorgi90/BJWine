import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { PortableText } from "@portabletext/react";
import { Suspense } from "react";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import {
  sanityClient,
  tastingPageQuery,
  urlFor,
  type TastingPage as TastingPageData,
  type TastingContentSection,
  type TastingPracticalSection,
  type TastingContactSection,
} from "@/lib/sanity";

const tastingQueryOptions = queryOptions({
  queryKey: ["tastingPage"],
  queryFn: () => sanityClient.fetch<TastingPageData | null>(tastingPageQuery),
  staleTime: 60_000,
});

export const Route = createFileRoute("/vinsmagning")({
  loader: ({ context }) => context.queryClient.ensureQueryData(tastingQueryOptions),
  head: () => ({
    meta: [
      { title: "Vinsmagning – BJ Wine" },
      { name: "description", content: "Vinsmagninger hos BJ Wine." },
      { property: "og:title", content: "Vinsmagning – BJ Wine" },
      { property: "og:description", content: "Vinsmagninger hos BJ Wine." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TastingPage,
});

function TastingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Suspense fallback={<div className="container-editorial py-20" />}>
        <TastingContent />
      </Suspense>
      <SiteFooter />
    </div>
  );
}

function TastingContent() {
  const { data } = useSuspenseQuery(tastingQueryOptions);
  const sections = data?.sections ?? [];
  const heroImage = data?.heroImage
    ? urlFor(data.heroImage).width(1500).height(900).fit("crop").auto("format").url()
    : null;

  return (
    <main>
      <section className="border-b border-border/60">
        <div className="container-editorial grid gap-12 py-16 sm:py-24 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          <div>
            <p className="eyebrow mb-6">{data?.eyebrow ?? "Vinsmagning"}</p>
            <h1 className="font-display text-5xl leading-tight text-primary sm:text-6xl">
              <span className="block">{data?.title ?? "Smag vinene"}</span>
              {data?.titleAccent && (
                <span className="block italic text-brass">{data.titleAccent}</span>
              )}
            </h1>
            {data?.introduction && (
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {data.introduction}
              </p>
            )}
          </div>
          {heroImage && (
            <img
              src={heroImage}
              alt="Vinsmagning hos BJ Wine"
              className="aspect-[5/3] w-full object-cover"
            />
          )}
        </div>
      </section>

      {sections.map((section) => {
        if (section._type === "tastingContentSection")
          return <ContentSection key={section._key} section={section} />;
        if (section._type === "tastingPracticalSection")
          return <PracticalSection key={section._key} section={section} />;
        if (section._type === "tastingContactSection")
          return <ContactSection key={section._key} section={section} />;
        return null;
      })}
    </main>
  );
}

function ContentSection({ section }: { section: TastingContentSection }) {
  const image = section.image
    ? urlFor(section.image).width(1100).height(800).fit("crop").auto("format").url()
    : null;
  return (
    <section className="border-b border-border/60">
      <div
        className={`container-editorial grid gap-12 py-16 sm:py-24 ${image ? "md:grid-cols-2 md:items-center" : "max-w-4xl"}`}
      >
        <div>
          {section.eyebrow && <p className="eyebrow mb-4">{section.eyebrow}</p>}
          <h2 className="font-display text-4xl text-primary sm:text-5xl">{section.title}</h2>
          {section.body && (
            <div className="prose-editorial mt-7 space-y-5 text-lg leading-relaxed text-foreground/85">
              <PortableText value={section.body} />
            </div>
          )}
        </div>
        {image && <img src={image} alt="" className="aspect-[4/3] w-full object-cover" />}
      </div>
    </section>
  );
}

function PracticalSection({ section }: { section: TastingPracticalSection }) {
  return (
    <section className="border-b border-border/60 bg-paper">
      <div className="container-editorial py-16 sm:py-24">
        {section.eyebrow && <p className="eyebrow mb-4">{section.eyebrow}</p>}
        <h2 className="font-display text-4xl text-primary sm:text-5xl">{section.title}</h2>
        {section.intro && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {section.intro}
          </p>
        )}
        {section.items && section.items.length > 0 && (
          <dl className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {section.items.map((item) => (
              <div key={item._key} className="bg-background p-7">
                <dt className="eyebrow">{item.label}</dt>
                <dd className="mt-3 font-display text-2xl text-primary">{item.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}

function ContactSection({ section }: { section: TastingContactSection }) {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container-editorial flex flex-col gap-8 py-16 sm:flex-row sm:items-end sm:justify-between sm:py-20">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl sm:text-5xl">{section.title}</h2>
          {section.body && (
            <p className="mt-5 text-lg leading-relaxed text-primary-foreground/75">
              {section.body}
            </p>
          )}
        </div>
        <Button
          asChild
          size="lg"
          className="shrink-0 border border-brass bg-brass text-accent-foreground shadow-none hover:bg-background"
        >
          <Link to="/kontakt">{section.buttonText}</Link>
        </Button>
      </div>
    </section>
  );
}
