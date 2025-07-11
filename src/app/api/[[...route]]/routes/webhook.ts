import { EventName } from '@paddle/paddle-node-sdk';
import { Hono } from 'hono';

import { connectDB } from '@/db';
import { User } from '@/db/models/user';
import { env } from '@/env';
import paddle from '@/lib/paddle';

const app = new Hono();

const updateUserToAddCredits = async (paddleCustomerId: string, credits: number) => {
  await connectDB();
  await User.findOneAndUpdate(
    { paddleCustomerId },
    {
      $inc: { credits },
    }
  );
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
    const { data: transactionData } = await c.req.json();
    const [line_items] = transactionData.details.line_items;
    const customerId = transactionData.customer_id;

    const platform = line_items.product.custom_data?.platform || 'unknown';
    if (platform !== 'bgeraser') {
      console.log(`Ignoring webhook for platform: ${platform}`);
      return c.json({
        success: true,
        message: 'Webhook ignored for non-bgeraser platform',
      });
    }

    const [items] = transactionData.items;
    const credit = items.price.custom_data?.credit || 0;

    switch (eventData.eventType) {
      case EventName.TransactionCreated:
        console.log(
          `Subscription ${eventData.data.id} was activated with ${credit} credits for customer ${customerId}`
        );
        break;
      case EventName.TransactionPaid:
        console.log(
          `Subscription ${eventData.data.id} was paid successfully with ${credit} credits for customer ${customerId}`
        );
        break;
      case EventName.TransactionCompleted:
        console.log(
          `Subscription ${eventData.data.id} was completed successfully with ${credit} credits for customer ${customerId}`
        );
        await updateUserToAddCredits(customerId, credit);
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
