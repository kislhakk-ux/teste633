import { Router } from 'express';
import statusRoutes from './statusRoutes.js';
import adminRoutes from './adminRoutes.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import logRoutes from './logRoutes.js';

const router = Router();

// Rotas públicas de status
router.use('/', statusRoutes);

// Rotas de autenticação (login/logout são públicas, me/change-password são protegidas internamente)
router.use('/auth', authRoutes);

// Rotas administrativas protegidas
router.use('/admin', adminRoutes);

// Gestão de administradores e sessões
router.use('/admin/users', userRoutes);

// Logs, Auditoria, Traces e Métricas
router.use('/admin/logs', logRoutes);

export default router;
