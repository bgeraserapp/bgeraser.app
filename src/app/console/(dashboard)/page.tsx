'use client';

import { BackgroundRemover } from '@/components/background-remover';
import { PageWrapper } from '@/components/layout/page-wrapper';

export default function ConsolePage() {
  return (
    <PageWrapper>
      <div className="container mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Background Remover</h1>
          <p className="text-muted-foreground">
            Upload an image to automatically remove its background using AI
          </p>
        </div>
        <BackgroundRemover />
      </div>
    </PageWrapper>
  );
}
