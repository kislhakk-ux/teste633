import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import * as EventSourceModule from 'eventsource';

const EventSourceConstructor = (EventSourceModule as any).default || (EventSourceModule as any).EventSource || EventSourceModule;

if (typeof global.EventSource === 'undefined') {
  (global as any).EventSource = EventSourceConstructor;
}

async function runMcpClientTest() {
  const baseUrl = process.env.MCP_SERVER_URL || 'http://127.0.0.1:3001';
  const token = process.env.MCP_ACCESS_TOKEN || 'test_token_12345';
  const url = `${baseUrl}/mcp?token=${encodeURIComponent(token)}`;

  console.log(`📡 Conectando MCP Client ao servidor em: ${baseUrl}/mcp ...`);

  const transport = new SSEClientTransport(new URL(url), {
    eventSourceInit: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    requestInit: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const client = new Client(
    {
      name: 'test-mcp-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  try {
    await client.connect(transport);
    console.log('✅ Conexão MCP estabelecida e protocolo negociado com sucesso!');

    // 1. Listar Ferramentas
    console.log('\n📋 Solicitando lista de ferramentas (tools/list)...');
    const toolsResponse = await client.listTools();
    console.log(`Encontradas ${toolsResponse.tools.length} ferramentas MCP registradas:`);
    toolsResponse.tools.forEach((t) => {
      console.log(` - 🛠️  ${t.name}: ${t.description}`);
    });

    // 2. Executar Tool server_status
    console.log('\n⚡ Executando ferramenta "server_status"...');
    const statusResult = await client.callTool({
      name: 'server_status',
      arguments: {},
    });

    console.log('🎉 Resultado da execução de "server_status":');
    console.log(JSON.stringify(statusResult, null, 2));

    // 3. Executar Tool get_server_stats
    console.log('\n⚡ Executando ferramenta "get_server_stats"...');
    const statsResult = await client.callTool({
      name: 'get_server_stats',
      arguments: {},
    });

    console.log('📊 Resultado de "get_server_stats":');
    console.log(JSON.stringify(statsResult, null, 2));

    console.log('\n✅ Teste do MCP Client concluído com sucesso!');
    await client.close();
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Erro durante a execução do MCP Client:', err.message || err);
    process.exit(1);
  }
}

runMcpClientTest();
