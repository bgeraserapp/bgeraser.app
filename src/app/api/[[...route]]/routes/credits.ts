import { Hono } from 'hono';

import { connectDB } from '@/db';
import { User } from '@/db/models';
import { HonoContext } from '@/types/hono';

import { requireAuth } from '../middleware';

const app = new Hono<HonoContext>();

// Apply authentication middleware to all routes
app.use('*', requireAuth);

// Get current user's credit balance
app.get('/', async (c) => {
  try {
    const user = c.get('user')!;

    await connectDB();

    const userData = await User.findById(user.id).select('credits');

    if (!userData) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({
      success: true,
      credits: userData.credits,
    });
  } catch (error) {
    console.error('Error fetching credits:', error);
    return c.json({ error: 'Failed to fetch credit balance' }, 500);
  }
});

export { app as creditsRoute };
