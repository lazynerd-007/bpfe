"use client"

import React, { forwardRef } from "react"
import { PhoneIcon } from "lucide-react"
import * as RPNInput from "react-phone-number-input"
import flags from "react-phone-number-input/flags"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select"



const getCountryEmoji = (countryCode: string): string => {
  if (!countryCode) return "🌍"
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
}


const countryData: Record<string, { name: string; continent: string }> = {
  // Africa (Ghana first)
  'GH': { name: 'Ghana', continent: 'Africa' },
  'NG': { name: 'Nigeria', continent: 'Africa' },
  'KE': { name: 'Kenya', continent: 'Africa' },
  'UG': { name: 'Uganda', continent: 'Africa' },
  'TZ': { name: 'Tanzania', continent: 'Africa' },
  'ZA': { name: 'South Africa', continent: 'Africa' },
  'EG': { name: 'Egypt', continent: 'Africa' },
  'MA': { name: 'Morocco', continent: 'Africa' },
  'ET': { name: 'Ethiopia', continent: 'Africa' },
  'DZ': { name: 'Algeria', continent: 'Africa' },
  'TN': { name: 'Tunisia', continent: 'Africa' },
  'LY': { name: 'Libya', continent: 'Africa' },
  'SD': { name: 'Sudan', continent: 'Africa' },
  'ZW': { name: 'Zimbabwe', continent: 'Africa' },
  'ZM': { name: 'Zambia', continent: 'Africa' },
  'BW': { name: 'Botswana', continent: 'Africa' },
  'NA': { name: 'Namibia', continent: 'Africa' },
  'SN': { name: 'Senegal', continent: 'Africa' },
  'CI': { name: 'Côte d\'Ivoire', continent: 'Africa' },
  'BF': { name: 'Burkina Faso', continent: 'Africa' },
  'ML': { name: 'Mali', continent: 'Africa' },
  'NE': { name: 'Niger', continent: 'Africa' },
  'TD': { name: 'Chad', continent: 'Africa' },
  'CM': { name: 'Cameroon', continent: 'Africa' },
  'GA': { name: 'Gabon', continent: 'Africa' },
  'CG': { name: 'Congo', continent: 'Africa' },
  'CD': { name: 'Democratic Republic of the Congo', continent: 'Africa' },
  'CF': { name: 'Central African Republic', continent: 'Africa' },
  'AO': { name: 'Angola', continent: 'Africa' },
  'MZ': { name: 'Mozambique', continent: 'Africa' },
  'MW': { name: 'Malawi', continent: 'Africa' },
  'RW': { name: 'Rwanda', continent: 'Africa' },
  'BI': { name: 'Burundi', continent: 'Africa' },
  'DJ': { name: 'Djibouti', continent: 'Africa' },
  'SO': { name: 'Somalia', continent: 'Africa' },
  'ER': { name: 'Eritrea', continent: 'Africa' },
  'SL': { name: 'Sierra Leone', continent: 'Africa' },
  'LR': { name: 'Liberia', continent: 'Africa' },
  'GN': { name: 'Guinea', continent: 'Africa' },
  'GW': { name: 'Guinea-Bissau', continent: 'Africa' },
  'GM': { name: 'Gambia', continent: 'Africa' },
  'MR': { name: 'Mauritania', continent: 'Africa' },
  'CV': { name: 'Cape Verde', continent: 'Africa' },
  'ST': { name: 'São Tomé and Príncipe', continent: 'Africa' },
  'GQ': { name: 'Equatorial Guinea', continent: 'Africa' },
  'KM': { name: 'Comoros', continent: 'Africa' },
  'MU': { name: 'Mauritius', continent: 'Africa' },
  'SC': { name: 'Seychelles', continent: 'Africa' },
  'MG': { name: 'Madagascar', continent: 'Africa' },
  'LS': { name: 'Lesotho', continent: 'Africa' },
  'SZ': { name: 'Eswatini', continent: 'Africa' },

  // Asia
  'IN': { name: 'India', continent: 'Asia' },
  'CN': { name: 'China', continent: 'Asia' },
  'JP': { name: 'Japan', continent: 'Asia' },
  'KR': { name: 'South Korea', continent: 'Asia' },
  'TH': { name: 'Thailand', continent: 'Asia' },
  'VN': { name: 'Vietnam', continent: 'Asia' },
  'PH': { name: 'Philippines', continent: 'Asia' },
  'ID': { name: 'Indonesia', continent: 'Asia' },
  'MY': { name: 'Malaysia', continent: 'Asia' },
  'SG': { name: 'Singapore', continent: 'Asia' },
  'BD': { name: 'Bangladesh', continent: 'Asia' },
  'PK': { name: 'Pakistan', continent: 'Asia' },
  'LK': { name: 'Sri Lanka', continent: 'Asia' },
  'MM': { name: 'Myanmar', continent: 'Asia' },
  'KH': { name: 'Cambodia', continent: 'Asia' },
  'LA': { name: 'Laos', continent: 'Asia' },
  'MN': { name: 'Mongolia', continent: 'Asia' },
  'KZ': { name: 'Kazakhstan', continent: 'Asia' },
  'UZ': { name: 'Uzbekistan', continent: 'Asia' },
  'TM': { name: 'Turkmenistan', continent: 'Asia' },
  'KG': { name: 'Kyrgyzstan', continent: 'Asia' },
  'TJ': { name: 'Tajikistan', continent: 'Asia' },
  'AF': { name: 'Afghanistan', continent: 'Asia' },
  'IR': { name: 'Iran', continent: 'Asia' },
  'IQ': { name: 'Iraq', continent: 'Asia' },
  'SA': { name: 'Saudi Arabia', continent: 'Asia' },
  'AE': { name: 'United Arab Emirates', continent: 'Asia' },
  'KW': { name: 'Kuwait', continent: 'Asia' },
  'QA': { name: 'Qatar', continent: 'Asia' },
  'BH': { name: 'Bahrain', continent: 'Asia' },
  'OM': { name: 'Oman', continent: 'Asia' },
  'YE': { name: 'Yemen', continent: 'Asia' },
  'JO': { name: 'Jordan', continent: 'Asia' },
  'LB': { name: 'Lebanon', continent: 'Asia' },
  'SY': { name: 'Syria', continent: 'Asia' },
  'IL': { name: 'Israel', continent: 'Asia' },
  'PS': { name: 'Palestine', continent: 'Asia' },
  'TR': { name: 'Turkey', continent: 'Asia' },
  'CY': { name: 'Cyprus', continent: 'Asia' },
  'GE': { name: 'Georgia', continent: 'Asia' },
  'AM': { name: 'Armenia', continent: 'Asia' },
  'AZ': { name: 'Azerbaijan', continent: 'Asia' },
  'NP': { name: 'Nepal', continent: 'Asia' },
  'BT': { name: 'Bhutan', continent: 'Asia' },
  'MV': { name: 'Maldives', continent: 'Asia' },
  'BN': { name: 'Brunei', continent: 'Asia' },
  'TL': { name: 'Timor-Leste', continent: 'Asia' },

  // Europe
  'GB': { name: 'United Kingdom', continent: 'Europe' },
  'DE': { name: 'Germany', continent: 'Europe' },
  'FR': { name: 'France', continent: 'Europe' },
  'IT': { name: 'Italy', continent: 'Europe' },
  'ES': { name: 'Spain', continent: 'Europe' },
  'PT': { name: 'Portugal', continent: 'Europe' },
  'NL': { name: 'Netherlands', continent: 'Europe' },
  'BE': { name: 'Belgium', continent: 'Europe' },
  'CH': { name: 'Switzerland', continent: 'Europe' },
  'AT': { name: 'Austria', continent: 'Europe' },
  'SE': { name: 'Sweden', continent: 'Europe' },
  'NO': { name: 'Norway', continent: 'Europe' },
  'DK': { name: 'Denmark', continent: 'Europe' },
  'FI': { name: 'Finland', continent: 'Europe' },
  'IS': { name: 'Iceland', continent: 'Europe' },
  'IE': { name: 'Ireland', continent: 'Europe' },
  'PL': { name: 'Poland', continent: 'Europe' },
  'CZ': { name: 'Czech Republic', continent: 'Europe' },
  'SK': { name: 'Slovakia', continent: 'Europe' },
  'HU': { name: 'Hungary', continent: 'Europe' },
  'RO': { name: 'Romania', continent: 'Europe' },
  'BG': { name: 'Bulgaria', continent: 'Europe' },
  'GR': { name: 'Greece', continent: 'Europe' },
  'AL': { name: 'Albania', continent: 'Europe' },
  'MK': { name: 'North Macedonia', continent: 'Europe' },
  'ME': { name: 'Montenegro', continent: 'Europe' },
  'RS': { name: 'Serbia', continent: 'Europe' },
  'BA': { name: 'Bosnia and Herzegovina', continent: 'Europe' },
  'HR': { name: 'Croatia', continent: 'Europe' },
  'SI': { name: 'Slovenia', continent: 'Europe' },
  'LT': { name: 'Lithuania', continent: 'Europe' },
  'LV': { name: 'Latvia', continent: 'Europe' },
  'EE': { name: 'Estonia', continent: 'Europe' },
  'BY': { name: 'Belarus', continent: 'Europe' },
  'UA': { name: 'Ukraine', continent: 'Europe' },
  'MD': { name: 'Moldova', continent: 'Europe' },
  'RU': { name: 'Russia', continent: 'Europe' },
  'LU': { name: 'Luxembourg', continent: 'Europe' },
  'LI': { name: 'Liechtenstein', continent: 'Europe' },
  'MC': { name: 'Monaco', continent: 'Europe' },
  'AD': { name: 'Andorra', continent: 'Europe' },
  'SM': { name: 'San Marino', continent: 'Europe' },
  'VA': { name: 'Vatican City', continent: 'Europe' },
  'MT': { name: 'Malta', continent: 'Europe' },

  // North America
  'US': { name: 'United States', continent: 'North America' },
  'CA': { name: 'Canada', continent: 'North America' },
  'MX': { name: 'Mexico', continent: 'North America' },
  'GT': { name: 'Guatemala', continent: 'North America' },
  'BZ': { name: 'Belize', continent: 'North America' },
  'SV': { name: 'El Salvador', continent: 'North America' },
  'HN': { name: 'Honduras', continent: 'North America' },
  'NI': { name: 'Nicaragua', continent: 'North America' },
  'CR': { name: 'Costa Rica', continent: 'North America' },
  'PA': { name: 'Panama', continent: 'North America' },
  'CU': { name: 'Cuba', continent: 'North America' },
  'JM': { name: 'Jamaica', continent: 'North America' },
  'HT': { name: 'Haiti', continent: 'North America' },
  'DO': { name: 'Dominican Republic', continent: 'North America' },
  'PR': { name: 'Puerto Rico', continent: 'North America' },
  'TT': { name: 'Trinidad and Tobago', continent: 'North America' },
  'BB': { name: 'Barbados', continent: 'North America' },
  'GD': { name: 'Grenada', continent: 'North America' },
  'LC': { name: 'Saint Lucia', continent: 'North America' },
  'VC': { name: 'Saint Vincent and the Grenadines', continent: 'North America' },
  'AG': { name: 'Antigua and Barbuda', continent: 'North America' },
  'KN': { name: 'Saint Kitts and Nevis', continent: 'North America' },
  'DM': { name: 'Dominica', continent: 'North America' },
  'BS': { name: 'Bahamas', continent: 'North America' },

  // South America
  'BR': { name: 'Brazil', continent: 'South America' },
  'AR': { name: 'Argentina', continent: 'South America' },
  'PE': { name: 'Peru', continent: 'South America' },
  'CO': { name: 'Colombia', continent: 'South America' },
  'VE': { name: 'Venezuela', continent: 'South America' },
  'CL': { name: 'Chile', continent: 'South America' },
  'EC': { name: 'Ecuador', continent: 'South America' },
  'BO': { name: 'Bolivia', continent: 'South America' },
  'PY': { name: 'Paraguay', continent: 'South America' },
  'UY': { name: 'Uruguay', continent: 'South America' },
  'GY': { name: 'Guyana', continent: 'South America' },
  'SR': { name: 'Suriname', continent: 'South America' },
  'GF': { name: 'French Guiana', continent: 'South America' },

  // Oceania
  'AU': { name: 'Australia', continent: 'Oceania' },
  'NZ': { name: 'New Zealand', continent: 'Oceania' },
  'FJ': { name: 'Fiji', continent: 'Oceania' },
  'PG': { name: 'Papua New Guinea', continent: 'Oceania' },
  'NC': { name: 'New Caledonia', continent: 'Oceania' },
  'SB': { name: 'Solomon Islands', continent: 'Oceania' },
  'VU': { name: 'Vanuatu', continent: 'Oceania' },
  'WS': { name: 'Samoa', continent: 'Oceania' },
  'TO': { name: 'Tonga', continent: 'Oceania' },
  'TV': { name: 'Tuvalu', continent: 'Oceania' },
  'KI': { name: 'Kiribati', continent: 'Oceania' },
  'NR': { name: 'Nauru', continent: 'Oceania' },
  'PW': { name: 'Palau', continent: 'Oceania' },
  'MH': { name: 'Marshall Islands', continent: 'Oceania' },
  'FM': { name: 'Micronesia', continent: 'Oceania' },
}

