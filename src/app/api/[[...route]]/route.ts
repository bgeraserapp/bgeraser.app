import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import { auth } from '@/lib/auth';
import { HonoContext } from '@/types/hono';

import betterAuthRoute from './routes/better-auth';
import { bgRemoverRoute } from './routes/bg-remover';
import { healthRoute } from './routes/health';
import { paymentRouter } from './routes/payment';
import { webhookRouter } from './routes/webhook';

const app = new Hono<HonoContext>().basePath('/api');

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

app.route('/', betterAuthRoute);
app.route('/health', healthRoute);
app.route('/models/bg-remover', bgRemoverRoute);
app.route('/payment', paymentRouter);
app.route('/webhook', webhookRouter);

export const dynamic = 'force-dynamic';

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
