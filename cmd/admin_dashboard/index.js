const http = require('http');
const url = require('url');
const dotenv = require("dotenv");

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

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  const segments = pathname.split('/').filter(Boolean);

  console.log(`[${new Date().toISOString()}] ${method} ${pathname}`);

  try {
    // GET /users
    if (method === 'GET' && pathname === '/users') {
      const result = await userHandler.getUsers({ query: parsedUrl.query });
      return respondJSON(res, 200, result);
    }

    // GET /users/:id
    if (method === 'GET' && segments[0] === 'users' && segments[1]) {
      const result = await userHandler.getUser({ params: { id: segments[1] } });
      return respondJSON(res, 200, result);
    }

    // POST /users
    if (method === 'POST' && pathname === '/users') {
      const body = await parseBody(req);
      const result = await userHandler.postUser(body);
      return respondJSON(res, 201, result);
    }

    // PUT /users/:id
    if (method === 'PUT' && segments[0] === 'users' && segments[1]) {
      const body = await parseBody(req);
      const result = await userHandler.updateUser({ params: { id: segments[1] }, body });
      return respondJSON(res, 200, result);
    }

    // DELETE /users/:id
    if (method === 'DELETE' && segments[0] === 'users' && segments[1]) {
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
    process.exit(1); // Завершить процесс при ошибке подключения
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
