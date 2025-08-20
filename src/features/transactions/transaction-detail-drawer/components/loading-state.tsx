import { Skeleton } from '@/components/ui/skeleton';

export function LoadingState() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-20" />
      <Skeleton className="h-48" />
      <Skeleton className="h-32" />
    </div>
  );
}