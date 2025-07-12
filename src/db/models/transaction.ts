import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITransactionItem {
  priceId: string;
  priceName: string;
  quantity: number;
  unitPrice: {
    amount: string;
    currencyCode: string;
  };
  credits: number;
  productId: string;
  productName: string;
}

export interface ITransactionTotals {
  fee?: string;
  tax: string;
  total: string;
  credit: string;
  balance: string;
  discount: string;
  earnings?: string;
  subtotal: string;
  grandTotal: string;
  currencyCode: string;
}

export interface IPaymentMethod {
  type: string;
  card?: {
    type: string;
    last4: string;
    expiryYear: number;
    expiryMonth: number;
    cardholderName: string;
  };
}

export interface ITransactionState {
  status: 'draft' | 'paid' | 'completed' | 'cancelled' | 'failed';
  eventType:
    | 'transaction.created'
    | 'transaction.paid'
    | 'transaction.completed'
    | 'transaction.cancelled';
  occurredAt: Date;
  totals: ITransactionTotals;
  paymentMethod?: IPaymentMethod;
  billedAt?: Date;
  invoiceId?: string;
  invoiceNumber?: string;
}

export interface ITransaction extends Document {
  _id: string;
  transactionId: string;
  customerId: string;
  userId: Types.ObjectId;
  currentStatus: 'draft' | 'paid' | 'completed' | 'cancelled' | 'failed';
  origin: string;
  currencyCode: string;
  items: ITransactionItem[];
  states: ITransactionState[];
  checkoutUrl?: string;
  paddleCreatedAt: Date;
  paddleUpdatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const transactionItemSchema = new Schema<ITransactionItem>({
  priceId: { type: String, required: true },
  priceName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: {
    amount: { type: String, required: true },
    currencyCode: { type: String, required: true },
  },
  credits: { type: Number, required: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
});

const transactionTotalsSchema = new Schema<ITransactionTotals>({
  fee: { type: String },
  tax: { type: String, required: true },
  total: { type: String, required: true },
  credit: { type: String, required: true },
  balance: { type: String, required: true },
  discount: { type: String, required: true },
  earnings: { type: String },
  subtotal: { type: String, required: true },
  grandTotal: { type: String, required: true },
  currencyCode: { type: String, required: true },
});

const paymentMethodSchema = new Schema<IPaymentMethod>({
  type: { type: String, required: true },
  card: {
    type: { type: String },
    last4: { type: String },
    expiryYear: { type: Number },
    expiryMonth: { type: Number },
    cardholderName: { type: String },
  },
});

const transactionStateSchema = new Schema<ITransactionState>({
  status: {
    type: String,
    enum: ['draft', 'paid', 'completed', 'cancelled', 'failed'],
    required: true,
  },
  eventType: {
    type: String,
    enum: [
      'transaction.created',
      'transaction.paid',
      'transaction.completed',
      'transaction.cancelled',
    ],
    required: true,
  },
  occurredAt: { type: Date, required: true },
  totals: transactionTotalsSchema,
  paymentMethod: paymentMethodSchema,
  billedAt: { type: Date },
  invoiceId: { type: String },
  invoiceNumber: { type: String },
});

const transactionSchema = new Schema<ITransaction>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    customerId: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    currentStatus: {
      type: String,
      enum: ['draft', 'paid', 'completed', 'cancelled', 'failed'],
      required: true,
    },
    origin: {
      type: String,
      required: true,
    },
    currencyCode: {
      type: String,
      required: true,
    },
    items: [transactionItemSchema],
    states: [transactionStateSchema],
    checkoutUrl: { type: String },
    paddleCreatedAt: { type: Date, required: true },
    paddleUpdatedAt: { type: Date, required: true },
  },
  {
    timestamps: true,
    collection: 'transaction',
  }
);

transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ customerId: 1 });
transactionSchema.index({ userId: 1 });
transactionSchema.index({ currentStatus: 1 });
transactionSchema.index({ 'states.eventType': 1 });

export const Transaction =
  mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', transactionSchema);
