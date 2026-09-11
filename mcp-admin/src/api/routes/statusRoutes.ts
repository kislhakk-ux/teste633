import { Router } from 'express';
import { statusController } from '../controllers/statusController.js';

const router = Router();

router.get('/status', statusController.getStatus);
router.get('/readiness', statusController.getReadiness);
router.get('/mcp/tools', statusController.getMcpTools);

export default router;
