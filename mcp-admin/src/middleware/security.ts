import helmet from 'helmet';
import cors from 'cors';
import express, { Express, Request, Response, NextFunction } from 'express';
import config from '../config/index.js';

// Simple in-memory rate limiter
const ipRequests = new Map<string, { count: number; resetTime: number }>();

function rateLimiterMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Ignorar rate limit para health check
  if (req.path === '/health') {
    return next();
  }

  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = config.rateLimit.windowMs;
  const max = config.rateLimit.max;

  const record = ipRequests.get(ip);

  if (!record || now > record.resetTime) {
    ipRequests.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  record.count++;

  if (record.count > max) {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Muitas requisições originadas deste IP. Tente novamente mais tarde.',
      },
    });
    return;
  }

  next();
}

export function setupSecurityMiddleware(app: Express): void {
  if (config.trustProxy) {
    app.set('trust proxy', 1);
  }

  // Configuração estrita de Helmet e Content Security Policy (CSP)
  app.use(
    helmet({
      contentSecurityPolicy: config.isTest
        ? false
        : {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              fontSrc: ["'self'", 'data:'],
              imgSrc: ["'self'", 'data:', 'https:'],
              connectSrc: ["'self'"],
              objectSrc: ["'none'"],
              baseUri: ["'self'"],
              frameAncestors: ["'none'"],
            },
          },
      hsts: config.isProduction
        ? {
            maxAge: 31536000, // 1 ano
            includeSubDomains: true,
            preload: true,
          }
        : false,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      crossOriginEmbedderPolicy: false,
    })
  );

  // Headers de política de recursos adicionais
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    next();
  });

  // Configuração Segura de CORS
  const allowedOrigins =
    config.corsOrigin === '*'
      ? '*'
      : config.corsOrigin.split(',').map((o) => o.trim());

  app.use(
    cors({
      origin: (origin, callback) => {
        // Permitir requisições sem origin (ex: chamadas de mesma origem no SPA, CLI ou cURL interno)
        if (!origin) return callback(null, true);
        if (allowedOrigins === '*') {
          // Em desenvolvimento permite *, em produção exige origem específica se não for *
          return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Origem não permitida pelo CORS'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Request-ID',
        'X-Correlation-ID',
      ],
      exposedHeaders: ['X-Request-ID', 'X-Correlation-ID'],
    })
  );

  // Limite rigoroso de tamanho do payload (prevenção de Payload DoS)
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));

  app.use(rateLimiterMiddleware);
}
