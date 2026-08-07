import { Link } from "@tanstack/react-router";
import { urlFor, type Wine } from "@/lib/sanity";

export function WineCard({ wine }: { wine: Wine }) {
  const hasImage = Boolean(wine.image);

  return (
    <Link
      to="/vin/$id"
      params={{ id: wine._id }}
      className="group flex flex-col overflow-hidden rounded-sm border border-border/70 bg-card transition hover:border-primary/60 hover:shadow-[0_20px_40px_-30px_rgba(60,10,20,0.35)]"
    >
      <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-muted/60">
        {hasImage ? (
          <img
            src={urlFor(wine.image!)
              .width(600)
              .height(800)
              .fit("crop")
              .auto("format")
              .url()}
            alt={wine.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <TypographicLabel name={wine.name} />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 px-5 py-5">
        <h3 className="font-display text-xl leading-tight text-ink">
          {wine.name}
        </h3>
        {wine.description ? (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {wine.description}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

function TypographicLabel({ name }: { name: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[linear-gradient(180deg,oklch(0.94_0.012_82)_0%,oklch(0.9_0.015_72)_100%)] px-6 text-center">
      <div className="h-px w-16 bg-brass/70" />
      <span className="eyebrow">Vin</span>
      <p className="font-display text-2xl leading-tight text-primary">{name}</p>
      <div className="h-px w-16 bg-brass/70" />
    </div>
  );
}
