import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import { createApp } from '../src/server/app.js';
import { sanitizeLogData } from '../src/logs/sanitizer.js';
import { executeToolWithLogging } from '../src/mcp/executeWrapper.ts';
import config from '../src/config/index.js';

function makeRequest(
  app: any,
  path: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: Record<string, any> | string;
  } = {}
): Promise<{ statusCode: number; body: any; headers: any }> {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address() as any;
      const port = address.port;

      const method = options.method || 'GET';
      const bodyStr = typeof options.body === 'string' ? options.body : options.body ? JSON.stringify(options.body) : undefined;

      const reqHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Connection: 'close',
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

describe('Suíte de Testes de Segurança - Etapa 10', () => {
  let app: any;

  before(async () => {
    app = await createApp();
  });

  it('1. Deve negar acesso não autenticado a rotas administrativas (/api/admin/dashboard)', async () => {
    const res = await makeRequest(app, '/api/admin/dashboard');
    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error.code, 'UNAUTHORIZED');
  });

  it('2. Deve rejeitar requisições ao /mcp sem token Bearer de acesso', async () => {
    // Configura token temporário
    process.env.MCP_ACCESS_TOKEN = 'test_secret_token_12345';
    config.mcp.accessToken = 'test_secret_token_12345';

    const res = await makeRequest(app, '/mcp', { method: 'POST' });
    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.success, false);
  });

  it('3. Deve rejeitar token MCP incorreto com HTTP 401', async () => {
    const res = await makeRequest(app, '/mcp', {
      method: 'POST',
      headers: { Authorization: 'Bearer token_invalido_errado' },
    });
    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.success, false);
  });

  it('4. Deve sanitizar e mascarar recursivamente segredos em objetos de log', () => {
    const rawData = {
      user: 'admin',
      password: 'SuperSecretPassword123!',
      nested: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        apiKey: 'sk-1234567890abcdef',
        DATABASE_URL: 'postgres://user:password@localhost:5432/db',
        safeField: 'InformacaoPublica',
      },
    };

    const sanitized = sanitizeLogData(rawData);
    assert.strictEqual(sanitized.password, '[REDACTED]');
    assert.strictEqual(sanitized.nested.token, '[REDACTED]');
    assert.strictEqual(sanitized.nested.apiKey, '[REDACTED]');
    assert.strictEqual(sanitized.nested.DATABASE_URL, '[REDACTED]');
    assert.strictEqual(sanitized.nested.safeField, 'InformacaoPublica');
  });

  it('5. Deve evitar enumeração de contas em falhas de login (mensagens genéricas)', async () => {
    const res = await makeRequest(app, '/api/auth/login', {
      method: 'POST',
      body: { email: 'usuario_inexistente_9999@exemplo.com', password: 'senha_qualquer_123' },
    });
    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.error.message, 'Credenciais inválidas.');
  });

  it('6. Deve bloquear ferramentas de escrita quando ADMIN_WRITE_MODE=false', async () => {
    config.flags.adminWriteMode = false;

    await assert.rejects(
      async () => {
        await executeToolWithLogging({
          toolName: 'add_coins',
          category: 'PLAYERS',
          riskLevel: 'HIGH',
          readOnly: false,
          handler: async () => ({ status: 'ok' }),
          params: { playerId: 'player_1' },
        });
      },
      (err: any) => {
        assert.strictEqual(err.code, 'ADMIN_WRITE_MODE_DISABLED');
        return true;
      }
    );
  });

  it('7. Deve bloquear ferramentas de diamantes quando ENABLE_DIAMOND_TOOLS=false', async () => {
    config.flags.enableDiamondTools = false;

    await assert.rejects(
      async () => {
        await executeToolWithLogging({
          toolName: 'add_diamonds',
          category: 'DIAMONDS',
          riskLevel: 'CRITICAL',
          readOnly: true,
          handler: async () => ({ status: 'ok' }),
          params: { playerId: 'player_1' },
        });
      },
      (err: any) => {
        assert.strictEqual(err.code, 'FEATURE_DISABLED');
        return true;
      }
    );
  });

  it('8. Deve bloquear ferramentas de banimento quando ENABLE_BAN_TOOLS=false', async () => {
    config.flags.enableBanTools = false;

    await assert.rejects(
      async () => {
        await executeToolWithLogging({
          toolName: 'ban_player',
          category: 'BAN',
          riskLevel: 'CRITICAL',
          readOnly: true,
          handler: async () => ({ status: 'ok' }),
          params: { playerId: 'player_1' },
        });
      },
      (err: any) => {
        assert.strictEqual(err.code, 'FEATURE_DISABLED');
        return true;
      }
    );
  });

  it('9. Deve suportar inputs com payloads maliciosos de SQL Injection sem falhas não tratadas', async () => {
    const sqlInjectionPayload = "' OR 1=1; DROP TABLE admins; --";
    const res = await makeRequest(app, '/api/auth/login', {
      method: 'POST',
      body: { email: sqlInjectionPayload, password: sqlInjectionPayload },
    });
    // Deve responder 401 limpo sem crash de banco ou vazamento de erro 500
    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.success, false);
  });

  it('10. Deve incluir headers de segurança HTTP (X-Content-Type-Options, Referrer-Policy)', async () => {
    const res = await makeRequest(app, '/health');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.headers['x-content-type-options'], 'nosniff');
    assert.ok(res.headers['referrer-policy']);
  });
});
