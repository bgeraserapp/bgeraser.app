'use client';
import { useMutation } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createContext } from 'react';
import { toast } from 'sonner';

import { logOutSession } from '@/actions/session';
import { Session, User } from '@/lib/auth';
import { useSession } from '@/lib/auth-client';
import { getQueryClient } from '@/lib/query-client';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const initialContext: AuthContextType = {
  user: null,
  session: null,
  isLoading: true,
  logout: async () => {
    throw new Error('Logout function not initialized');
  },
};

export const AuthContext = createContext<AuthContextType>(initialContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = getQueryClient();
  const { data: session, isPending, refetch } = useSession();

  const logout = useMutation({
    mutationFn: async () => {
      await logOutSession();
    },
    onSuccess: () => {
      refetch();
      queryClient.clear();
      toast.success('Logged out successfully');
      router.push('/sign-in');
    },
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="h-12 w-12  animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        session: session?.session || null,
        isLoading: isPending,
        logout: logout.mutateAsync,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
