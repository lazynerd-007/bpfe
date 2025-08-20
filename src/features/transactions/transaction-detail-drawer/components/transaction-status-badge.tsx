import { StatusBadge } from '@/components/status-badge';

interface TransactionStatusBadgeProps {
  status: string;
  className?: string;
}

export function TransactionStatusBadge({ status, className }: TransactionStatusBadgeProps) {
  return <StatusBadge status={status} type="transaction" className={className} />;
}