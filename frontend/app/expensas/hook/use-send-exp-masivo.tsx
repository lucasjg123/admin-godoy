// app/expensas/hooks/use-send-expensas-masivo.tsx
'use client';

import { sendExpensas } from '@/lib/api/expensa.api';
import { ExpensaList } from '@/lib/schemas/expensa.schema';
import { useCallback, useRef, useState } from 'react';

export type SendProgressEvent = {
  type: 'start' | 'success' | 'error' | 'complete' | 'cancelled';
  id_exp?: number;
  message: string;
  sent: number;
  remaining: number;
  percentage: number;
  error?: string;
};

export function useSendExpensasMasivo() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<SendProgressEvent | null>(null);
  const [logs, setLogs] = useState<SendProgressEvent[]>([]);
  const cancelRef = useRef(false);

  const sendMasivo = useCallback(
    async (id_edif: number, file: File, expensas: ExpensaList) => {
      // ✅ Recibe expensas ya cargadas
      cancelRef.current = false;
      setIsRunning(true);
      setLogs([]);

      const total = expensas.length;
      let sent = 0;
      let errors = 0;
      let wasCancelled = false;

      for (let i = 0; i < total; i++) {
        // ✅ Respetar cancelación
        if (cancelRef.current) {
          wasCancelled = true;
         setProgress({
            type: 'cancelled',
            message: '❌ Proceso cancelado por el usuario',
            sent,
            remaining: total - sent,
            percentage: Math.round((sent / total) * 100),
          });
          setLogs((prev) => [...prev, {
            type: 'cancelled',
            message: '❌ Proceso cancelado',
            sent,
            remaining: total - sent,
            percentage: Math.round((sent / total) * 100),
          }]);
          break;
        }

        const expensa = expensas[i];

        try {
          // Notificar inicio
          const startEvent: SendProgressEvent = {
            type: 'start',
            id_exp: expensa.id_exp,
            message: `Enviando ${i + 1} de ${total}...`,
            sent,
            remaining: total - sent,
            percentage: Math.round((sent / total) * 100),
          };
          setProgress(startEvent);
          setLogs((prev) => [...prev, startEvent]);

          // ✅ Usar API directa (sin pasar expensas de nuevo)
          await sendExpensas(id_edif, file, expensa.id_exp);
          sent++;

          // Notificar éxito
          const successEvent: SendProgressEvent = {
            type: 'success',
            id_exp: expensa.id_exp,
            message: `✔ Expensa ${expensa.departamentos.piso_depto} '${expensa.departamentos.letra_depto}' enviada`,
            sent,
            remaining: total - sent,
            percentage: Math.round((sent / total) * 100),
          };
          setProgress(successEvent);
          setLogs((prev) => [...prev, successEvent]);
        } catch (error) {
          errors++;

          // Notificar error
          const errorEvent: SendProgressEvent = {
            type: 'error',
            id_exp: expensa.id_exp,
            message: `✖ Expensa ${expensa.departamentos.piso_depto} '${expensa.departamentos.letra_depto}' falló`,
            sent,
            remaining: total - sent,
            percentage: Math.round((sent / total) * 100),
            error: error instanceof Error ? error.message : 'Error desconocido',
          };
          setProgress(errorEvent);
          setLogs((prev) => [...prev, errorEvent]);
        }

        // ⏳ Delay 3 segundos ANTES de la siguiente
        if (i < total - 1) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }

      // Notificar completado SOLO SI NO FUE CANCELADO
      if (!wasCancelled) {
        setProgress({
          type: 'complete',
          message: `✅ Completado: ${sent} enviadas, ${errors} errores`,
          sent,
          remaining: 0,
          percentage: 100,
        });
      }

      setIsRunning(false);
      return { successful: sent, failed: errors };
    },
    []
  );

  const cancel = useCallback(() => {
    cancelRef.current = true;
  }, []);

  return {
    sendMasivo,
    cancel,
    isRunning,
    progress,
    logs,
  };
}