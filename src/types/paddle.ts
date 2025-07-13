export interface PaddlePaymentCard {
  type: string;
  last4: string;
  expiry_year: number;
  expiry_month: number;
  cardholder_name: string;
}

export interface PaddlePaymentMethod {
  type: string;
  card?: PaddlePaymentCard;
}

export interface PaddlePayment {
  amount: string;
  status: string;
  created_at: string;
  error_code?: string;
  captured_at?: string;
  method_details?: PaddlePaymentMethod;
  payment_method_id: string;
  payment_attempt_id: string;
  stored_payment_method_id: string;
}

export interface PaddleTotals {
  fee?: string;
  tax: string;
  total: string;
  credit: string;
  balance: string;
  discount: string;
  earnings?: string;
  subtotal: string;
  grand_total: string;
  currency_code: string;
  credit_to_balance: string;
}

export interface PaddleProduct {
  id: string;
  name: string;
  type: string;
  status: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  custom_data?: Record<string, string>;
  description?: string;
  tax_category: string;
}

export interface PaddleLineItem {
  id: string;
  totals: Omit<PaddleTotals, 'fee' | 'earnings' | 'credit_to_balance'>;
  item_id?: string;
  product: PaddleProduct;
  price_id: string;
  quantity: number;
  tax_rate: string;
  unit_totals: Omit<PaddleTotals, 'fee' | 'earnings' | 'credit_to_balance'>;
  is_tax_exempt: boolean;
  revised_tax_exempted: boolean;
}

export interface PaddlePrice {
  id: string;
  name: string;
  type: string;
  status: string;
  quantity: {
    maximum: number;
    minimum: number;
  };
  tax_mode: string;
  created_at: string;
  product_id: string;
  unit_price: {
    amount: string;
    currency_code: string;
  };
  updated_at: string;
  custom_data?: Record<string, string>;
  description: string;
  trial_period?: unknown;
  billing_cycle?: unknown;
  unit_price_overrides: unknown[];
}

export interface PaddleItem {
  price: PaddlePrice;
  price_id: string;
  quantity: number;
  proration?: unknown;
}

export interface PaddleTransactionData {
  id: string;
  items: PaddleItem[];
  origin: string;
  status: string;
  details: {
    totals: PaddleTotals;
    line_items: PaddleLineItem[];
    payout_totals?: unknown;
    tax_rates_used: unknown[];
    adjusted_totals: PaddleTotals;
  };
  checkout?: {
    url: string;
  };
  payments: PaddlePayment[];
  billed_at?: string;
  address_id?: string;
  created_at: string;
  invoice_id?: string;
  revised_at?: string;
  updated_at: string;
  business_id?: string;
  custom_data?: unknown;
  customer_id: string;
  discount_id?: string;
  receipt_data?: unknown;
  currency_code: string;
  billing_period?: unknown;
  invoice_number?: string;
  billing_details?: unknown;
  collection_mode: string;
  subscription_id?: string;
}

export interface PaddleWebhookData {
  data: PaddleTransactionData;
  event_id: string;
  event_type: string;
  occurred_at: string;
  notification_id: string;
}
