import { CardContent } from '@/components/ui/card';
import ExpensaForm from './form';
import { Expensa } from '@/lib/schemas/expensa.schema';
import { formatMoney, formatPreviousMonth } from '@/lib/formats';
import { MoneyRow } from './money-row';
import { MoneyTable } from './money-table';

const ExpensaContent = ({ expensa }: { expensa: Expensa }) => {
  return (
    <CardContent>
      <MoneyTable
        rows={[
          {
            label: `EXPENSAS MES ${formatPreviousMonth(
              expensa.departamentos.edificios.gastoscomunes?.vto1_gc
            )}`,
            value: expensa.departamentos.edificios.gastoscomunes?.monto_gc,
          },
          {
            label: `% Participación ${expensa.departamentos.porc_depto}`,
            value: expensa.vto1_exp,
          },
        ]}
      />
      <br />
      <ExpensaForm expensa={expensa} />
    </CardContent>
  );
};

export default ExpensaContent;
