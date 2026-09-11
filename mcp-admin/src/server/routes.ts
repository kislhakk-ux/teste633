import { Router } from 'express';
import { statusController } from '../api/controllers/statusController.js';
import config from '../config/index.js';
import { mcpRegistry } from '../mcp/registry.js';
import { ApiResponse } from '../types/index.js';

const router = Router();

// Rota raiz GET / - Se a requisição for do navegador (text/html), deixa passar para o SPA Dashboard
router.get('/', (req, res, next) => {
  const acceptHeader = req.headers.accept || '';
  if (acceptHeader.includes('text/html')) {
    return next();
  }
  const tools = mcpRegistry.getAllTools();
  const response: ApiResponse = {
    success: true,
    data: {
      service: config.mcp.name,
      status: 'online',
      version: config.mcp.version,
      mcpEndpoint: '/mcp',
      toolsCount: tools.length,
    },
  };
  res.json(response);
});

// Health check GET /health
router.get('/health', statusController.getHealth);

export default router;
