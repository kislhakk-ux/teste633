export interface SystemStatusData {
  service: string;
  version: string;
  uptime: number;
  environment: string;
  timestamp: number;
  services: {
    mcp: string;
    gameBackend: string;
    database: string;
  };
  mcpToolsCount: number;
}
