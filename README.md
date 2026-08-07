# BJ Wine — Catalog Website

A Danish wine-catalog site for **BJ Wine**. The site is not a web shop; it lists wines currently available in the physical shop, with a name, optional image, and optional description. All content is managed in [Sanity CMS](https://www.sanity.io/).

## Stack

- [TanStack Start](https://tanstack.com/start/) — React full-stack framework
- [TypeScript](https://www.typescriptlang.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Sanity](https://www.sanity.io/) — headless CMS for wine and page content
- [Cloudflare Workers](https://workers.cloudflare.com/) — hosting

## Development

Requires [Bun](https://bun.sh/) (or Node.js with `npm`).

```sh
git clone <this-repository-url>
cd bj-wine
bun install
bun run dev
```

Open [http://localhost:5173](http://localhost:5173).

## CMS

- **Studio URL:** https://bj-wine.sanity.studio/
- **Managed content:**
  - `Vin` — name, image, description, sort order
  - `Forside` — hero eyebrow/title/description, banner image, catalog title
  - `Om butikken` — about-page content
  - `Kontakt` — address, opening hours, phone, email

## Build

```sh
bun run build
```

Outputs:

- `dist/client/` — static assets
- `dist/server/` — Worker server bundle

## Cloudflare Workers deployment

The project is configured to run as a Cloudflare Worker with the `@cloudflare/vite-plugin`.

### Prerequisites

1. A [Cloudflare account](https://dash.cloudflare.com/sign-up).
2. [Wrangler](https://developers.cloudflare.com/workers/wrangler/) installed locally (already included as a dev dependency).
3. Authenticate Wrangler with your Cloudflare account:

   ```sh
   bunx wrangler login
   ```

### Deploy

```sh
bun run deploy
```

This runs `vite build` and then `wrangler deploy` using the `wrangler.jsonc` config.

### Preview locally

```sh
bun run preview
```

This runs the Worker locally with `wrangler dev`.

### Things to be aware of

- **Custom domain:** Cloudflare Workers can be connected to your own domain from the Cloudflare dashboard under **Workers & Pages > your worker > Settings > Triggers > Custom Domains**. If you keep the One.com domain, you can either:
  - Change the domain's nameservers to Cloudflare (recommended for the easiest custom-domain setup), or
  - Create a CNAME from your domain to the Workers domain (this requires using Cloudflare as the DNS proxy).
- **Free tier limits:** Cloudflare Workers free tier includes 100,000 requests per day, which is more than enough for a small wine catalog.
- **Environment variables:** If you later add secret API keys, store them with `bunx wrangler secret put <NAME>` (not in `.env` files). The only current external service is Sanity, which uses public read-only keys.
- **Node compatibility:** `wrangler.jsonc` has `nodejs_compat` enabled. The project uses only Worker-safe APIs, so this is mainly for TanStack Start internals.
- **No database:** The site reads from Sanity CMS at runtime. There is no Lovable Cloud/Supabase backend anymore.
