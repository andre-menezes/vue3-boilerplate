# Vue3 Boilerplate

Boilerplate Vue 3 com TypeScript, Vite, Pinia, Vue Router, Tailwind CSS v4, vue-i18n, autenticação JWT e testes automatizados.

## Stack

- Vue 3 com Composition API e `<script setup>`
- TypeScript
- Vite
- Pinia com persistência em `localStorage`
- Vue Router com guards de autenticação
- Tailwind CSS v4
- vue-i18n com `pt-BR` e `en-US`
- Axios com interceptors para JWT
- Vitest, Vue Test Utils e Playwright

## Requisitos

- Node.js compatível com as versões definidas no `yarn.lock`
- Yarn

Use sempre `yarn`. Não use `npm` ou `pnpm` neste projeto.

## Instalação

```bash
yarn install
```

## Scripts

```bash
# Frontend em http://localhost:8080
yarn dev

# API mock em http://localhost:3000
yarn server

# Type-check + build
yarn build

# Testes unitários/componentes em watch mode
yarn test

# Testes unitários/componentes uma vez
yarn test:run

# Cobertura
yarn test:coverage

# E2E com Playwright
yarn test:e2e

# Lint
yarn lint
```

## Autenticação

O fluxo de autenticação usa `useAuthStore` com persistência via `pinia-plugin-persistedstate`.

- `src/services/http.ts` adiciona `Authorization: Bearer <token>` nas requisições autenticadas.
- Respostas `401` limpam a autenticação e redirecionam para Login.
- `src/router/index.ts` protege a rota Home e redireciona usuários autenticados para fora de Login.

Credenciais locais de teste:

- `admin@example.com` / `123456`
- `user@example.com` / `123456`

## API mock

`server.js` expõe:

- `POST /login`
- `POST /register`
- `GET /users`
- `GET /users/:id`

Os dados são persistidos em `db.json`.

## Estrutura

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

## Testes

- Vitest cobre stores, services, router e componentes/páginas principais.
- Playwright cobre o fluxo de autenticação pelo navegador com chamadas de autenticação mockadas.
- A cobertura mínima é configurada em `vitest.config.ts`.

## Branching workflow

`main` é a branch estável. O trabalho diário parte de `develop`, e pull requests devem mirar `develop` por padrão.

Use uma branch por mudança:

- `feature/descricao-curta`
- `fix/descricao-curta`
- `chore/descricao-curta`
- `test/descricao-curta`
- `docs/descricao-curta`

Mantenha descrições curtas, em kebab-case e sem acentos. Quando `develop` estiver pronta para release, abra um PR de `develop` para `main`.
