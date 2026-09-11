export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options?.headers || {}),
    },
  });

  const body: ApiResponse<T> = await response.json();
  if (!response.ok || !body.success) {
    throw new Error(body.error?.message || `Erro HTTP ${response.status}`);
  }

  return body.data as T;
}

export const api = {
  getOverview: () => request<any>('/api/admin/dashboard'),
  getStatus: () => request<any>('/api/status'),
  getTools: () => request<any[]>('/api/mcp/tools'),
  getPlayers: (query: string = '', limit: number = 20) =>
    request<any>(`/api/admin/players?query=${encodeURIComponent(query)}&limit=${limit}`),
  getPlayerDetail: (id: string) => request<any>(`/api/admin/players/${encodeURIComponent(id)}`),
  getJournal: () => request<any>('/api/admin/journal'),
  getMarket: () => request<any>('/api/admin/market'),
  
  // Endpoints avançados de Logs e Rastreabilidade (Etapa 8)
  getLogs: (params: Record<string, any> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        searchParams.append(k, String(v));
      }
    });
    return request<any>(`/api/admin/logs?${searchParams.toString()}`);
  },
  getTrace: (correlationId: string) => request<any>(`/api/admin/logs/trace/${encodeURIComponent(correlationId)}`),
  getToolMetrics: () => request<any[]>('/api/admin/logs/tool-metrics'),
  getIncidentGroups: () => request<any[]>('/api/admin/logs/incidents'),
  getDashboardSummary: () => request<any>('/api/admin/logs/dashboard-summary'),
  getPlayerLogs: (playerId: string, limit: number = 50) =>
    request<any[]>(`/api/admin/logs/player/${encodeURIComponent(playerId)}?limit=${limit}`),
  getAdminLogs: (adminId: string, limit: number = 50) =>
    request<any[]>(`/api/admin/logs/admin/${encodeURIComponent(adminId)}?limit=${limit}`),

  exportLogsUrl: (params: Record<string, any> = {}, format: 'json' | 'csv' = 'json') => {
    const searchParams = new URLSearchParams({ format });
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        searchParams.append(k, String(v));
      }
    });
    return `/api/admin/logs/export?${searchParams.toString()}`;
  },

  executeTool: (toolName: string, params: Record<string, any> = {}) =>
    request<any>('/api/admin/tools/execute', {
      method: 'POST',
      body: JSON.stringify({ toolName, params }),
    }),
};
