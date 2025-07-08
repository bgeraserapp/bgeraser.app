import { env } from '@/env';
import Replicate from 'replicate';

const replicateClient = new Replicate({
  auth: env.REPLICATE_API_KEY,
  userAgent: 'bgeraser/0.1',
});

export type ModelsType = `${string}/${string}` | `${string}/${string}:${string}`;

export const Models: Record<string, ModelsType> = {
  BACKGROUND_REMOVER:
    '851-labs/background-remover:a029dff38972b5fda4ec5d75d7d1cd25aeff621d2cf4946a41055d7db66b80bc',
};

export default replicateClient;
