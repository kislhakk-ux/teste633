import { z } from 'zod';
import { serverService } from '../../services/serverService.js';
import { McpToolOptions } from '../types.js';

export const serverStatusTool: McpToolOptions<typeof serverStatusSchema> = {
  name: 'server_status',
  description: 'Informa o estado operacional atual do MCP Admin Server',
  category: 'SERVER',
  riskLevel: 'LOW',
  inputSchema: z.object({}),
  handler: async () => {
    return serverService.getStatus();
  },
};

const serverStatusSchema = z.object({});

export const getServerStatsTool: McpToolOptions<typeof serverStatsSchema> = {
  name: 'get_server_stats',
  description: 'Retorna estatísticas detalhadas de uso de memória, requisições e uptime',
  category: 'SERVER',
  riskLevel: 'LOW',
  inputSchema: z.object({}),
  handler: async () => {
    return serverService.getStatus();
  },
};

const serverStatsSchema = z.object({});
