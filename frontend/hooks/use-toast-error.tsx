import { useEffect } from 'react';
import { toast } from 'sonner';

export function useToastError(error: string | null) {
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);
}
