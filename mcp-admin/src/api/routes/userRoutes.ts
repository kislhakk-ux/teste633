import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { requireAuth, requirePermission } from '../../middleware/authMiddleware.js';

const router = Router();

// Todas as rotas abaixo requerem autenticação
router.use(requireAuth);

// Listar administradores
router.get('/', requirePermission('admins:view'), userController.listAdmins);

// Criar administrador
router.post('/', requirePermission('admins:manage'), userController.createAdmin);

// Atualizar administrador (role, status)
router.patch('/:id', requirePermission('admins:manage'), userController.updateAdmin);

// Sessões
router.get('/sessions', requirePermission('sessions:view'), userController.listSessions);
router.delete('/sessions/other', userController.revokeOtherSessions);
router.delete('/sessions/:id', requirePermission('sessions:revoke'), userController.revokeSession);

// Dados da página de segurança
router.get('/security', requirePermission('sessions:view'), userController.getSecurityData);

export default router;
