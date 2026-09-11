import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;
const MIN_PASSWORD_LENGTH = 10;

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePasswordPolicy(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
  }

  // Verificação básica de complexidade — sem exigências absurdas
  if (/^\s+$/.test(password)) {
    errors.push('A senha não pode conter apenas espaços.');
  }

  // Bloqueio de senhas fracas comuns
  const commonWeak = ['password', '12345678901', 'qwertyuiop', 'admin12345', 'adminadmin'];
  if (commonWeak.some((w) => password.toLowerCase().includes(w))) {
    errors.push('Senha muito comum. Escolha uma senha mais única.');
  }

  return { valid: errors.length === 0, errors };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
