import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import pino from 'pino';
import httpLogger from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middlewares/errorHandler.js';
import { router } from './routes/index.js';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

export const app = express();
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    const allow = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!origin || allow.length === 0 || allow.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(compression());
app.use(express.json());
app.use(rateLimit({ windowMs: 60_000, max: 100 }));
app.use((httpLogger as any)({ logger }));

app.use('/api', router);
if (process.env.NODE_ENV !== 'test') {
  import('./docs/swagger.js').then(({ specs }) => {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
  }).catch(() => {});
}
app.use(errorHandler);
