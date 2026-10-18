# AGENTS.md — hillview-tv-web

## 1. What this repo is

The public site at **hillview.tv**: homepage spotlight, the video archive (`/content`, `/watch`, `/videos/v/[video]`), playlists, the live badge, newsletter sign-up and a sitemap. Server-rendered with `getServerSideProps`; every SSR page sets `Cache-Control: public, s-maxage=300, stale-while-revalidate=86400`, which **Cloudflare** caches (a cache rule on the hillview.tv zone makes HTML eligible). It reads from the Hillview APIs and owns no data.

Served at **hillview.tv (and www.hillview.tv)** from Lattice stack 38 "Hillview Web". It moved off Vercel (team `hillview-ms`) in October 2026. It owns no data — everything comes from the Hillview Go APIs at `api.hillview.tv`.

## 2. Stack & dependencies

- Next.js 16 (**Pages Router**), React 18, Tailwind CSS v4 (`@tailwindcss/postcss`, CSS-first config in `styles/globals.css` — no `tailwind.config.js`), TypeScript, axios (`services/http/requestHandler.ts`), Font Awesome (free), react-hot-toast, `@mux/mux-player-react` (watch page), `@aidenappleby/monitor-js`
- Node 24 (Docker `node:24-alpine`), `output: "standalone"`
- Telemetry: `@aidenappleby/monitor-js` ^1.2.1 → Monitor zone **hillview** (§6)

## 3. Project structure

```
hillview-tv-web/
  pages/                       # routes; `pages/api/` holds `health`, `monitor` (telemetry relay), `live-status` (Vimeo), `sitemap.xml`
  components/                  # UI (PascalCase)
  hooks/                       # `Query*` data hooks
  lib/                         # `video.ts` helpers (embed/content urls, Mux playback id, VTT parsing), `monitor-server.ts`, `monitor-relay.ts`
  services/                    # `http/requestHandler.ts` (axios `FetchAPI`), `monitor.service.ts` (browser Monitor)
  styles/                      # Tailwind v4 entry (`@import "tailwindcss"`, `@theme`) + base styles
  public/                      # static assets
  instrumentation.ts           # onRequestError → Monitor (Node runtime only)
  instrumentation-client.ts    # creates the browser Monitor before hydration
  next.config.*                # standalone output, image hosts, security headers
  Dockerfile                   # node:24-alpine build → standalone runner as uid 1001, HEALTHCHECK /api/health
  .github/workflows/push-to-registry.yml   # main → registry.appleby.cloud → Lattice redeploy
  Devfile.yaml                 # dev CLI commands
```

## 4. Running, building & testing

```bash
dev            # next dev
dev build      # next build
dev check      # lint + prettier --check + tsc --noEmit
```

| Variable              | Kind      | Purpose                                                                                                                    |
| --------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | build arg | https://api.hillview.tv                                                                                                    |
| `MONITOR_INGEST_URL`  | runtime   | Monitor ingest, `https://hillview-monitor-api.appleby.cloud/v1/events`. Unset = telemetry discarded (logged once a minute) |
| `MONITOR_API_KEY`     | runtime   | Ingest-scoped key minted on the **hillview** zone; server-side only                                                        |
| `MONITOR_ENV`         | runtime   | Event `env` (default `production`)                                                                                         |

`NEXT_PUBLIC_*` values are compiled into the bundle: they are Docker **build args** set in `push-to-registry.yml`, not Lattice env. Changing one needs a rebuild, not a redeploy. Locally, put them in `.env.local`.

## 5. How code is written here

- Data fetching is imperative (`useEffect` + service calls, or `getServerSideProps`) through the axios wrapper in `services/http/requestHandler.ts`; no SWR/React Query.
- Report errors with `reportError(name, error, data)` from `services/monitor.service.ts` in boundaries and catch blocks that change what the user sees. Never put form values, tokens or response bodies in event data.
- The Monitor ingest key never reaches the browser: the browser SDK posts to the same-origin `/api/monitor`, which validates the batch, forces `service` to `hillview-tv-web`, adds the key and forwards.
- Legacy codebase: some components predate the estate standards (e.g. component libraries, Pages Router). Don't extend those patterns.
- **Tailwind v4 CSS layering:** utilities live in `@layer utilities`, and unlayered CSS beats any layer. Put element-level rules (`html`, `body`, `a`, `*`, resets) inside `@layer base` in `styles/globals.css`, or they will override utility classes. Theme tokens go in `@theme`, not a JS config.

## 6. Domain & architecture

**Request flow:** Cloudflare (proxied, `hillview.tv` zone) → NPM proxy host → worker-5 `10.15.10.79:3010` → Next.js standalone server. Browser API calls go straight to `https://api.hillview.tv`.

**Player (Mux, moved from Cloudflare Stream Oct 2026):** `/watch` renders `<MuxPlayer>` for every Mux video (`mux_playback_id`, or a `https://stream.mux.com/{id}.m3u8` url — `getMuxPlaybackId`): on-demand, poster = the stored thumbnail unless it is the upload default, `metadata` = uuid/title for Mux Data, captions from the HLS text track. Transcript cues seek it and follow its `timeupdate`. Other urls (old Vimeo rows) fall back to an iframe or "unavailable"; there is no Cloudflare Stream code left. `getEmbedUrl` gives `https://player.mux.com/{id}` — the JSON-LD `embedUrl`, the sitemap `player_loc` and og:video. `image.mux.com` is an allowed `next/image` host and, with `stream.mux.com`, is preconnected in `_document.tsx`.

