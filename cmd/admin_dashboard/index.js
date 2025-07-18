const http = require('http');
const url = require('url');
const dotenv = require("dotenv");
const bcrypt = require('bcryptjs');
const { signToken, verifyToken } = require('../../pkg/token/jwt');

const {
  NewUserRepository,
  NewUserService,
  NewUserHandler
} = require('../../internal/user');
const NewSequelize = require("../../pkg/database/database");

dotenv.config({ path: '../../.env' });

const DB_URL = process.env.DB_URL || "postgres://user:pass@postgres:5432/admin_dashboard";
const PORT = process.env.PORT || 3000;

const db = NewSequelize(DB_URL);

const userRepo = NewUserRepository(db);
const userService = NewUserService(userRepo);
const userHandler = NewUserHandler(userService);

const COOKIE_NAME = 'token';

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*', // domain or localhost
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      //'Access-Control-Allow-Credentials': 'true'
    });
    res.end();
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');  
  //res.setHeader('Access-Control-Allow-Credentials', 'true');

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  const segments = pathname.split('/').filter(Boolean);

  console.log(`[${new Date().toISOString()}] ${method} ${pathname}`);

  // AUTH: LOGIN
  if (method === 'POST' && pathname === '/auth/login') {
    try {
      const body = await parseBody(req);
      const { username, password } = body;
      if (!username || !password) {
        return respondJSON(res, 400, { error: 'Username and password required' });
      }
      const user = await userRepo.findUserByUsername(username);
      if (!user) {
        return respondJSON(res, 401, { error: 'Invalid credentials' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return respondJSON(res, 401, { error: 'Invalid credentials' });
      }
      const token = signToken({ id: user.id, username: user.username });
      res.writeHead(200, {
        'Set-Cookie': `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`,
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify({ ok: true }));
    } catch (err) {
      console.error(err);
      respondJSON(res, 500, { error: 'Internal Server Error' });
    }
    return;
  }

  // AUTH: LOGOUT
  if (method === 'POST' && pathname === '/auth/logout') {
    res.writeHead(200, {
      'Set-Cookie': `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`,
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  // AUTH: ME
  if (method === 'GET' && pathname === '/me') {
    try {
      const cookies = parseCookies(req.headers.cookie);
      const token = cookies[COOKIE_NAME];
      if (!token) {
        return respondJSON(res, 401, { error: 'Not authenticated' });
      }
      let payload;
      try {
        payload = verifyToken(token);
      } catch {
        return respondJSON(res, 401, { error: 'Invalid token' });
      }
      const user = await userRepo.findUserById(payload.id);
      if (!user) {
        return respondJSON(res, 401, { error: 'User not found' });
      }
      const { password, ...userData } = user;
      respondJSON(res, 200, userData);
    } catch (err) {
      console.error(err);
      respondJSON(res, 500, { error: 'Internal Server Error' });
    }
    return;
  }

  try {
    // GET /users
    if (method === 'GET' && pathname === '/users') {
      const auth = requireAuth(req, res);
      if (!auth) return;
      const result = await userHandler.getUsers({ query: parsedUrl.query });
      return respondJSON(res, 200, result);
    }

    // GET /users/:id
    if (method === 'GET' && segments[0] === 'users' && segments[1]) {
      const auth = requireAuth(req, res);
      if (!auth) return;
      const result = await userHandler.getUser({ params: { id: segments[1] } });
      return respondJSON(res, 200, result);
    }

    // POST /users
    if (method === 'POST' && pathname === '/users') {
      // регистрация не требует авторизации
      const body = await parseBody(req);
      const result = await userHandler.postUser(body);
      return respondJSON(res, 201, result);
    }

    // PUT /users/:id
    if (method === 'PUT' && segments[0] === 'users' && segments[1]) {
      const auth = requireAuth(req, res);
      if (!auth) return;
      const body = await parseBody(req);
      const result = await userHandler.updateUser({ params: { id: segments[1] }, body });
      return respondJSON(res, 200, result);
    }

    // DELETE /users/:id
    if (method === 'DELETE' && segments[0] === 'users' && segments[1]) {
      const auth = requireAuth(req, res);
      if (!auth) return;
      const result = await userHandler.deleteUser({ params: { id: segments[1] } });
      return respondJSON(res, 204, result); // No content
    }

    // 404
    respondJSON(res, 404, { error: 'Not Found' });

  } catch (err) {
    console.error(err);
    respondJSON(res, err.statusCode || 500, { error: err.message || 'Internal Server Error' });
  }
});

async function startServer(server) {
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');

    await db.sync({ alter: true });
    console.log('Database synchronization has been completed successfully.');

    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(server)

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try {
        const parsed = JSON.parse(data || '{}');
        resolve(parsed);
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
  });
}

function respondJSON(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  if (statusCode !== 204) {
    res.end(JSON.stringify(payload));
  } else {
    res.end();
  }
}

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.trim().split('=');
    cookies[name] = decodeURIComponent(rest.join('='));
  });
  return cookies;
}

function requireAuth(req, res) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[COOKIE_NAME];
  if (!token) {
    respondJSON(res, 401, { error: 'Not authenticated' });
    return null;
  }
  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    respondJSON(res, 401, { error: 'Invalid token' });
    return null;
  }
  return payload;
}
