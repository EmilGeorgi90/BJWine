import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import {
  sanityClient,
  urlFor,
  wineListQuery,
  homePageQuery,
  type Wine,
  type HomePage,
} from "@/lib/sanity";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { WineCard } from "@/components/WineCard";

const winesQueryOptions = queryOptions({
  queryKey: ["wines"],
  queryFn: () => sanityClient.fetch<Wine[]>(wineListQuery),
  staleTime: 60_000,
});

const homePageQueryOptions = queryOptions({
  queryKey: ["homePage"],
  queryFn: () => sanityClient.fetch<HomePage | null>(homePageQuery),
  staleTime: 60_000,
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(winesQueryOptions);
    context.queryClient.ensureQueryData(homePageQueryOptions);
  },
  component: HomePageRoute,
});

function HomePageRoute() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Suspense fallback={<HeroSkeleton />}>
        <Hero />
      </Suspense>
      <section className="container-editorial py-16">
        <Suspense fallback={null}>
          <CatalogHeader />
        </Suspense>
        <Suspense fallback={<CatalogSkeleton />}>
          <Catalog />
        </Suspense>
      </section>
      <SiteFooter />
    </div>
  );
}

function Hero() {
  const { data } = useSuspenseQuery(homePageQueryOptions);
  const eyebrow = data?.eyebrow ?? "Est. i Danmark";
  const title = data?.title ?? "Et kurateret udvalg af vine —";
  const accent = data?.titleAccent;
  const description =
    data?.description ??
    "Velkommen til BJ Wine. Vores katalog viser de vine, du kan finde i butikken lige nu.";
  const banner = data?.bannerImage
    ? urlFor(data.bannerImage)
        .width(1200)
        .height(1500)
        .fit("crop")
        .auto("format")
        .url()
    : null;

  return (
    <section className="border-b border-border/60">
      <div className="container-editorial grid gap-10 py-20 sm:py-28 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div>
          <p className="eyebrow mb-6">{eyebrow}</p>
          <h1 className="font-display text-5xl leading-[1.05] text-primary sm:text-6xl md:text-7xl">
            {title}
            {accent && (
              <>
                {" "}
                <span className="italic text-brass">{accent}</span>
              </>
            )}
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="relative hidden md:block">
          {banner ? (
            <img
              src={banner}
              alt=""
              className="aspect-[4/5] w-full object-cover shadow-[0_40px_80px_-40px_rgba(60,10,20,0.5)]"
            />
          ) : (
            <div className="aspect-[4/5] w-full bg-[linear-gradient(180deg,oklch(0.32_0.11_15)_0%,oklch(0.22_0.08_15)_100%)] p-10 shadow-[0_40px_80px_-40px_rgba(60,10,20,0.5)]">
              <div className="flex h-full flex-col items-center justify-center gap-6 border border-brass/40 text-center">
                <div className="h-px w-20 bg-brass" />
                <p className="eyebrow text-brass/90">Vinhandel</p>
                <p className="font-display text-5xl text-paper">BJ Wine</p>
                <p className="font-display text-lg italic text-paper/70">
                  Anno 2024
                </p>
                <div className="h-px w-20 bg-brass" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function HeroSkeleton() {
  return <div className="container-editorial py-28" />;
}

function CatalogHeader() {
  const { data } = useSuspenseQuery(homePageQueryOptions);
  return (
    <div className="mb-10 flex items-end justify-between gap-6">
      <div>
        <p className="eyebrow mb-3">{data?.catalogEyebrow ?? "Kataloget"}</p>
        <h2 className="font-display text-4xl text-primary sm:text-5xl">
          {data?.catalogTitle ?? "Vine i butikken"}
        </h2>
      </div>
      <div className="hidden h-px flex-1 bg-rule/40 sm:block" />
    </div>
  );
}

function Catalog() {
  const { data: wines } = useSuspenseQuery(winesQueryOptions);

  if (!wines || wines.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-border p-16 text-center">
        <p className="font-display text-2xl text-primary">Kataloget er tomt</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Der er endnu ikke tilføjet vine. Log ind i CMS'et for at komme i gang.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {wines.map((wine) => (
        <WineCard key={wine._id} wine={wine} />
      ))}
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] bg-muted/60" />
          <div className="mt-4 h-5 w-2/3 bg-muted/60" />
          <div className="mt-2 h-3 w-full bg-muted/40" />
        </div>
      ))}
    </div>
  );
}
