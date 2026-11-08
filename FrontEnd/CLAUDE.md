# FrontEnd - My Winter Car WR

React SPA for the My Winter Car world-record platform. The backend lives in `../Backend/mwcWR/wr` (Spring Boot) and is the source of truth for every contract.

## Stack
- Vite + React 19 + TypeScript (strict)
- Tailwind CSS v4 (tokens in `src/styles/index.css` under `@theme`)
- React Router, TanStack Query, react-hook-form + zod, sonner (toasts)
- lucide-react (icons), flag-icons (country flags)
- Vitest + Testing Library, oxlint, Prettier

## Commands
- `npm run dev` - dev server on http://localhost:5173 (backend expected on `VITE_API_URL`, default http://localhost:8080)
- `npm run test` - unit tests
- `npm run lint` - oxlint
- `npm run build` - type check + production build
- `npm run format` - Prettier (sorts Tailwind classes)

Before finishing a change: `npm run lint && npm run test && npm run build`.

## Structure
- `src/app` - router, providers, layouts
- `src/components/ui` - generic presentational components (Button, Card, Chip, Input, Avatar, Flag, feedback states). Never call the API here.
- `src/components/layout` - Header, PageContainer, Sidebar
- `src/features/<feature>` - pages and components of one domain area, plus `api.ts` (requests + query/mutation hooks) and `types.ts` (mirrors backend DTOs)
- `src/lib` - framework-free helpers: `http.ts`, `jwt.ts`, `time.ts`, `video.ts`, `countries.ts`, `cn.ts`
- `src/assets` - images exported from the Figma file

Pages compose feature components; feature components compose `ui` components. Data fetching only through TanStack Query hooks in `features/*/api.ts`, all requests through `lib/http.ts`.

## Design rules
- Use only theme tokens (`bg-surface`, `text-muted`, `bg-accent`, `--color-cat-*`...). No loose hex values in components.
- Icons only from lucide-react; flags only through the `Flag` component.
- Category labels, colors and images come from `features/categories/categories.ts`.
- Keep the Figma layout; interaction improvements (hover, transitions, skeletons, empty states) are welcome.
- UI text is in English.
- Accessible by default: labels on inputs, `aria-*` on icon-only buttons, visible focus.

## Backend contracts
- Categories used by the UI: `RALLY`, `ICE_RACE`, `FULL_ASSEMBLY`, `DEATH`. The backend also has `RALLY_RACE`, intentionally unused for now.
- Typography: Freeman (Google Fonts, single weight); weight synthesis is disabled, so `font-bold` does not fake bold.
- Roles: `USER`, `MODERATOR`, `ADMIN`. The backend checks roles per route (no hierarchy).
- Login returns `{ token, username }`; the JWT carries `id`, `email`, `username`, `role`. Register returns no body, so the UI logs in right after registering.
- Session: token in `localStorage` (`mwc.token`), managed by `features/auth/AuthProvider`; read it with `useAuth()`. Protect routes with `<RequireAuth roles={[...]}>`.
- Login failures (unknown email or wrong password) return 401 with a generic message.
- Registration rules (validated in both front and backend): valid email, password 8-128 chars, username 3-20 chars with letters, numbers, `-` and `_`, ISO-2 country.
- Attempt time is sent as `HH:mm:ss` or `HH:mm:ss.SS` (`lib/time.ts`).
- `POST /attempt/submit` and `GET /attempt/me` accept `USER` and `MODERATOR` (admins cannot play). Submit returns no body and answers 409 when the user already has a pending attempt; `/attempt/me` lists the user's attempts, newest first. Moderators cannot review their own attempts (403). The submit wizard lives in `features/submit` (route `/submit/:category?`).
- Video links: YouTube or Twitch only (`lib/video.ts` mirrors the backend rule).
- Errors come as `{ errorMessage, errorCode }` and are turned into `ApiError`.

## Code style
- No code comments of any kind; names must explain the code.
- No `any`. Prefer small components and explicit props.
- Commits: Conventional Commits, directly on `main`, no co-author lines.
