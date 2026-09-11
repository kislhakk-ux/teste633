import { z } from 'zod';
import { journalService } from '../../services/journalService.js';
import { McpToolOptions } from '../types.js';

const getJournalStatusSchema = z.object({});

export const getJournalStatusTool: McpToolOptions<typeof getJournalStatusSchema> = {
  name: 'get_journal_status',
  description: 'Diagnostica o estado do jornal da comunidade, ofertas ativas, vendas e anúncios de NPCs',
  category: 'JOURNAL',
  riskLevel: 'LOW',
  inputSchema: getJournalStatusSchema,
  handler: async () => {
    return journalService.getJournalStatus();
  },
};
