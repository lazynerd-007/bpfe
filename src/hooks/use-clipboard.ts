import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

export const useClipboard = () => {
  const { toast } = useToast();

  const copyToClipboard = useCallback((text: string, message?: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: message || 'Copied to clipboard',
    });
  }, [toast]);

  return { copyToClipboard };
};