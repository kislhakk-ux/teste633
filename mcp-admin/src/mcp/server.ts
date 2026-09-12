import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { Express, Request, Response } from 'express';
import config from '../config/index.js';
import { logger } from '../logs/logger.js';
import { mcpRegistry } from './registry.js';
import { initializeMcpTools } from './tools/index.js';

export function createMcpServer(): McpServer {
  initializeMcpTools();

  const mcpServer = new McpServer({
    name: config.mcp.name,
    version: config.mcp.version,
  });

  const tools = mcpRegistry.getAllTools();
  for (const t of tools) {
    const fullTool = mcpRegistry.getTool(t.name);
    if (!fullTool) continue;

    const shape = (fullTool.inputSchema as any)?.shape || {};

    mcpServer.tool(
      fullTool.name,
      fullTool.description,
      shape,
      async (args: any) => {
        try {
          const result = await mcpRegistry.executeTool(fullTool.name, args || {});
          return {
            content: [
              {
                type: 'text' as const,
                text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (err: any) {
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(
                  {
                    success: false,
                    error: {
                      code: err.code || 'TOOL_EXECUTION_ERROR',
                      message: `Erro ao executar ferramenta '${fullTool.name}': ${err.message}`,
                      details: err.details || null,
                    },
                  },
                  null,
                  2
                ),
              },
            ],
            isError: true,
          };
        }
      }
    );
  }

  logger.info(`[MCP Server Factory] ${tools.length} ferramentas MCP vinculadas ao McpServer.`);
  return mcpServer;
}

export function setupMcpTransport(app: Express, mcpServer: McpServer): void {
  const transports = new Map<string, SSEServerTransport>();

  // SSE connection endpoint: GET /mcp
  app.get('/mcp', async (req: Request, res: Response) => {
    logger.info(`[MCP SSE GET /mcp] Nova conexão estabelecida. Client IP: ${req.ip}`);

    const transport = new SSEServerTransport('/mcp/messages', res);
    transports.set(transport.sessionId, transport);

    transport.onclose = () => {
      transports.delete(transport.sessionId);
      logger.info(`[MCP SSE Session Closed] Sessão ${transport.sessionId} finalizada.`);
    };

    await mcpServer.connect(transport);
  });

  // Message handler endpoint: POST /mcp/messages
  app.post('/mcp/messages', async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;
    const transport = sessionId ? transports.get(sessionId) : Array.from(transports.values())[0];

    if (transport) {
      // Passa req.body pré-analisado pelo middleware express.json()
      await transport.handlePostMessage(req, res, req.body);
    } else {
      res.status(400).json({
        success: false,
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Sessão MCP SSE não encontrada ou expirada.',
        },
      });
    }
  });
}
