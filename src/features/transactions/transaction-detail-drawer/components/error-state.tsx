interface ErrorStateProps {
  error?: string | null;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">{error || 'Transaction not found'}</p>
    </div>
  );
}