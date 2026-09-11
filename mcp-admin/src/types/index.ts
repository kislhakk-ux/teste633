export type ServiceState = 'online' | 'offline' | 'degraded' | 'not_connected' | 'not_configured';

export interface ServiceStatus {
  status: ServiceState;
  latency?: number;
  message?: string;
}

export type McpToolRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type McpToolCategory =
  | 'Players'
  | 'PLAYERS'
  | 'Inventory'
  | 'INVENTORY'
  | 'Economy'
  | 'ECONOMY'
  | 'Server'
  | 'SERVER'
  | 'Database'
  | 'DATABASE'
  | 'Journal'
  | 'JOURNAL'
  | 'Market'
  | 'MARKET'
  | 'Game'
  | 'GAME'
  | 'Development'
  | 'System'
  | 'SYSTEM'
  | 'Diagnostics'
  | 'DIAGNOSTICS';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface HealthStatusData {
  status: 'online' | 'degraded' | 'offline';
  service: string;
  version: string;
  environment: string;
  uptime: number;
  timestamp: string;
}

export interface SystemMetrics {
  requests: number;
  success: number;
  errors: number;
  averageResponseTimeMs: number;
  startedAt: string;
}

export interface SystemStatusData {
  service: {
    name: string;
    version: string;
    environment: string;
    uptime: number;
  };
  services: {
    http: ServiceStatus;
    mcp: ServiceStatus;
    gameApi: ServiceStatus;
    database: ServiceStatus;
    journal: ServiceStatus;
    market: ServiceStatus;
  };
  metrics: SystemMetrics;
  mcpToolsCount: number;
}

export interface McpToolDefinition {
  name: string;
  description: string;
  category: McpToolCategory;
  riskLevel: McpToolRiskLevel;
  readOnly: boolean;
  enabled: boolean;
  available?: boolean;
  requiresGameApi?: boolean;
  requiresDatabase?: boolean;
  inputSchema: Record<string, any>;
  handler: (params: any) => Promise<any>;
}
