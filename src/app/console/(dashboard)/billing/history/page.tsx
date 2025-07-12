'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CreditCard, Filter, HistoryIcon, Receipt, Search } from 'lucide-react';
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

interface TransactionData {
  transactionId: string;
  itemName: string;
  price: {
    amount: string;
    currency: string;
  };
  credits: number;
  paidAt: string | null;
  currentStatus: string;
  eventType: string;
  occurredAt: string;
  invoiceNumber: string | null;
  paymentMethod: {
    type: string;
    card?: {
      type: string;
      last4: string;
      expiryYear: number;
      expiryMonth: number;
      cardholderName: string;
    };
  } | null;
  allStates: Array<{
    status: string;
    eventType: string;
    occurredAt: string;
    totals: {
      total: string;
      currencyCode: string;
    };
  }>;
}

interface TransactionStatistics {
  totalSpent: number; // In cents
  totalCredits: number;
  completedTransactions: number;
}

interface TransactionResponse {
  success: boolean;
  transactions: TransactionData[];
  total: number;
  statistics: TransactionStatistics;
}

type FilterStatus = 'all' | 'draft' | 'paid' | 'completed' | 'cancelled' | 'failed';

const fetchTransactions = async (): Promise<TransactionResponse> => {
  const response = await fetch('/api/transactions');

  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch transactions');
  }

  return data;
};

export default function BillingHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('completed');
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionData | null>(null);

  const {
    data: transactionResponse,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const transactions = transactionResponse?.transactions || [];
  const statistics = transactionResponse?.statistics;

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.invoiceNumber &&
        transaction.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || transaction.currentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Format the total spent from cents to dollars
  const formatTotalSpent = (amountInCents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amountInCents / 100);
  };

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
      case 'paid':
        return (
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
          >
            Paid
          </Badge>
        );
      case 'draft':
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
          >
            Draft
          </Badge>
        );
      case 'cancelled':
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatPrice = (amount: string, currency: string) => {
    const price = parseFloat(amount) / 100; // Convert cents to dollars
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const getPaymentMethodDisplay = (paymentMethod: TransactionData['paymentMethod']) => {
    if (!paymentMethod) return 'N/A';

    if (paymentMethod.type === 'card' && paymentMethod.card) {
      return `${paymentMethod.card.type.toUpperCase()} ****${paymentMethod.card.last4}`;
    }

    return paymentMethod.type;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-3">
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading billing history...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-3">
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500">Failed to load billing history. Please try again.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-3">
      {/* Header with Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HistoryIcon className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Billing History</h1>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <div className="font-bold text-foreground">
              {statistics ? formatTotalSpent(statistics.totalSpent) : '$0.00'}
            </div>
            <div className="text-xs text-muted-foreground">Total Spent</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-foreground">{statistics?.totalCredits || 0}</div>
            <div className="text-xs text-muted-foreground">Credits</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-foreground">
              {statistics?.completedTransactions || 0}
            </div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
        </div>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Transaction History</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3 h-3" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-7 w-48 h-8 text-sm"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-1 h-3 w-3" />
                    {statusFilter === 'all'
                      ? 'All'
                      : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                    Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('paid')}>Paid</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('draft')}>
                    Draft
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('failed')}>
                    Failed
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
                  <TableHead className="w-[120px]">Transaction ID</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead className="w-[100px]">Price</TableHead>
                  <TableHead className="w-[80px]">Credits</TableHead>
                  <TableHead className="w-[120px]">Paid At</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[120px]">Payment Method</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No transactions found matching your criteria</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.transactionId} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-xs">
                        {transaction.transactionId.substring(0, 12)}...
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{transaction.itemName}</p>
                          {transaction.invoiceNumber && (
                            <p className="text-xs text-muted-foreground">
                              Invoice: {transaction.invoiceNumber}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatPrice(transaction.price.amount, transaction.price.currency)}
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
                          {transaction.credits}
                        </div>
                      </TableCell>
                      <TableCell>
                        {transaction.paidAt ? (
                          <div>
                            <p className="text-xs">
                              {format(new Date(transaction.paidAt), 'MMM dd, yyyy')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(transaction.paidAt), 'HH:mm')}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(transaction.currentStatus)}</TableCell>
                      <TableCell>
                        <span className="text-xs">
                          {getPaymentMethodDisplay(transaction.paymentMethod)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedTransaction(transaction)}
                        >
                          <Receipt className="w-3 h-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTransaction(null)}
        >
          <div
            className="bg-background rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Transaction Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedTransaction(null)}>
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

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Transaction ID
                  </label>
                  <p className="font-mono text-sm">{selectedTransaction.transactionId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedTransaction.currentStatus)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Item</label>
                  <p className="text-sm">{selectedTransaction.itemName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Price</label>
                  <p className="text-sm">
                    {formatPrice(
                      selectedTransaction.price.amount,
                      selectedTransaction.price.currency
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Credits</label>
                  <p className="text-sm">{selectedTransaction.credits}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Payment Method
                  </label>
                  <p className="text-sm">
                    {getPaymentMethodDisplay(selectedTransaction.paymentMethod)}
                  </p>
                </div>
              </div>

              {selectedTransaction.invoiceNumber && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Invoice Number
                  </label>
                  <p className="text-sm">{selectedTransaction.invoiceNumber}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Transaction States
                </label>
                <div className="mt-2 space-y-2">
                  {selectedTransaction.allStates.map((state, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-muted rounded"
                    >
                      <div className="flex items-center gap-2">
                        {getStatusBadge(state.status)}
                        <span className="text-sm">{state.eventType}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(state.occurredAt), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
