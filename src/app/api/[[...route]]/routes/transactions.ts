import { Hono } from 'hono';
import { Types } from 'mongoose';

import { connectDB } from '@/db';
import { ITransactionState, Transaction } from '@/db/models';
import { HonoContext } from '@/types/hono';

import { requireAuth } from '../middleware';

const app = new Hono<HonoContext>();

// Apply authentication middleware to all routes
app.use('*', requireAuth);

app.get('/', async (c) => {
  try {
    const user = c.get('user')!; // User is guaranteed to exist due to middleware

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
      return sum + parseFloat(transaction.price.amount); // Amount is already in cents
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
        totalSpent: totalSpent, // In cents
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

export { app as transactionsRouter };
