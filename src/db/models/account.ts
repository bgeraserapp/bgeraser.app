import mongoose, { Document, Schema } from 'mongoose';

export interface IAccount extends Document {
  _id: string;
  userId: string;
  accountId: string;
  providerId: string;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresAt?: Date;
  refreshTokenExpiresAt?: Date;
  scope?: string;
  idToken?: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new Schema<IAccount>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    accountId: {
      type: String,
      required: true,
    },
    providerId: {
      type: String,
      required: true,
      enum: ['google', 'github', 'microsoft'],
    },
    accessToken: {
      type: String,
      required: false,
    },
    refreshToken: {
      type: String,
      required: false,
    },
    accessTokenExpiresAt: {
      type: Date,
      required: false,
    },
    refreshTokenExpiresAt: {
      type: Date,
      required: false,
    },
    scope: {
      type: String,
      required: false,
    },
    idToken: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: 'account',
  }
);

export const Account =
  mongoose.models.Account || mongoose.model<IAccount>('Account', accountSchema);
