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
    price: 4.99,
    popular: false,
    paddlePriceId: 'pri_01k0heabd87e0hsk09b52y05gv',
    description: 'Personal use',
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 100,
    price: 9.99,
    popular: true,
    paddlePriceId: 'pri_01k0hed59gj3fz2vtecc2pawx3',
    description: 'Most popular',
  },
  {
    id: 'proplus',
    name: 'Pro Plus',
    credits: 250,
    price: 19.99,
    popular: false,
    paddlePriceId: 'pri_01k0heepah07kc468sxycyj33s',
    description: 'For professionals',
  },
];

export default creditPricingData;
