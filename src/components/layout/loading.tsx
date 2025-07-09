'use client';
import { IconLoader3 } from '@tabler/icons-react';

import { useAuth } from '@/hooks/use-auth-queries';

export default function LoadingWrapper({
  children,
}: Readonly<{
  children?: React.ReactNode;
}>) {
  const { isLoading } = useAuth();
  if (!isLoading) {
    return <>{children}</>;
  }
  return (
    <div className="flex items-center justify-center h-screen">
      <IconLoader3 className="animate-spin text-primary" size={48} />
    </div>
  );
}
