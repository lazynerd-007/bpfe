'use client';

import { useState, useEffect, useMemo } from 'react';
import { Check, ChevronsUpDown, Search, Building2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { partnerBankService } from '@/sdk/partner-banks';
import { PartnerBank } from '@/sdk/types';

interface PartnerBankSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  showActiveOnly?: boolean;
}

export function PartnerBankSelect({
  value,
  onValueChange,
  disabled = false,
  placeholder = "Select partner bank...",
  className,
  showActiveOnly = false
}: PartnerBankSelectProps) {
  const [open, setOpen] = useState(false);
  const [partnerBanks, setPartnerBanks] = useState<PartnerBank[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const fetchPartnerBanks = async () => {
      setLoading(true);
      try {
        const response = await partnerBankService.getPartnerBanks();
        const banks = response.data || [];
        setPartnerBanks(banks);
      } catch (error) {
        console.error('Failed to fetch partner banks:', error);
        setPartnerBanks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerBanks();
  }, [showActiveOnly]);

  const filteredPartnerBanks = useMemo(() => {
    if (!searchValue) return partnerBanks;
    return partnerBanks.filter(bank =>
      bank.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      (bank.slug && bank.slug.toLowerCase().includes(searchValue.toLowerCase()))
    );
  }, [partnerBanks, searchValue]);

  const selectedPartnerBank = partnerBanks.find((bank) => bank.uuid === value);


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
            <Building2 className="h-4 w-4 text-muted-foreground" />
            {selectedPartnerBank ? (
              <span className="truncate">
                {selectedPartnerBank.name} {selectedPartnerBank.slug ? `(${selectedPartnerBank.slug})` : ''}
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
            placeholder="Search partner banks..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? "Loading partner banks..." : "No partner banks found."}
            </CommandEmpty>
            <CommandGroup>
              {filteredPartnerBanks.map((bank) => (
                <CommandItem
                  key={bank.uuid}
                  value={bank.uuid}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{bank.name}</span>
                        {bank.slug && (
                          <span className="text-xs text-muted-foreground px-1.5 py-0.5 bg-muted rounded">
                            {bank.slug}
                          </span>
                        )}
                        {bank.commissionRatio && (
                          <span className="text-xs text-blue-600 px-1.5 py-0.5 bg-blue-50 rounded">
                            {(bank.commissionRatio * 100).toFixed(1)}%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Commission: {bank.commissionRatio ? `${(bank.commissionRatio * 100).toFixed(1)}%` : 'N/A'}</span>
                        {bank.swiftCode && (
                          <>
                            <span>•</span>
                            <span>SWIFT: {bank.swiftCode}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === bank.uuid ? "opacity-100" : "opacity-0"
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