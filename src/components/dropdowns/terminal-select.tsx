'use client';

import { useState, useEffect, useMemo } from 'react';
import { Check, ChevronsUpDown, Terminal as TerminalIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { deviceService } from '@/sdk/devices';
import { Device } from '@/sdk/types';

interface TerminalSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  merchantId?: string;
  partnerBankId?: string;
  className?: string;
}

export function TerminalSelect({
  value,
  onValueChange,
  disabled = false,
  placeholder = "Select terminal...",
  merchantId,
  partnerBankId,
  className
}: TerminalSelectProps) {
  const [open, setOpen] = useState(false);
  const [terminals, setTerminals] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const fetchTerminals = async () => {
      setLoading(true);
      try {
        let devices;
        if (merchantId) {
          devices = await deviceService.getDevicesByMerchant(merchantId);
        } else if (partnerBankId) {
          devices = await deviceService.getDevicesByPartnerBank(partnerBankId);
        } else {
          const response = await deviceService.getDevices();
          devices = response.data || [];
        }
        
        // All devices are terminals in this system
        const deviceArray = Array.isArray(devices) ? devices : [];
        setTerminals(deviceArray);
      } catch (error) {
        console.error('Failed to fetch terminals:', error);
        setTerminals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTerminals();
  }, [merchantId, partnerBankId]);

  const filteredTerminals = useMemo(() => {
    if (!searchValue) return terminals;
    return terminals.filter(terminal =>
      terminal.deviceId.toLowerCase().includes(searchValue.toLowerCase()) ||
      (terminal.merchantUuid && terminal.merchantUuid.toLowerCase().includes(searchValue.toLowerCase()))
    );
  }, [terminals, searchValue]);

  const selectedTerminal = terminals.find((terminal) => terminal.uuid === value);

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
            <TerminalIcon className="h-4 w-4 text-muted-foreground" />
            {selectedTerminal ? (
              <span className="truncate">
                {selectedTerminal.deviceId} - {selectedTerminal.status}
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
            placeholder="Search terminals..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? "Loading terminals..." : "No terminals found."}
            </CommandEmpty>
            <CommandGroup>
              {filteredTerminals.map((terminal) => (
                <CommandItem
                  key={terminal.uuid}
                  value={terminal.uuid}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <TerminalIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{terminal.deviceId}</span>
                        <span className={cn(
                          "text-xs px-1.5 py-0.5 rounded",
                          terminal.status === 'ALLOCATED' ? 'text-green-600 bg-green-50' :
                          terminal.status === 'SUBMITTED' ? 'text-blue-600 bg-blue-50' :
                          terminal.status === 'BLOCKED' ? 'text-red-600 bg-red-50' :
                          'text-gray-600 bg-gray-50'
                        )}>
                          {terminal.status}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {terminal.merchantUuid ? `Merchant: ${terminal.merchantUuid}` : 'Unassigned'}
                      </span>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === terminal.uuid ? "opacity-100" : "opacity-0"
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