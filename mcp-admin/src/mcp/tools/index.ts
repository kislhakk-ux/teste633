import { mcpRegistry } from '../registry.js';
import { logger } from '../../logs/logger.js';

import { serverStatusTool, getServerStatsTool } from './systemTools.js';
import { getGameInfoTool } from './gameTools.js';
import { getOnlinePlayersTool, getPlayerTool } from './playerTools.js';
import { getJournalStatusTool } from './journalTools.js';
import { getMarketStatusTool } from './marketTools.js';
import {
  diagnoseJournalTool,
  diagnoseMarketTool,
  diagnosePlayerTool,
  diagnoseInventoryTool,
  getJournalListingsTool,
  getMarketListingsTool,
  searchPlayersTool,
} from './diagnosticTools.js';

export function initializeMcpTools(): void {
  logger.info('[MCP Tools] Registrando conjunto expandido de ferramentas READ-ONLY e Diagnóstico...');

  mcpRegistry.registerTool(serverStatusTool);
  mcpRegistry.registerTool(getServerStatsTool);
  mcpRegistry.registerTool(getGameInfoTool);
  mcpRegistry.registerTool(getOnlinePlayersTool);
  mcpRegistry.registerTool(getPlayerTool);
  mcpRegistry.registerTool(searchPlayersTool);
  mcpRegistry.registerTool(getJournalStatusTool);
  mcpRegistry.registerTool(getJournalListingsTool);
  mcpRegistry.registerTool(diagnoseJournalTool);
  mcpRegistry.registerTool(getMarketStatusTool);
  mcpRegistry.registerTool(getMarketListingsTool);
  mcpRegistry.registerTool(diagnoseMarketTool);
  mcpRegistry.registerTool(diagnosePlayerTool);
  mcpRegistry.registerTool(diagnoseInventoryTool);

  logger.info(`[MCP Tools] ${mcpRegistry.getAllTools().length} ferramentas READ-ONLY registradas com sucesso no Registry.`);
}
