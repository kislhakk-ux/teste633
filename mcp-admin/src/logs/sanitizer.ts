const BLACKLISTED_KEYWORDS = [
  'password',
  'passwordhash',
  'token',
  'authorization',
  'cookie',
  'secret',
  'apikey',
  'sessionid',
  'refreshtoken',
  'accesstoken',
  'databaseurl',
  'connectionstring',
  'mcp_access_token',
  'game_api_token',
  'jwt',
  'bearer',
];

/**
 * Sanitiza recursivamente objetos, arrays e strings eliminando segredos.
 * Evita exceções por referências circulares.
 */
export function sanitizeLogData<T = any>(data: T, seen = new WeakSet()): T {
  if (data === null || data === undefined) return data;

  if (typeof data === 'string') {
    // Caso seja uma string JSON, tenta tratar
    return data as any;
  }

  if (typeof data !== 'object') return data;

  // Proteção contra ciclos de objeto
  if (seen.has(data as object)) {
    return '[CIRCULAR]' as any;
  }
  seen.add(data as object);

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeLogData(item, seen)) as any;
  }

  // Se for uma instância de Error, sanitizar mensagem e extrair stack
  if (data instanceof Error) {
    return {
      name: data.name,
      message: sanitizeLogData(data.message, seen),
      stack: process.env.NODE_ENV === 'production' ? undefined : data.stack,
    } as any;
  }

  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(data as Record<string, any>)) {
    const lowerKey = key.toLowerCase();
    const normalizedKey = lowerKey.replace(/[_-\s]/g, '');
    const isSensitive = BLACKLISTED_KEYWORDS.some((kw) => {
      const normalizedKw = kw.toLowerCase().replace(/[_-\s]/g, '');
      return lowerKey.includes(kw.toLowerCase()) || normalizedKey.includes(normalizedKw);
    });

    if (isSensitive) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeLogData(value, seen);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

/**
 * Mascara endereços IP para visualização em papéis com acesso restrito (ex: 192.168.xxx.xxx)
 */
export function maskIpAddress(ip: string | undefined | null): string {
  if (!ip || ip === 'unknown') return 'unknown';
  if (ip === '::1' || ip === '127.0.0.1') return ip;

  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.xxx.xxx`;
  }
  const ipv6Parts = ip.split(':');
  if (ipv6Parts.length > 2) {
    return `${ipv6Parts[0]}:${ipv6Parts[1]}:xxxx:xxxx`;
  }
  return 'xxx.xxx.xxx.xxx';
}
