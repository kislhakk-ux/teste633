import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import { createApp } from '../src/server/app.js';
import { adminStore } from '../src/auth/store.js';
import { hashPassword } from '../src/auth/password.js';

// Helper para fazer requisições com suporte a cookies
function makeRequest(
  app: any,
  path: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: Record<string, any>;
  } = {}
): Promise<{ statusCode: number; body: any; headers: any }> {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address() as any;
      const port = address.port;

      const method = options.method || 'GET';
      const bodyStr = options.body ? JSON.stringify(options.body) : undefined;

      const reqHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {}),
      };
      if (bodyStr) {
        reqHeaders['Content-Length'] = Buffer.byteLength(bodyStr).toString();
      }

      const req = http.request(
        { hostname: '127.0.0.1', port, path, method, headers: reqHeaders },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            server.close();
            try {
              const body = data ? JSON.parse(data) : {};
              resolve({ statusCode: res.statusCode || 500, body, headers: res.headers });
            } catch {
              resolve({ statusCode: res.statusCode || 500, body: data, headers: res.headers });
            }
          });
        }
      );

      req.on('error', (err) => {
        server.close();
        reject(err);
      });

      if (bodyStr) req.write(bodyStr);
      req.end();
    });
  });
}

// Cria um admin de teste no store antes dos testes
let testAdminId = '';
before(async () => {
  // Remover admin de teste se já existir (para testes idempotentes)
  const existing = adminStore.findAdminByEmail('test-owner@example.com');
  if (!existing) {
    const hash = await hashPassword('TestPass1234!');
    const admin = adminStore.createAdmin({
      name: 'Test Owner',
      email: 'test-owner@example.com',
      passwordHash: hash,
      role: 'OWNER',
      active: true,
    });
    testAdminId = admin.id;
  } else {
    testAdminId = existing.id;
  }

  // Criar admin de suporte para testes de permissão
  if (!adminStore.findAdminByEmail('support-test@example.com')) {
    const hash = await hashPassword('SupportPass567!');
    adminStore.createAdmin({
      name: 'Test Support',
      email: 'support-test@example.com',
      passwordHash: hash,
      role: 'SUPPORT',
      active: true,
    });
  }

  // Limpar tentativas de login acumuladas para evitar bloqueio por rate-limit em testes sequenciais
  adminStore.clearLoginAttempts();
});