// Helper function to get country name
const getCountryName = (countryCode: string): string => {
  return countryData[countryCode]?.name || countryCode
}

// Helper function to get country continent
const getCountryContinent = (countryCode: string): string => {
  return countryData[countryCode]?.continent || 'Other'
}

// Helper function to organize countries by continent
const organizeCountriesByContinent = (options: { label: string; value: RPNInput.Country | undefined }[]) => {
  const continentOrder = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania', 'Other']
  const countriesByContinent: Record<string, typeof options> = {}
  
  // Initialize continents
  continentOrder.forEach(continent => {
    countriesByContinent[continent] = []
  })

  // Group countries by continent
  options
    .filter(option => option.value)
    .forEach(option => {
      const continent = getCountryContinent(option.value!)
      if (countriesByContinent[continent]) {
        countriesByContinent[continent].push(option)
      } else {
        countriesByContinent['Other'].push(option)
      }
    })

  // Sort countries within each continent (Ghana first in Africa)
  Object.keys(countriesByContinent).forEach(continent => {
    if (continent === 'Africa') {
      // Sort Africa with Ghana first, then alphabetically
      countriesByContinent[continent].sort((a, b) => {
        if (a.value === 'GH') return -1
        if (b.value === 'GH') return 1
        return getCountryName(a.value!).localeCompare(getCountryName(b.value!))
      })
    } else {
      // Sort other continents alphabetically
      countriesByContinent[continent].sort((a, b) => 
        getCountryName(a.value!).localeCompare(getCountryName(b.value!))
      )
    }
  })

  return continentOrder
    .filter(continent => countriesByContinent[continent].length > 0)
    .map(continent => ({
      continent,
      countries: countriesByContinent[continent]
    }))
}

