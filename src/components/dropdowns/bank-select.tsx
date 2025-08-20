'use client';

import { useState, useEffect, useMemo } from 'react';
import { Check, ChevronsUpDown, Landmark, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { bankService, type Bank } from '@/sdk/banks';

interface BankSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  country?: string;
}

export function BankSelect({
  value,
  onValueChange,
  disabled = false,
  placeholder = "Select bank...",
  className,
  country = 'Ghana'
}: BankSelectProps) {
  const [open, setOpen] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const fetchBanks = async () => {
      setLoading(true);
      try {
        const params = country ? { country } : undefined;
        const banksData = await bankService.getBanks(params);
        setBanks(banksData);
      } catch (error) {
        console.error('Failed to fetch banks:', error);
        setBanks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, [country]);

  const filteredBanks = useMemo(() => {
    if (!searchValue) return banks;
    return banks.filter(bank =>
      bank.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      bank.code.toLowerCase().includes(searchValue.toLowerCase()) ||
      (bank.swiftCode && bank.swiftCode.toLowerCase().includes(searchValue.toLowerCase()))
    );
  }, [banks, searchValue]);

  const selectedBank = banks.find((bank) => bank.uuid === value);

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
            <Landmark className="h-4 w-4 text-muted-foreground" />
            {selectedBank ? (
              <span className="truncate">
                {selectedBank.name} ({selectedBank.code})
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
            placeholder="Search banks..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? "Loading banks..." : "No banks found."}
            </CommandEmpty>
            <CommandGroup>
              {filteredBanks.map((bank) => (
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
                    <Landmark className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{bank.name}</span>
                        <span className="text-xs text-muted-foreground px-1.5 py-0.5 bg-muted rounded">
                          {bank.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{bank.country}</span>
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