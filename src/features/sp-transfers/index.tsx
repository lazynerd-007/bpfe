"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FeatureErrorBoundary } from "@/components/error-boundary";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Clock, CheckCircle, XCircle, Plus } from "lucide-react";

export default function SPTransfersPage() {
  return (
    <FeatureErrorBoundary featureName="SP Transfers Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Special Purpose Transfers</h1>
            <p className="text-muted-foreground">
              Manage special purpose transfers, bulk operations, and custom workflows
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New SP Transfer
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transfers</CardTitle>
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Successfully processed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Failed transfers
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Transfer Types</CardTitle>
              <CardDescription>
                Available special purpose transfer categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Bulk Salary Payments", status: "Active", count: 0 },
                  { name: "Vendor Payments", status: "Active", count: 0 },
                  { name: "Emergency Transfers", status: "Active", count: 0 },
                  { name: "Disbursements", status: "Active", count: 0 },
                ].map((type) => (
                  <div key={type.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{type.name}</div>
                      <div className="text-sm text-muted-foreground">{type.count} transfers</div>
                    </div>
                    <Badge variant="outline">{type.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transfers</CardTitle>
              <CardDescription>
                Latest special purpose transfer activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-12 text-muted-foreground">
                  <ArrowUpDown className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p>No recent transfers</p>
                  <p className="text-sm">Special purpose transfers will appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transfer Guidelines</CardTitle>
            <CardDescription>
              Important information about special purpose transfers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-medium">Authorization Requirements</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Transfers above GHS 10,000 require dual approval</li>
                  <li>• OTP verification required for all SP transfers</li>
                  <li>• Batch transfers require senior manager approval</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Processing Times</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Standard transfers: 2-5 minutes</li>
                  <li>• Bulk transfers: 15-30 minutes</li>
                  <li>• International: 1-3 business days</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FeatureErrorBoundary>
  );
}