export interface PhoneNumberInputProps {
  value?: string
  onChange?: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  defaultCountry?: RPNInput.Country
  international?: boolean
  id?: string
  name?: string
  required?: boolean
  error?: boolean
}

export const PhoneNumberInput = React.memo(({ 
  value, 
  onChange, 
  placeholder = "Enter phone number", 
  disabled, 
  className,
  defaultCountry = "GH",
  international = true,
  error,
  ...props 
}: PhoneNumberInputProps) => {
  const handleChange = (newValue: string | undefined) => {
    const trimmedValue = newValue?.trim()
    onChange?.(trimmedValue)
  }

  const StablePhoneInput = React.useMemo(() => {
    const Component = forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
      (inputProps, ref) => (
        <PhoneInput {...inputProps} ref={ref} error={error} />
      )
    )
    Component.displayName = "StablePhoneInput"
    return Component
  }, [error])

  return (
    <RPNInput.default
      className={cn("flex rounded-md shadow-xs", className)}
      international={international}
      defaultCountry={defaultCountry}
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      inputComponent={StablePhoneInput}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      {...props}
    />
  )
})

PhoneNumberInput.displayName = "PhoneNumberInput"

const PhoneInput = forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { error?: boolean }>(
  ({ className, error, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        data-slot="phone-input"
        className={cn(
          "-ms-px rounded-s-none shadow-none focus-visible:z-10",
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        {...props}
      />
    )
  }
)

PhoneInput.displayName = "PhoneInput"

type CountrySelectProps = {
  disabled?: boolean
  value: RPNInput.Country
  onChange: (value: RPNInput.Country) => void
  options: { label: string; value: RPNInput.Country | undefined }[]
}

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(false)
  
  // Filter countries based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return options
    
    return options.filter(option => {
      if (!option.value) return false
      const countryName = getCountryName(option.value).toLowerCase()
      const countryCode = option.value.toLowerCase()
      const query = searchQuery.toLowerCase()
      return countryName.includes(query) || countryCode.includes(query)
    })
  }, [options, searchQuery])
  
  // Organize filtered countries by continent
  const continentGroups = React.useMemo(() => {
    return organizeCountriesByContinent(filteredOptions)
  }, [filteredOptions])
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setSearchQuery('')
    }
  }
  
  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <SelectTrigger className="w-auto  rounded-s-md rounded-e-none border-e-0 px-3 focus:z-10">
        <SelectValue>
          <div className="flex items-center gap-2">
            <span className="text-base">
              {getCountryEmoji(value)}
            </span>
            <span className="text-sm font-medium">
              {value || ''}
            </span>
            {/*<span className="text-xs text-muted-foreground">*/}
            {/*  {value && `+${RPNInput.getCountryCallingCode(value)}`}*/}
            {/*</span>*/}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[300px] w-[300px]">
        <div className="p-2 border-b">
          <Input
            placeholder="Search countries..."
            value={searchQuery}
            onChange={(e) => {
              e.stopPropagation()
              setSearchQuery(e.target.value)
            }}
            onKeyDown={(e) => {
              e.stopPropagation()
              if (e.key === 'Escape') {
                setSearchQuery('')
                setIsOpen(false)
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
            {countries.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value!}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-3 w-full">
                  <span className="text-base shrink-0">
                    {getCountryEmoji(option.value!)}
                  </span>
                  <span className="flex-1 text-sm truncate">
                    {getCountryName(option.value!)}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    +{RPNInput.getCountryCallingCode(option.value!)}
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
  )
}

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country]

  return (
    <span className="w-5 overflow-hidden rounded-sm">
      {Flag ? (
        <Flag title={countryName} />
      ) : (
        <PhoneIcon size={16} aria-hidden="true" />
      )}
    </span>
  )
}