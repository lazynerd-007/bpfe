'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

// Country emoji helper
const getCountryEmoji = (countryCode: string): string => {
  if (!countryCode) return "🌍"
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
}

// Country data - simplified for merchant onboarding (focused on business-friendly countries)
const countryData: Record<string, { name: string; continent: string; code: string }> = {
  // Africa (Ghana first as primary market)
  'GHANA': { name: 'Ghana', continent: 'Africa', code: 'GH' },
  'NIGERIA': { name: 'Nigeria', continent: 'Africa', code: 'NG' },
  'KENYA': { name: 'Kenya', continent: 'Africa', code: 'KE' },
  'SOUTH_AFRICA': { name: 'South Africa', continent: 'Africa', code: 'ZA' },
  'EGYPT': { name: 'Egypt', continent: 'Africa', code: 'EG' },
  'MOROCCO': { name: 'Morocco', continent: 'Africa', code: 'MA' },
  'TUNISIA': { name: 'Tunisia', continent: 'Africa', code: 'TN' },
  'RWANDA': { name: 'Rwanda', continent: 'Africa', code: 'RW' },
  'BOTSWANA': { name: 'Botswana', continent: 'Africa', code: 'BW' },
  'MAURITIUS': { name: 'Mauritius', continent: 'Africa', code: 'MU' },

  // Europe
  'UNITED_KINGDOM': { name: 'United Kingdom', continent: 'Europe', code: 'GB' },
  'GERMANY': { name: 'Germany', continent: 'Europe', code: 'DE' },
  'FRANCE': { name: 'France', continent: 'Europe', code: 'FR' },
  'ITALY': { name: 'Italy', continent: 'Europe', code: 'IT' },
  'SPAIN': { name: 'Spain', continent: 'Europe', code: 'ES' },
  'NETHERLANDS': { name: 'Netherlands', continent: 'Europe', code: 'NL' },
  'SWITZERLAND': { name: 'Switzerland', continent: 'Europe', code: 'CH' },
  'SWEDEN': { name: 'Sweden', continent: 'Europe', code: 'SE' },
  'NORWAY': { name: 'Norway', continent: 'Europe', code: 'NO' },
  'DENMARK': { name: 'Denmark', continent: 'Europe', code: 'DK' },

  // North America
  'UNITED_STATES': { name: 'United States', continent: 'North America', code: 'US' },
  'CANADA': { name: 'Canada', continent: 'North America', code: 'CA' },

  // Asia
  'SINGAPORE': { name: 'Singapore', continent: 'Asia', code: 'SG' },
  'HONG_KONG': { name: 'Hong Kong', continent: 'Asia', code: 'HK' },
  'UNITED_ARAB_EMIRATES': { name: 'United Arab Emirates', continent: 'Asia', code: 'AE' },
  'JAPAN': { name: 'Japan', continent: 'Asia', code: 'JP' },
  'SOUTH_KOREA': { name: 'South Korea', continent: 'Asia', code: 'KR' },
  'INDIA': { name: 'India', continent: 'Asia', code: 'IN' },

  // Oceania
  'AUSTRALIA': { name: 'Australia', continent: 'Oceania', code: 'AU' },
  'NEW_ZEALAND': { name: 'New Zealand', continent: 'Oceania', code: 'NZ' },
};

// Helper function to organize countries by continent
const organizeCountriesByContinent = (countries: typeof countryData) => {
  const continentOrder = ['Africa', 'Asia', 'Europe', 'North America', 'Oceania'];
  const countriesByContinent: Record<string, Array<{ value: string; name: string; code: string }>> = {};
  
  // Initialize continents
  continentOrder.forEach(continent => {
    countriesByContinent[continent] = [];
  });

  // Group countries by continent
  Object.entries(countries).forEach(([value, data]) => {
    const continent = data.continent;
    if (countriesByContinent[continent]) {
      countriesByContinent[continent].push({
        value,
        name: data.name,
        code: data.code,
      });
    }
  });

  // Sort countries within each continent (Ghana first in Africa)
  Object.keys(countriesByContinent).forEach(continent => {
    if (continent === 'Africa') {
      // Sort Africa with Ghana first, then alphabetically
      countriesByContinent[continent].sort((a, b) => {
        if (a.value === 'GHANA') return -1;
        if (b.value === 'GHANA') return 1;
        return a.name.localeCompare(b.name);
      });
    } else {
      // Sort other continents alphabetically
      countriesByContinent[continent].sort((a, b) => a.name.localeCompare(b.name));
    }
  });

  return continentOrder
    .filter(continent => countriesByContinent[continent].length > 0)
    .map(continent => ({
      continent,
      countries: countriesByContinent[continent]
    }));
};

export interface CountrySelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const CountrySelect = React.memo(({
  value,
  onValueChange,
  placeholder = "Select country",
  disabled,
  className,
}: CountrySelectProps) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Filter countries based on search query
  const filteredCountries = React.useMemo(() => {
    if (!searchQuery.trim()) return countryData;
    
    const filtered: typeof countryData = {};
    Object.entries(countryData).forEach(([key, data]) => {
      const query = searchQuery.toLowerCase();
      if (
        data.name.toLowerCase().includes(query) ||
        data.code.toLowerCase().includes(query)
      ) {
        filtered[key] = data;
      }
    });
    
    return filtered;
  }, [searchQuery]);
  
  // Organize filtered countries by continent
  const continentGroups = React.useMemo(() => {
    return organizeCountriesByContinent(filteredCountries);
  }, [filteredCountries]);
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSearchQuery('');
    }
  };

  const selectedCountry = value ? countryData[value] : null;
  
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder}>
          {selectedCountry && (
            <div className="flex items-center gap-2">
              <span className="text-base">
                {getCountryEmoji(selectedCountry.code)}
              </span>
              <span className="text-sm">
                {selectedCountry.name}
              </span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[300px] w-[300px]">
        <div className="p-2 border-b">
          <Input
            placeholder="Search countries..."
            value={searchQuery}
            onChange={(e) => {
              e.stopPropagation();
              setSearchQuery(e.target.value);
            }}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === 'Escape') {
                setSearchQuery('');
                setIsOpen(false);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="h-8 text-sm"
            autoFocus
          />
        </div>
        {continentGroups.map(({ continent, countries }) => (
          <SelectGroup key={continent}>
            <SelectLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              {continent}
            </SelectLabel>
            {countries.map((country) => (
              <SelectItem 
                key={country.value} 
                value={country.value}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-3 w-full">
                  <span className="text-base shrink-0">
                    {getCountryEmoji(country.code)}
                  </span>
                  <span className="flex-1 text-sm truncate">
                    {country.name}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {country.code}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
        {continentGroups.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No countries found
          </div>
        )}
      </SelectContent>
    </Select>
  );
});