import { App } from '@tinyhttp/app';
import { cors } from '@tinyhttp/cors';
import { json } from 'milliparsec';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const adapter = new JSONFile('db.json');
const db = new Low(adapter, {});
const JWT_SECRET = 'your-secret-key-change-this-in-production';

await db.read();

const app = new App();

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

  const user = db.data.users?.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({
      error: 'Email ou senha inválidos',
    });
  }

  // Verificar senha
  const isPasswordValid = password === '123456'; // Senha de teste

  if (!isPasswordValid) {
    return res.status(401).json({
      error: 'Email ou senha inválidos',
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    accessToken: token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
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

  const userExists = db.data.users?.some((u) => u.email === email);

  if (userExists) {
    return res.status(409).json({
      error: 'Usuário com este email já existe',
    });
  }

  const newUser = {
    id: uuidv4(),
    email,
    password,
    name,
    role: 'user',
  };

  if (!db.data.users) {
    db.data.users = [];
  }

  db.data.users.push(newUser);
  await db.write();

  const token = jwt.sign(
    {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.status(201).json({
    accessToken: token,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    },
  });
});

// Rota para listar usuários
app.get('/users', (req, res) => {
  res.json(db.data.users || []);
});

// Rota para obter usuário por ID
app.get('/users/:id', (req, res) => {
  const user = db.data.users?.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  res.json(user);
});

app.listen(3000, () => {
  console.log('JSON Server com autenticação está rodando na porta 3000');
  console.log('');
  console.log('Rotas disponíveis:');
  console.log('  POST /login - Login (email e password)');
  console.log('  POST /register - Registrar novo usuário');
  console.log('  GET /users - Listar todos os usuários');
  console.log('  GET /users/:id - Obter usuário por ID');
  console.log('');
  console.log('Credenciais para teste:');
  console.log('  Email: admin@example.com');
  console.log('  Email: user@example.com');
  console.log('  Senha: 123456 (para ambos)');
});
