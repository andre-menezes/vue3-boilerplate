# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
# Development (runs on port 8080)
yarn dev

# Mock API server (runs on port 3000)
yarn server

# Type-check + build
yarn build

# Unit tests (watch mode)
yarn test

# Run tests once
yarn test:run

# Run a single test file
yarn test:run src/path/to/file.spec.ts

# Test coverage
yarn test:coverage

# E2E tests (requires both dev server and API server running)
yarn test:e2e

# Lint
yarn lint
```

Always use `yarn` — never `npm` or `pnpm`.

## Architecture

**Stack:** Vue 3 (Composition API) + TypeScript + Vite + Pinia + Vue Router 5 + Tailwind v4 + vue-i18n

**Entry flow:** `src/main.ts` → `loadPlugins()` (registers Pinia, Router, i18n, and all UI components globally) → mounts `App.vue`.

**Path aliases** (defined in both `vite.config.ts` and `vitest.config.ts`):

| Alias                                              | Path                      |
| -------------------------------------------------- | ------------------------- |
| `@`                                                | `src/`                    |
| `@components`                                      | `src/components/`         |
| `@pages`                                           | `src/pages/`              |
| `@stores`                                          | `src/stores/`             |
| `@services`                                        | `src/services/`           |
| `@app-types`                                       | `src/types/`              |
| `@composables`, `@i18n`, `@router`, `@utils`, etc. | respective `src/` subdirs |

**Auth flow:** `useAuthStore` (Pinia, persisted via `pinia-plugin-persistedstate`) stores JWT token. The axios instance in `src/services/http.ts` attaches the token to every request and redirects to Login on 401. The router guard in `src/router/index.ts` waits 50ms for persisted state to hydrate before checking `isAuthenticated`.

**UI component library:** `src/components/ui/` exports `AppButton`, `AppInput`, `AppTextarea`, `AppCard`, `AppBadge`, `AppAlert`, `AppModal`, `AppSpinner`. All are registered globally in `loadPlugins()` — use them without importing. The `/ui` route (`DocsLayout` + doc pages) provides a live design system reference.

**Mock API server:** `server.js` uses tinyhttp + lowdb + jsonwebtoken. Data is persisted in `db.json`. Test credentials: `admin@example.com` / `user@example.com`, password `123456` for both. The API runs on `http://localhost:3000`.

**i18n:** Default locale is `pt-BR`, fallback is `en-US`. Locale files live in `src/i18n/locales/`.

## CSS conventions

- Tailwind v4 — use `@theme` tokens defined in `src/style.css`, not hardcoded hex values.
- Semantic CSS variables (e.g. `--color-brand`, `--color-surface`, `--color-text-primary`) are defined in `:root` and should be preferred over raw palette tokens.
- Reusable component classes (`.btn`, `.btn-primary`, `.input`, `.card`, `.badge`, `.alert`) are defined in `src/style.css` — use them before writing one-off Tailwind classes.
- Mobile-first breakpoints.

## Commit conventions

Commits follow Conventional Commits (`@commitlint/config-conventional`). Husky runs lint-staged on pre-commit.

## Branch and PR workflow

- Keep `main` stable. Do not create feature, fix, test, chore, or docs work directly from `main`.
- Use `develop` as the integration branch. Before starting work, update it with `git switch develop` and `git pull --ff-only origin develop`.
- Create one branch per change from `develop`, using kebab-case:
  - `feature/descricao-curta` for new functionality
  - `fix/descricao-curta` for bug fixes
  - `chore/descricao-curta` for maintenance and configuration
  - `test/descricao-curta` for test-focused changes
  - `docs/descricao-curta` for documentation
- Open pull requests from work branches into `develop` by default.
- Open pull requests from `develop` into `main` only when the integrated version is ready for release.
- Run the relevant `yarn` checks before pushing or opening a PR. For code changes, use at least `yarn lint`, `yarn test:run`, and `yarn build`; include `yarn test:e2e` when the change affects routed user flows.
