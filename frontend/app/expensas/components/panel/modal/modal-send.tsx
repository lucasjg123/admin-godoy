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
import { useState } from 'react';

type Props = { onClose: () => void };

const ModalSend = ({ onClose }: Props) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

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

    const formData = new FormData();
    formData.append('file', file);

    //id del edificio
    await fetch('/api/expensas', {
      method: 'POST',
      body: formData,
    });

    setConfirmOpen(false);
    onClose();
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
          </form>
          <DialogFooter className='mt-6'>
            <DialogClose asChild>
              <Button type='button' variant='outline'>
                Cancelar
              </Button>
            </DialogClose>

            <Button type='submit'>Enviar</Button>
          </DialogFooter>
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
