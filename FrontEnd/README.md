# My Winter Car WR - FrontEnd

React + TypeScript client for the My Winter Car world-record platform.

## Running

```bash
cp .env.example .env.local
npm install
npm run dev
```

The app runs on http://localhost:5173 and talks to the backend configured in `VITE_API_URL` (default `http://localhost:8080`).

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run test` | Unit tests (Vitest) |
| `npm run lint` | Lint (oxlint) |
| `npm run build` | Type check and production build |
| `npm run format` | Format with Prettier |

In development, `/ui` shows the UI kit (palette, typography, icons and components).
