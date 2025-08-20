import { 
  IconDeviceMobile, 
  IconCreditCard, 
  IconBrandVisa, 
  IconBrandMastercard,
  IconCircleCheckFilled,
  IconAlertCircle,
  IconClock,
  IconX
} from "@tabler/icons-react"

export interface ProcessorConfig {
  color: string
  title: string
  icon: React.ReactNode
  logoPath?: string
}

export interface TransactionStatusConfig {
  color: string
  title: string
  icon: React.ReactNode
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
}

export const PROCESSOR_MAP: Record<string, ProcessorConfig> = {
  MTN: {
    color: "hsl(var(--chart-1))",
    title: "MTN Mobile Money",
    icon: <IconDeviceMobile className="w-4 h-4" />,
    logoPath: "/logos/mtn.png"
  },
  VODAFONE: {
    color: "hsl(var(--chart-2))",
    title: "Vodafone Cash",
    icon: <IconDeviceMobile className="w-4 h-4" />,
    logoPath: "/logos/vodafone.png"
  },
  AIRTEL: {
    color: "hsl(var(--chart-3))",
    title: "AirtelTigo Money",
    icon: <IconDeviceMobile className="w-4 h-4" />,
    logoPath: "/logos/airteltigo.png"
  },
  AIRTELTIGO: {
    color: "hsl(var(--chart-3))",
    title: "AirtelTigo Money",
    icon: <IconDeviceMobile className="w-4 h-4" />,
    logoPath: "/logos/airteltigo.png"
  },
  TIGO: {
    color: "hsl(var(--chart-4))",
    title: "Tigo Cash",
    icon: <IconDeviceMobile className="w-4 h-4" />,
    logoPath: "/logos/tigo.png"
  },
  ORANGE: {
    color: "hsl(var(--chart-5))",
    title: "Orange Money",
    icon: <IconDeviceMobile className="w-4 h-4" />,
    logoPath: "/logos/orange.png"
  },
  ZEEPAY: {
    color: "hsl(var(--chart-1))",
    title: "ZeePay",
    icon: <IconDeviceMobile className="w-4 h-4" />,
    logoPath: "/logos/zeepay.png"
  },
  VISA: {
    color: "hsl(var(--chart-2))",
    title: "Visa Card",
    icon: <IconBrandVisa className="w-4 h-4" />,
    logoPath: "/logos/visa.png"
  },
  MASTERCARD: {
    color: "hsl(var(--chart-3))",
    title: "Mastercard",
    icon: <IconBrandMastercard className="w-4 h-4" />,
    logoPath: "/logos/mastercard.png"
  },
  CARD: {
    color: "hsl(var(--chart-4))",
    title: "Card Payment",
    icon: <IconCreditCard className="w-4 h-4" />
  },
  UNKNOWN: {
    color: "hsl(var(--muted-foreground))",
    title: "Unknown Processor",
    icon: <IconX className="w-4 h-4" />
  }
}

export const TRANSACTION_STATUS_MAP: Record<string, TransactionStatusConfig> = {
  SUCCESSFUL: {
    color: "hsl(var(--chart-1))",
    title: "Successful",
    icon: <IconCircleCheckFilled className="w-3 h-3" />,
    variant: 'default'
  },
  SUCCESS: {
    color: "hsl(var(--chart-1))",
    title: "Successful",
    icon: <IconCircleCheckFilled className="w-3 h-3" />,
    variant: 'default'
  },
  FAILED: {
    color: "hsl(var(--chart-5))",
    title: "Failed",
    icon: <IconAlertCircle className="w-3 h-3" />,
    variant: 'destructive'
  },
  PENDING: {
    color: "hsl(var(--chart-3))",
    title: "Pending",
    icon: <IconClock className="w-3 h-3" />,
    variant: 'secondary'
  },
  PROCESSING: {
    color: "hsl(var(--chart-3))",
    title: "Processing",
    icon: <IconClock className="w-3 h-3" />,
    variant: 'secondary'
  }
}

export const getProcessorConfig = (processor: string): ProcessorConfig => {
  return PROCESSOR_MAP[processor?.toUpperCase()] || PROCESSOR_MAP.UNKNOWN
}

export const getTransactionStatusConfig = (status: string): TransactionStatusConfig => {
  return TRANSACTION_STATUS_MAP[status?.toUpperCase()] || TRANSACTION_STATUS_MAP.PENDING
}