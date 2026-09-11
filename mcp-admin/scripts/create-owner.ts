#!/usr/bin/env tsx
/**
 * Script de criação do primeiro OWNER via CLI
 *
 * Uso:
 *   npm run create-owner
 *
 * Ou passando variáveis de ambiente:
 *   OWNER_NAME="Admin" OWNER_EMAIL="admin@example.com" OWNER_PASSWORD="mypassword123" npm run create-owner
 *
 * Este script NÃO cria endpoint público — é executado apenas localmente/no servidor.
 */
import * as readline from 'readline';
import { adminStore } from '../src/auth/store.js';
import { hashPassword, validatePasswordPolicy } from '../src/auth/password.js';

async function prompt(question: string, hidden = false): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    if (hidden && process.stdout.isTTY) {
      process.stdout.write(question);
      let input = '';
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', (char: string) => {
        if (char === '\r' || char === '\n') {
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdout.write('\n');
          resolve(input);
        } else if (char === '\u0003') {
          process.exit();
        } else {
          input += char;
          process.stdout.write('*');
        }
      });
    } else {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer);
      });
    }
  });
}

async function main(): Promise<void> {
  console.log('\n🌾 Farm MCP Control — Criação do Primeiro OWNER Administrativo\n');

  // Verificar se já existe um OWNER
  const existingOwner = adminStore.getAllAdmins().find((a) => a.role === 'OWNER' && a.active);
  if (existingOwner) {
    console.log(`⚠️  Já existe um OWNER ativo no sistema: ${existingOwner.email}`);
    console.log('   Para criar outro OWNER, use a tela de gestão de administradores.');
    process.exit(0);
  }

  // Verificar variáveis de ambiente (modo não-interativo)
  let name = process.env.OWNER_NAME || '';
  let email = process.env.OWNER_EMAIL || '';
  let password = process.env.OWNER_PASSWORD || '';

  if (!name) name = await prompt('Nome completo: ');
  if (!email) email = await prompt('Email: ');
  if (!password) password = await prompt('Senha (mínimo 10 caracteres): ', true);

  // Validar campos
  if (!name.trim()) {
    console.error('❌ Nome é obrigatório.');
    process.exit(1);
  }
  if (!email.includes('@')) {
    console.error('❌ Email inválido.');
    process.exit(1);
  }

  const policy = validatePasswordPolicy(password);
  if (!policy.valid) {
    console.error('❌ Senha inválida:', policy.errors.join('\n   '));
    process.exit(1);
  }

  const existing = adminStore.findAdminByEmail(email);
  if (existing) {
    console.error(`❌ Já existe uma conta com o e-mail: ${email}`);
    process.exit(1);
  }

  console.log('\n⏳ Gerando hash da senha (bcrypt)...');
  const passwordHash = await hashPassword(password);

  const owner = adminStore.createAdmin({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash,
    role: 'OWNER',
    active: true,
  });

  adminStore.addAuthAuditLog({
    timestamp: new Date().toISOString(),
    event: 'ADMIN_CREATED',
    adminId: owner.id,
    adminEmail: owner.email,
    ip: 'cli',
    userAgent: 'create-owner script',
    details: 'Primeiro OWNER criado via script CLI.',
  });

  console.log('\n✅ OWNER criado com sucesso!');
  console.log(`   Nome:  ${owner.name}`);
  console.log(`   Email: ${owner.email}`);
  console.log(`   Role:  ${owner.role}`);
  console.log(`   ID:    ${owner.id}`);
  console.log('\n🔑 Acesse o dashboard com estas credenciais em: /login\n');
}

main().catch((err) => {
  console.error('Erro:', err);
  process.exit(1);
});
