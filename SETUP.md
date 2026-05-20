# Vue 3 + TypeScript + Vite + JSON Server com JWT

Este é um boilerplate completo para construir aplicações Vue 3 modernas com autenticação JWT usando JSON Server.

## 🚀 Características

- **Vue 3** com Composition API
- **TypeScript** para type safety
- **Vite** para desenvolvimento rápido
- **Pinia** para gerenciamento de estado com persistência em localStorage
- **Vue Router** com proteção de rotas
- **Vue I18n** para internacionalização (pt-BR e en-US)
- **JSON Server** com autenticação JWT
- **Axios** com interceptadores para JWT automático
- **Tailwind CSS** para styling
- **ESLint** e **Prettier** para qualidade de código

## 📦 Instalação

```bash
# Instalar dependências
yarn install
# ou
npm install
```

## 🔧 Setup

### Backend (JSON Server com JWT)

1. **Iniciar o servidor JSON:**

```bash
yarn server
# ou
npm run server
```

Isso iniciará o servidor em `http://localhost:3000`

**Credenciais de teste incluídas em `db.json`:**

- Email: `admin@example.com` | Password: `123456`
- Email: `user@example.com` | Password: `123456`

### Frontend (Vue App)

Em outro terminal:

```bash
yarn dev
# ou
npm run dev
```

Acesse `http://localhost:8080` no browser

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── pages/              # Views/Pages
│   ├── HomeView.vue    # Página inicial (protegida)
│   ├── LoginView.vue   # Página de login
│   └── NotFoundView.vue
├── router/             # Configuração de rotas com guards
├── stores/             # Pinia stores
│   └── auth.ts         # Store de autenticação
├── services/           # Serviços HTTP e autenticação
│   ├── http.ts         # Instância Axios com interceptadores
│   └── auth.ts         # API de autenticação
├── types/              # Tipos TypeScript
│   └── user.ts         # Interfaces (User, AuthResponse, etc)
├── i18n/               # Internacionalização
│   ├── index.ts
│   └── locales/        # pt-BR.json, en-US.json
├── plugins/            # Registro de plugins Vue
├── App.vue
└── main.ts
```

## 🔐 Fluxo de Autenticação

1. **Início da aplicação:**
   - Router verifica se há token persistido no Pinia store
   - Se houver = usuário autenticado, acessa a app normalmente
   - Se não = redireciona para `/login`

2. **Login:**
   - Usuário preenche email/password em LoginView
   - Requisição POST para `http://localhost:3000/login`
   - JSON Server retorna JWT token + dados do usuário
   - Token é salvo no Pinia store (persiste em localStorage)
   - Redireciona para home

3. **Requisições Authenticated:**
   - Axios interceptor adiciona automaticamente: `Authorization: Bearer {token}`
   - Se status 401, redireciona para login

4. **Logout:**
   - Limpa token e usuário do store
   - Redireciona para login
   - localStorage é automático

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
yarn dev           # Inicia Vite dev server
yarn server        # Inicia JSON Server
yarn dev-all       # Dica: execute em dois terminals separados

# Build
yarn build         # Build otimizado
yarn preview       # Preview do build

# Qualidade
yarn lint          # Executa ESLint
yarn format        # Formata com Prettier
```

## 📝 Endpoints Disponíveis

O JSON Server expõe automaticamente esses endpoints:

```
POST   /login              # Login (email, password)
POST   /register           # Registrar novo usuário
GET    /users              # Listar usuários (protegido)
GET    /users/:id          # Obter usuário específico
POST   /users              # Criar usuário
PUT    /users/:id          # Atualizar usuário
DELETE /users/:id          # Deletar usuário
```

Todos os endpoints exceto `/login` e `/register` requerem token JWT no header.

## 🔑 Modificando Credenciais de Teste

Edite `db.json`:

```json
{
  "users": [
    {
      "id": 1,
      "email": "seu@email.com",
      "password": "sua-senha",
      "name": "Seu Nome",
      "role": "admin"
    }
  ]
}
```

**Nota:** JSON Server com json-server-auth faz hash automático de passwords.

## 🌍 Internacionalização

Adicione novas chaves em:

- `src/i18n/locales/pt-BR.json` - Português
- `src/i18n/locales/en-US.json` - English

No componente:

```vue
{{ $t('auth.login') }}
<!-- Acessar chaves aninhadas -->
```

## 🚀 Deploy

1. **Build:**

```bash
yarn build
```

2. **Servir `dist/` no seu servidor**

3. **Configurar backend:**
   - Para produção, substitua `http://localhost:3000` em `src/services/http.ts`
   - Ou use variáveis de ambiente

## 📚 Próximas Etapas

Este é um template. Para expandir:

1. **Adicione mais recursos:** Edite `db.json` e crie endpoints
2. **Customize o store:** Expanda `src/stores/auth.ts` conforme necessário
3. **Crie páginas:** Adicione mais `.vue` em `src/pages/`
4. **Adicione componentes:** Use `src/components/`

## ⚙️ Troubleshooting

**"Cannot GET /login"**

- Certifique-se de que o JSON Server está rodando: `yarn server`

**"401 Unauthorized"**

- Token expirou ou inválido
- Faça login novamente

**CORS com produção**

- Configure CORS no backend

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ usando Vue 3 + TypeScript**
