import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import type { AdminUser, AdminSession, LoginAttempt, AuthAuditLog, Role } from './types.js';

// Diretório de persistência — fora do dist para sobreviver a builds
const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'admin_store.json');

interface StoreData {
  admins: AdminUser[];
  sessions: AdminSession[];
  loginAttempts: LoginAttempt[];
  authAuditLogs: AuthAuditLog[];
}

class AdminStore {
  private data: StoreData = { admins: [], sessions: [], loginAttempts: [], authAuditLogs: [] };
  private saveTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.load();
  }

  // ----- PERSISTÊNCIA -----

  private load(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(STORE_FILE)) {
        const raw = fs.readFileSync(STORE_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Garantir arrays
        this.data.admins ??= [];
        this.data.sessions ??= [];
        this.data.loginAttempts ??= [];
        this.data.authAuditLogs ??= [];
      }
    } catch {
      // Arquivo corrompido ou inexistente — inicializar vazio
      this.data = { admins: [], sessions: [], loginAttempts: [], authAuditLogs: [] };
    }
  }

  private scheduleSave(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(STORE_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[AdminStore] Erro ao persistir store:', err);
    }
  }

  private save(): void {
    this.scheduleSave();
  }

  // ----- ADMINS -----

  getAllAdmins(): AdminUser[] {
    return this.data.admins;
  }

  findAdminById(id: string): AdminUser | undefined {
    return this.data.admins.find((a) => a.id === id);
  }

  findAdminByEmail(email: string): AdminUser | undefined {
    return this.data.admins.find((a) => a.email.toLowerCase() === email.toLowerCase());
  }

  createAdmin(user: Omit<AdminUser, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt'>): AdminUser {
    const admin: AdminUser = {
      ...user,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: null,
    };
    this.data.admins.push(admin);
    this.save();
    return admin;
  }

  updateAdmin(id: string, updates: Partial<AdminUser>): AdminUser | null {
    const idx = this.data.admins.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.data.admins[idx] = {
      ...this.data.admins[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.admins[idx];
  }

  recordLogin(id: string): void {
    const idx = this.data.admins.findIndex((a) => a.id === id);
    if (idx !== -1) {
      this.data.admins[idx].lastLoginAt = new Date().toISOString();
      this.save();
    }
  }

  countActiveOwners(): number {
    return this.data.admins.filter((a) => a.role === 'OWNER' && a.active).length;
  }

  // ----- SESSIONS -----

  createSession(adminId: string, ip: string, userAgent: string): AdminSession {
    const ttlHours = parseInt(process.env.ADMIN_SESSION_TTL_HOURS ?? '8', 10);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlHours * 60 * 60 * 1000);

    const session: AdminSession = {
      id: randomUUID(),
      adminId,
      token: randomUUID() + '-' + randomUUID(), // token opaco
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      lastActivityAt: now.toISOString(),
      ipAddress: ip,
      userAgent: userAgent.substring(0, 200),
    };
    this.data.sessions.push(session);
    this.save();
    return session;
  }

  findSessionByToken(token: string): AdminSession | undefined {
    return this.data.sessions.find((s) => s.token === token);
  }

  findSessionById(id: string): AdminSession | undefined {
    return this.data.sessions.find((s) => s.id === id);
  }

  getSessionsForAdmin(adminId: string): AdminSession[] {
    const now = new Date();
    return this.data.sessions.filter(
      (s) => s.adminId === adminId && new Date(s.expiresAt) > now
    );
  }

  getAllActiveSessions(): AdminSession[] {
    const now = new Date();
    return this.data.sessions.filter((s) => new Date(s.expiresAt) > now);
  }

  touchSession(token: string): void {
    const idx = this.data.sessions.findIndex((s) => s.token === token);
    if (idx !== -1) {
      this.data.sessions[idx].lastActivityAt = new Date().toISOString();
      this.save();
    }
  }

  revokeSession(token: string): void {
    this.data.sessions = this.data.sessions.filter((s) => s.token !== token);
    this.save();
  }

  revokeSessionById(id: string): void {
    this.data.sessions = this.data.sessions.filter((s) => s.id !== id);
    this.save();
  }

  revokeAllSessionsForAdmin(adminId: string): void {
    this.data.sessions = this.data.sessions.filter((s) => s.adminId !== adminId);
    this.save();
  }

  revokeOtherSessionsForAdmin(adminId: string, currentToken: string): void {
    this.data.sessions = this.data.sessions.filter(
      (s) => s.adminId !== adminId || s.token === currentToken
    );
    this.save();
  }

  purgeExpiredSessions(): void {
    const now = new Date();
    this.data.sessions = this.data.sessions.filter((s) => new Date(s.expiresAt) > now);
    this.save();
  }

  // ----- LOGIN ATTEMPTS (Brute-force) -----

  recordLoginAttempt(ip: string, email: string, success: boolean): void {
    const now = new Date();
    const key = `${ip}::${email.toLowerCase()}`;

    let attempt = this.data.loginAttempts.find(
      (a) => a.ip === ip && a.email.toLowerCase() === email.toLowerCase()
    );

    if (success) {
      // Limpar tentativas ao fazer login com sucesso
      this.data.loginAttempts = this.data.loginAttempts.filter(
        (a) => !(a.ip === ip && a.email.toLowerCase() === email.toLowerCase())
      );
      this.save();
      return;
    }

    if (!attempt) {
      attempt = {
        ip,
        email: email.toLowerCase(),
        failedCount: 0,
        lastAttemptAt: now.toISOString(),
        blockedUntil: null,
      };
      this.data.loginAttempts.push(attempt);
    }

    attempt.failedCount++;
    attempt.lastAttemptAt = now.toISOString();

    // Bloquear após 5 tentativas por 15 minutos
    if (attempt.failedCount >= 5) {
      const blockUntil = new Date(now.getTime() + 15 * 60 * 1000);
      attempt.blockedUntil = blockUntil.toISOString();
    }

    this.save();
  }

  isBlocked(ip: string, email: string): { blocked: boolean; retryAfter?: Date } {
    const attempt = this.data.loginAttempts.find(
      (a) => a.ip === ip && a.email.toLowerCase() === email.toLowerCase()
    );
    if (!attempt || !attempt.blockedUntil) return { blocked: false };

    const retryAfter = new Date(attempt.blockedUntil);
    if (new Date() < retryAfter) {
      return { blocked: true, retryAfter };
    }

    // Bloqueio expirado — limpar
    attempt.blockedUntil = null;
    attempt.failedCount = 0;
    this.save();
    return { blocked: false };
  }

  clearLoginAttempts(ip?: string, email?: string): void {
    if (ip && email) {
      this.data.loginAttempts = this.data.loginAttempts.filter(
        (a) => !(a.ip === ip && a.email.toLowerCase() === email.toLowerCase())
      );
    } else {
      this.data.loginAttempts = [];
    }
    this.save();
  }

  // ----- AUTH AUDIT LOGS -----

  addAuthAuditLog(log: Omit<AuthAuditLog, 'id'>): void {
    const entry: AuthAuditLog = { id: randomUUID(), ...log };
    this.data.authAuditLogs.push(entry);
    // Manter os últimos 500 logs de auth
    if (this.data.authAuditLogs.length > 500) {
      this.data.authAuditLogs = this.data.authAuditLogs.slice(-500);
    }
    this.save();
  }

  getAuthAuditLogs(limit = 50): AuthAuditLog[] {
    return [...this.data.authAuditLogs]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  getRecentLoginAttempts(limit = 20): AuthAuditLog[] {
    return this.getAuthAuditLogs(100)
      .filter((l) => l.event === 'LOGIN_FAILED' || l.event === 'LOGIN_SUCCESS')
      .slice(0, limit);
  }
}

export const adminStore = new AdminStore();
