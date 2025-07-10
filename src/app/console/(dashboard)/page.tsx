'use client';

import { BackgroundRemover } from '@/components/background-remover';
import { PageWrapper } from '@/components/layout/page-wrapper';

export default function ConsolePage() {
  return (
    <PageWrapper>
      <div className="container mx-auto p-4">
        <BackgroundRemover />
      </div>
    </PageWrapper>
  );
}