**Downloads:** the watch page links to `GET {NEXT_PUBLIC_API_URL}/video/v1.1/download/{uuid}` (hillviewVideoAPI), which 302s to a named presigned S3 or Mux MP4 link. The site no longer proxies video bytes (the old `/api/download` route was removed when the site left Vercel — it would have streamed every download over the studio's single WAN). The download is counted first with `POST /video/v1.1/recordDownload/{uuid}` sent as `fetch(..., { keepalive: true })` — **not** `FetchAPI`: the click navigates straight to `/download`, and that navigation cancelled the axios request, so downloads went uncounted and logged as Network Errors (Oct 2026).

**Caching:** SSR pages are cached at Cloudflare for 5 minutes and served stale for a day while revalidating; `/_next/static/*` is immutable; `/_next/image` responses are optimised on worker CPU (sharp) and cached both in the `hillview-tv-web-next-cache` volume and at Cloudflare. Purge the Cloudflare cache for hillview.tv after a content change that must show immediately.

### Monitor telemetry

Service **`hillview-tv-web`**, zone **`hillview`** (Lattice stack 37). Server-side events ship directly from the container; browser events go through `/api/monitor`. The server client is created lazily from runtime env and installs no process-wide handlers, so a crash still crashes the container.

| Event                                     | Level        | Meaning                                                                                                                                             |
| ----------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `server.request.error`                    | error        | a server render / API route threw (`instrumentation.ts` `onRequestError`): message, stack, digest, route, router kind                               |
| `client.error.boundary`                   | error        | a render error reached an error boundary                                                                                                            |
| `(uncaught errors, unhandled rejections)` | error        | captured by the browser SDK automatically                                                                                                           |
| `api.request.*`                           | warn / error | a failed axios call to the Hillview APIs, with the API's `X-Request-ID` so it joins the API's own `http.request.end`                                |
| `monitor.relay.rejected`                  | warn         | the relay refused a batch (`reason`: cross_origin, body_too_large, too_many_events, invalid_json, not_an_object) — at most once a minute per reason |

## 7. Ecosystem & related repos

- **Calls:** hillviewVideoAPI, hillviewCoreAPI, hillviewAuthAPI, hillviewLinksAPI, hillviewAssetsAPI (all at `api.hillview.tv`).
- **Siblings:** hillview-tv-web (hillview.tv), hillview-team-web (team.hillview.tv), hillview-live-web (watch.hillview.tv) — same Dockerfile, CI and Monitor wiring.
- **Monitor:** zone `hillview`; agents query it with `mcp__monitor_hillview__*`.

## 8. Operations

- **Lattice stack 38 "Hillview Web"** on worker-5 (id 8, `10.15.10.79`), container `hillview-tv-web`, host port `3010`. Stack env: `MONITOR_HILLVIEW_INGEST_URL` / `MONITOR_HILLVIEW_INGEST_KEY`.
- **CI:** push to `main` → `push-to-registry.yml`: registry credentials from Keyring (token `hillview-web-ci`, via `aidenappl/keyring-actions`), build on the shared `lattice-builder`, push `registry.appleby.cloud/hillview-tv-web:latest`, then `LATTICE_DEPLOY_URL?container=hillview-tv-web`. GitHub secrets: `KEYRING_URL`, `KEYRING_ACCESS_KEY_ID`, `KEYRING_SECRET_ACCESS_KEY`, `LATTICE_DEPLOY_URL`.
- Env or compose changes need a **stack Deploy** in Lattice; a CI container redeploy reuses the old config.
- **Edge:** Cloudflare DNS record (proxied) → NPM proxy host with the Cloudflare real-IP block and a Let's Encrypt certificate (DNS challenge).
- **Health:** `GET /api/health` (Docker HEALTHCHECK). **Errors:** Monitor zone hillview, `service: hillview-tv-web`. **Logs:** `lattice_get_container_logs`.
- The old Vercel project (`hillview-ms/hillview-tv-web`) is no longer serving traffic; don't redeploy it.

## 9. Rules & guardrails

- Never expose `MONITOR_API_KEY` to the browser or prefix it `NEXT_PUBLIC_`.
- Never proxy large files through this server — the studio has one WAN.
- Keep `lib/monitor-relay.ts` / `lib/monitor-server.ts` in step with the sibling Hillview web repos.

## 10. Verification

```bash
npx tsc --noEmit
npm run lint
npx prettier --check .
npx next build
```

`npm run lint`, `npx prettier --check .`, `npx tsc --noEmit` and `npm run build` also run in `.github/workflows/ci.yml` on every PR.

## 11. Keeping this file updated

Any change to structure, stack, commands, conventions, routes, env vars, events or deployment updates this file (and `README.md` where setup or role changed) in the same change.
