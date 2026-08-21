# AGENTS.md

This file provides guidance to Codex when working with code in this repository.

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

# Lint
yarn lint
```

Always use `yarn` — never `npm` or `pnpm`.

## Architecture

**Stack:** Vue 3 (Composition API) + TypeScript + Vite + Pinia + Vue Router + Tailwind v4 + vue-i18n

**Entry flow:** `src/main.ts` → `loadPlugins()` (registers Pinia, Router, and i18n) → mounts `App.vue`.

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

**Auth flow:** `useAuthStore` (Pinia, persisted via `pinia-plugin-persistedstate`) stores the JWT token and user. The axios instance in `src/services/http.ts` attaches the token to every request and redirects to Login on 401. The router guard in `src/router/index.ts` relies on the synchronously restored persisted store before checking `isAuthenticated` and admin-only route metadata.

**Mock API server:** `server.js` uses `@tinyhttp/app`, `@tinyhttp/cors`, `milliparsec`, `lowdb`, `jsonwebtoken`, and `uuid`. Data is persisted in ignored local `db.json`. Test credentials: `admin@example.com` / `user@example.com`, password `123456` for both. The API runs on `http://localhost:3000`. `POST /login` and `POST /register` are public; `/profile` requires any JWT; `/users` and `/audit-logs` require an admin JWT. User responses never return `password`. Passwords are plain text in the mock API only for local development clarity.

**Environment:** local defaults are documented in `.env.example`. The frontend reads `VITE_API_BASE_URL`; the mock API reads `API_PORT` and `JWT_SECRET`.

**i18n:** Default locale is `pt-BR`, fallback is `en-US`. Locale files live in `src/i18n/locales/`.

## CSS conventions

- Tailwind v4 — use `@theme` tokens defined in `src/style.css`, not hardcoded hex values.
- Semantic CSS variables (e.g. `--color-brand`, `--color-surface`, `--color-text-primary`) are defined in `:root` and should be preferred over raw palette tokens.
- Mobile-first breakpoints.

## HTTP Requests & Composables

**useFetch:** Generic composable for making HTTP requests with method-chaining, always returns `{ data, error, loading }` without throwing exceptions.

**Usage patterns:**

```typescript
// Single GET request
const { data, error, loading } = await useFetch().get<User>('/users/1');
if (error) console.error('Failed to fetch user:', error);
else console.log('User:', data);

// POST with payload
const { data, error, loading } = await useFetch().post<User>('/users', {
  name: 'Jane Doe',
  email: 'jane@example.com',
  password: '123456',
});

// PATCH for updates
const { data, error, loading } = await useFetch().patch<User>('/profile', {
  name: 'Updated Name',
});

// DELETE request
const { data, error, loading } = await useFetch().del<void>(`/users/${userId}`);

// Method chaining (sequential requests)
const usersList = await useFetch().get<User[]>('/users');
if (usersList.error) return;

const newUser = await useFetch().post<User>('/users', { name: 'Bob' });
if (newUser.error) return;

console.log('Created:', newUser.data);
```

**Response structure:** All methods return `{ data: T | null, error: string | null, loading: Ref<boolean> }`:

- **data** — parsed response body or `null` if error occurred
- **error** — error message string or `null` on success
- **loading** — reactive boolean ref (starts `true`, ends `false`)

**Error extraction:** Errors are automatically extracted from the API response's `error` field (e.g. `{ error: 'Email already exists' }`). If no `error` field exists, falls back to `error.message`.

**Type safety:** All methods are fully generic — use `.get<User>()`, `.post<AuthResponse>()`, etc. to get typed data.

**Token injection:** The axios instance (`src/services/instance.ts`) automatically injects `Authorization: Bearer {token}` headers if the user is authenticated. On 401, the store logs out and redirects to Login.

## Commit conventions

Commits follow Conventional Commits (`@commitlint/config-conventional`). Husky runs lint-staged on pre-commit.

## Branch and PR workflow

- Keep `main` stable. Do not create feature, fix, test, chore, or docs work directly from `main`.
- Use `develop` as the integration branch. Before starting work, update it with `git switch develop` and `git pull --ff-only origin develop`.
- Create one branch per change from `develop`, using kebab-case:
  - `feature/short-description` for new functionality
  - `fix/short-description` for bug fixes
  - `chore/short-description` for maintenance and configuration
  - `test/short-description` for test-focused changes
  - `docs/short-description` for documentation
- Open pull requests from work branches into `develop` by default.
- Open pull requests from `develop` into `main` only when the integrated version is ready for release.
- Run the relevant `yarn` checks before pushing or opening a PR. For code changes, use at least `yarn lint`, `yarn test:run`, and `yarn build`.
