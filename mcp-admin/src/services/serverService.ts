import config from '../config/index.js';
import { metricsManager } from '../metrics/metricsManager.js';
import { mcpRegistry } from '../mcp/registry.js';

export class ServerService {
  public getStatus() {
    const memoryUsage = process.memoryUsage();
    return {
      service: config.mcp.name,
      version: config.mcp.version,
      status: 'online',
      uptimeSeconds: Number(process.uptime().toFixed(2)),
      environment: config.env,
      nodeVersion: process.version,
      memory: {
        rssMb: Number((memoryUsage.rss / (1024 * 1024)).toFixed(2)),
        heapUsedMb: Number((memoryUsage.heapUsed / (1024 * 1024)).toFixed(2)),
        heapTotalMb: Number((memoryUsage.heapTotal / (1024 * 1024)).toFixed(2)),
      },
      registeredTools: mcpRegistry.getAllTools().length,
      metrics: metricsManager.getMetrics(),
      timestamp: new Date().toISOString(),
    };
  }
}

export const serverService = new ServerService();
