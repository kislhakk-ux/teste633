import { z } from 'zod';
import { marketService } from '../../services/marketService.js';
import { McpToolOptions } from '../types.js';

const getMarketStatusSchema = z.object({});

export const getMarketStatusTool: McpToolOptions<typeof getMarketStatusSchema> = {
  name: 'get_market_status',
  description: 'Diagnostica a economia de mercado, volume de vendas nas bancas e produtos mais vendidos',
  category: 'MARKET',
  riskLevel: 'LOW',
  inputSchema: getMarketStatusSchema,
  handler: async () => {
    return marketService.getMarketStatus();
  },
};
