import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { requireAuth } from '../../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limit específico para login: 5 tentativas por 15 minutos por IP
const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_ATTEMPTS',
      message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    },
  },
});

// Rotas públicas de auth
router.post('/login', loginRateLimit, authController.login);
router.post('/logout', authController.logout);

// Rotas autenticadas
router.get('/me', requireAuth, authController.me);
router.post('/change-password', requireAuth, authController.changePassword);

export default router;
