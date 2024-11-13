'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, CheckCircle2, XCircle, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { IUser } from '@/lib/models/user.model';

interface ResellerListProps {
  status: 'active' | 'pending';
}

export default function ResellerList({ status }: ResellerListProps) {
  const [resellers, setResellers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResellers();
  }, [status]);

  const fetchResellers = async () => {
    try {
      const response = await fetch(`/api/admin/resellers?status=${status}`);
      const data = await response.json();
      setResellers(data);
    } catch (error) {
      console.error('Failed to fetch resellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (resellerId: string) => {
    try {
      const response = await fetch(`/api/admin/resellers/${resellerId}/approve`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchResellers();
      }
    } catch (error) {
      console.error('Failed to approve reseller:', error);
    }
  };

  const handleReject = async (resellerId: string) => {
    try {
      const response = await fetch(`/api/admin/resellers/${resellerId}/reject`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchResellers();
      }
    } catch (error) {
      console.error('Failed to reject reseller:', error);
    }
  };

  if (loading) {
    return <div>Loading resellers...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Business Name</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Domain</TableHead>
          <TableHead>Wallet Balance</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {resellers.map((reseller) => (
          <TableRow key={reseller._id}>
            <TableCell className="font-medium">
              {reseller.businessName}
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span>{reseller.name}</span>
                <span className="text-sm text-muted-foreground">
                  {reseller.email}
                </span>
              </div>
            </TableCell>
            <TableCell>{reseller.domain || 'Not set'}</TableCell>
            <TableCell>
              {reseller.wallet ? (
                formatCurrency(reseller.wallet.balance, reseller.wallet.currency)
              ) : (
                'N/A'
              )}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  reseller.status === 'active'
                    ? 'success'
                    : reseller.status === 'pending'
                    ? 'warning'
                    : 'destructive'
                }
              >
                {reseller.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {status === 'pending' ? (
                    <>
                      <DropdownMenuItem
                        onClick={() => handleApprove(reseller._id)}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleReject(reseller._id)}
                        className="text-red-600"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem>
                      <Wallet className="mr-2 h-4 w-4" />
                      Manage Wallet
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}