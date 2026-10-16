# hillview-tv-web

The public HillviewTV site — the video archive, playlists, live status and newsletter for Hillview Middle School's student broadcast.

> **Hillview platform** · Next.js app · hillview.tv (Lattice stack 38)

---

## Overview

The public site at **hillview.tv**: homepage spotlight, the video archive (`/content`, `/watch`, `/videos/v/[video]`), playlists, the live badge, newsletter sign-up and a sitemap. Server-rendered with `getServerSideProps`; every SSR page sets `Cache-Control: public, s-maxage=300, stale-while-revalidate=86400`, which **Cloudflare** caches (a cache rule on the hillview.tv zone makes HTML eligible). It reads from the Hillview APIs and owns no data.

## Role in the Hillview ecosystem

One of three Hillview web apps (hillview.tv, team.hillview.tv, watch.hillview.tv) in front of the five Hillview Go APIs at `api.hillview.tv`. Reports to Monitor zone **hillview** as `hillview-tv-web`.

## Tech stack

Next.js 16 (**Pages Router**), React 18, Tailwind CSS v3, TypeScript, axios (`services/http/requestHandler.ts`), Font Awesome (free), react-hot-toast, `@aidenappleby/monitor-js` · Docker · Lattice

## Getting started

### Prerequisites

Node 24, the `dev` CLI.

### Setup

```bash
npm install
cp .env.example .env.local   # where present; see AGENTS.md §4 for the variables
dev
```

## Development

| Command         | What it does                    |
| --------------- | ------------------------------- |
| `dev`           | Start the dev server            |
| `dev build`     | Production build                |
| `dev lint`      | ESLint                          |
| `dev format`    | Prettier                        |
| `dev typecheck` | `tsc --noEmit`                  |
| `dev check`     | lint + format check + typecheck |

## Project structure

See [AGENTS.md §3](AGENTS.md#3-project-structure).

## Deployment

Push to `main` → GitHub Actions builds `registry.appleby.cloud/hillview-tv-web:latest` → Lattice stack 38 redeploys the container (worker-5, port 3010).

## Contributing & further reading

- [AGENTS.md](AGENTS.md) — conventions, telemetry, operations
- Related: hillview-tv-web, hillview-team-web, hillview-live-web, hillviewVideoAPI, hillviewCoreAPI, hillviewAuthAPI
