import { describe, it } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import { createApp } from '../src/server/app.js';
import config from '../src/config/index.js';
import { mcpRegistry } from '../src/mcp/registry.js';
import { initializeMcpTools } from '../src/mcp/tools/index.js';

function makeRequest(app: any, path: string, headers: Record<string, string> = {}): Promise<{ statusCode: number; body: any; headers: any }> {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address() as any;
      const port = address.port;

      const req = http.get(`http://127.0.0.1:${port}${path}`, { headers }, (res) => {
        if (res.headers['content-type']?.includes('text/event-stream')) {
          const result = { statusCode: res.statusCode || 200, body: 'sse_stream', headers: res.headers };
          res.destroy();
          server.close();
          resolve(result);
          return;
        }

        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          server.close();
          try {
            const body = JSON.parse(data);
            resolve({ statusCode: res.statusCode || 500, body, headers: res.headers });
          } catch (err) {
            resolve({ statusCode: res.statusCode || 500, body: data, headers: res.headers });
          }
        });
      });

      req.on('error', (err) => {
        server.close();
        reject(err);
      });
    });
  });
}

describe('Servidor MCP Admin - Suíte de Diagnósticos e Integrações (Etapa 5)', () => {
  it('GET / deve retornar status 200 com contagem expandida de ferramentas', async () => {
    const app = await createApp();
    const res = await makeRequest(app, '/');

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.service, config.mcp.name);
    assert.strictEqual(res.body.data.status, 'online');
    assert.ok(res.body.data.toolsCount >= 14);
  });

  it('GET /api/readiness deve responder status e diagnóstico estruturado do backend', async () => {
    const app = await createApp();
    const res = await makeRequest(app, '/api/readiness');

    assert.ok(res.statusCode === 200 || res.statusCode === 503);
    assert.ok(res.body.data.readiness === 'READY' || res.body.data.readiness === 'DEGRADED');
    assert.strictEqual(res.body.data.http, 'online');
    assert.strictEqual(res.body.data.mcp, 'online');
    assert.ok(res.body.data.gameApi !== undefined);
  });

  it('GET /api/mcp/tools deve incluir categorias de DIAGNOSTICS', async () => {
    const app = await createApp();
    const res = await makeRequest(app, '/api/mcp/tools');

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.length >= 14);

    const categories = res.body.data.map((t: any) => t.category);
    assert.ok(categories.includes('DIAGNOSTICS'));
    assert.ok(categories.includes('JOURNAL'));
    assert.ok(categories.includes('MARKET'));
  });

  it('Execução direta da tool server_status deve retornar dados válidos', async () => {
    initializeMcpTools();
    const result = await mcpRegistry.executeTool('server_status', {});

    assert.ok(result);
    assert.strictEqual(result.service, config.mcp.name);
    assert.strictEqual(result.status, 'online');
    assert.strictEqual(typeof result.uptimeSeconds, 'number');
  });

  it('Execução de tool get_player com backend offline deve tratar erro graciosamente', async () => {
    initializeMcpTools();
    try {
      await mcpRegistry.executeTool('get_player', { playerId: 'farm_inexistente_99' });
      assert.fail('Deveria ter lançado erro de integração/conexão');
    } catch (err: any) {
      assert.ok(err.message.includes('GAME_API_UNAVAILABLE') || err.message.includes('PLAYER_NOT_FOUND'));
    }
  });

  it('GET /mcp com token Bearer correto deve permitir conexao SSE', async () => {
    process.env.MCP_ACCESS_TOKEN = 'valid_secret_token_999';
    const app = await createApp();

    const resSuccess = await makeRequest(app, '/mcp', {
      Authorization: 'Bearer valid_secret_token_999',
    });

    assert.strictEqual(resSuccess.statusCode, 200);
    assert.ok(resSuccess.headers['content-type']?.includes('text/event-stream'));

    delete process.env.MCP_ACCESS_TOKEN;
  });
});
