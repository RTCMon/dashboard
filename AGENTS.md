 # Project Overview
 RTCMon Dashboard is a compact React + TypeScript single-page app (Vite) that
 visualizes telemetry and analytics produced by the RTCMon backend. It offers
 operator-focused dashboards, metric cards, and charts to inspect WebRTC
 telemetry and diagnose trends. > TODO: add supported browsers and canonical
 deployment targets.

 ## Repository Structure
 - `public/` — static files and assets served with the production build.
 - `src/` — application source: components, contexts, styles, and utilities.
   - `src/assets/` — images and other static imports.
   - `src/components/` — pages and feature components.
   - `src/components/ui/` — small, shared presentational components.
   - `src/context/` — React context providers (theme, flags, global state).
   - `src/lib/` — API client and helper utilities (eg. `api.ts`).
 - `docs/` — architecture, product, and reference documentation.
 - `plans/` — feature plans and implementation notes.
 - `package.json` — npm scripts and dependency manifest.
 - `tsconfig.app.json`, `tsconfig.json`, `tsconfig.node.json` — TypeScript configs.
 - `vite.config.ts` — Vite dev server and build configuration.
 - `eslint.config.js` — ESLint configuration.
 - `README.md` — project quickstart and overview.
 - `AGENTS.md` — this file (agent guidance and repo summary).
 - `CLAUDE.md` — local agent notes.
 > TODO: list CI and infra files if present upstream.

 ## Build & Development Commands
 1. Install dependencies
 ```bash
 npm install
 # or
 yarn
 ```
 2. Development (hot reload)
 ```bash
 npm run dev
 # TODO: confirm `dev` script in package.json and preserve it verbatim
 ```
 3. Type-check
 ```bash
 npm run type-check
 # or: npx tsc --noEmit
 # TODO: confirm `type-check` script
 ```
 4. Lint
 ```bash
 npm run lint
 # TODO: confirm `lint` script
 ```
 5. Unit tests
 ```bash
 npm test
 # TODO: configure test runner (Vitest or Jest) if not present
 ```
 6. Build production bundle
 ```bash
 npm run build
 ```
 7. Preview production build
 ```bash
 npm run preview
 # TODO: confirm `preview` script
 ```
 8. Debugging
 ```bash
 # Run dev server and attach browser/IDE debuggers
 npm run dev
 ```
 9. Deploy
 - > TODO: add canonical deploy instructions (Docker, static host, CDN).
 - Typical: `npm run build` then publish `dist/` to hosting.

 ## Code Style & Conventions
 - Formatting: follow Prettier where configured. > TODO: add `.prettierrc` if
   missing.
 - Linting: ESLint configured via `eslint.config.js`. Run `npm run lint` and
   `npm run lint -- --fix` where available.
 - TypeScript: follow `tsconfig*.json`. Run type checks before merging.
 - Naming and structure:
   - Components and files: PascalCase (e.g., `StatCard.tsx`).
   - Hooks: `use` prefix (e.g., `useTheme`).
   - Shared UI primitives in `src/components/ui/`.
 - CSS: prefer scoped or module styles; global styles in `src/index.css` and
   `App.css`.
 - Commit messages: follow Conventional Commits (recommended):
   - `<type>(scope?): subject` — e.g., `feat(ui): add StatCard loading state`.
 - Branching & reviews: > TODO: add repo-specific branch protection policy.
   All changes to `main` require an approved PR.

 ## Architecture Notes
 ```mermaid
 flowchart LR
   Browser["Browser (user)"] -->|HTTP| CDN["Static host / CDN"]
   Browser -->|API| Client["RTCMon Dashboard (React SPA)"]
   Client -->|REST / RPC| Backend["RTCMon backend (ingest & query)"]
   Backend --> DB["Database / TSDB"]
   Backend --> Ingest["Ingest pipeline / processors"]
 ```
 - The SPA is a client-side app: UI in `src/components`, state in
   `src/context`, API integration in `src/lib/api.ts`.
 - Data flow: Browser → React UI → `src/lib/api.ts` → backend endpoints →
   storage (DB / TSDB).
 - Dev: Vite runs HMR. Prod: static `dist/` served by static host/CDN.
 - > TODO: add backend sequence diagrams and auth details when available.

 ## Testing Strategy
 - Unit tests: use Vitest or Jest for components and utilities.
 - Integration: validate `src/lib/api.ts` with staging or mocked backends.
 - E2E: Playwright or Cypress for critical UI flows (login, metrics, charts).
 - CI should run: install, type-check, lint, tests, build.
 - Commands:
 ```bash
 npm run type-check
 npm run lint
 npm test
 # E2E (example): TODO: add Playwright/Cypress scripts
 ```
 > TODO: add example CI workflow (GitHub Actions) in `.github/workflows/`.

 ## Security & Compliance
 - Secrets: keep secrets in environment variables and secret stores; never
   commit `.env` or secret files. Add `.env` to `.gitignore`.
 - Client: never embed private keys in front-end bundles.
 - Dependency scanning: run `npm audit` and enable Dependabot / Snyk in CI.
 - XSS/CSP: avoid `dangerouslySetInnerHTML`; enforce CSP in hosting layer.
 - Data privacy: telemetry may contain sensitive info — follow backend
   retention and redaction policies. > TODO: link privacy docs.
 - License: > TODO: confirm license in `package.json` or `LICENSE`.

 ## Agent Guardrails
 - Do NOT modify without explicit human approval: `docs/`, `plans/`,
   `AGENTS.md`, `README.md`, and any secret or key files (`*.key`, `*.pem`).
 - Changes to CI, deployment, or security-related code require at least one
   human reviewer before merge.
 - Agents must not invent secrets; add `> TODO:` markers when facts are
   missing.
 - Avoid load against production telemetry endpoints; use staging/mocks for
   automated tests.
 - Agents may open draft PRs with suggested changes but must not merge them.

 ## Extensibility Hooks
 - Environment variables:
   - `VITE_API_BASE` — suggested API base URL for `src/lib/api.ts`.
   - `NODE_ENV` — standard build mode.
   - > TODO: confirm exact env var names used in the code.
 - Feature flags: implement a provider under `src/context/` or use
   `localStorage`-backed flags for runtime toggles.
 - Plugin points:
   - `src/lib/api.ts` for swapping endpoints or auth flows.
   - `vite.config.ts` for build-time plugins and transforms.
 - Theming extension point: `src/context/ThemeContext.tsx`.

 ## Further Reading
 - [README.md](README.md) — quickstart and overview.
 - [docs/](docs/) — architecture and product docs.
 - [plans/](plans/) — feature plans and walkthroughs.
 - [src/main.tsx](src/main.tsx) — app entry.
 - [src/lib/api.ts](src/lib/api.ts) — API client.
 - [src/context/ThemeContext.tsx](src/context/ThemeContext.tsx) — theme provider.
 - [src/components/ui/](src/components/ui/) — shared UI components.
 > TODO: add ADRs, CI workflow links, and license references when available.
