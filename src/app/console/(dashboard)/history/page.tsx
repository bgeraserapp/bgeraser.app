'use client';

import { format } from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Filter,
  HistoryIcon,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import S3Image from '@/components/ui/s3-image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type BgRemoverLogData, useBgRemoverLogs } from '@/hooks/use-bg-remover-logs';

type FilterStatus = 'all' | 'success' | 'error' | 'processing' | 'deleted';

export default function HistoryPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [selectedImage, setSelectedImage] = useState<{
    original: string;
    processed?: string;
    logData: BgRemoverLogData;
  } | null>(null);

  const limit = 10;
  const { data, isLoading, error } = useBgRemoverLogs({
    page,
    limit,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  const logs = data?.data?.logs || [];
  const pagination = data?.data?.pagination;
  const statistics = data?.data?.statistics;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          >
            Success
          </Badge>
        );
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'processing':
        return (
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
          >
            Processing
          </Badge>
        );
      case 'deleted':
        return (
          <Badge
            variant="secondary"
            className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          >
            Deleted
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto p-4 lg:p-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error loading history</h3>
              <p className="text-muted-foreground">Please try refreshing the page</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <HistoryIcon className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Processing History</h1>
        </div>
        {!isLoading && statistics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border">
              <div className="text-xl font-bold text-foreground">{statistics.totalProcesses}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border">
              <div className="text-xl font-bold text-foreground">
                {statistics.completedProcesses}
              </div>
              <div className="text-xs text-muted-foreground">Success</div>
            </div>
            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border">
              <div className="text-xl font-bold text-foreground">
                {(statistics.averageProcessingTime / 1000).toFixed(1)}s
              </div>
              <div className="text-xs text-muted-foreground">Avg Time</div>
            </div>
            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border">
              <div className="text-xl font-bold text-foreground">
                {statistics.successRate.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Success Rate</div>
            </div>
          </div>
        )}
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" disabled={isLoading}>
                    <Filter className="mr-1 h-3 w-3" />
                    {statusFilter === 'all' ? 'All Status' : statusFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => {
                      setStatusFilter('all');
                      setPage(1);
                    }}
                  >
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setStatusFilter('success');
                      setPage(1);
                    }}
                  >
                    Success
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setStatusFilter('error');
                      setPage(1);
                    }}
                  >
                    Error
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setStatusFilter('processing');
                      setPage(1);
                    }}
                  >
                    Processing
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setStatusFilter('deleted');
                      setPage(1);
                    }}
                  >
                    Deleted
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
              <span className="text-muted-foreground">Loading history...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Preview</TableHead>
                    <TableHead className="w-[120px]">Request ID</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead className="w-[80px]">Status</TableHead>
                    <TableHead className="w-[80px]">Time</TableHead>
                    <TableHead className="w-[60px]">Credits</TableHead>
                    <TableHead className="w-[100px]">Size</TableHead>
                    <TableHead className="w-[120px]">Date</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <div className="text-muted-foreground">
                          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No processing history found</p>
                          {statusFilter !== 'all' && (
                            <p className="text-sm mt-1">Try adjusting your filter</p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log._id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex gap-1">
                            <div className="relative w-8 h-8 rounded overflow-hidden border">
                              <S3Image
                                src={log.status === 'deleted' ? null : log.originalImageUrl || null}
                                alt="Original"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="relative w-8 h-8 rounded overflow-hidden border">
                              <S3Image
                                src={
                                  log.status === 'deleted' ? null : log.processedImageUrl || null
                                }
                                alt="Processed"
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{log.requestId}</TableCell>
                        <TableCell className="text-sm">{log.modelName}</TableCell>
                        <TableCell>{getStatusBadge(log.status)}</TableCell>
                        <TableCell>
                          {log.processingTime ? `${(log.processingTime / 1000).toFixed(1)}s` : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-3 h-3 text-primary"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                              />
                            </svg>
                            {log.creditsUsed}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          {formatFileSize(log.imageSize)}
                          {log.imageFormat && (
                            <div className="text-muted-foreground">{log.imageFormat}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <p className="text-xs">
                            {format(new Date(log.createdAt), 'MMM dd, yyyy')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(log.createdAt), 'HH:mm')}
                          </p>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {log.status !== 'deleted' &&
                              (log.originalImageUrl || log.processedImageUrl) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setSelectedImage({
                                      original: log.originalImageUrl || '',
                                      processed: log.processedImageUrl || undefined,
                                      logData: log,
                                    })
                                  }
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                              )}
                            {log.status !== 'deleted' && log.processedImageUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  downloadImage(
                                    log.processedImageUrl!,
                                    `processed-${log.requestId}.png`
                                  )
                                }
                              >
                                <Download className="w-3 h-3" />
                              </Button>
                            )}
                            {log.status === 'deleted' && (
                              <span className="text-xs text-muted-foreground px-2">
                                Images deleted
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.totalCount)} of{' '}
              {pagination.totalCount} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={!pagination.hasPrevPage || isLoading}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={!pagination.hasNextPage || isLoading}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-background rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">Image Preview</h3>
                <p className="text-sm text-muted-foreground">
                  Request ID: {selectedImage.logData.requestId}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedImage(null)}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedImage.original && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Original Image</h4>
                  <div className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
                    <S3Image
                      src={selectedImage.original}
                      alt="Original"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
              {selectedImage.processed && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Processed Image</h4>
                  <div
                    className="relative aspect-square rounded-lg overflow-hidden border"
                    style={{
                      backgroundImage:
                        'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                    }}
                  >
                    <S3Image
                      src={selectedImage.processed}
                      alt="Processed"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Log Details */}
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="text-sm font-medium mb-2">Processing Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <div className="mt-1">{getStatusBadge(selectedImage.logData.status)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Processing Time:</span>
                  <div className="font-medium">
                    {selectedImage.logData.processingTime
                      ? `${(selectedImage.logData.processingTime / 1000).toFixed(1)}s`
                      : 'N/A'}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Credits Used:</span>
                  <div className="font-medium">{selectedImage.logData.creditsUsed}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <div className="font-medium">
                    {format(new Date(selectedImage.logData.createdAt), 'MMM dd, yyyy HH:mm')}
                  </div>
                </div>
              </div>
              {selectedImage.logData.errorMessage && (
                <div className="mt-2">
                  <span className="text-muted-foreground">Error:</span>
                  <div className="font-medium text-destructive">
                    {selectedImage.logData.errorMessage}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
