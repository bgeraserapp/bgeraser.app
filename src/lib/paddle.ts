import { Environment, Paddle } from '@paddle/paddle-node-sdk';

import { env } from '@/env';

const paddle = new Paddle(env.PADDLE_SECRET_TOKEN!, {
  environment: env.PADDLE_ENV === 'sandbox' ? Environment.sandbox : Environment.production,
});

export default paddle;

export const createUser = async (userData: { email: string; name: string }) => {
  try {
    const user = await paddle.customers.create({
      email: userData.email,
      name: userData.name,
    });
    return user;
  } catch (error) {
    console.error('Error creating Paddle user:', error);
    throw error;
  }
};
