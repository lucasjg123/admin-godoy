// modal-send.tsx - Version actualizada
import { useSendExpensasMasivo } from '@/app/expensas/hook/use-send-exp-masivo';
import { useExpensas, useSendExpensas } from '@/app/expensas/hooks/use-expensas';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToastError } from '@/hooks/use-toast-error';
import { useEdificioStore } from '@/stores/edificio-store';
import { useState } from 'react';
import { toast } from 'sonner';
import { ModalProgress } from './modal-progress';

type Props = { onClose: () => void; id_exp?: number };

const ModalSend = ({ onClose, id_exp }: Props) => {
  const selectedEdificio = useEdificioStore((state) => state.selectedEdificio);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progressOpen, setProgressOpen] = useState(false);
  const [showFileDialog, setShowFileDialog] = useState(true);

  // ✅ Obtener expensas 
  const { expensas, loading: loadingExpensas, error: errorExpensas } = useExpensas(selectedEdificio);
  // ✅ Hook para envío masivo
  const { sendMasivo, cancel, isRunning, progress, logs } = useSendExpensasMasivo();
  // Hook para envío individual
  const { send, loading, error } = useSendExpensas();

  useToastError(error || errorExpensas);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      toast.error('Debe seleccionar un PDF');
      return;
    }

    setConfirmOpen(true);
  };

  const handleSend = async () => {
    if (!file) return;

    if (id_exp) {
      // Envío individual
      const res = await send(selectedEdificio!, file, id_exp);

      if (res) {
        toast.success('Expensa enviada');
        setConfirmOpen(false);
        setShowFileDialog(false);
        onClose();
      }
    } else {
      // Envío masivo - cerrar dialog de archivo y mostrar progreso
      setConfirmOpen(false);
      setShowFileDialog(false);
      setProgressOpen(true);
      await sendMasivo(selectedEdificio!, file, expensas!);
    }
  };

  const handleCancel = () => {
    cancel();
    toast.info('Envío cancelado');
  };

  const handleProgressClose = () => {
    setProgressOpen(false);
    onClose();
  };

  return (
    <>
      {/* Dialog de selección de archivo */}
      <Dialog open={showFileDialog} onOpenChange={setShowFileDialog}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {id_exp ? 'Enviar Expensa Individual' : 'Enviar Expensas del Edificio'}
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const selected = e.target.files?.[0];
                if (selected) {
                  setFile(selected);
                }
              }}
              disabled={loadingExpensas || !selectedEdificio}
            />

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>

              <Button type="submit" disabled={loadingExpensas || !file}>
                Enviar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de progreso */}
      <ModalProgress
        open={progressOpen}
        isRunning={isRunning}
        progress={progress}
        logs={logs}
        onCancel={handleCancel}
        onClose={handleProgressClose}
      />

      {/* Confirmación */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={id_exp ? '¿Desea enviar esta expensa?' : '¿Desea enviar todas las expensas?'}
        confirmText="Enviar"
        onConfirm={handleSend}
      />
    </>
  );
};

export default ModalSend;