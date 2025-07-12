import { v4 as uuidv4 } from 'uuid';

import { connectDB } from '@/db';
import { BgRemoverLog, User } from '@/db/models';

export interface CreditDeductionResult {
  success: boolean;
  creditsRemaining: number;
  error?: string;
}

export interface LogEntry {
  userId: string;
  modelName: string;
  creditsUsed: number;
  requestId: string;
  originalImageUrl?: string;
  imageFormat?: string;
  imageSize?: number;
}

// Internal model names mapping
export const MODEL_MAPPING = {
  'bg-remover-v1': '851-labs/background-remover',
  'bg-remover-standard': '851-labs/background-remover',
} as const;

export type InternalModelName = keyof typeof MODEL_MAPPING;

export async function deductCredits(
  userId: string,
  creditsToDeduct: number
): Promise<CreditDeductionResult> {
  try {
    await connectDB();

    // Get user's current credits using Mongoose
    const user = await User.findById(userId);

    if (!user) {
      return {
        success: false,
        creditsRemaining: 0,
        error: 'User not found',
      };
    }

    if (user.credits < creditsToDeduct) {
      return {
        success: false,
        creditsRemaining: user.credits,
        error: 'Insufficient credits',
      };
    }

    // Deduct credits atomically using Mongoose
    const result = await User.findOneAndUpdate(
      { _id: userId, credits: { $gte: creditsToDeduct } },
      { $inc: { credits: -creditsToDeduct } },
      { new: true }
    );

    if (!result) {
      return {
        success: false,
        creditsRemaining: user.credits,
        error: 'Failed to deduct credits - insufficient balance',
      };
    }

    return {
      success: true,
      creditsRemaining: result.credits,
    };
  } catch (error) {
    console.error('Error deducting credits:', error);
    return {
      success: false,
      creditsRemaining: 0,
      error: 'Database error',
    };
  }
}

export async function logBgRemoverUsage(logEntry: LogEntry): Promise<string> {
  try {
    await connectDB();

    const log = new BgRemoverLog({
      userId: logEntry.userId,
      modelName: logEntry.modelName,
      status: 'processing',
      creditsUsed: logEntry.creditsUsed,
      requestId: logEntry.requestId,
      originalImageUrl: logEntry.originalImageUrl,
      imageFormat: logEntry.imageFormat,
      imageSize: logEntry.imageSize,
    });

    await log.save();
    return log._id.toString();
  } catch (error) {
    console.error('Error logging bg remover usage:', error);
    throw new Error('Failed to log usage');
  }
}

export async function updateLogStatus(
  logId: string,
  status: 'success' | 'error',
  options: {
    processingTime?: number;
    errorMessage?: string;
    processedImageUrl?: string;
  } = {}
): Promise<void> {
  try {
    await connectDB();

    await BgRemoverLog.findByIdAndUpdate(logId, {
      status,
      ...(options.processingTime && { processingTime: options.processingTime }),
      ...(options.errorMessage && { errorMessage: options.errorMessage }),
      ...(options.processedImageUrl && { processedImageUrl: options.processedImageUrl }),
    });
  } catch (error) {
    console.error('Error updating log status:', error);
  }
}

export function generateRequestId(): string {
  return uuidv4();
}

export function getInternalModelName(_externalModel: string): InternalModelName {
  return 'bg-remover-v1'; // Default internal model name
}
