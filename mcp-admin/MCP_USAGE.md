# MCP Usage & Integration Guide - Farm MCP Control

Guia de referência e manual de conexão para clientes MCP (Model Context Protocol) e assistentes de Inteligência Artificial.

---

## 1. Visão Geral da Arquitetura MCP

O **Farm MCP Control** implementa a especificação oficial do Model Context Protocol (MCP) sobre transporte Server-Sent Events (SSE) e HTTP POST:

```text
Cliente MCP / Assistente IA
         │  (Handshake SSE + Bearer Token)
         ▼
  GET /mcp?token=<TOKEN>
  POST /mcp/messages?sessionId=<SESSION_ID>
         │
         ▼
   MCP Server & Tool Registry
  (14 Ferramentas READ-ONLY & Diagnóstico)
         │
         ▼
   Services & Circuit Breaker
         │
         ▼
   Game Backend API & Multiplayer Server
```

---

## 2. Parâmetros de Conexão

| Parâmetro | Valor de Produção | Valor de Homologação / Local |
| :--- | :--- | :--- |
| **Protocolo** | MCP SSE (Server-Sent Events) | MCP SSE (Server-Sent Events) |
| **Endpoint Base** | `https://<SEU_DOMINIO_RENDER>.onrender.com/mcp` | `http://localhost:3001/mcp` |
| **Endpoint Mensagens** | `https://<SEU_DOMINIO_RENDER>.onrender.com/mcp/messages` | `http://localhost:3001/mcp/messages` |
| **Autenticação** | `Bearer <MCP_ACCESS_TOKEN>` ou `?token=<TOKEN>` | `Bearer <MCP_ACCESS_TOKEN>` |
| **Formato de Payload**| JSON-RPC 2.0 | JSON-RPC 2.0 |

> [!IMPORTANT]
> Nunca versione ou compartilhe o `MCP_ACCESS_TOKEN` em canais públicos. Utilize variáveis de ambiente para armazenamento seguro.

---

## 3. Configuração em Clientes MCP (Exemplo de Configuração)

### Claude Desktop / Antigravity / MCP Client JSON:
```json
{
  "mcpServers": {
    "farm-control": {
      "command": "node",
      "args": ["dist/mcp/client-runner.js"],
      "env": {
        "MCP_SERVER_URL": "https://farm-mcp-control.onrender.com/mcp",
        "MCP_ACCESS_TOKEN": "SEU_TOKEN_SECRETO_AQUI"
      }
    }
  }
}
```

---

## 4. Catálogo de Ferramentas Disponíveis (`tools/list`)

Todas as 14 ferramentas atualmente ativas operam em modo **READ-ONLY**, com nível de risco **LOW**:

### 🛠️ Sistema e Infraestrutura
1. `server_status`: Informa a integridade operacional, tempo de uptime e versão do MCP Admin.
2. `get_server_stats`: Métricas de consumo de memória Heap, estatísticas de requisições e versão do Node.js.
3. `get_game_info`: Estado do backend do jogo, número de jogadores conectados e contagem de ofertas.

### 👥 Jogadores e Fazendas
4. `get_online_players`: Lista fazendas ativas no momento com paginação (`limit`).
5. `get_player`: Retorna detalhes da fazenda (`farmId`), nível, avatar, caixas da banca e curtidas.
6. `search_players`: Busca textual por nome da fazenda ou identificador (`query`).

### 📰 Jornal da Comunidade
7. `get_journal_status`: Estado da sincronização do jornal comunitário e ofertas anunciadas.
8. `get_journal_listings`: Filtra ofertas ativas no jornal por vendedor, item ou limite.
9. `diagnose_journal`: Auditoria automatizada em busca de ofertas fantasmas ou anúncios com problemas.

### 🏪 Banca de Vendas & Economia
10. `get_market_status`: Diagnóstico macroeconômico das vendas e produtos mais comercializados.
11. `get_market_listings`: Listagem detalhada de caixas de beira de estrada ativas e vendidas.
12. `diagnose_market`: Detecção de inconsistências em compras, vendas pendentes e concorrência.

### 🔍 Diagnósticos Avançados
13. `diagnose_player`: Diagnóstico de integridade estrutural do perfil do jogador.
14. `diagnose_inventory`: Verificação de estoque e caixas à procura de anomalias ou preços inconsistentes.

---

## 5. Exemplo de Execução Programática via TypeScript SDK

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

const transport = new SSEClientTransport(
  new URL('https://farm-mcp-control.onrender.com/mcp?token=SEU_TOKEN'),
  {
    eventSourceInit: {
      headers: { Authorization: 'Bearer SEU_TOKEN' },
    },
  }
);

const client = new Client({ name: 'ai-assistant', version: '1.0.0' }, { capabilities: {} });
await client.connect(transport);

// Executar consulta
const status = await client.callTool({
  name: 'server_status',
  arguments: {},
});

console.log(status);
await client.close();
```

---

## 6. Tratamento de Erros e Resiliência

- **Falha no Backend do Jogo:** O MCP Server possui *Circuit Breaker* integrado. Se a API do jogo cair, as ferramentas retornam diagnósticos controlados (`status: DEGRADED` ou erro estruturado com código `INTEGRATION_ERROR`) sem derrubar o processo principal.
- **Autenticação Invalida:** Retorna `HTTP 401 Unauthorized`.
- **Validação de Parâmetros:** Erros de schema Zod retornam `isError: true` com mensagens descritivas do campo ausente ou inválido.
