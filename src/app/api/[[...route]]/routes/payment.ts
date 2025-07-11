import { Hono } from 'hono';

import paddle from '@/lib/paddle';

const app = new Hono();

app.post('/', async (c) => {
  const txn = await paddle.transactions.create({
    customerId: 'ctm_01jztv1cj1g7m2qkrvb8ddgdqr',
    items: [
      {
        priceId: 'pri_01jzv2ckqjdycxprmghmbhtwk8',
        quantity: 1,
      },
    ],
  });

  return c.json({
    success: true,
    message: 'Transaction created successfully',
    transaction: txn,
  });
});

export { app as paymentRouter };
