'use server';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth';

export const authSession = async () => {
  const headerList = await headers();
  const session = await auth.api.getSession({
    headers: headerList,
  });
  return session;
};

export const logOutSession = async () => {
  const headerList = await headers();
  await auth.api.signOut({
    headers: headerList,
  });
  return true;
};
