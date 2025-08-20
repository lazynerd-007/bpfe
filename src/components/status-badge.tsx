import { Badge } from "@/components/ui/badge"
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconLoader,
  IconClock,
  IconBan,
  IconUserCheck,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

type TransactionStatus = "successful" | "failed" | "pending"
type UserStatus = "active" | "inactive" | "suspended" | "pending"

interface StatusBadgeProps {
  status: string
  type?: "transaction" | "user"
  className?: string
}

export function StatusBadge({ status, type = "transaction", className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase()
  
  const getTransactionBadgeConfig = () => {
    switch (normalizedStatus) {
      case "successful":
      case "success":
      case "done":
        return {
          icon: <IconCircleCheckFilled className="h-3.5 w-3.5" />,
          className: "rounded-xl text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950",
        }
      case "failed":
      case "fail":
      case "error":
        return {
          icon: <IconCircleXFilled className="h-3.5 w-3.5" />,
          className: "rounded-xl text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950",
        }
      case "pending":
      case "in progress":
      case "processing":
        return {
          icon: <IconLoader className="h-3.5 w-3.5" />,
          className: "rounded-xl text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950",
        }
      default:
        return {
          icon: <IconClock className="h-3.5 w-3.5" />,
          className: "rounded-xl text-muted-foreground border-muted",
        }
    }
  }
  
  const getUserBadgeConfig = () => {
    switch (normalizedStatus) {
      case "active":
        return {
          icon: <IconUserCheck className="h-3.5 w-3.5" />,
          className: "rounded-xl text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950",
        }
      case "inactive":
        return {
          icon: <IconCircleXFilled className="h-3.5 w-3.5" />,
          className: "rounded-xl text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950",
        }
      case "suspended":
      case "banned":
        return {
          icon: <IconBan className="h-3.5 w-3.5" />,
          className: "rounded-xl text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950",
        }
      case "pending":
        return {
          icon: <IconLoader className="h-3.5 w-3.5" />,
          className: "rounded-xl text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950",
        }
      default:
        return {
          icon: <IconClock className="h-3.5 w-3.5" />,
          className: "rounded-xl text-muted-foreground border-muted",
        }
    }
  }
  
  const config = type === "user" ? getUserBadgeConfig() : getTransactionBadgeConfig()
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "gap-1 px-2 py-0.5 font-medium",
        config.className,
        className
      )}
    >
      {config.icon}
      <span className="capitalize">{status}</span>
    </Badge>
  )
}