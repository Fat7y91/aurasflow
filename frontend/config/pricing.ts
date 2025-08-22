export interface Plan {
  id: 'starter' | 'professional' | 'business';
  priceUsd: number;
}

export const PLANS: Plan[] = [
  {
    id: 'starter',
    priceUsd: 19
  },
  {
    id: 'professional', 
    priceUsd: 49
  },
  {
    id: 'business',
    priceUsd: 99
  }
];
