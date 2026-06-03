import { useSendExpensas } from '@/hooks/use-expensas';
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

type Props = { onClose: () => void; id_exp?: number; };

const ModalSend = ({ onClose, id_exp }: Props) => {
  const selectedEdificio = useEdificioStore((state) => state.selectedEdificio);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { send, loading, error } = useSendExpensas();

  useToastError(error);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      toast.error('Debe seleccionar un PDF');
      return;
    }

    setConfirmOpen(true); // abre confirmación
  };

  const handleSend = async () => {
    if (!file) return;
    const res = await send(selectedEdificio!, file, id_exp);

    if (res) {
      toast.success('Expensa enviada');
      setConfirmOpen(false);
      onClose();
    }
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className='sm:max-w-3xl'>
          <DialogHeader>
            <DialogTitle>{id_exp ? 'Enviar Expensa Individual' : 'Enviar Expensas del Edificio'}</DialogTitle>
            <DialogDescription />
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <Input
              type='file'
              accept='application/pdf'
              onChange={(e) => {
                const selected = e.target.files?.[0];
                if (selected) {
                  setFile(selected);
                }
              }}
            />
            
            <DialogFooter className='mt-6'>
              <DialogClose asChild>
                <Button type='button' variant='outline'>
                  Cancelar
                </Button>
              </DialogClose>

              <Button type='submit'>Enviar</Button>
            </DialogFooter>

          </form>
          </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={id_exp ? '¿Desea enviar esta expensa?' : '¿Desea enviar todas las expensas?'}
        confirmText='Enviar'
        onConfirm={handleSend}
      />
    </>
  );
};

export default ModalSend;
