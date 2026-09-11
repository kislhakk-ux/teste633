import { createApp } from './app.js';
import config from '../config/index.js';
import { logger } from '../logs/logger.js';

const port = Number(process.env.PORT) || config.port || 3001;
const host = '0.0.0.0';

async function start() {
  const app = await createApp();

  const server = app.listen(port, host, () => {
    logger.info(`🚀 MCP Admin Server iniciado com sucesso!`, {
      port,
      host,
      env: config.env,
      mcpServer: config.mcp.name,
      mcpVersion: config.mcp.version,
    });
    console.log(`\n======================================================`);
    console.log(`🟢 Farm MCP Control rodando em http://${host}:${port}`);
    console.log(`🏥 Health Check: http://localhost:${port}/health`);
    console.log(`📊 Status API: http://localhost:${port}/api/status`);
    console.log(`🔐 Login Admin: http://localhost:${port}/login`);
    console.log(`🤖 MCP Endpoint: http://localhost:${port}/mcp`);
    console.log(`======================================================\n`);
  });

  function shutdown(signal: string): void {
    logger.info(`Sinal ${signal} recebido. Encerrando o servidor HTTP graciosamente...`);
    server.close(() => {
      logger.info('Servidor HTTP totalmente encerrado.');
      process.exit(0);
    });
    setTimeout(() => {
      logger.error('Forçando encerramento do processo após timeout de shutdown.');
      process.exit(1);
    }, 10000);
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

// Tratamento de erros fatais não capturados
process.on('uncaughtException', (error: Error) => {
  logger.error(`[UncaughtException] ${error.message}`, error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
  logger.error(`[UnhandledRejection] Motivo: ${reason?.message || reason}`, reason);
});

start().catch((err) => {
  console.error('Erro fatal ao iniciar servidor:', err);
  process.exit(1);
});
