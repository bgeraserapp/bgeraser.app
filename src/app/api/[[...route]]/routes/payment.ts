import { Hono } from 'hono';

import { connectDB } from '@/db';
import { User } from '@/db/models';
import paddle from '@/lib/paddle';
import creditPricingData from '@/lib/pricing';
import { HonoContext } from '@/types/hono';

import { requireAuth } from '../middleware';

const app = new Hono<HonoContext>();

// Apply authentication middleware to all routes
app.use('*', requireAuth);

app.post('/', async (c) => {
  try {
    const { packId } = await c.req.json();

    if (!packId) {
      return c.json({ success: false, message: 'Pack ID is required' }, 400);
    }

    const plan = creditPricingData.find((p) => p.id === packId);
    if (!plan) {
      return c.json({ success: false, message: 'Invalid plan ID' }, 400);
    }

    const user = c.get('user');
    if (!user) {
      return c.json({ success: false, message: 'User not authenticated' }, 401);
    }

    let paddleCustomerId = user.paddleCustomerId;

    if (!paddleCustomerId) {
      const [existingCustomer] = await paddle.customers.list({ email: [user.email] }).next();

      paddleCustomerId =
        existingCustomer?.id ??
        (
          await paddle.customers.create({
            email: user.email,
            name: user.name,
          })
        ).id;
    }

    await connectDB();
    await User.findByIdAndUpdate(user.id, {
      $set: { paddleCustomerId },
    });

    const transaction = await paddle.transactions.create({
      customerId: paddleCustomerId,
      items: [
        {
          priceId: plan.paddlePriceId,
          quantity: 1,
        },
      ],
    });

    return c.json({
      success: true,
      message: 'Transaction created successfully',
      transaction,
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

export { app as paymentRouter };
