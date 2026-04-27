import { useSendExpensas } from '@/app/expensas/hooks/use-expensas';
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
import { useEdificioStore } from '@/stores/edificio-store';
import { useState } from 'react';

type Props = { onClose: () => void };

const ModalSend = ({ onClose }: Props) => {
  const selectedEdificio = useEdificioStore((state) => state.selectedEdificio);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { send, loading, error } = useSendExpensas();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      alert('Debe seleccionar un PDF');
      return;
    }

    setConfirmOpen(true); // abre confirmación
  };

  const handleSend = async () => {
    if (!file) return;
    const res = await send(selectedEdificio!, file);

    if (res) {
      setConfirmOpen(false);
      onClose();
    }
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className='sm:max-w-3xl'>
          <DialogHeader>
            <DialogTitle>Enviar expensas</DialogTitle>
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
        title='¿Desea enviar las expensas por correo?'
        confirmText='Enviar'
        onConfirm={handleSend}
      />
    </>
  );
};

export default ModalSend;
