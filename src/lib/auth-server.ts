import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from './auth';

export async function getServerSession() {
  try {
    const cookieStore = await cookies();
    const headers = new Headers();

    // Convert cookies to headers format
    cookieStore.getAll().forEach((cookie) => {
      headers.append('cookie', `${cookie.name}=${cookie.value}`);
    });

    const session = await auth.api.getSession({
      headers: headers,
    });

    return session;
  } catch (error) {
    console.error('Error getting server session:', error);
    return null;
  }
}

export async function requireAuth(redirectTo?: string) {
  const session = await getServerSession();

  if (!session) {
    const loginUrl = '/sign-in';

    // Get current URL if not provided
    if (!redirectTo) {
      const headersList = await headers();
      const pathname = headersList.get('x-pathname') || headersList.get('referer')?.split('?')[0];
      redirectTo = pathname || '/';
    }

    const redirectUrl = redirectTo
      ? `${loginUrl}?redirect=${encodeURIComponent(redirectTo)}`
      : loginUrl;
    redirect(redirectUrl);
  }

  return session;
}

export async function redirectIfAuthenticated(redirectTo: string = '/console') {
  const session = await getServerSession();

  if (session) {
    redirect(redirectTo);
  }
}
