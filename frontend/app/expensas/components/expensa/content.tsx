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
            label: (
              <strong>
                <u>
                  EXPENSAS MES {formatPreviousMonth(
                    expensa.departamentos.edificios.gastoscomunes?.vto1_gc
                  )}
                </u>
              </strong>
            ),
            value: '',
            hideCurrency: true,
          },
          {
            label: `Expensas Extraordinarias`,
            value: expensa.departamentos.edificios.gastoscomunes?.monto_gc,
          },
          {
            label: `% Participación ${expensa.departamentos.porc_depto}`,
            value: expensa.porcentual_exp,
          },
        ]}
      />
      <div className='mt-4 mb-2'>
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
