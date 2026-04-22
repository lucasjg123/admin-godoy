import { CardFooter } from '@/components/ui/card';
import { formatShortDate, formatMoney } from '@/lib/formats';
import { Expensa } from '@/lib/schemas/expensa.schema';
import { MoneyTable } from './money-table';

const ExpensaFooter = ({ expensa }: { expensa: Expensa }) => {
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
    </CardFooter>
  );
};

export default ExpensaFooter;
