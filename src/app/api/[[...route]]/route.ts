import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import { bgRemoverRoute } from './routes/bg-remover';
import { healthRoute } from './routes/health';

const app = new Hono().basePath('/api');

app.route('/health', healthRoute);
app.route('/models/bg-remover', bgRemoverRoute);

export const dynamic = 'force-dynamic';

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
