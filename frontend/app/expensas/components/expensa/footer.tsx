import { CardFooter } from '@/components/ui/card';
import { formatShortDate, formatMoney } from '@/lib/formats';
import { Expensa } from '@/lib/schemas/expensa.schema';
import { MoneyTable } from './money-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ExpensaFooter = ({ expensa, onSendClick }: { expensa: Expensa, onSendClick: () => void }) => {
  return (
    <CardFooter className='flex-col gap-2 items-start'>
      <MoneyTable
        rows={[
          {
            label: `1 Vto. ${formatShortDate(
              expensa.departamentos.edificios.gastoscomunes?.vto1_gc
            )}`,
            value: <Input
                type="number"
                name="vto1"
                // Al usar text-right y quitar los bordes/fondos, se mimetiza con la tabla
                className="h-7 w-24 text-right text-base! bg-transparent border-dashed border-muted-foreground/30 focus-visible:ring-1 p-1 "
                defaultValue={expensa.vto1_exp ?? undefined}
            />,
          },
          {
            label: `2 Vto. ${formatShortDate(
              expensa.departamentos.edificios.gastoscomunes?.vto2_gc
            )}`,
            value: <Input
              type="number"
              name="vto2"
              // Al usar text-right y quitar los bordes/fondos, se mimetiza con la tabla
              className="h-7 w-24 text-right text-base! bg-transparent border-dashed border-muted-foreground/30 focus-visible:ring-1 p-1"
              defaultValue={expensa.vto2_exp ?? undefined}
            />,
          },
        ]}
      />
      {/* Botones */}
      <div className="w-full flex flex-col gap-2 mt-2">
        {/* Este botón es type="submit", por ende dispara el handleSubmit del padre */}
        <Button
          type='submit'
          variant='default'
          size="sm"
          className='w-full'
        >
          Guardar Cambios y Notas
        </Button>

        {/* Este botón mantiene el e.preventDefault() para que NO dispare el formulario */}
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
      </div>
    </CardFooter>
  );
};

export default ExpensaFooter;
