import { env } from './env.js';

export const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  corsOrigin: env.CORS_ORIGIN,
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
  },
  trustProxy: env.TRUST_PROXY,
  isProduction: env.NODE_ENV === 'production',
  isDevelopment: env.NODE_ENV === 'development',
  isTest: env.NODE_ENV === 'test',
  gameApiUrl: env.GAME_API_URL,
  gameApiToken: env.GAME_API_TOKEN,
  databaseUrl: env.DATABASE_URL,
  mcp: {
    name: env.MCP_SERVER_NAME,
    version: env.MCP_SERVER_VERSION,
    accessToken: env.MCP_ACCESS_TOKEN,
  },
  auth: {
    jwtSecret: env.ADMIN_JWT_SECRET,
    sessionSecret: env.ADMIN_SESSION_SECRET,
  },
  flags: {
    adminWriteMode: env.ADMIN_WRITE_MODE,
    enableDiamondTools: env.ENABLE_DIAMOND_TOOLS,
    enableBanTools: env.ENABLE_BAN_TOOLS,
  },
  limits: {
    maxExportRows: env.MAX_EXPORT_ROWS,
  },
  logging: {
    level: env.LOG_LEVEL,
    retentionDays: env.LOG_RETENTION_DAYS,
    auditRetentionDays: env.AUDIT_LOG_RETENTION_DAYS,
    errorRateWarningPercent: env.ERROR_RATE_WARNING_PERCENT,
    latencyWarningMs: env.LATENCY_WARNING_MS,
  },
};

export default config;
