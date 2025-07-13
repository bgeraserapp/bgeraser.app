import { Hono } from 'hono';
import { Types } from 'mongoose';

import { connectDB } from '@/db';
import { ITransactionState, Transaction, User } from '@/db/models';
import paddle from '@/lib/paddle';
import creditPricingData from '@/lib/pricing';
import { HonoContext } from '@/types/hono';

import { requireAuth } from '../middleware';

const app = new Hono<HonoContext>();

// Apply authentication middleware to all routes
app.use('*', requireAuth);

// Create payment transaction
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

// Get user transactions history
app.get('/transactions', async (c) => {
  try {
    const user = c.get('user')!;

    await connectDB();

    // Convert user.id to ObjectId and fetch transactions for the authenticated user
    const userObjectId = new Types.ObjectId(user.id);
    const transactions = await Transaction.find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .lean();

    // Transform data to show only the latest state for each transaction
    const transformedTransactions = transactions.map((transaction) => {
      // Get the latest state (last in the array)
      const latestState = transaction.states[transaction.states.length - 1];

      // Get first item for display
      const firstItem = transaction.items[0];

      return {
        transactionId: transaction.transactionId,
        itemName: firstItem?.priceName || 'Unknown Item',
        price: {
          amount: latestState?.totals.total || '0',
          currency: latestState?.totals.currencyCode || 'USD',
        },
        credits: firstItem?.credits || 0,
        paidAt: latestState?.billedAt || null,
        currentStatus: transaction.currentStatus,
        eventType: latestState?.eventType || transaction.currentStatus,
        occurredAt: latestState?.occurredAt || transaction.createdAt,
        invoiceNumber: latestState?.invoiceNumber || null,
        paymentMethod: latestState?.paymentMethod || null,
        allStates: transaction.states.map((state: ITransactionState) => ({
          status: state.status,
          eventType: state.eventType,
          occurredAt: state.occurredAt,
          totals: state.totals,
        })),
      };
    });

    // Calculate statistics for completed transactions only
    const completedTransactions = transformedTransactions.filter(
      (t) => t.currentStatus === 'completed'
    );

    const totalSpent = completedTransactions.reduce((sum, transaction) => {
      return sum + parseFloat(transaction.price.amount);
    }, 0);

    const totalCredits = completedTransactions.reduce((sum, transaction) => {
      return sum + transaction.credits;
    }, 0);

    const completedCount = completedTransactions.length;

    return c.json({
      success: true,
      transactions: transformedTransactions,
      total: transformedTransactions.length,
      statistics: {
        totalSpent: totalSpent,
        totalCredits: totalCredits,
        completedTransactions: completedCount,
      },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to fetch transactions',
      },
      500
    );
  }
});

// Get transaction by ID
app.get('/transactions/:id', async (c) => {
  try {
    const user = c.get('user')!;
    const transactionId = c.req.param('id');

    await connectDB();

    const userObjectId = new Types.ObjectId(user.id);
    const transaction = await Transaction.findOne({
      transactionId,
      userId: userObjectId,
    }).lean();

    if (!transaction) {
      return c.json({ error: 'Transaction not found' }, 404);
    }

    return c.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return c.json({ error: 'Failed to fetch transaction' }, 500);
  }
});

export { app as paymentsRoute };
