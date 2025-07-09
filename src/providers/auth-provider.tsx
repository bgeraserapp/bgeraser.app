'use client';

import React, { createContext, useContext } from 'react';

import {
  useAuth as useAuthQuery,
  useLinkAccountMutation,
  useSession as useSessionQuery,
  useSignInMutation,
  useSignOutMutation,
  useUnlinkAccountMutation,
  useUpdateUserMutation,
  useUser as useUserQuery,
} from '@/hooks/use-auth-queries';
import { Session, User } from '@/lib/auth';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: {
    social: (params: { provider: string }) => void;
    isLoading: boolean;
  };
  signOut: {
    mutate: () => void;
    isLoading: boolean;
  };
  linkAccount: {
    mutate: (params: { provider: string }) => void;
    isLoading: boolean;
  };
  unlinkAccount: {
    mutate: (params: { provider: string }) => void;
    isLoading: boolean;
  };
  updateUser: {
    mutate: (userData: { name?: string; email?: string }) => void;
    isLoading: boolean;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthQuery();
  const signInMutation = useSignInMutation();
  const signOutMutation = useSignOutMutation();
  const linkAccountMutation = useLinkAccountMutation();
  const unlinkAccountMutation = useUnlinkAccountMutation();
  const updateUserMutation = useUpdateUserMutation();

  const value: AuthContextType = {
    session: auth.session || null,
    user: auth.user || null,
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    signIn: {
      social: signInMutation.mutate,
      isLoading: signInMutation.isPending,
    },
    signOut: {
      mutate: signOutMutation.mutate,
      isLoading: signOutMutation.isPending,
    },
    linkAccount: {
      mutate: linkAccountMutation.mutate,
      isLoading: linkAccountMutation.isPending,
    },
    unlinkAccount: {
      mutate: unlinkAccountMutation.mutate,
      isLoading: unlinkAccountMutation.isPending,
    },
    updateUser: {
      mutate: updateUserMutation.mutate,
      isLoading: updateUserMutation.isPending,
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useSession() {
  const sessionQuery = useSessionQuery();
  return {
    data: sessionQuery.data,
    isLoading: sessionQuery.isLoading,
    error: sessionQuery.error,
  };
}

export function useUser() {
  const userQuery = useUserQuery();
  return {
    data: userQuery.data,
    isLoading: userQuery.isLoading,
    error: userQuery.error,
  };
}
