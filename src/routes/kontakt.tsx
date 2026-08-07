import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import {
  sanityClient,
  contactPageQuery,
  type ContactPage as ContactPageData,
} from "@/lib/sanity";

const contactQueryOptions = queryOptions({
  queryKey: ["contactPage"],
  queryFn: () => sanityClient.fetch<ContactPageData | null>(contactPageQuery),
  staleTime: 60_000,
});

export const Route = createFileRoute("/kontakt")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(contactQueryOptions),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Suspense fallback={<div className="container-editorial py-20" />}>
        <ContactContent />
      </Suspense>
      <SiteFooter />
    </div>
  );
}

function ContactContent() {
  const { data } = useSuspenseQuery(contactQueryOptions);
  const eyebrow = data?.eyebrow ?? "Kontakt";
  const title = data?.title ?? "Kom forbi butikken.";
  const address = data?.addressLines ?? [];
  const hours = data?.openingHours ?? [];
  const phone = data?.phone;
  const email = data?.email;

  return (
    <section className="container-editorial py-20">
      <p className="eyebrow mb-6">{eyebrow}</p>
      <h1 className="font-display text-5xl leading-tight text-primary sm:text-6xl">
        {title}
      </h1>

      <div className="mt-16 grid gap-12 md:grid-cols-3">
        {address.length > 0 && (
          <div>
            <p className="eyebrow mb-3">Adresse</p>
            <p className="text-lg leading-relaxed text-foreground/85">
              {address.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < address.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>
        )}
        {hours.length > 0 && (
          <div>
            <p className="eyebrow mb-3">Åbningstider</p>
            <ul className="space-y-1 text-lg text-foreground/85">
              {hours.map((h) => (
                <li key={h._key}>
                  {h.days}
                  {h.days && h.hours && ": "}
                  {h.hours}
                </li>
              ))}
            </ul>
          </div>
        )}
        {(phone || email) && (
          <div>
            <p className="eyebrow mb-3">Kontakt</p>
            <p className="text-lg leading-relaxed text-foreground/85">
              {phone && (
                <>
                  Tlf: {phone}
                  <br />
                </>
              )}
              {email && (
                <a href={`mailto:${email}`} className="text-primary underline">
                  {email}
                </a>
              )}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
