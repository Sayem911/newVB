'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Wallet, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function WalletCard() {
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTopUp = async () => {
    // Implement top-up logic here
    setIsDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Wallet Balance</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Top Up
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Top Up Wallet</DialogTitle>
              <DialogDescription>
                Enter the amount you want to add to your wallet
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                />
              </div>
              <Button onClick={handleTopUp} className="w-full">
                Proceed to Payment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Wallet className="h-8 w-8 text-primary" />
          <div>
            <div className="text-3xl font-bold">
              {formatCurrency(5231.89, 'USD')}
            </div>
            <p className="text-sm text-muted-foreground">
              Available for purchases
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}