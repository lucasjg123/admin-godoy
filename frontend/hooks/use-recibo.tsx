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
      const response = await sendRecibo(recibo);

      // Validar si la operación fue realmente exitosa
      if (!response.success) {
        let errorMsg = 'Error al enviar el recibo';
        if (!response.email.success && response.email.error) {
          errorMsg += `Email: ${response.email.error}`;
        }
        if (!response.n8n.success && response.n8n.error) {
          errorMsg +=
            (errorMsg.includes('Email') ? ' | ' : '') +
            `Pago: ${response.n8n.error}`;
        }
        setError(errorMsg);
      }
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { sendRecibo: send, loading, error };
}
