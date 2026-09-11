import { McpToolRiskLevel } from '../types/index.js';
import { AdminRole } from './auth.js';

export function isToolExecutionAllowed(role: AdminRole, riskLevel: McpToolRiskLevel): boolean {
  switch (riskLevel) {
    case 'LOW':
      return ['OWNER', 'ADMIN', 'SUPPORT', 'READ_ONLY'].includes(role);
    case 'MEDIUM':
      return ['OWNER', 'ADMIN', 'SUPPORT'].includes(role);
    case 'HIGH':
      return ['OWNER', 'ADMIN'].includes(role);
    case 'CRITICAL':
      return ['OWNER'].includes(role);
    default:
      return false;
  }
}
