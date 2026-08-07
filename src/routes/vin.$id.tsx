import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { sanityClient, urlFor, wineByIdQuery, type Wine } from "@/lib/sanity";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";

const wineQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["wine", id],
    queryFn: async () => {
      const wine = await sanityClient.fetch<Wine | null>(wineByIdQuery, { id });
      if (!wine) throw notFound();
      return wine;
    },
    staleTime: 60_000,
  });

export const Route = createFileRoute("/vin/$id")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(wineQueryOptions(params.id)),
  head: ({ loaderData }) => {
    const title = loaderData?.name
      ? `${loaderData.name} – BJ Wine`
      : "Vin – BJ Wine";
    const description = loaderData?.description ?? "Vin fra BJ Wines katalog.";
    const image = loaderData?.image
      ? urlFor(loaderData.image).width(1200).height(630).fit("crop").url()
      : undefined;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(image
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
    };
  },
  component: WineDetailPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container-editorial py-24 text-center">
        <p className="eyebrow mb-4">Ikke fundet</p>
        <h1 className="font-display text-4xl text-primary">
          Vinen findes ikke
        </h1>
        <Link to="/" className="mt-8 inline-block text-primary underline">
          Tilbage til kataloget
        </Link>
      </div>
      <SiteFooter />
    </div>
  ),
});

function WineDetailPage() {
  const wine = useSuspenseQuery(wineQueryOptions(Route.useParams().id)).data;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <article className="container-editorial py-16">
        <Link
          to="/"
          className="eyebrow mb-10 inline-flex items-center gap-2 text-muted-foreground hover:text-primary"
        >
          ← Tilbage til kataloget
        </Link>

        <div className="grid gap-14 md:grid-cols-2 md:gap-20">
          <div className="relative">
            {wine.image ? (
              <img
                src={urlFor(wine.image)
                  .width(900)
                  .height(1200)
                  .fit("crop")
                  .auto("format")
                  .url()}
                alt={wine.name}
                className="aspect-[3/4] w-full object-cover shadow-[0_30px_60px_-40px_rgba(60,10,20,0.45)]"
              />
            ) : (
              <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-6 border border-border bg-[linear-gradient(180deg,oklch(0.94_0.012_82)_0%,oklch(0.9_0.015_72)_100%)] p-10 text-center">
                <div className="h-px w-24 bg-brass" />
                <span className="eyebrow">Vin</span>
                <p className="font-display text-4xl text-primary">
                  {wine.name}
                </p>
                <div className="h-px w-24 bg-brass" />
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="eyebrow mb-4">Fra vores katalog</p>
            <h1 className="font-display text-5xl leading-tight text-primary sm:text-6xl">
              {wine.name}
            </h1>
            <div className="mt-8 h-px w-16 bg-brass" />
            {wine.description ? (
              <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-foreground/85">
                {wine.description}
              </p>
            ) : (
              <p className="mt-8 text-base italic text-muted-foreground">
                Kom forbi butikken og spørg — vi fortæller gerne om denne
                flaske.
              </p>
            )}
            <div className="mt-10 border-t border-border/60 pt-6 text-sm text-muted-foreground">
              Denne vin er en del af vores nuværende sortiment i butikken. Se{" "}
              <Link to="/kontakt" className="text-primary underline">
                åbningstider og adresse
              </Link>
              .
            </div>
          </div>
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}
