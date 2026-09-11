import { McpToolOptions, RegisteredMcpTool } from './types.js';
import { logger } from '../logs/logger.js';
import { executeToolWithLogging } from './executeWrapper.js';
import { logStore } from '../logs/logStore.js';

class McpToolRegistry {
  private tools: Map<string, RegisteredMcpTool> = new Map();

  public registerTool<TInput extends import('zod').ZodType>(options: McpToolOptions<TInput>): void {
    if (this.tools.has(options.name)) {
      logger.warn(`[MCP Registry] Ferramenta ${options.name} já registrada. Sobrescrevendo...`);
    }

    const registeredTool: RegisteredMcpTool = {
      name: options.name,
      description: options.description,
      category: options.category,
      riskLevel: options.riskLevel,
      readOnly: options.readOnly ?? true,
      enabled: true,
      requiresGameApi: options.requiresGameApi ?? false,
      requiresDatabase: options.requiresDatabase ?? false,
      inputSchema: options.inputSchema,
      handler: options.handler,
      executionsCount: 0,
      totalDurationMs: 0,
      errorsCount: 0,
    };

    this.tools.set(options.name, registeredTool);
    logger.info(`[MCP Registry] Ferramenta '${options.name}' [Categoria: ${options.category}, Risco: ${options.riskLevel}] registrada.`);
  }

  public getTool(name: string): RegisteredMcpTool | undefined {
    return this.tools.get(name);
  }

  public getAllTools(): (Omit<RegisteredMcpTool, 'handler' | 'inputSchema'> & {
    successRate?: number;
    averageDuration?: number;
    p50?: number;
    p95?: number;
    p99?: number;
  })[] {
    const metricsMap = new Map(logStore.getToolMetrics().map((m) => [m.toolName, m]));

    return Array.from(this.tools.values()).map((tool) => {
      const metric = metricsMap.get(tool.name);
      return {
        name: tool.name,
        description: tool.description,
        category: tool.category,
        riskLevel: tool.riskLevel,
        readOnly: tool.readOnly,
        enabled: tool.enabled,
        requiresGameApi: tool.requiresGameApi,
        requiresDatabase: tool.requiresDatabase,
        executionsCount: metric ? metric.calls : tool.executionsCount,
        lastExecutedAt: metric?.lastExecutedAt || tool.lastExecutedAt || undefined,
        totalDurationMs: tool.totalDurationMs,
        errorsCount: metric ? metric.errors : tool.errorsCount,
        successRate: metric ? metric.successRate : 100,
        averageDuration: metric ? metric.averageDuration : 0,
        p50: metric?.p50,
        p95: metric?.p95,
        p99: metric?.p99,
      };
    });
  }

  public async executeTool(name: string, inputParams: any, adminId: string = 'system'): Promise<any> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Ferramenta MCP '${name}' não encontrada`);
    }

    return executeToolWithLogging({
      toolName: tool.name,
      category: tool.category,
      riskLevel: tool.riskLevel,
      readOnly: tool.readOnly,
      principal: adminId,
      params: inputParams,
      handler: async (p) => {
        const validatedInput = tool.inputSchema.parse(p);
        return tool.handler(validatedInput);
      },
    });
  }
}

export const mcpRegistry = new McpToolRegistry();
