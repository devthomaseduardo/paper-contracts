import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { config } from './config.js';
import { errorHandler } from './middleware/errorHandler.js';
import { openApiSpec } from './openapi.js';
import { aiRouter } from './routes/ai.js';
import { clientsRouter } from './routes/clients.js';

export function createApp() {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(express.json({ limit: '512kb' }));
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) {
          callback(null, true);
          return;
        }
        callback(null, config.frontendOrigins.includes(origin));
      },
    })
  );

  const v1 = express.Router();

  v1.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      geminiConfigured: Boolean(config.geminiApiKey),
    });
  });

  v1.use('/ai', aiRouter);
  v1.use('/clients', clientsRouter);

  app.use('/api/v1', v1);

  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, { customSiteTitle: 'devthomas/contratos — API' }));
  app.get('/api/v1/openapi.json', (_req, res) => res.json(openApiSpec));

  app.use(errorHandler);

  return app;
}
