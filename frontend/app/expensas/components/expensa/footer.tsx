import { CardFooter } from '@/components/ui/card';
import { formatShortDate, formatMoney } from '@/lib/formats';
import { Expensa } from '@/lib/schemas/expensa.schema';
import { MoneyTable } from './money-table';
import { Button } from '@/components/ui/button';

const ExpensaFooter = ({ expensa, onSendClick }: { expensa: Expensa, onSendClick: () => void }) => {
  return (
    <CardFooter className='flex-col gap-2 items-start'>
      <MoneyTable
        rows={[
          {
            label: `1 Vto. ${formatShortDate(
              expensa.departamentos.edificios.gastoscomunes?.vto1_gc
            )}`,
            value: expensa.vto1_exp,
          },
          {
            label: `2 Vto. ${formatShortDate(
              expensa.departamentos.edificios.gastoscomunes?.vto2_gc
            )}`,
            value: expensa.vto2_exp,
          },
        ]}
      />
      {/* Botón de enviar */}
      <Button
        variant="outline"
        size="sm"
        className="w-full flex gap-2"
        onClick={(e) => {
          e.preventDefault();
          onSendClick();
        }}
      >
        Enviar por Email
      </Button>
    </CardFooter>
  );
};

export default ExpensaFooter;
