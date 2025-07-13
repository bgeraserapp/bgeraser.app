import mongoose, { Document, Schema } from 'mongoose';

export interface IBgRemoverLog extends Document {
  userId: string;
  modelName: string;
  status: 'success' | 'error' | 'processing' | 'deleted';
  creditsUsed: number;
  processingTime?: number;
  errorMessage?: string;
  requestId: string;
  originalImageUrl?: string;
  processedImageUrl?: string;
  imageFormat?: string;
  imageSize?: number;
  createdAt: Date;
  updatedAt: Date;
}

const bgRemoverLogSchema = new Schema<IBgRemoverLog>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    modelName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['success', 'error', 'processing', 'deleted'],
      default: 'processing',
    },
    creditsUsed: {
      type: Number,
      required: true,
      default: 1,
    },
    processingTime: {
      type: Number,
      required: false,
    },
    errorMessage: {
      type: String,
      required: false,
    },
    requestId: {
      type: String,
      required: true,
    },
    originalImageUrl: {
      type: String,
      required: false,
    },
    processedImageUrl: {
      type: String,
      required: false,
    },
    imageFormat: {
      type: String,
      required: false,
    },
    imageSize: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: 'bg_remover_logs',
  }
);

// Indexes for efficient querying
bgRemoverLogSchema.index({ userId: 1, createdAt: -1 });
bgRemoverLogSchema.index({ status: 1, createdAt: -1 });
bgRemoverLogSchema.index({ requestId: 1 });

export const BgRemoverLog =
  mongoose.models.BgRemoverLog || mongoose.model<IBgRemoverLog>('BgRemoverLog', bgRemoverLogSchema);
