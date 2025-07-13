import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { requestId } from 'hono/request-id';
import { timing } from 'hono/timing';
import { handle } from 'hono/vercel';

import { auth } from '@/lib/auth';
import { HonoContext } from '@/types/hono';

// Import route modules
import betterAuthRoute from './routes/better-auth';
import { bgRemoverModelsRoute } from './routes/bg-remover-models';
import { cleanupRoute } from './routes/cleanup';
import { creditsRoute } from './routes/credits';
import { downloadZipRoute } from './routes/download-zip';
import { healthRoute } from './routes/health';
import { paymentsRoute } from './routes/payments';
import { s3SignedUrlRoute } from './routes/s3-signed-url';
import { webhookRouter } from './routes/webhook';

// Create Hono app with base path
const app = new Hono<HonoContext>().basePath('/api');

// Global middleware
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', requestId());
app.use('*', timing());
app.use(
  '*',
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://bgeraser.app', 'https://console.bgeraser.app']
        : ['http://localhost:3000'],
    credentials: true,
  })
);

// Authentication middleware
app.use('*', async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set('user', null);
    c.set('session', null);
    return next();
  }

  c.set('user', session.user);
  c.set('session', session.session);
  return next();
});

// Global error handler
app.onError((err, c) => {
  console.error('API Error:', err);
  return c.json(
    {
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId'),
    },
    500
  );
});

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      error: 'Not Found',
      message: `Route ${c.req.path} not found`,
      timestamp: new Date().toISOString(),
    },
    404
  );
});

// Authentication routes
app.route('/', betterAuthRoute);

// System routes
app.route('/health', healthRoute);

// User management routes
app.route('/credits', creditsRoute);

// Background remover routes (includes both processing and logs)
// GET /api/models/bg-remover/logs - Get logs with pagination
// GET /api/models/bg-remover/logs/:id - Get specific log
// POST /api/models/bg-remover - Process images
app.route('/models/bg-remover', bgRemoverModelsRoute);

// File management routes
app.route('/download-zip', downloadZipRoute);

// Cleanup routes
app.route('/cleanup', cleanupRoute);

// S3 signed URL routes
app.route('/s3/signed-url', s3SignedUrlRoute);

// Payment routes (includes transactions)
// POST /api/payment - Create payment
// GET /api/payment/transactions - Get transaction history
// GET /api/payment/transactions/:id - Get specific transaction
app.route('/payment', paymentsRoute);

// Webhook routes
app.route('/webhook', webhookRouter);

export const dynamic = 'force-dynamic';

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
