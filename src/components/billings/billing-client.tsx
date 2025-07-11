'use client';

import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { useEffect, useState } from 'react';

import { env } from '@/env';

import { CreditManagement } from './credit-management';
import { CreditPlansDialog } from './credit-plans-dialog';

interface BillingClientProps {
  currentCredits?: number;
}

export function BillingClient({ currentCredits = 0 }: BillingClientProps) {
  const [paddle, setPaddle] = useState<Paddle>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    initializePaddle({
      environment: 'sandbox',
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    }).then((paddle) => setPaddle(paddle));
  }, []);

  const handleCheckout = async (packId: string) => {
    if (!paddle) {
      alert('Payment system not ready. Please try again.');
      return;
    }

    setIsLoading(true);
    setSelectedPack(packId);

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ packId }),
      });

      const data = await response.json();
      setIsDialogOpen(false);

      paddle.Checkout.open({
        transactionId: data.transaction.id,
        settings: {
          theme: 'light',
          successUrl: `${env.NEXT_PUBLIC_PORTAL_URL}/billing?success=true`,
        },
      });
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setIsLoading(false);
      setSelectedPack(null);
    }
  };

  const handleBuyCreditClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <CreditManagement currentCredits={currentCredits} onBuyCreditClick={handleBuyCreditClick} />

      <CreditPlansDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onPurchase={handleCheckout}
        isLoading={isLoading}
        selectedPack={selectedPack}
      />
    </div>
  );
}
