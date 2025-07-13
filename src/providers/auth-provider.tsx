// This file now just re-exports the centralized auth hooks
// No need for context provider since we're using React Query directly
export { useAuth, useSession, useUser } from '@/hooks/use-auth-queries';
