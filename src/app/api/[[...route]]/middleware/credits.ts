import { Context, Next } from 'hono';

import { connectDB } from '@/db';
import { User } from '@/db/models';
import { HonoContext } from '@/types/hono';

/**
 * Middleware to check if user has sufficient credits
 * Requires authentication middleware to be run first
 */
export function requireCredits(minCredits: number = 1) {
  return async (c: Context<HonoContext>, next: Next) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    try {
      await connectDB();

      // Check user's current credits using Mongoose
      const userData = await User.findById(user.id);

      if (!userData) {
        return c.json({ error: 'User not found' }, 404);
      }

      if (userData.credits < minCredits) {
        return c.json(
          {
            error: 'Insufficient credits',
            creditsRequired: minCredits,
            creditsAvailable: userData.credits,
          },
          402
        );
      }

      // Store user data in context for later use
      c.set('userData', userData);

      await next();
    } catch (error) {
      console.error('Credit check error:', error);
      return c.json({ error: 'Failed to check credits' }, 500);
    }
  };
}

/**
 * Middleware to deduct credits atomically after successful processing
 * This should be used after the main processing is complete
 */
export function deductCredits(creditsToDeduct: number) {
  return async (c: Context<HonoContext>, next: Next) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    try {
      await connectDB();

      // Deduct credits atomically using Mongoose
      const result = await User.findOneAndUpdate(
        { _id: user.id, credits: { $gte: creditsToDeduct } },
        { $inc: { credits: -creditsToDeduct } },
        { new: true }
      );

      if (!result) {
        return c.json({ error: 'Failed to deduct credits - insufficient balance' }, 402);
      }

      // Store the updated credits in context
      c.set('creditsRemaining', result.credits);
      c.set('creditsUsed', creditsToDeduct);

      await next();
    } catch (error) {
      console.error('Credit deduction error:', error);
      return c.json({ error: 'Failed to deduct credits' }, 500);
    }
  };
}
