export interface Pricing {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular: boolean;
  paddlePriceId: string;
  description: string;
}

const creditPricingData: Pricing[] = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 50,
    price: 9.99,
    popular: false,
    paddlePriceId: 'pri_01jzv2ckqjdycxprmghmbhtwk8',
    description: 'Personal use',
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 150,
    price: 24.99,
    popular: true,
    paddlePriceId: 'pri_01jzxsn3x9aszs34gkdd9ryse4',
    description: 'Most popular',
  },
  {
    id: 'proplus',
    name: 'Pro Plus',
    credits: 500,
    price: 79.99,
    popular: false,
    paddlePriceId: 'pri_01jzxsppce3efhpnrcgzq35nfa',
    description: 'For professionals',
  },
];

export default creditPricingData;
