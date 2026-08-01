# Copilot instructions for this repository

Purpose: help future Copilot sessions understand how to build, run, and make safe edits in this Next.js 15 + Prisma sample.

---

## Build, run, test, and lint (exact commands)

- Install: npm install
- Dev server: npm run dev  # runs next dev --turbo (localhost:3000)
- Build: npm run build
- Start (prod): npm run start
- Lint: npm run lint  # runs `next lint` using eslint.config.mjs

Prisma helpers (scripts in package.json):
- Open studio: npm run prisma.studio
- Run migrations (sqlserver): npm run prisma.migrate
- Push schema (sqlite or quick sync): npm run prisma.push
- Seed: npm run prisma.seed

Local SQLite development (Run locally without Postgres):
- A local SQLite DB is recommended for simple local development. This repo includes `prisma/schema.prisma` configured for sqlite and a `.env.local` with `DATABASE_URL=file:./prisma/dev.db`.
- Local setup commands (PowerShell):
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  npx pnpm install
  npx pnpm run prisma.push
  npx pnpm run prisma.seed
  npx pnpm run dev

Notes on adapter replacements: this repository uses the standard `@prisma/client` with Prisma's engines; there is no `@prisma/adapter-pg` present, so no adapter file edits are required. If you have a different setup that uses `@prisma/adapter-pg`, replace it with `@prisma/adapter-better-sqlite3` and follow the adapter's docs.

Tests: No test runner or test scripts are included in this repo. If tests are added later, run a single test with the project's chosen test command (e.g., `npx vitest <path/to/test>` or `npx jest <path/to/test>`).

Formatting: Prettier is configured (prettier, prettier-plugin-tailwindcss). Run with:
- npx prettier --write .

---

## High-level architecture (big picture)

- Framework: Next.js 15 (App Router) + React 19 Server Components.
- Routing: app/ uses file-based routes. Each route folder usually contains page.tsx and optionally layout.tsx, loading.tsx, error.tsx, not-found.tsx.
- Route groups: parentheses (e.g., `(demo)`) create route groups that do not affect the URL.
- Dynamic routes: bracket folders like `jokes/[jokeid]` expose route params.
- Data layer separation:
  - data/services/* — server-side read-only fetches
  - data/actions/*  — server actions/mutations (Server Functions; these use `use server`/Server Actions)
- UI components:
  - Shared components live in /components
  - Route-local components live in route `_components` folders (e.g., app/(demo)/_components)
- DB: Prisma is used. prisma/schema.prisma defaults to sqlserver; the project contains prisma/migrations and seed.ts.
- Prisma client: db.ts exports a singleton PrismaClient for dev to avoid connection proliferation.
- Styling: TailwindCSS (tailwind.config.ts) + utilities (utils/style.ts). Use the cn utility when merging classes.

---

## Key repo conventions and patterns

- Naming:
  - Components: PascalCase
  - Folders: kebab-case
  - Other files: camelCase
- Route-local folders prefixed with `_` (e.g., `_components`, `_hooks`) are for items scoped to that route.
- Server actions (mutations) are implemented as Server Functions under `data/actions` or inside route `_actions` files; they run on the server — take care not to leak secrets or return server-only values to client code.
- Use `not-found.tsx` and `error.tsx` in routes for 404 and error handling rather than throwing raw errors.
- DB environment:
  - Check .env.sample for expected env vars (DATABASE_URL, SHADOW_DATABASE_URL if using sqlserver).
  - README notes: if switching to sqlite, update schema.prisma and remove prisma/migrations before migrating.
- TypeScript path alias: `@/*` maps to repo root (tsconfig.json) — Copilot should prefer repo-root imports when searching.
- ESLint: central config is `eslint.config.mjs` (Flat config, plugins including react-compiler, autofix, sort-keys-fix). Copilot should respect these rules when suggesting edits.

---

## Files and places to inspect when making changes

- App routes and demos: app/ (includes the `(demo)` group for advanced examples)
- Shared components: components/
- Data access: data/services/ and data/actions/ (server-only logic)
- Prisma schema and seeds: prisma/schema.prisma and prisma/seed.ts
- Global DB client: db.ts (singleton pattern)
- ESLint and formatting: eslint.config.mjs, .prettierrc

---

## Safety notes for Copilot edits

- Do not move server-only code to client bundles. Files in data/actions and server code using `use server` must remain server-only.
- When changing Prisma schema or migrations: back up `prisma/migrations` if switching provider; follow README steps.
- Avoid introducing long-running synchronous work in Server Functions; prefer async patterns.

---

## Useful quick commands for single-file or scoped runs

- Lint a specific file (delegate to Next/Eslint): `npx next lint <path/to/file-or-dir>`
- Run Prettier on a single file: `npx prettier --write path/to/file`
- Open Prisma Studio scoped to DB: npm run prisma.studio

---

Playwright and CI (scaffolding added): The repository now includes recommended Playwright scaffolding and a sample GitHub Actions workflow to run E2E tests.

- Playwright config: playwright.config.ts (baseURL defaults to http://localhost:3000). Install Playwright in your local dev environment with `npm i -D @playwright/test` and the browsers with `npx playwright install`.
- Sample test: tests/example.spec.ts — a basic smoke test that checks the homepage header.
- CI workflow: .github/workflows/e2e.yml — builds the app, uses an SQLite file DB (DATABASE_URL=file:./test.db), runs `npx prisma db push` and `npx prisma generate`, starts the app, and runs `npx playwright test`. Review the workflow and adjust sleep/wait logic or add wait-on/start-server-and-test for more robust startup handling.

If you want additional coverage (examples: how to add tests, customize CI, or add other MCP servers), say which area to add and Copilot will extend this file.


<!-- headroom:rtk-instructions -->
# RTK (Rust Token Killer) - Token-Optimized Commands

When running shell commands, **always prefix with `rtk`**. This reduces context
usage by 60-90% with zero behavior change. If rtk has no filter for a command,
it passes through unchanged — so it is always safe to use.

## Key Commands
```bash
# Git (59-80% savings)
rtk git status          rtk git diff            rtk git log

# Files & Search (60-75% savings)
rtk ls <path>           rtk read <file>         rtk grep <pattern>
rtk find <pattern>      rtk diff <file>

# Test (90-99% savings) — shows failures only
rtk pytest tests/       rtk cargo test          rtk test <cmd>

# Build & Lint (80-90% savings) — shows errors only
rtk tsc                 rtk lint                rtk cargo build
rtk prettier --check    rtk mypy                rtk ruff check

# Analysis (70-90% savings)
rtk err <cmd>           rtk log <file>          rtk json <file>
rtk summary <cmd>       rtk deps                rtk env

# GitHub (26-87% savings)
rtk gh pr view <n>      rtk gh run list         rtk gh issue list

# Infrastructure (85% savings)
rtk docker ps           rtk kubectl get         rtk docker logs <c>

# Package managers (70-90% savings)
rtk pip list            rtk pnpm install        rtk npm run <script>
```

## Rules
- In command chains, prefix each segment: `rtk git add . && rtk git commit -m "msg"`
- For debugging, use raw command without rtk prefix
- `rtk proxy <cmd>` runs command without filtering but tracks usage
<!-- /headroom:rtk-instructions -->
