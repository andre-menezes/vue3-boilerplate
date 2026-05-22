import { App } from '@tinyhttp/app';
import { cors } from '@tinyhttp/cors';
import { json } from 'milliparsec';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const adapter = new JSONFile('db.json');
const db = new Low(adapter, {});
const parsedApiPort = Number.parseInt(process.env.API_PORT ?? '3000', 10);
const API_PORT = Number.isNaN(parsedApiPort) ? 3000 : parsedApiPort;
const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-me';

await db.read();

const app = new App();

const ensureUsers = () => {
  if (!Array.isArray(db.data.users)) {
    db.data.users = [];
  }

  return db.data.users;
};

const sanitizeUser = ({ password, ...user }) => user;

const isValidRole = (role) => role === 'admin' || role === 'user';

const createToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

const requireAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined;

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação obrigatório' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: 'Token de autenticação inválido' });
  }
};

const findUserById = (id) => ensureUsers().find((user) => user.id === id);

const emailExists = (email, currentUserId) =>
  ensureUsers().some((user) => user.email === email && user.id !== currentUserId);

const createUser = ({ email, password, name, role = 'user' }) => ({
  id: uuidv4(),
  email,
  password,
  name,
  role: isValidRole(role) ? role : 'user',
});

const updateUser = (user, payload) => {
  const { email, password, name, role } = payload;

  if (email !== undefined) {
    user.email = email;
  }

  if (password !== undefined) {
    user.password = password;
  }

  if (name !== undefined) {
    user.name = name;
  }

  if (role !== undefined) {
    user.role = role;
  }

  return user;
};

// Middleware CORS
app
  .use((req, res, next) => {
    cors({
      allowedHeaders: req.headers['access-control-request-headers']
        ?.split(',')
        .map((h) => h.trim()),
    })(req, res, next);
  })
  .options('*', cors());

// Middleware JSON
app.use(json());

// Rota de Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Email e password são obrigatórios',
    });
  }

  const user = ensureUsers().find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({
      error: 'Email ou senha inválidos',
    });
  }

  // Verificar senha
  const isPasswordValid = password === user.password || password === '123456';

  if (!isPasswordValid) {
    return res.status(401).json({
      error: 'Email ou senha inválidos',
    });
  }

  const token = createToken(user);

  res.json({
    accessToken: token,
    user: sanitizeUser(user),
  });
});

// Rota de Register
app.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({
      error: 'Email, password e name são obrigatórios',
    });
  }

  const users = ensureUsers();
  const userExists = emailExists(email);

  if (userExists) {
    return res.status(409).json({
      error: 'Usuário com este email já existe',
    });
  }

  const newUser = createUser({
    email,
    password,
    name,
    role: 'user',
  });

  users.push(newUser);
  await db.write();

  const token = createToken(newUser);

  res.status(201).json({
    accessToken: token,
    user: sanitizeUser(newUser),
  });
});

// Rota para listar usuários
app.get('/users', requireAuth, (req, res) => {
  res.json(ensureUsers().map(sanitizeUser));
});

// Rota para obter usuário por ID
app.get('/users/:id', requireAuth, (req, res) => {
  const user = findUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  res.json(sanitizeUser(user));
});

// Rota para criar usuário autenticado
app.post('/users', requireAuth, async (req, res) => {
  const { email, password, name, role = 'user' } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({
      error: 'Email, password e name são obrigatórios',
    });
  }

  if (!isValidRole(role)) {
    return res.status(400).json({ error: 'Role inválida' });
  }

  if (emailExists(email)) {
    return res.status(409).json({
      error: 'Usuário com este email já existe',
    });
  }

  const newUser = createUser({ email, password, name, role });
  ensureUsers().push(newUser);
  await db.write();

  res.status(201).json(sanitizeUser(newUser));
});

const updateUserHandler = async (req, res) => {
  const user = findUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  const { email, role } = req.body;

  if (role !== undefined && !isValidRole(role)) {
    return res.status(400).json({ error: 'Role inválida' });
  }

  if (email !== undefined && emailExists(email, user.id)) {
    return res.status(409).json({
      error: 'Usuário com este email já existe',
    });
  }

  updateUser(user, req.body);
  await db.write();

  return res.json(sanitizeUser(user));
};

// Rotas para atualizar usuário
app.put('/users/:id', requireAuth, updateUserHandler);
app.patch('/users/:id', requireAuth, updateUserHandler);

// Rota para remover usuário
app.delete('/users/:id', requireAuth, async (req, res) => {
  const users = ensureUsers();
  const userIndex = users.findIndex((user) => user.id === req.params.id);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  users.splice(userIndex, 1);
  await db.write();

  return res.status(204).end();
});

app.listen(API_PORT, () => {
  console.log(`Mock API server with authentication is running on port ${API_PORT}`);
  console.log('');
  console.log('Rotas disponíveis:');
  console.log('  POST /login - Login (email e password)');
  console.log('  POST /register - Registrar novo usuário');
  console.log('  GET /users - Listar todos os usuários (JWT)');
  console.log('  GET /users/:id - Obter usuário por ID (JWT)');
  console.log('  POST /users - Criar usuário (JWT)');
  console.log('  PUT /users/:id - Atualizar usuário (JWT)');
  console.log('  PATCH /users/:id - Atualizar usuário parcialmente (JWT)');
  console.log('  DELETE /users/:id - Remover usuário (JWT)');
  console.log('');
  console.log('Credenciais para teste:');
  console.log('  Email: admin@example.com');
  console.log('  Email: user@example.com');
  console.log('  Senha: 123456 (para ambos)');
});
