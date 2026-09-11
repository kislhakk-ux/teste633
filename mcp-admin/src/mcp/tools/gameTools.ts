import { z } from 'zod';
import { gameService } from '../../services/gameService.js';
import { McpToolOptions } from '../types.js';

const getGameInfoSchema = z.object({});

export const getGameInfoTool: McpToolOptions<typeof getGameInfoSchema> = {
  name: 'get_game_info',
  description: 'Retorna informações sobre o estado do backend do jogo, número de jogadores e mercado',
  category: 'GAME',
  riskLevel: 'LOW',
  inputSchema: getGameInfoSchema,
  handler: async () => {
    return gameService.getGameInfo();
  },
};
