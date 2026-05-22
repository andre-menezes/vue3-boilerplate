# Vue3 Boilerplate

Vue 3 boilerplate with TypeScript, Vite, Pinia, Vue Router, Tailwind CSS v4, vue-i18n, JWT authentication, and automated tests.

## Stack

- Vue 3 with Composition API and `<script setup>`
- TypeScript
- Vite
- Pinia with `localStorage` persistence
- Vue Router with authentication guards
- Tailwind CSS v4
- vue-i18n with `pt-BR` and `en-US`
- Axios with JWT interceptors
- Vitest, Vue Test Utils, and Playwright

## Requirements

- Node.js compatible with the versions locked in `yarn.lock`
- Yarn

Always use `yarn`. Do not use `npm` or `pnpm` in this project.

## Installation

```bash
yarn install
```

Copy `.env.example` to `.env` if you need to override local defaults.

## Scripts

```bash
# Frontend at http://localhost:8080
yarn dev

# Mock API at http://localhost:3000
yarn server

# Type-check + build
yarn build

# Unit/component tests in watch mode
yarn test

# Unit/component tests once
yarn test:run

# Coverage
yarn test:coverage

# E2E with Playwright
yarn test:e2e

# Lint
yarn lint
```

## Authentication

The authentication flow uses `useAuthStore` with persistence through `pinia-plugin-persistedstate`.

- `src/services/http.ts` adds `Authorization: Bearer <token>` to authenticated requests.
- `401` responses clear authentication and redirect to Login.
- `src/router/index.ts` protects the Home route and redirects authenticated users away from Login.

Local test credentials:

- `admin@example.com` / `123456`
- `user@example.com` / `123456`

## API mock

`server.js` exposes:

- `POST /login`
- `POST /register`
- `GET /users`
- `GET /users/:id`

Data is persisted in `db.json`.

## Environment variables

| Variable            | Default                 | Description                 |
| ------------------- | ----------------------- | --------------------------- |
| `VITE_API_BASE_URL` | `http://localhost:3000` | Frontend API base URL       |
| `API_PORT`          | `3000`                  | Mock API server port        |
| `JWT_SECRET`        | `dev-secret-change-me`  | JWT signing secret for mock |

## Structure

```text
src/
├── assets/
├── components/
├── i18n/
├── pages/
├── plugins/
├── router/
├── services/
├── stores/
├── types/
├── App.vue
├── main.ts
└── style.css
```

## Tests

- Vitest covers stores, services, router, and the main components/pages.
- Playwright covers the browser authentication flow with mocked authentication calls.
- Minimum coverage thresholds are configured in `vitest.config.ts`.

## Continuous integration

GitHub Actions runs on pull requests and pushes targeting `develop` or `main`.

The CI workflow installs dependencies with Yarn, then runs lint, coverage, build, and Playwright E2E checks.

## Branching workflow

`main` is the stable branch. Daily work starts from `develop`, and pull requests should target `develop` by default.

Use one branch per change:

- `feature/short-description`
- `fix/short-description`
- `chore/short-description`
- `test/short-description`
- `docs/short-description`

Keep descriptions short and in kebab-case. When `develop` is ready for release, open a PR from `develop` into `main`.
