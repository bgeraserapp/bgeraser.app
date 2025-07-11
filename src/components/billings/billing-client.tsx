'use client';

import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { useEffect, useState } from 'react';

import { env } from '@/env';

import { CreditManagement } from './credit-management';
import { CreditPacks } from './credit-packs';

interface BillingClientProps {
  currentCredits?: number;
  usedCredits?: number;
  totalCreditsUsed?: number;
}

export function BillingClient({
  currentCredits = 120,
  usedCredits = 80,
  totalCreditsUsed = 280,
}: BillingClientProps) {
  const [paddle, setPaddle] = useState<Paddle>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);

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

  const handleUpgradeClick = () => {
    document.getElementById('credit-packs')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto p-3 space-y-4">
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>

      <CreditManagement
        currentCredits={currentCredits}
        usedCredits={usedCredits}
        totalCreditsUsed={totalCreditsUsed}
        onUpgradeClick={handleUpgradeClick}
      />

      <CreditPacks onPurchase={handleCheckout} isLoading={isLoading} selectedPack={selectedPack} />
    </div>
  );
}
