import { Context, Next } from 'hono';

import { HonoContext } from '@/types/hono';

/**
 * Middleware to check if user is authenticated
 * Returns 401 if user is not authenticated
 */
export async function requireAuth(c: Context<HonoContext>, next: Next) {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized - Authentication required' }, 401);
  }

  await next();
}
