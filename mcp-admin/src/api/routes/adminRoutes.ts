import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { requireAuth, requirePermission } from '../../middleware/authMiddleware.js';

const router = Router();

// Todas as rotas requerem autenticação (requireAuth)
// Validação de permissão feita também no backend em cada rota

router.get(
  '/dashboard',
  requireAuth,
  requirePermission('dashboard:view'),
  adminController.getDashboardOverview
);

router.get(
  '/players',
  requireAuth,
  requirePermission('players:view'),
  adminController.getPlayers
);

router.get(
  '/players/:id',
  requireAuth,
  requirePermission('players:view'),
  adminController.getPlayerDetail
);

router.get(
  '/journal',
  requireAuth,
  requirePermission('journal:view'),
  adminController.getJournalData
);

router.get(
  '/market',
  requireAuth,
  requirePermission('market:view'),
  adminController.getMarketData
);


router.post(
  '/tools/execute',
  requireAuth,
  requirePermission('tools:execute'),
  adminController.executeTool
);

export default router;
