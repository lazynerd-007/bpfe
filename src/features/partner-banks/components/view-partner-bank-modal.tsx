"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PartnerBank } from "@/sdk/types";
import { IconBuildingBank, IconUsers, IconDevices, IconCalendar, IconMail, IconPhone, IconMapPin } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";

interface ViewPartnerBankModalProps {
  partnerBank: PartnerBank | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewPartnerBankModal({
  partnerBank,
  open,
  onOpenChange,
}: ViewPartnerBankModalProps) {
  if (!partnerBank) return null;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconBuildingBank className="h-5 w-5" />
            {partnerBank.name}
          </DialogTitle>
          <DialogDescription>
            Partner Bank Details and Information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-sm font-medium">{partnerBank.name}</p>
                </div>
                {partnerBank.slug && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Slug</label>
                    <p className="text-sm">{partnerBank.slug}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">UUID</label>
                  <p className="text-sm font-mono text-xs">{partnerBank.uuid}</p>
                </div>
                {partnerBank.commissionRatio && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Commission Ratio</label>
                    <p className="text-sm">{partnerBank.commissionRatio}%</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bank Details */}
          {(partnerBank.settlementBank || partnerBank.commissionBank) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bank Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {partnerBank.settlementBank && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Settlement Bank</label>
                      <p className="text-sm">
                        {typeof partnerBank.settlementBank === 'string' 
                          ? partnerBank.settlementBank 
                          : JSON.stringify(partnerBank.settlementBank, null, 2)
                        }
                      </p>
                    </div>
                  )}
                  {partnerBank.commissionBank && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Commission Bank</label>
                      <p className="text-sm">
                        {typeof partnerBank.commissionBank === 'string' 
                          ? partnerBank.commissionBank 
                          : JSON.stringify(partnerBank.commissionBank, null, 2)
                        }
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}



          {/* Associated Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Devices */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <IconDevices className="h-4 w-4" />
                  Devices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-4">
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    {partnerBank.devices?.length || 0}
                  </Badge>
                </div>
                {partnerBank.devices && partnerBank.devices.length > 0 && (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {partnerBank.devices.slice(0, 5).map((device) => (
                      <div key={device.uuid} className="text-xs p-2 bg-muted rounded">
                        <p className="font-medium">{device.deviceId}</p>
                        <p className="text-muted-foreground">{device.status}</p>
                      </div>
                    ))}
                    {partnerBank.devices.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{partnerBank.devices.length - 5} more devices
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Merchants */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <IconUsers className="h-4 w-4" />
                  Merchants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-4">
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    {partnerBank.merchants?.length || 0}
                  </Badge>
                </div>
                {partnerBank.merchants && partnerBank.merchants.length > 0 && (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {partnerBank.merchants.slice(0, 5).map((merchant) => (
                      <div key={merchant.uuid} className="text-xs p-2 bg-muted rounded">
                        <p className="font-medium">{merchant.merchantName}</p>
                        <p className="text-muted-foreground">{merchant.merchantCode}</p>
                      </div>
                    ))}
                    {partnerBank.merchants.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{partnerBank.merchants.length - 5} more merchants
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <IconCalendar className="h-4 w-4" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-sm">{formatDate(partnerBank.createdAt)}</p>
                  <p className="text-xs text-muted-foreground">{getTimeAgo(partnerBank.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="text-sm">{formatDate(partnerBank.updatedAt)}</p>
                  <p className="text-xs text-muted-foreground">{getTimeAgo(partnerBank.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}