import { Router } from 'express';
import { requireAuth, requirePermission } from '../../middleware/authMiddleware.js';
import {
  getLogs,
  getTrace,
  exportLogsController,
  getToolMetricsController,
  getIncidentGroupsController,
  getDashboardSummaryController,
  getPlayerLogsController,
  getAdminLogsController,
} from '../controllers/logController.js';

const router = Router();

// Todas as rotas de logs exigem sessão autenticada
router.use(requireAuth);

router.get('/dashboard-summary', requirePermission('dashboard:view'), getDashboardSummaryController);
router.get('/tool-metrics', requirePermission('logs:view'), getToolMetricsController);
router.get('/incidents', requirePermission('logs:view'), getIncidentGroupsController);
router.get('/export', requirePermission('logs:export'), exportLogsController);
router.get('/trace/:correlationId', requirePermission('traces:view'), getTrace);
router.get('/player/:playerId', requirePermission('players:view'), getPlayerLogsController);
router.get('/admin/:adminId', requirePermission('audit:view'), getAdminLogsController);
router.get('/', requirePermission('logs:view'), getLogs);

export default router;
