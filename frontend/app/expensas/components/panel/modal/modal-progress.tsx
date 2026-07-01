// modal-progress.tsx - Version actualizada con estilos mejorados
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SendProgressEvent } from '@/app/expensas/hook/use-send-exp-masivo';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

type Props = {
  open: boolean;
  isRunning: boolean;
  progress: SendProgressEvent | null;
  logs: SendProgressEvent[];
  onCancel: () => void;
  onClose: () => void;
};

export function ModalProgress({
  open,
  isRunning,
  progress,
  logs,
  onCancel,
  onClose,
}: Props) {
  const handleClose = () => {
    if (!isRunning) {
      onClose();
    }
  };
const isCancelled = progress?.type === 'cancelled';
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && !isRunning) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-2xl" onPointerDownOutside={(e) => {
        // Prevenir cierre clickeando afuera si está en progreso
        if (isRunning) {
          e.preventDefault();
        }
      }}>
        <DialogHeader>
          <DialogTitle className="text-white">Enviando Expensas</DialogTitle>
          <DialogDescription className="text-white/80">
            {progress?.message}
          </DialogDescription>
        </DialogHeader>

        {/* Progreso con Fieldset */}
        <fieldset className="space-y-3 border border-slate-200 rounded-lg p-4">
          <legend className="text-sm font-semibold text-white px-2">
            Progreso
          </legend>

          <div className="space-y-2">
            <Progress value={progress?.percentage || 0} className="w-full" />

            <div className="flex justify-between items-center text-sm">
              <span className="text-white font-medium">
                {progress?.sent} de {progress ? progress.sent + progress.remaining : 0}
              </span>
              <span className="text-white font-semibold">
                {progress?.percentage || 0}%
              </span>
            </div>
          </div>
        </fieldset>

        {/* Logs */}
        <div className="bg-slate-950 text-slate-50 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm space-y-1 border border-slate-800">
          {logs.length === 0 ? (
            <p className="text-slate-400">Esperando iniciar...</p>
          ) : (
            logs.map((log, idx) => (
              <div
                key={idx}
                className={`${
                  log.type === 'success'
                    ? 'text-green-400'
                    : log.type === 'error'
                      ? 'text-red-400'
                      : log.type === 'cancelled'  // ← Agregar
                     ? 'text-yellow-400'
                      : log.type === 'complete'
                        ? 'text-blue-400'
                        : 'text-white'
                }`}
              >
                {log.message}
                {log.error && ` (${log.error})`}
              </div>
            ))
          )}
          <div ref={logsEndRef} />  {/* ← Agrega esto */}
        </div>

        <DialogFooter className="flex gap-2">
           <Button
            variant="destructive"
            onClick={onCancel}
            disabled={!isRunning || isCancelled}  // ← Deshabilitar si ya fue cancelado
            >
            {isCancelled ? 'Cancelado' : 'Cancelar'}
          </Button>

          <Button
            variant="default"
            onClick={handleClose}
            disabled={isRunning}
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}