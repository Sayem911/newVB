'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface Order {
  id: string;
  product: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    product: 'Mobile Legends Diamonds',
    date: '2024-02-10',
    amount: 99.00,
    status: 'completed',
  },
  {
    id: 'ORD-002',
    product: 'PUBG UC',
    date: '2024-02-09',
    amount: 49.99,
    status: 'completed',
  },
  {
    id: 'ORD-003',
    product: 'Steam Wallet Code',
    date: '2024-02-08',
    amount: 25.00,
    status: 'pending',
  },
];

export function OrderHistory() {
  const [orders] = useState<Order[]>(mockOrders);

  return (
    <>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>
          View and track your previous orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>{formatCurrency(order.amount, 'USD')}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === 'completed'
                        ? 'default'
                        : order.status === 'pending'
                        ? 'secondary'
                        : 'destructive'
                    }
                    className={
                      order.status === 'completed'
                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                        : order.status === 'pending'
                        ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </>
  );
}