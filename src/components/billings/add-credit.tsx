'use client';
import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { useEffect, useState } from 'react';

import { env } from '@/env';

import { Button } from '../ui/button';

export function AddCreditComponent() {
  const [paddle, setPaddle] = useState<Paddle>();

  useEffect(() => {
    initializePaddle({
      environment: 'sandbox',
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    }).then((paddle) => setPaddle(paddle));
  }, []);

  useEffect(() => {}, []);

  const handleCheckout = async () => {
    if (!paddle) return alert('Paddle not initialized');

    const response = await fetch('/api/payment', {
      method: 'POST',
    });
    const data = await response.json();

    paddle.Checkout.open({
      transactionId: data.transaction.id,
      settings: {
        theme: 'light',
        successUrl: `${env.NEXT_PUBLIC_PORTAL_URL}/billing?success=true`,
      },
    });
  };

  return (
    <div>
      <Button onClick={handleCheckout}>Add Credits</Button>
    </div>
  );
}
