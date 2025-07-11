import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  credits: number;
  paddleCustomerId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    credits: {
      type: Number,
      required: true,
      default: 5,
    },
    paddleCustomerId: {
      type: String,
      required: false,
      default: null,
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: 'user',
  }
);

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
