'use client';

import { format } from 'date-fns';
import { Download, Eye, Filter, HistoryIcon, Image as ImageIcon, Search } from 'lucide-react';
import Image from 'next/image';
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
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data for demonstration
const mockHistoryData = [
  {
    id: 'bg-001',
    originalImage: 'https://via.placeholder.com/150x150?text=Original+1',
    processedImage: 'https://via.placeholder.com/150x150?text=Processed+1',
    filename: 'portrait-photo.jpg',
    processedAt: new Date('2024-01-15T10:30:00'),
    processingTime: 2.3,
    creditsUsed: 1,
    status: 'completed',
    fileSize: '2.4 MB',
  },
  {
    id: 'bg-002',
    originalImage: 'https://via.placeholder.com/150x150?text=Original+2',
    processedImage: 'https://via.placeholder.com/150x150?text=Processed+2',
    filename: 'product-image.png',
    processedAt: new Date('2024-01-14T15:45:00'),
    processingTime: 1.8,
    creditsUsed: 1,
    status: 'completed',
    fileSize: '1.2 MB',
  },
  {
    id: 'bg-003',
    originalImage: 'https://via.placeholder.com/150x150?text=Original+3',
    processedImage: 'https://via.placeholder.com/150x150?text=Processed+3',
    filename: 'team-photo.jpg',
    processedAt: new Date('2024-01-13T09:15:00'),
    processingTime: 3.1,
    creditsUsed: 1,
    status: 'completed',
    fileSize: '4.1 MB',
  },
  {
    id: 'bg-004',
    originalImage: 'https://via.placeholder.com/150x150?text=Original+4',
    processedImage: null,
    filename: 'large-image.jpg',
    processedAt: new Date('2024-01-12T14:20:00'),
    processingTime: 0,
    creditsUsed: 0,
    status: 'failed',
    fileSize: '15.2 MB',
  },
  {
    id: 'bg-005',
    originalImage: 'https://via.placeholder.com/150x150?text=Original+5',
    processedImage: 'https://via.placeholder.com/150x150?text=Processed+5',
    filename: 'headshot.png',
    processedAt: new Date('2024-01-11T11:00:00'),
    processingTime: 1.5,
    creditsUsed: 1,
    status: 'completed',
    fileSize: '890 KB',
  },
];

type _HistoryItem = (typeof mockHistoryData)[0];
type FilterStatus = 'all' | 'completed' | 'failed' | 'processing';

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [selectedImage, setSelectedImage] = useState<{
    original: string;
    processed?: string;
  } | null>(null);

  const filteredData = mockHistoryData.filter((item) => {
    const matchesSearch =
      item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCreditsUsed = mockHistoryData.reduce((sum, item) => sum + item.creditsUsed, 0);
  const completedProcesses = mockHistoryData.filter((item) => item.status === 'completed').length;
  const averageProcessingTime =
    mockHistoryData
      .filter((item) => item.status === 'completed')
      .reduce((sum, item) => sum + item.processingTime, 0) / completedProcesses;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          >
            Completed
          </Badge>
        );
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'processing':
        return (
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
          >
            Processing
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto p-3">
      {/* Compact Header with Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HistoryIcon className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">History</h1>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <div className="font-bold text-foreground">{totalCreditsUsed}</div>
            <div className="text-xs text-muted-foreground">Credits</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-foreground">{completedProcesses}</div>
            <div className="text-xs text-muted-foreground">Processed</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-foreground">{averageProcessingTime.toFixed(1)}s</div>
            <div className="text-xs text-muted-foreground">Avg Time</div>
          </div>
        </div>
      </div>

      {/* Compact Filters and Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Processing History</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3 h-3" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-7 w-32 h-8 text-sm"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-1 h-3 w-3" />
                    {statusFilter === 'all' ? 'All' : statusFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                    Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('failed')}>
                    Failed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('processing')}>
                    Processing
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Preview</TableHead>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Filename</TableHead>
                  <TableHead className="w-[80px]">Status</TableHead>
                  <TableHead className="w-[80px]">Time</TableHead>
                  <TableHead className="w-[60px]">Credits</TableHead>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No images found matching your criteria</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex gap-1">
                          <div className="relative w-8 h-8 rounded overflow-hidden border">
                            <Image
                              src={item.originalImage}
                              alt="Original"
                              fill
                              className="object-cover"
                            />
                          </div>
                          {item.processedImage && (
                            <div className="relative w-8 h-8 rounded overflow-hidden border">
                              <Image
                                src={item.processedImage}
                                alt="Processed"
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{item.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium truncate max-w-[120px]">
                            {item.filename}
                          </p>
                          <p className="text-xs text-muted-foreground">{item.fileSize}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        {item.processingTime > 0 ? `${item.processingTime}s` : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-primary"
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
                          {item.creditsUsed}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs">{format(item.processedAt, 'MMM dd')}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(item.processedAt, 'HH:mm')}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setSelectedImage({
                                original: item.originalImage,
                                processed: item.processedImage || undefined,
                              })
                            }
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          {item.processedImage && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                downloadImage(item.processedImage!, `processed-${item.filename}`)
                              }
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Compact Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-background rounded-lg p-4 max-w-2xl w-full max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-semibold">Preview</h3>
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <h4 className="text-xs font-medium mb-1">Original</h4>
                <div className="relative aspect-square rounded overflow-hidden border">
                  <Image
                    src={selectedImage.original}
                    alt="Original"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              {selectedImage.processed && (
                <div>
                  <h4 className="text-xs font-medium mb-1">Processed</h4>
                  <div className="relative aspect-square rounded overflow-hidden border">
                    <Image
                      src={selectedImage.processed}
                      alt="Processed"
                      fill
                      className="object-cover"
                    />
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
