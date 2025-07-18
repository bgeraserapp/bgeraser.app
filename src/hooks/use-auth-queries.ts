'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth-client';

// Query Keys
export const authQueryKeys = {
  session: ['auth', 'session'] as const,
  user: ['auth', 'user'] as const,
  accounts: ['auth', 'accounts'] as const,
  sessions: ['auth', 'sessions'] as const,
  credits: ['auth', 'credits'] as const,
} as const;

// Accounts Query
export function useAccountsQuery() {
  return useQuery({
    queryKey: authQueryKeys.accounts,
    queryFn: async () => {
      const result = await authClient.listAccounts();
      return result.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

// Sessions Query
export function useSessionsQuery() {
  return useQuery({
    queryKey: authQueryKeys.sessions,
    queryFn: async () => {
      const result = await authClient.listSessions();
      return result.data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for security)
    retry: 1,
  });
}

// Session Query
export function useSessionQuery() {
  return useQuery({
    queryKey: authQueryKeys.session,
    queryFn: async () => {
      const result = await authClient.getSession();
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

// User Query
export function useUserQuery() {
  return useQuery({
    queryKey: authQueryKeys.user,
    queryFn: async () => {
      const result = await authClient.getSession();
      return result.data?.user || null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

// Sign In Mutation
export function useSignInMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { provider: string }) => {
      return await authClient.signIn.social(params);
    },
    onSuccess: async () => {
      // Invalidate and refetch session data
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.session });
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.user });
      toast.success('Successfully signed in!');
    },
    onError: (error) => {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in', {
        description: 'Please try again or contact support if the issue persists.',
      });
    },
  });
}

// Sign Out Mutation
export function useSignOutMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      return await authClient.signOut();
    },
    onSuccess: () => {
      queryClient.clear();
      router.refresh();
      toast.success('Successfully signed out!');
    },
    onError: (error) => {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out', {
        description: 'Please try again.',
      });
    },
  });
}

// Update User Mutation
export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: { name?: string; email?: string }) => {
      return await authClient.updateUser(userData);
    },
    onSuccess: async () => {
      // Invalidate and refetch user data
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.user });
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.session });
      toast.success('Profile updated successfully!', {
        description: 'Your profile information has been saved.',
      });
    },
    onError: (error) => {
      console.error('Update user error:', error);
      toast.error('Failed to update profile', {
        description: 'Please try again. If the problem persists, contact support.',
      });
    },
  });
}

// Link Account Mutation
export function useLinkAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { provider: string }) => {
      return await authClient.linkSocial(params);
    },
    onSuccess: async (_, variables) => {
      // Invalidate and refetch session data
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.session });
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.user });
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.accounts });
      toast.success('Account linked successfully!', {
        description: `Your ${variables.provider} account has been connected.`,
      });
    },
    onError: (error, variables) => {
      console.error(`Link account error:`, error);
      toast.error(`Failed to link ${variables.provider} account`, {
        description: 'Please try again. Make sure you have the necessary permissions.',
      });
    },
  });
}

// Unlink Account Mutation
export function useUnlinkAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { provider: string; accountId?: string }) => {
      return await authClient.unlinkAccount({
        providerId: params.provider,
        ...(params.accountId && { accountId: params.accountId }),
      });
    },
    onSuccess: async (data, variables) => {
      if (data.error) {
        toast.error(`Failed to unlink ${variables.provider} account`, {
          description: data?.error?.message || 'Please try again later.',
        });
        return;
      }
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.session });
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.user });
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.accounts });
      toast.success('Account disconnected', {
        description: `Your ${variables.provider} account has been disconnected.`,
      });
    },
    onError: (error, variables) => {
      console.error(`Unlink account error:`, error);
      toast.error(`Failed to disconnect ${variables.provider} account`, {
        description: 'Please try again later.',
      });
    },
  });
}

// Revoke Session Mutation
export function useRevokeSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { token: string }) => {
      return await authClient.revokeSession({ token: params.token });
    },
    onSuccess: async () => {
      // Invalidate sessions list
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.sessions });
      toast.success('Session revoked successfully', {
        description: 'The session has been logged out.',
      });
    },
    onError: (error) => {
      console.error('Revoke session error:', error);
      toast.error('Failed to revoke session', {
        description: 'Please try again later.',
      });
    },
  });
}

// Revoke Other Sessions Mutation
export function useRevokeOtherSessionsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await authClient.revokeOtherSessions();
    },
    onSuccess: async () => {
      // Invalidate sessions list
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.sessions });
      toast.success('Other sessions revoked', {
        description: 'All other devices have been logged out.',
      });
    },
    onError: (error) => {
      console.error('Revoke other sessions error:', error);
      toast.error('Failed to revoke other sessions', {
        description: 'Please try again later.',
      });
    },
  });
}

// Revoke All Sessions Mutation
export function useRevokeAllSessionsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await authClient.revokeSessions();
    },
    onSuccess: () => {
      // Clear all auth-related queries (user will be logged out)
      queryClient.clear();
      toast.success('All sessions revoked', {
        description: 'You have been logged out from all devices.',
      });
    },
    onError: (error) => {
      console.error('Revoke all sessions error:', error);
      toast.error('Failed to revoke all sessions', {
        description: 'Please try again later.',
      });
    },
  });
}

// Credits Query
export function useCreditsQuery() {
  return useQuery({
    queryKey: authQueryKeys.credits,
    queryFn: async () => {
      const response = await fetch('/api/credits');
      if (!response.ok) {
        throw new Error('Failed to fetch credits');
      }
      const data = await response.json();
      return data.credits;
    },
    staleTime: 1 * 60 * 1000, // 1 minute - shorter for more frequent updates
    refetchOnWindowFocus: true, // Refetch when user switches back to tab
    refetchOnMount: true, // Refetch when component mounts
    retry: 1,
  });
}

export function useClearAuthCache() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: authQueryKeys.session });
    queryClient.invalidateQueries({ queryKey: authQueryKeys.user });
    queryClient.invalidateQueries({ queryKey: authQueryKeys.accounts });
    queryClient.invalidateQueries({ queryKey: authQueryKeys.credits });
  };
}

// Main Auth Hook - Centralized
export function useAuth() {
  const sessionQuery = useSessionQuery();
  const creditsQuery = useCreditsQuery();
  const signInMutation = useSignInMutation();
  const signOutMutation = useSignOutMutation();
  const linkAccountMutation = useLinkAccountMutation();
  const unlinkAccountMutation = useUnlinkAccountMutation();
  const updateUserMutation = useUpdateUserMutation();
  const clearAuthCache = useClearAuthCache();
  const queryClient = useQueryClient();

  return {
    // Session and User data
    session: sessionQuery.data,
    user: sessionQuery.data?.user || null,
    credits: creditsQuery.data || 0,
    isLoading: sessionQuery.isLoading || creditsQuery.isLoading,
    isAuthenticated: !!sessionQuery.data,
    error: sessionQuery.error || creditsQuery.error,

    // Actions
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
    clearAuthCache,

    // Credit management
    invalidateCredits: () => {
      queryClient.invalidateQueries({ queryKey: authQueryKeys.credits });
    },
  };
}

// Simplified convenience hooks
export function useSession() {
  const auth = useAuth();
  return {
    data: auth.session,
    isLoading: auth.isLoading,
    error: auth.error,
  };
}

export function useUser() {
  const auth = useAuth();
  return {
    data: auth.user,
    isLoading: auth.isLoading,
    error: auth.error,
  };
}
