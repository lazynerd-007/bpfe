'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, RotateCcw, Calendar } from 'lucide-react';
import type { TransactionFilters } from '@/sdk/types';
import { useTransactionFilters } from './hooks';

const statusOptions = [
  { value: 'ALL', label: 'All Status' },
  { value: 'SUCCESSFUL', label: 'Successful' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'FAILED', label: 'Failed' },
];

const processorOptions = [
  { value: 'ALL', label: 'All Processors' },
  { value: 'MTN', label: 'MTN' },
  { value: 'AIRTEL', label: 'Airtel' },
  { value: 'VODAFONE', label: 'Vodafone' },
  { value: 'TIGO', label: 'Tigo' },
  { value: 'ORANGE', label: 'Orange' },
];

export function TransactionFilters() {
  const { filters, updateFilters, resetFilters } = useTransactionFilters();
  const [localFilters, setLocalFilters] = useState(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleApplyFilters = async () => {
    await updateFilters(localFilters);
  };

  const handleResetFilters = async () => {
    const defaultFilters: TransactionFilters = {
      page: 1,
      limit: 10,
    };
    setLocalFilters(defaultFilters);
    await resetFilters();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status) count++;
    if (filters.processor) count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    return count;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">{getActiveFiltersCount()}</Badge>
            )}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Simple' : 'Advanced'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by reference, customer name, or phone..."
              value={(localFilters as any).search || ''}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, search: e.target.value })
              }
              className="pl-9"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={localFilters.status || 'ALL'}
              onValueChange={(value) =>
                setLocalFilters({ 
                  ...localFilters, 
                  status: value === 'ALL' ? undefined : value as any
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Processor */}
          <div className="space-y-2">
            <Label>Processor</Label>
            <Select
              value={localFilters.processor || 'ALL'}
              onValueChange={(value) =>
                setLocalFilters({ 
                  ...localFilters, 
                  processor: value === 'ALL' ? undefined : value as any 
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select processor" />
              </SelectTrigger>
              <SelectContent>
                {processorOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {showAdvanced && (
          <div className="grid gap-4 md:grid-cols-2">
            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="startDate"
                  type="date"
                  value={localFilters.startDate || ''}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, startDate: e.target.value })
                  }
                  className="pl-9"
                />
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="endDate"
                  type="date"
                  value={localFilters.endDate || ''}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, endDate: e.target.value })
                  }
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button onClick={handleApplyFilters} className="flex-1">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={handleResetFilters}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}