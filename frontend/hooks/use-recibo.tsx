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
        // si falla el registro del pago (ej: mes ya pago) el mail no se envía
        if (!response.n8n.success) {
          setError(`Pago no registrado: ${response.n8n.error}`);
        } else {
          setError(`Pago registrado, pero falló el email: ${response.email.error}`);
        }
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
