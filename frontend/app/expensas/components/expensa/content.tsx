import { CardContent } from '@/components/ui/card';
import ExpensaForm from './form';
import { Expensa } from '@/lib/schemas/expensa.schema';
import { formatMoney, formatPreviousMonth } from '@/lib/formats';
import { MoneyRow } from './money-row';
import { MoneyTable } from './money-table';
import { Textarea } from '@/components/ui/textarea';

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
            value: expensa.porcentual_exp,
          },
        ]}
      />
      <br />
      <div className='mt-4'>
        <Textarea
          name='notas'
          placeholder='Notas de la expensa...'
          defaultValue={expensa.nota_exp ?? undefined}
          className="resize-none"
        />
      </div>
    </CardContent>
  );
};

export default ExpensaContent;
