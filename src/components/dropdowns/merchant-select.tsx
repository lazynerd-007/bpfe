'use client';

import { useState, useEffect, useMemo } from 'react';
import { Check, ChevronsUpDown, Search, Store, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { merchantsService } from '@/sdk/merchants';
import { Merchant } from '@/sdk/types';

interface MerchantSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  partnerBankId?: string;
  showActiveOnly?: boolean;
}

export function MerchantSelect({
  value,
  onValueChange,
  disabled = false,
  placeholder = "Select merchant...",
  className,
  partnerBankId,
  showActiveOnly = false
}: MerchantSelectProps) {
  const [open, setOpen] = useState(false);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const fetchMerchants = async () => {
      setLoading(true);
      try {
        // Ensure user is authenticated before making request (prevents missing Bearer header)
        const { getSession } = await import('next-auth/react');
        const session = await getSession();
        if (!session?.user) {
          console.log('[MerchantSelect] No authenticated session, skipping merchants fetch');
          setMerchants([]);
          setLoading(false);
          return;
        }

        const filters: Record<string, unknown> = {};
        
        if (partnerBankId) {
          filters.partnerBankId = partnerBankId;
        }
        
        const response = await merchantsService.getAllMerchants(filters);
        const merchantList = response.data || [];
        
        setMerchants(merchantList);
      } catch (error) {
        console.error('Failed to fetch merchants:', error);
        setMerchants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchants();
  }, [partnerBankId, showActiveOnly]);

  const filteredMerchants = useMemo(() => {
    if (!searchValue) return merchants;
    return merchants.filter(merchant =>
      merchant.merchantName.toLowerCase().includes(searchValue.toLowerCase()) ||
      merchant.merchantCode.toLowerCase().includes(searchValue.toLowerCase()) ||
      merchant.country.toLowerCase().includes(searchValue.toLowerCase()) ||
      merchant.notificationEmail.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [merchants, searchValue]);

  const selectedMerchant = merchants.find((merchant) => merchant.uuid === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled || loading}
        >
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-muted-foreground" />
            {selectedMerchant ? (
              <span className="truncate">
                {selectedMerchant.merchantName} ({selectedMerchant.merchantCode})
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          {loading ? (
            <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput
            placeholder="Search merchants..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? "Loading merchants..." : "No merchants found."}
            </CommandEmpty>
            <CommandGroup>
              {filteredMerchants.map((merchant) => (
                <CommandItem
                  key={merchant.uuid}
                  value={merchant.uuid}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{merchant.merchantName}</span>
                        <span className="text-xs text-muted-foreground px-1.5 py-0.5 bg-muted rounded">
                          {merchant.merchantCode}
                        </span>
                        <div className="flex gap-1">
                          {merchant.canProcessMomoTransactions && (
                            <span className="text-xs text-blue-600 px-1.5 py-0.5 bg-blue-50 rounded">
                              MoMo
                            </span>
                          )}
                          {merchant.canProcessCardTransactions && (
                            <span className="text-xs text-purple-600 px-1.5 py-0.5 bg-purple-50 rounded">
                              Card
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{merchant.country}</span>
                        <span>•</span>
                        <span>{merchant.notificationEmail}</span>
                      </div>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === merchant.uuid ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}