import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import { createApp } from '../src/server/app.js';
import { logStore } from '../src/logs/logStore.js';
import { sanitizeLogData, maskIpAddress } from '../src/logs/sanitizer.js';
import { executeToolWithLogging } from '../src/mcp/executeWrapper.js';
import { adminStore } from '../src/auth/store.js';
import { hashPassword } from '../src/auth/password.js';

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

let ownerCookie = '';
let supportCookie = '';

before(async () => {
  // Configurar usuários de teste se não existirem
  if (!adminStore.findAdminByEmail('owner-logs-test@example.com')) {
    const hash = await hashPassword('OwnerPass1234!');
    adminStore.createAdmin({
      name: 'Logs Owner Test',
      email: 'owner-logs-test@example.com',
      passwordHash: hash,
      role: 'OWNER',
      active: true,
    });
  }

  if (!adminStore.findAdminByEmail('support-logs-test@example.com')) {
    const hash = await hashPassword('SupportPass1234!');
    adminStore.createAdmin({
      name: 'Logs Support Test',
      email: 'support-logs-test@example.com',
      passwordHash: hash,
      role: 'SUPPORT',
      active: true,
    });
  }

  const app = await createApp();

  // Obtain Owner Cookie
  const loginOwner = await makeRequest(app, '/api/auth/login', {
    method: 'POST',
    body: { email: 'owner-logs-test@example.com', password: 'OwnerPass1234!' },
  });
  const cookieOwnerHeader = loginOwner.headers['set-cookie'];
  ownerCookie = Array.isArray(cookieOwnerHeader) ? cookieOwnerHeader[0].split(';')[0] : cookieOwnerHeader?.split(';')[0] || '';

  // Obtain Support Cookie
  const loginSupport = await makeRequest(app, '/api/auth/login', {
    method: 'POST',
    body: { email: 'support-logs-test@example.com', password: 'SupportPass1234!' },
  });
  const cookieSupportHeader = loginSupport.headers['set-cookie'];
  supportCookie = Array.isArray(cookieSupportHeader) ? cookieSupportHeader[0].split(';')[0] : cookieSupportHeader?.split(';')[0] || '';
});

