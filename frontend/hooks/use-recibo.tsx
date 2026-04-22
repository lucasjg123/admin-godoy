//hacer ele post
import { createRecibo, sendRecibo } from '@/lib/api/recibo.api';
import { ReciboFormValues } from '@/lib/schemas/recibo.schema';
import { useState } from 'react';

export function useCreateRecibo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (recibo: ReciboFormValues) => {
    setLoading(true);
    setError(null);
    try {
      return await createRecibo(recibo);
    } catch (err) {
      setError('Error al generar recibo');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

export function useSendRecibo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async (recibo: ReciboFormValues) => {
    setLoading(true);
    setError(null);
    try {
      return await sendRecibo(recibo);
    } catch (err) {
      setError('Error al generar recibo');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { sendRecibo: send, loading, error };
}
