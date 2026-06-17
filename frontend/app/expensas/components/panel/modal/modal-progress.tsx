// app/expensas/components/panel/modal/modal-progress.tsx
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

type Props = {
  open: boolean;
  isRunning: boolean;
  progress: SendProgressEvent | null;
  logs: SendProgressEvent[];
//   onCancel: () => void;
};

export function ModalProgress({
  open,
  isRunning,
  progress,
  logs,
//   onCancel,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
    //   if (!isOpen && isRunning) {
    //     onCancel();
    //   }
    }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Enviando Expensas</DialogTitle>
          <DialogDescription>
            {progress?.message}
          </DialogDescription>
        </DialogHeader>

        {/* Progreso */}
        <div className="space-y-2">
          <Progress
            value={progress?.percentage || 0}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground text-center">
            {progress?.sent} de {progress ? progress.sent + progress.remaining : 0} enviadas
          </p>
        </div>

        {/* Logs */}
        <div className="bg-slate-950 text-slate-50 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm space-y-1">
          {logs.length === 0 ? (
            <p className="text-slate-500">Esperando iniciar...</p>
          ) : (
            logs.map((log, idx) => (
              <div
                key={idx}
                className={`${
                  log.type === 'success'
                    ? 'text-green-400'
                    : log.type === 'error'
                      ? 'text-red-400'
                      : 'text-slate-300'
                }`}
              >
                {log.message}
                {log.error && ` (${log.error})`}
              </div>
            ))
          )}
        </div>

        <DialogFooter>
          <Button
            variant="destructive"
            // onClick={onCancel}
            // disabled={!isRunning}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}