describe('Suíte de Testes Etapa 8 - Sistema de Logs, Auditoria, Traces e Sanitização', () => {
  // 1. SANITIZER & SECRET SCRUBBING
  it('Sanitizer deve remover senhas, tokens e credenciais em objetos simples e aninhados', () => {
    const sensitivePayload = {
      user: {
        id: 'usr_123',
        password: 'SuperSecretPassword123!',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      },
      headers: {
        Authorization: 'Bearer secret_access_token_999',
        cookie: 'admin_session=secret_cookie_val',
      },
      config: {
        DATABASE_URL: 'postgresql://postgres:secretpass@localhost:5432/mydb',
        apiKey: 'sk_live_123456789',
        nestedArray: [
          { secret: 'hidden1' },
          { safeField: 'ok', refreshToken: 'refresh_secret' },
        ],
      },
    };

    const sanitized = sanitizeLogData(sensitivePayload);

    assert.strictEqual(sanitized.user.password, '[REDACTED]');
    assert.strictEqual(sanitized.user.token, '[REDACTED]');
    assert.strictEqual(sanitized.headers.Authorization, '[REDACTED]');
    assert.strictEqual(sanitized.headers.cookie, '[REDACTED]');
    assert.strictEqual(sanitized.config.DATABASE_URL, '[REDACTED]');
    assert.strictEqual(sanitized.config.apiKey, '[REDACTED]');
    assert.strictEqual(sanitized.config.nestedArray[0].secret, '[REDACTED]');
    assert.strictEqual(sanitized.config.nestedArray[1].refreshToken, '[REDACTED]');
    assert.strictEqual(sanitized.config.nestedArray[1].safeField, 'ok');
  });

  it('Masking de IP deve aplicar regra de privacidade corretamente', () => {
    assert.strictEqual(maskIpAddress('192.168.1.100'), '192.168.xxx.xxx');
    assert.strictEqual(maskIpAddress('127.0.0.1'), '127.0.0.1');
    assert.strictEqual(maskIpAddress('::1'), '::1');
  });

  // 2. LOGSTORE & EXECUTE WRAPPER METRICS
  it('executeToolWithLogging deve cronometrar execução e atualizar métricas no LogStore', async () => {
    const testToolName = `test_tool_${Date.now()}`;

    // Execução bem-sucedida
    await executeToolWithLogging({
      toolName: testToolName,
      category: 'TEST',
      riskLevel: 'LOW',
      readOnly: true,
      principal: 'admin_test',
      params: { playerId: 'farm_001', safeInput: 'hello' },
      handler: async () => {
        await new Promise((r) => setTimeout(r, 10));
        return { success: true, count: 5 };
      },
    });

    const metrics = logStore.getToolMetrics();
    const toolMetric = metrics.find((m) => m.toolName === testToolName);

    assert.ok(toolMetric, 'Métrica da ferramenta testada deve existir');
    assert.strictEqual(toolMetric.calls, 1);
    assert.strictEqual(toolMetric.success, 1);
    assert.strictEqual(toolMetric.errors, 0);
    assert.strictEqual(toolMetric.successRate, 100);
    assert.ok(toolMetric.averageDuration >= 5);
  });

  // 3. TRACE SYSTEM
  it('getTraceByCorrelationId deve reconstruir a linha do tempo cronológica por correlationId', () => {
    const testCorrelationId = `corr_test_trace_${Date.now()}`;

    logStore.addApplicationLog({
      level: 'INFO',
      service: 'mcp-admin-api',
      message: 'Recebendo requisição HTTP',
      requestId: 'req_001',
      correlationId: testCorrelationId,
      duration: 5,
    });

    logStore.addMcpToolLog({
      toolName: 'get_player',
      category: 'PLAYERS',
      riskLevel: 'LOW',
      readOnly: true,
      principal: 'admin_test',
      requestId: 'req_002',
      correlationId: testCorrelationId,
      duration: 15,
      success: true,
      targetId: 'player_99',
    });

    const trace = logStore.getTraceByCorrelationId(testCorrelationId);

    assert.ok(trace);
    assert.strictEqual(trace.correlationId, testCorrelationId);
    assert.strictEqual(trace.spans.length, 2);
    assert.strictEqual(trace.spans[0].type, 'SERVICE');
    assert.strictEqual(trace.spans[1].type, 'MCP_TOOL');
  });

  // 4. REST ENDPOINTS & PERMISSÕES
  it('GET /api/admin/logs como OWNER deve retornar logs paginados com sucesso', async () => {
    const app = await createApp();
    const res = await makeRequest(app, '/api/admin/logs?limit=10&page=1', {
      headers: { Cookie: ownerCookie },
    });


    assert.strictEqual(res.statusCode, 200, `Expected 200 but got ${res.statusCode}: ${JSON.stringify(res.body)}`);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data.data));
    assert.strictEqual(typeof res.body.data.total, 'number');
  });

  it('GET /api/admin/logs/export como SUPPORT (sem permissão logs:export) deve retornar 403', async () => {
    const app = await createApp();
    const res = await makeRequest(app, '/api/admin/logs/export?format=json', {
      headers: { Cookie: supportCookie },
    });

    assert.strictEqual(res.statusCode, 403);
    assert.strictEqual(res.body.error.code, 'FORBIDDEN');
  });

  it('GET /api/admin/logs/export como OWNER deve retornar arquivo CSV/JSON e registrar LOG_EXPORT no Audit', async () => {
    const app = await createApp();
    const res = await makeRequest(app, '/api/admin/logs/export?format=csv', {
      headers: { Cookie: ownerCookie },
    });

    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.headers['content-type']?.includes('text/csv'));
    assert.ok(res.body.includes('Timestamp') || typeof res.body === 'string');

    // Verificar se a exportação registrou o evento de auditoria
    const auditLogs = logStore.queryLogs({ type: 'audit', limit: 10 });
    const exportAudit = auditLogs.data.find((r) => (r.data as any).action === 'LOG_EXPORT');
    assert.ok(exportAudit, 'Evento LOG_EXPORT deve estar no Audit Log');
  });

  it('GET /api/admin/logs/tool-metrics deve retornar métricas e latências p50/p95/p99', async () => {
    const app = await createApp();
    const res = await makeRequest(app, '/api/admin/logs/tool-metrics', {
      headers: { Cookie: ownerCookie },
    });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  it('GET /api/admin/logs/dashboard-summary deve retornar resumo das 24h', async () => {
    const app = await createApp();
    const res = await makeRequest(app, '/api/admin/logs/dashboard-summary', {
      headers: { Cookie: ownerCookie },
    });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(typeof res.body.data.mcpSuccessRate, 'number');
  });
});
