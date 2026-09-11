import type { Role, Permission } from './types.js';

// Mapa completo de permissões por role
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  OWNER: [
    'dashboard:view',
    'players:view',
    'inventory:view',
    'economy:view',
    'journal:view',
    'market:view',
    'logs:view',
    'logs:export',
    'audit:view',
    'security:view',
    'traces:view',
    'tools:view',
    'tools:execute',
    'settings:view',
    'settings:update',
    'admins:view',
    'admins:manage',
    'sessions:view',
    'sessions:revoke',
  ],
  ADMIN: [
    'dashboard:view',
    'players:view',
    'inventory:view',
    'economy:view',
    'journal:view',
    'market:view',
    'logs:view',
    'logs:export',
    'audit:view',
    'security:view',
    'traces:view',
    'tools:view',
    'tools:execute',
    'settings:view',
    'sessions:view',
  ],
  SUPPORT: [
    'dashboard:view',
    'players:view',
    'inventory:view',
    'journal:view',
    'market:view',
    'logs:view',
    'audit:view',
    'traces:view',
    'tools:view',
  ],
  READ_ONLY: [
    'dashboard:view',
    'players:view',
    'inventory:view',
    'economy:view',
    'logs:view',
    'traces:view',
  ],
};

export function getPermissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  const rolePerms = ROLE_PERMISSIONS[role] ?? [];
  return permissions.some((p) => rolePerms.includes(p));
}
