import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('3001'),
  CORS_ORIGIN: z.string().default('*'),
  RATE_LIMIT_WINDOW_MS: z.string().transform((val) => parseInt(val, 10)).default('900000'),
  RATE_LIMIT_MAX: z.string().transform((val) => parseInt(val, 10)).default('200'),
  TRUST_PROXY: z.string().transform((val) => val === 'true' || val === '1').default('true'),
  GAME_API_URL: z.string().default('http://localhost:3000'),
  GAME_API_TOKEN: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  MCP_SERVER_NAME: z.string().default('farm-mcp-control'),
  MCP_SERVER_VERSION: z.string().default('1.0.0'),
  MCP_ACCESS_TOKEN: z.string().optional(),
  ADMIN_JWT_SECRET: z.string().min(8).default('dev_jwt_secret_farm_mcp_12345'),
  ADMIN_SESSION_SECRET: z.string().min(8).default('dev_session_secret_farm_mcp_12345'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error', 'critical']).default('info'),
  LOG_RETENTION_DAYS: z.string().transform((val) => parseInt(val, 10)).default('30'),
  AUDIT_LOG_RETENTION_DAYS: z.string().transform((val) => parseInt(val, 10)).default('180'),
  ERROR_RATE_WARNING_PERCENT: z.string().transform((val) => parseFloat(val)).default('10'),
  LATENCY_WARNING_MS: z.string().transform((val) => parseInt(val, 10)).default('1000'),
  ADMIN_WRITE_MODE: z.string().transform((val) => val === 'true' || val === '1').default('false'),
  ENABLE_DIAMOND_TOOLS: z.string().transform((val) => val === 'true' || val === '1').default('false'),
  ENABLE_BAN_TOOLS: z.string().transform((val) => val === 'true' || val === '1').default('false'),
  MAX_EXPORT_ROWS: z.string().transform((val) => parseInt(val, 10)).default('1000'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Configuração inválida de variáveis de ambiente:', parsed.error.format());
  throw new Error('Falha na validação das variáveis de ambiente');
}

const envData = parsed.data;

// Trava de segurança para produção: impedir inicialização com segredos fracos padrão
if (envData.NODE_ENV === 'production') {
  const criticalErrors: string[] = [];

  if (envData.ADMIN_SESSION_SECRET === 'dev_session_secret_farm_mcp_12345') {
    criticalErrors.push('ADMIN_SESSION_SECRET está usando o segredo padrão de desenvolvimento.');
  }
  if (envData.ADMIN_JWT_SECRET === 'dev_jwt_secret_farm_mcp_12345') {
    criticalErrors.push('ADMIN_JWT_SECRET está usando o segredo padrão de desenvolvimento.');
  }
  if (!envData.MCP_ACCESS_TOKEN && process.env.STRICT_PROD_CHECK !== 'false') {
    criticalErrors.push('MCP_ACCESS_TOKEN deve ser definido em ambiente de produção.');
  }

  if (criticalErrors.length > 0) {
    console.error('🚨 ERRO CRÍTICO DE SEGURANÇA NA INICIALIZAÇÃO DE PRODUÇÃO:');
    criticalErrors.forEach((err) => console.error(`  - ${err}`));
    throw new Error('Inicialização cancelada por falha nos requisitos de segurança de produção.');
  }
}

export const env = envData;
