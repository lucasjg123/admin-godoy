import { Card } from '@/components/ui/card';
import { Expensa } from '@/lib/schemas/expensa.schema';
import ExpensaHeader from './header';
import ExpensaContent from './content';
import ExpensaFooter from './footer';
import { useState } from 'react';
import ModalSend from '../panel/modal/modal-send';

export function ExpensaCard({ expensa }: { expensa: Expensa }) {
  const [openModal, setOpenModal] = useState(false);
  return (
    <Card className='w-full max-w-sm mb-5'>
      <ExpensaHeader expensa={expensa} />
      <ExpensaContent expensa={expensa} />
      <ExpensaFooter expensa={expensa} onSendClick={() => setOpenModal(true)} />
      {/* El modal recibe el id_exp de esta card específica */}
      {openModal && (
        <ModalSend 
          id_exp={expensa.id_exp} 
          onClose={() => setOpenModal(false)} 
        />
      )}
    </Card>
  );
}
