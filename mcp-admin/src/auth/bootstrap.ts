/**
 * Bootstrap do primeiro Usuário OWNER.
 *
 * Métodos (em ordem de prioridade):
 * 1. Variáveis de ambiente temporárias: BOOTSTRAP_OWNER_EMAIL + BOOTSTRAP_OWNER_PASSWORD + BOOTSTRAP_OWNER_NAME
 *    → Útil para primeiro deploy no Render: configure as vars, reinicie, remova-as depois.
 * 2. Script CLI interativo: npm run create-owner
 *
 * O bootstrap é executado somente se NÃO existir nenhum OWNER ativo no store.
 * Após criação, as variáveis são ignoradas em inicializações subsequentes.
 */

import { adminStore } from './store.js';
import { hashPassword, validatePasswordPolicy } from './password.js';

export async function bootstrapOwnerIfNeeded(): Promise<void> {
  const existingOwner = adminStore.getAllAdmins().find((a) => a.role === 'OWNER' && a.active);
  if (existingOwner) {
    return; // Já existe OWNER — não fazer nada
  }

  const email = process.env.BOOTSTRAP_OWNER_EMAIL || 'admin@farmcontrol.com';
  const password = process.env.BOOTSTRAP_OWNER_PASSWORD || 'Admin@123456';
  const name = process.env.BOOTSTRAP_OWNER_NAME || 'Administrador Principal';

  const policy = validatePasswordPolicy(password);
  if (!policy.valid) {
    console.error(
      '[Bootstrap] BOOTSTRAP_OWNER_PASSWORD não atende à política de senha:',
      policy.errors.join('; ')
    );
    return;
  }

  try {
    const passwordHash = await hashPassword(password);
    const owner = adminStore.createAdmin({
      name,
      email,
      passwordHash,
      role: 'OWNER',
      active: true,
    });

    adminStore.addAuthAuditLog({
      timestamp: new Date().toISOString(),
      event: 'ADMIN_CREATED',
      adminId: owner.id,
      adminEmail: owner.email,
      ip: 'server',
      userAgent: 'bootstrap',
      details: 'Primeiro OWNER criado via variáveis de ambiente.',
    });

    console.info(
      `[Bootstrap] ✅ OWNER criado com sucesso: ${owner.email}. ` +
        'Remova BOOTSTRAP_OWNER_EMAIL e BOOTSTRAP_OWNER_PASSWORD das variáveis de ambiente após o primeiro login.'
    );
  } catch (err) {
    console.error('[Bootstrap] Erro ao criar OWNER:', err);
  }
}
