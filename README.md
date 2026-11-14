# FLEET//OS — Rami Bouchnag portfolio

A portfolio themed as a robot Fleet Management System console. On desktop the visitor
sends AMR-01 around a warehouse map (A* path planning) to open each section; on mobile,
or with the toggle, a classic single-column portfolio shows the same content.

Stack: Vite, React 18, TypeScript (strict), Tailwind CSS v3, Framer Motion, React Router, Vitest.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
```

Other commands:

```bash
npm run lint           # ESLint
npx tsc --noEmit       # type check
npm run test -- --run  # unit tests (A*, dispatch)
npm run build          # production build in dist/
npm run preview        # serve the production build
npm run og             # regenerate public/og-image.png
```

## Edit the content

All text (English and French) lives in one file: `src/data/content.ts`.
The map panels, the classic view and the printable CV at `/cv` all read from it.

- Edit both the `en` and `fr` objects so the two languages stay in sync.
- Wrap a phrase in `**double asterisks**` to highlight it.
- The warehouse layout (racks, station positions) is in `src/lib/grid.ts`.
- Never name client companies, client sites or client cities.
- The `cv/` folder (source PDF) is git-ignored on purpose: it holds private contact
  details and outdated wording. Do not copy it into `public/`.

## Where things are

```
src/data/content.ts            all copy, EN + FR, typed
src/lib/astar.ts               A* + path smoothing (tests: astar.test.ts)
src/lib/dispatch.ts            naive vs optimized task dispatch (tests: dispatch.test.ts)
src/lib/grid.ts                warehouse map definition
src/components/fleet/          Boot, FleetView, WarehouseMap, Robot, Hud, StationPanel
src/components/classic/        Hero, About, Experience, Projects, Skills, Education, Contact
src/components/playground/     OptimizerPlayground
src/components/CommandPalette.tsx
src/pages/Home.tsx, CvPrint.tsx
```

Keyboard: `1`–`6` send the robot to a station, `Ctrl/Cmd + K` opens the operator console
(`goto <section>`, `lang en|fr`, `view classic|fleet`, `cv`, `optimize`, `help`), `Esc` closes panels.

## Deploy to Vercel

1. Create an empty GitHub repo, then run `git remote add origin <url>` and `git push -u origin main`.
2. Go to vercel.com → **Add New → Project** → import the repo. The framework is auto-detected
   as **Vite** (build `npm run build`, output `dist`). Click **Deploy**.
3. ✅ Success: the URL loads, `/cv` loads directly (not a 404), and the language toggle works.
   ❌ If `/cv` shows a 404, `vercel.json` is missing from the repo root.
4. Optional: in Project → Settings → Domains, rename the project to get
   `rami-bouchnag.vercel.app`, and update the domain in `index.html`, `public/sitemap.xml`
   and `public/robots.txt`.
