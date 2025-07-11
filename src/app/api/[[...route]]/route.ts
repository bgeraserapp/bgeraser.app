import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import betterAuthRoute from './routes/better-auth';
import { bgRemoverRoute } from './routes/bg-remover';
import { healthRoute } from './routes/health';
import { paymentRouter } from './routes/payment';
import { webhookRouter } from './routes/webhook';

const app = new Hono().basePath('/api');

app.route('/health', healthRoute);
app.route('/models/bg-remover', bgRemoverRoute);
app.route('/payment', paymentRouter);
app.route('/webhook', webhookRouter);
app.route('/', betterAuthRoute);

export const dynamic = 'force-dynamic';

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
