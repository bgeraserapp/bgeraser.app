import { EventName } from '@paddle/paddle-node-sdk';
import { Hono } from 'hono';
import { Types } from 'mongoose';

import { connectDB } from '@/db';
import {
  IPaymentMethod,
  ITransactionState,
  ITransactionTotals,
  Transaction,
  User,
} from '@/db/models';
import { env } from '@/env';
import paddle from '@/lib/paddle';
import { PaddleWebhookData } from '@/types/paddle';

const app = new Hono();

const updateUserToAddCredits = async (userId: Types.ObjectId, credits: number) => {
  await connectDB();
  await User.findOneAndUpdate(
    { _id: userId },
    {
      $inc: { credits },
    }
  );
};

const createOrUpdateTransaction = async (
  transactionData: PaddleWebhookData,
  eventType: string,
  occurredAt: string
) => {
  await connectDB();

  const { data } = transactionData;
  const [lineItem] = data.details.line_items;
  const [item] = data.items;

  // Prepare the new state
  const newState: {
    status: string;
    eventType: string;
    occurredAt: Date;
    totals: ITransactionTotals;
    billedAt?: Date;
    invoiceId?: string;
    invoiceNumber?: string;
    paymentMethod?: IPaymentMethod;
  } = {
    status: data.status,
    eventType,
    occurredAt: new Date(occurredAt),
    totals: {
      fee: data.details.totals.fee,
      tax: data.details.totals.tax,
      total: data.details.totals.total,
      credit: data.details.totals.credit,
      balance: data.details.totals.balance,
      discount: data.details.totals.discount,
      earnings: data.details.totals.earnings,
      subtotal: data.details.totals.subtotal,
      grandTotal: data.details.totals.grand_total,
      currencyCode: data.details.totals.currency_code,
    },
    billedAt: data.billed_at ? new Date(data.billed_at) : undefined,
    invoiceId: data.invoice_id,
    invoiceNumber: data.invoice_number,
    paymentMethod: undefined,
  };

  // Add payment method if payments exist
  if (data.payments && data.payments.length > 0) {
    const payment = data.payments[0];
    if (payment.method_details) {
      newState.paymentMethod = {
        type: payment.method_details.type,
        ...(payment.method_details.card && {
          card: {
            type: payment.method_details.card.type,
            last4: payment.method_details.card.last4,
            expiryYear: payment.method_details.card.expiry_year,
            expiryMonth: payment.method_details.card.expiry_month,
            cardholderName: payment.method_details.card.cardholder_name,
          },
        }),
      };
    }
  }

  // Get userId from User model using paddleCustomerId
  const user = await User.findOne({ paddleCustomerId: data.customer_id });

  if (!user) {
    console.error(`User not found for Paddle customer ID: ${data.customer_id}`);
    throw new Error(`User not found for customer ID: ${data.customer_id}`);
  }

  const userId = user._id as Types.ObjectId;

  // Check if transaction already exists
  const existingTransaction = await Transaction.findOne({ transactionId: data.id });

  if (existingTransaction) {
    // Check if this state already exists to avoid duplicates
    const stateExists = existingTransaction.states.some(
      (state: ITransactionState) => state.eventType === eventType
    );

    if (!stateExists) {
      // Add new state and update current status
      return await Transaction.findOneAndUpdate(
        { transactionId: data.id },
        {
          $push: { states: newState },
          $set: {
            currentStatus: data.status,
            paddleUpdatedAt: new Date(data.updated_at),
            userId: userId,
          },
        },
        { new: true }
      );
    }
    return existingTransaction;
  } else {
    // Create new transaction with first state
    const transactionDoc = {
      transactionId: data.id,
      customerId: data.customer_id,
      userId: userId,
      currentStatus: data.status,
      origin: data.origin,
      currencyCode: data.currency_code,
      items: [
        {
          priceId: item.price.id,
          priceName: item.price.name,
          quantity: item.quantity,
          unitPrice: {
            amount: item.price.unit_price.amount,
            currencyCode: item.price.unit_price.currency_code,
          },
          credits: parseInt(item.price.custom_data?.credit || '0'),
          productId: lineItem.product.id,
          productName: lineItem.product.name,
        },
      ],
      states: [newState],
      checkoutUrl: data.checkout?.url,
      paddleCreatedAt: new Date(data.created_at),
      paddleUpdatedAt: new Date(data.updated_at),
    };

    return await Transaction.create(transactionDoc);
  }
};

app.post('/paddle', async (c) => {
  // Handle the webhook logic here
  // For example, you can log the request body or process it as needed

  const signature = c.req.header('Paddle-Signature');
  const rawReqBody = await c.req.text();
  const webhookSecret = env.PADDLE_WEBHOOK_SECRET;

  try {
    if (!signature || !webhookSecret) {
      throw new Error('Missing signature or webhook secret');
    }

    const eventData = await paddle.webhooks.unmarshal(rawReqBody, webhookSecret, signature);
    const transactionData = JSON.parse(rawReqBody);
    const [line_items] = transactionData.data.details.line_items;
    const customerId = transactionData.data.customer_id;

    const platform = line_items.product.custom_data?.platform || 'unknown';
    if (platform !== 'bgeraser') {
      console.log(`Ignoring webhook for platform: ${platform}`);
      return c.json({
        success: true,
        message: 'Webhook ignored for non-bgeraser platform',
      });
    }

    const [items] = transactionData.data.items;
    const credit = parseInt(items.price.custom_data?.credit || '0');

    // Get internal userId for the transaction
    await connectDB();
    const user = await User.findOne({ paddleCustomerId: customerId });

    if (!user) {
      console.error(`User not found for Paddle customer ID: ${customerId}`);
      return c.json(
        {
          success: false,
          message: 'User not found for customer ID',
        },
        400
      );
    }

    const userId = user._id as Types.ObjectId;

    // Track transaction in database with precise occurred_at timestamp
    await createOrUpdateTransaction(
      transactionData,
      eventData.eventType,
      transactionData.occurred_at
    );

    switch (eventData.eventType) {
      case EventName.TransactionCreated:
        console.log(
          `Transaction ${eventData.data.id} was created with ${credit} credits for user ${userId} (Paddle customer: ${customerId})`
        );
        break;
      case EventName.TransactionPaid:
        console.log(
          `Transaction ${eventData.data.id} was paid successfully with ${credit} credits for user ${userId} (Paddle customer: ${customerId})`
        );
        break;
      case EventName.TransactionCompleted:
        console.log(
          `Transaction ${eventData.data.id} was completed successfully with ${credit} credits for user ${userId} (Paddle customer: ${customerId})`
        );
        await updateUserToAddCredits(userId, credit);
        break;
      default:
        console.log(`Unhandled event: ${eventData.eventId} with data: ${eventData.eventType}`);
        break;
    }
    return c.json({
      success: true,
      message: 'Webhook processed successfully',
    });
  } catch (error) {
    console.error('Webhook verification failed:', error);
    return c.json(
      {
        success: false,
        message: 'Webhook verification failed',
      },
      400
    );
  }
});

export { app as webhookRouter };
