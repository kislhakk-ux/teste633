import { z } from 'zod';
import { McpToolRiskLevel, McpToolCategory } from '../types/index.js';

export interface McpToolOptions<TInput extends z.ZodType = z.ZodType> {
  name: string;
  description: string;
  category: McpToolCategory;
  riskLevel: McpToolRiskLevel;
  readOnly?: boolean;
  requiresGameApi?: boolean;
  requiresDatabase?: boolean;
  inputSchema: TInput;
  handler: (params: z.infer<TInput>) => Promise<any>;
}

export interface RegisteredMcpTool {
  name: string;
  description: string;
  category: string;
  riskLevel: McpToolRiskLevel;
  readOnly: boolean;
  enabled: boolean;
  requiresGameApi: boolean;
  requiresDatabase: boolean;
  inputSchema: z.ZodType;
  handler: (params: any) => Promise<any>;
  executionsCount: number;
  lastExecutedAt?: string;
  totalDurationMs: number;
  errorsCount: number;
}
