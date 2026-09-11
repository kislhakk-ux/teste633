import { z } from 'zod';
import { playerService } from '../../services/playerService.js';
import { McpToolOptions } from '../types.js';

const getOnlinePlayersSchema = z.object({
  limit: z.number().min(1).max(100).optional().default(50),
});

export const getOnlinePlayersTool: McpToolOptions<typeof getOnlinePlayersSchema> = {
  name: 'get_online_players',
  description: 'Lista os jogadores/fazendas conectados em tempo real com paginação e limites',
  category: 'PLAYERS',
  riskLevel: 'LOW',
  inputSchema: getOnlinePlayersSchema,
  handler: async (params) => {
    return playerService.getOnlinePlayers(params.limit || 50);
  },
};

const getPlayerSchema = z.object({
  playerId: z.string().min(1, 'O ID da fazenda/jogador é obrigatório'),
});

export const getPlayerTool: McpToolOptions<typeof getPlayerSchema> = {
  name: 'get_player',
  description: 'Consulta o estado detalhado, nível e bancas de uma fazenda pelo ID',
  category: 'PLAYERS',
  riskLevel: 'LOW',
  inputSchema: getPlayerSchema,
  handler: async (params) => {
    return playerService.getPlayer(params.playerId);
  },
};
