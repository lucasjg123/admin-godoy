import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Expensa, expensaUpdateSchema } from '@/lib/schemas/expensa.schema';
import { toast } from 'sonner';
import { useUpdateExpensa } from '../../hooks/use-expensas';
import { useToastError } from '@/hooks/use-toast-error';

const ExpensaForm = ({ expensa }: { expensa: Expensa }) => {
  const { update, error } = useUpdateExpensa();
  useToastError(error);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const rawPayload = {
      nota_exp: formData.get('notas') as string | null,
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
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex flex-col gap-6'>
        <Textarea
          name='notas'
          placeholder='notas...'
          defaultValue={expensa.nota_exp ?? undefined}
        />

        <Button
          //   disabled={isSubmitting}
          type='submit'
          variant='outline'
          className='w-full'
        >
          Agregar nota
        </Button>
      </div>
    </form>
  );
};

export default ExpensaForm;

/* 
  ); */
