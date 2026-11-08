# My Winter Car WR - FrontEnd

React + TypeScript client for the My Winter Car world-record platform. Players browse the leaderboards and submit runs; moderators verify runs and follow the activity on a dashboard. The Spring Boot API lives in `../Backend/mwcWR/wr`.

## Features

| Area | Routes | Access |
| --- | --- | --- |
| Landing, categories and leaderboards (podium, ranking, run video) | `/`, `/categories`, `/leaderboard/:category` | Public |
| Login and sign up (country picker, session expiry) | `/login`, `/signup` | Public |
| Run submission wizard (category, video with preview, time, description, review) | `/submit/:category?` | Players and moderators |
| Verification queue, run verification (approve / reject, keyboard shortcuts) and review history | `/moderation/queue`, `/moderation/attempts/:id`, `/moderation/history` | Moderators |
| Dashboard (submissions per day, runs per category, review outcomes) | `/moderation/dashboard` | Moderators |

## Stack

- Vite, React 19 and TypeScript (strict)
- Tailwind CSS v4 with the design tokens in `src/styles/index.css`
- React Router (lazy loaded routes), TanStack Query, react-hook-form and zod
- Recharts (dashboard only), lucide-react icons, flag-icons SVGs, sonner toasts
- Vitest and Testing Library, oxlint, Prettier

## Running

Requirements: Node 22+ and the backend running (see `../Backend`).

```bash
cp .env.example .env.local
npm install
npm run dev
```

The app runs on http://localhost:5173 and talks to the API configured in `.env.local`:

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:8080` | Base URL of the backend. Its CORS configuration must allow the frontend origin. |

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run test` | Unit and component tests (Vitest) |
| `npm run lint` | Lint (oxlint) |
| `npm run build` | Type check and production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run format` | Format with Prettier (also sorts Tailwind classes) |

## Project structure

```
src/
  app/           router, providers and layouts
  components/    ui/ (generic components) and layout/ (header, page container, skip link)
  features/      one folder per domain: landing, categories, leaderboard, auth, submit, moderation, dashboard
  lib/           framework-free helpers: http client, JWT, time, video links, countries
  styles/        Tailwind entry and design tokens
  test/          test setup and render helpers
```

Each feature keeps its API calls and TanStack Query hooks in `api.ts` and mirrors the backend DTOs in `types.ts`. Conventions for contributors (and AI assistants) are in [`CLAUDE.md`](./CLAUDE.md).

In development, `/ui` shows the UI kit (palette, typography, icons and components).
