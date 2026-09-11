import { z } from 'zod';
import { journalService } from '../../services/journalService.js';
import { marketService } from '../../services/marketService.js';
import { playerService } from '../../services/playerService.js';
import { McpToolOptions } from '../types.js';

export const diagnoseJournalTool: McpToolOptions<typeof diagnoseJournalSchema> = {
  name: 'diagnose_journal',
  description: 'Diagnostica automaticamente problemas no jornal da comunidade, anúncios expirados e inconformidades',
  category: 'DIAGNOSTICS',
  riskLevel: 'LOW',
  requiresGameApi: true,
  inputSchema: z.object({}),
  handler: async () => {
    return journalService.diagnoseJournal();
  },
};
const diagnoseJournalSchema = z.object({});

export const diagnoseMarketTool: McpToolOptions<typeof diagnoseMarketSchema> = {
  name: 'diagnose_market',
  description: 'Diagnostica erros na banca de vendas, caixas duplicadas e inconformidades nas compras',
  category: 'DIAGNOSTICS',
  riskLevel: 'LOW',
  requiresGameApi: true,
  inputSchema: z.object({}),
  handler: async () => {
    return marketService.diagnoseMarket();
  },
};
const diagnoseMarketSchema = z.object({});

export const diagnosePlayerTool: McpToolOptions<typeof diagnosePlayerSchema> = {
  name: 'diagnose_player',
  description: 'Diagnostica inconsistências de nível, avatares ou estrutura de uma fazenda pelo ID',
  category: 'DIAGNOSTICS',
  riskLevel: 'LOW',
  requiresGameApi: true,
  inputSchema: z.object({
    playerId: z.string().min(1, 'ID do jogador/fazenda é obrigatório'),
  }),
  handler: async (params) => {
    return playerService.diagnosePlayer(params.playerId);
  },
};
const diagnosePlayerSchema = z.object({
  playerId: z.string().min(1),
});

export const diagnoseInventoryTool: McpToolOptions<typeof diagnoseInventorySchema> = {
  name: 'diagnose_inventory',
  description: 'Inspeciona os slots de banca e estoque de um jogador buscando quantidades ou preços negativos',
  category: 'DIAGNOSTICS',
  riskLevel: 'LOW',
  requiresGameApi: true,
  inputSchema: z.object({
    playerId: z.string().min(1, 'ID do jogador/fazenda é obrigatório'),
  }),
  handler: async (params) => {
    return playerService.diagnoseInventory(params.playerId);
  },
};
const diagnoseInventorySchema = z.object({
  playerId: z.string().min(1),
});

export const getJournalListingsTool: McpToolOptions<typeof getJournalListingsSchema> = {
  name: 'get_journal_listings',
  description: 'Filtra e lista ofertas ativas no jornal por vendedor, item ou status com limite',
  category: 'JOURNAL',
  riskLevel: 'LOW',
  requiresGameApi: true,
  inputSchema: z.object({
    playerId: z.string().optional(),
    itemId: z.string().optional(),
    advertised: z.boolean().optional(),
    limit: z.number().min(1).max(100).optional().default(50),
  }),
  handler: async (params) => {
    return journalService.getJournalListings(params);
  },
};
const getJournalListingsSchema = z.object({
  playerId: z.string().optional(),
  itemId: z.string().optional(),
  advertised: z.boolean().optional(),
  limit: z.number().min(1).max(100).optional().default(50),
});

export const getMarketListingsTool: McpToolOptions<typeof getMarketListingsSchema> = {
  name: 'get_market_listings',
  description: 'Filtra ofertas ativas na banca de vendas por vendedor, comprador, item ou status de venda',
  category: 'MARKET',
  riskLevel: 'LOW',
  requiresGameApi: true,
  inputSchema: z.object({
    sellerId: z.string().optional(),
    buyerId: z.string().optional(),
    itemId: z.string().optional(),
    isSold: z.boolean().optional(),
    limit: z.number().min(1).max(100).optional().default(50),
  }),
  handler: async (params) => {
    return marketService.getMarketListings(params);
  },
};
const getMarketListingsSchema = z.object({
  sellerId: z.string().optional(),
  buyerId: z.string().optional(),
  itemId: z.string().optional(),
  isSold: z.boolean().optional(),
  limit: z.number().min(1).max(100).optional().default(50),
});

export const searchPlayersTool: McpToolOptions<typeof searchPlayersSchema> = {
  name: 'search_players',
  description: 'Busca jogadores e fazendas cadastradas por nome ou ID com limite',
  category: 'PLAYERS',
  riskLevel: 'LOW',
  requiresGameApi: true,
  inputSchema: z.object({
    query: z.string().min(1, 'Termo de busca é obrigatório'),
    limit: z.number().min(1).max(50).optional().default(20),
  }),
  handler: async (params) => {
    return playerService.searchPlayers(params.query, params.limit || 20);
  },
};
const searchPlayersSchema = z.object({
  query: z.string().min(1),
  limit: z.number().min(1).max(50).optional().default(20),
});
