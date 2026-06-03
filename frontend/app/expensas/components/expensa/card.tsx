import { Card } from '@/components/ui/card';
import { Expensa, expensaUpdateSchema } from '@/lib/schemas/expensa.schema';
import ExpensaHeader from './header';
import ExpensaContent from './content';
import ExpensaFooter from './footer';
import { useState } from 'react';
import ModalSend from '../panel/modal/modal-send';
import { useToastError } from '@/hooks/use-toast-error';
import { useUpdateExpensa } from '../../../../hooks/use-expensas';
import { toast } from 'sonner';

export function ExpensaCard({ expensa }: { expensa: Expensa }) {
  const [openModal, setOpenModal] = useState(false);
  const { update, error } = useUpdateExpensa();
  useToastError(error);
  // React.SyntheticEvent<HTMLFormElement>
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // Recolectamos TODO lo que esté dentro del form (Content + Footer)
    const rawPayload = {
      nota_exp: formData.get('notas') as string | null,
      vto1_exp: formData.get('vto1') ? Number(formData.get('vto1')) : null, // O string, según tu BD
      vto2_exp: formData.get('vto2') ? Number(formData.get('vto2')) : null,
    };

    const parsed = expensaUpdateSchema.safeParse(rawPayload);

    if (!parsed.success) {
      console.error(parsed.error);
      toast.error('Datos inválidos');
      return;
    }

    const updated = await update(
      expensa.departamentos.id_edif,
      expensa.id_exp,
      parsed.data
    );

    if (updated) {
      toast.success('Expensa actualizada');
      // triggerRefetch();
    }
  }
  return (
    <Card className='w-full max-w-sm mb-5'>
      <ExpensaHeader expensa={expensa} />

      {/* El formulario envuelve el contenido y el footer */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <ExpensaContent expensa={expensa} />
        <ExpensaFooter expensa={expensa} onSendClick={() => setOpenModal(true)} />
      </form>   

      {openModal && (
        <ModalSend 
          id_exp={expensa.id_exp} 
          onClose={() => setOpenModal(false)} 
        />
      )}
    </Card>
  );
}
