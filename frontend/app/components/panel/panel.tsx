import {
  DialogContent,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Tabla from './tabla/tabla';
import { Departamento } from '@/lib/schemas/departamento.schema';

type Props = {
  depto: Departamento;
  onClose: () => void;
};

// traer id dpeto o depto

const Panel = ({ depto, onClose }: Props) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-3xl'>
        <DialogHeader>
          <DialogTitle className='text-center'>
            {depto.edificios.nom_edif} {depto.piso_depto} {depto.letra_depto}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Tabla id_depto={depto.id_depto} />
      </DialogContent>
    </Dialog>
  );
};

export default Panel;
