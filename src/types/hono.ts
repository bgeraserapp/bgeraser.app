import { auth } from '@/lib/auth';

export type HonoContext = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
    userData: Record<string, unknown>; // MongoDB user document
    creditsRemaining: number;
    creditsUsed: number;
  };
};
