'use client';

import { useQuery } from '@tanstack/react-query';

export interface BgRemoverLogData {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface BgRemoverLogsResponse {
  success: boolean;
  data: {
    logs: BgRemoverLogData[];
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    statistics: {
      totalCreditsUsed: number;
      totalProcesses: number;
      completedProcesses: number;
      errorProcesses: number;
      processingProcesses: number;
      averageProcessingTime: number; // in milliseconds
      successRate: number; // percentage
    };
  };
}

export const bgRemoverLogsQueryKeys = {
  all: ['bg-remover-logs'] as const,
  lists: () => [...bgRemoverLogsQueryKeys.all, 'list'] as const,
  list: (filters: { page?: number; limit?: number; status?: string }) =>
    [...bgRemoverLogsQueryKeys.lists(), filters] as const,
  detail: (id: string) => [...bgRemoverLogsQueryKeys.all, 'detail', id] as const,
} as const;

export function useBgRemoverLogs(
  params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}
) {
  const { page = 1, limit = 10, status } = params;

  return useQuery({
    queryKey: bgRemoverLogsQueryKeys.list({ page, limit, status }),
    queryFn: async (): Promise<BgRemoverLogsResponse> => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (status) {
        searchParams.set('status', status);
      }

      const response = await fetch(`/api/models/bg-remover/logs?${searchParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch bg remover logs');
      }

      return response.json();
    },
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
  });
}

export function useBgRemoverLog(id: string) {
  return useQuery({
    queryKey: bgRemoverLogsQueryKeys.detail(id),
    queryFn: async (): Promise<{ success: boolean; data: BgRemoverLogData }> => {
      const response = await fetch(`/api/models/bg-remover/logs/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch bg remover log');
      }

      return response.json();
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
