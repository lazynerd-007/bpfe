"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Device } from '@/sdk/types';
import { format } from 'date-fns';

interface DeviceViewModalProps {
  device: Device | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ALLOCATED':
      return 'bg-green-100 text-green-800';
    case 'SUBMITTED':
      return 'bg-blue-100 text-blue-800';
    case 'BLOCKED':
      return 'bg-red-100 text-red-800';
    case 'REMOVED':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function DeviceViewModal({ device, open, onOpenChange }: DeviceViewModalProps) {
  if (!device) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Device Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-4">Basic Information</h4>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-muted-foreground">Device ID:</span>
                  <span className="font-mono">{device.deviceId}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-muted-foreground">UUID:</span>
                  <span className="font-mono text-xs break-all">{device.uuid}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={getStatusColor(device.status)}>
                    {device.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{format(new Date(device.createdAt), 'PPP')}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-muted-foreground">Updated:</span>
                  <span>{format(new Date(device.updatedAt), 'PPP')}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Assignment Details</h4>
              <div className="space-y-3 text-sm">
                {device.merchant ? (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Merchant:</span>
                      <span>{device.merchant.merchantName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Merchant Code:</span>
                      <span className="font-mono">{device.merchant.merchantCode}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Merchant Email:</span>
                      <span>{device.merchant.notificationEmail}</span>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Merchant:</span>
                    <span className="text-muted-foreground">Not assigned</span>
                  </div>
                )}
                
                {device.assignedTo ? (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Partner Bank:</span>
                      <span>{device.assignedTo.name}</span>
                    </div>
                    {device.assignedTo.slug && (
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-muted-foreground">Bank Slug:</span>
                        <span className="font-mono">{device.assignedTo.slug}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Partner Bank:</span>
                    <span className="text-muted-foreground">Not assigned</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {device.transactions && device.transactions.length > 0 && (
            <div>
              <h4 className="font-medium mb-4">Recent Transactions</h4>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  Total transactions: {device.transactions.length}
                </div>
                <div className="max-h-40 overflow-y-auto">
                  <div className="space-y-2">
                    {device.transactions.slice(0, 5).map((transaction, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                        <span className="font-mono">{transaction.transactionRef}</span>
                        <div className="flex items-center gap-2">
                          <span>{transaction.amount} {transaction.currency}</span>
                          <Badge 
                            variant={transaction.status === 'SUCCESSFUL' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {device.transactions.length > 5 && (
                      <div className="text-xs text-muted-foreground text-center py-2">
                        ... and {device.transactions.length - 5} more transactions
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}