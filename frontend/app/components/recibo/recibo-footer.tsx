import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';

const ReciboFooter = () => {
  return (
    <DialogFooter className='mt-6'>
      <DialogClose asChild>
        <Button type='button' variant='outline'>
          Cancelar
        </Button>
      </DialogClose>

      <Button type='submit'>Enviar</Button>
    </DialogFooter>
  );
};

export default ReciboFooter;