describe('Auth - Etapa 7: Sistema de Autenticação Administrativa', () => {
  // === LOGIN ===
  it('POST /api/auth/login com credenciais válidas deve retornar 200 e setar cookie', async () => {
    const app = await createApp();
    const res = await makeRequest(app, '/api/auth/login', {
      method: 'POST',
      body: { email: 'test-owner@example.com', password: 'TestPass1234!' },
    });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.email === 'test-owner@example.com');
    assert.ok(res.body.data.role === 'OWNER');
    assert.ok(Array.isArray(res.body.data.permissions));
    assert.ok(!res.body.data.passwordHash, 'passwordHash NÃO deve aparecer na resposta');
    // Verificar cookie
    const setCookie = res.headers['set-cookie'];
    assert.ok(setCookie, 'Cookie admin_session deve ser setado');
    const cookieStr = Array.isArray(setCookie) ? setCookie[0] : setCookie;
    assert.ok(cookieStr.includes('admin_session'), 'Cookie deve ter nome admin_session');
    assert.ok(cookieStr.toLowerCase().includes('httponly'), 'Cookie deve ter HttpOnly');
  });

  it('POST /api/auth/login com senha errada deve retornar 401 com mensagem genérica', async () => {
    const app = await createApp();
    const res = await makeRequest(app, '/api/auth/login', {
      method: 'POST',
      body: { email: 'test-owner@example.com', password: 'WrongPassword!' },
    });

    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.success, false);
    // Mensagem genérica — não revela que o usuário existe
    assert.strictEqual(res.body.error.message, 'Credenciais inválidas.');
  });

  it('POST /api/auth/login com email inexistente deve retornar 401 genérico', async () => {
    const app = await createApp();
    const res = await makeRequest(app, '/api/auth/login', {
      method: 'POST',
      body: { email: 'nobody@nowhere.com', password: 'WhateverPass123' },
    });

    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.error.message, 'Credenciais inválidas.');
  });

  // === ME ===
  it('GET /api/auth/me sem cookie deve retornar 401', async () => {
    const app = await createApp();
    const res = await makeRequest(app, '/api/auth/me');
    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.error.code, 'UNAUTHORIZED');
  });

  it('GET /api/auth/me com sessão válida deve retornar dados do usuário', async () => {
    const app = await createApp();
    // Primeiro fazer login para obter cookie
    const loginRes = await makeRequest(app, '/api/auth/login', {
      method: 'POST',
      body: { email: 'test-owner@example.com', password: 'TestPass1234!' },
    });

    const setCookie = loginRes.headers['set-cookie'];
    const cookieHeader = Array.isArray(setCookie)
      ? setCookie.map((c: string) => c.split(';')[0]).join('; ')
      : setCookie?.split(';')[0] || '';

    const meRes = await makeRequest(app, '/api/auth/me', {
      headers: { Cookie: cookieHeader },
    });

    assert.strictEqual(meRes.statusCode, 200);
    assert.strictEqual(meRes.body.data.email, 'test-owner@example.com');
    assert.ok(meRes.body.data.permissions.includes('admins:manage'));
    assert.ok(!meRes.body.data.passwordHash, 'passwordHash não deve ser exposto');
  });

  // === ROTAS PROTEGIDAS ===
  it('GET /api/admin/dashboard sem sessão deve retornar 401', async () => {
    const app = await createApp();
    const res = await makeRequest(app, '/api/admin/dashboard');
    assert.strictEqual(res.statusCode, 401);
  });

  it('GET /api/admin/logs sem sessão deve retornar 401', async () => {
    const app = await createApp();
    const res = await makeRequest(app, '/api/admin/logs');
    assert.strictEqual(res.statusCode, 401);
  });

  // === PERMISSÕES ===
  it('GET /api/admin/users com SUPPORT deve retornar 403 (sem admins:view)', async () => {
    const app = await createApp();
    // Login como SUPPORT
    const loginRes = await makeRequest(app, '/api/auth/login', {
      method: 'POST',
      body: { email: 'support-test@example.com', password: 'SupportPass567!' },
    });

    const setCookie = loginRes.headers['set-cookie'];
    const cookieHeader = Array.isArray(setCookie)
      ? setCookie.map((c: string) => c.split(';')[0]).join('; ')
      : setCookie?.split(';')[0] || '';

    const res = await makeRequest(app, '/api/admin/users', {
      headers: { Cookie: cookieHeader },
    });

    // SUPPORT não tem admins:view
    assert.strictEqual(res.statusCode, 403);
    assert.strictEqual(res.body.error.code, 'FORBIDDEN');
  });

  // === LOGOUT ===
  it('POST /api/auth/logout deve limpar o cookie', async () => {
    const app = await createApp();
    const loginRes = await makeRequest(app, '/api/auth/login', {
      method: 'POST',
      body: { email: 'test-owner@example.com', password: 'TestPass1234!' },
    });

    const setCookie = loginRes.headers['set-cookie'];
    const cookieHeader = Array.isArray(setCookie)
      ? setCookie.map((c: string) => c.split(';')[0]).join('; ')
      : setCookie?.split(';')[0] || '';

    const logoutRes = await makeRequest(app, '/api/auth/logout', {
      method: 'POST',
      headers: { Cookie: cookieHeader },
    });

    assert.strictEqual(logoutRes.statusCode, 200);

    // Após logout, /me deve retornar 401
    const meRes = await makeRequest(app, '/api/auth/me', {
      headers: { Cookie: cookieHeader },
    });
    assert.strictEqual(meRes.statusCode, 401);
  });

  // === POLICY DE SENHA ===
  it('POST /api/auth/change-password com senha fraca deve retornar 400', async () => {
    const app = await createApp();
    const loginRes = await makeRequest(app, '/api/auth/login', {
      method: 'POST',
      body: { email: 'test-owner@example.com', password: 'TestPass1234!' },
    });

    const setCookie = loginRes.headers['set-cookie'];
    const cookieHeader = Array.isArray(setCookie)
      ? setCookie.map((c: string) => c.split(';')[0]).join('; ')
      : setCookie?.split(';')[0] || '';

    const changeRes = await makeRequest(app, '/api/auth/change-password', {
      method: 'POST',
      headers: { Cookie: cookieHeader },
      body: {
        currentPassword: 'TestPass1234!',
        newPassword: 'weak',
        confirmPassword: 'weak',
      },
    });

    assert.strictEqual(changeRes.statusCode, 400);
    assert.strictEqual(changeRes.body.error.code, 'WEAK_PASSWORD');
  });

  // === CRIAÇÃO DE ADMIN ===
  it('POST /api/admin/users como OWNER deve criar novo admin', async () => {
    const app = await createApp();
    const loginRes = await makeRequest(app, '/api/auth/login', {
      method: 'POST',
      body: { email: 'test-owner@example.com', password: 'TestPass1234!' },
    });

    const setCookie = loginRes.headers['set-cookie'];
    const cookieHeader = Array.isArray(setCookie)
      ? setCookie.map((c: string) => c.split(';')[0]).join('; ')
      : setCookie?.split(';')[0] || '';

    const email = `new-admin-${Date.now()}@test.com`;
    const createRes = await makeRequest(app, '/api/admin/users', {
      method: 'POST',
      headers: { Cookie: cookieHeader },
      body: {
        name: 'New Admin Test',
        email,
        password: 'SecurePass9876!',
        role: 'ADMIN',
      },
    });

    assert.strictEqual(createRes.statusCode, 201);
    assert.strictEqual(createRes.body.data.role, 'ADMIN');
    assert.ok(!createRes.body.data.passwordHash, 'passwordHash não deve ser exposto');
  });
});
