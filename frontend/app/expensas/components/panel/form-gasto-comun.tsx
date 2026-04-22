import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEdificioStore } from '@/stores/edificio-store';
import {
  useGetGastoComun,
  useUpdateGastoComun,
} from '../../hooks/use-gastoscomunes';
import { useToastError } from '@/hooks/use-toast-error';
import { toast } from 'sonner';
import { useExpensasStore } from '@/stores/expensa-store';
import { updateGastoComunSchema } from '@/lib/schemas/gasto-comun.schema';
import { useState } from 'react';
import ModalSend from './modal/modal-send';

const FormGastoComun = () => {
  const selectedEdificio = useEdificioStore((state) => state.selectedEdificio);
  const { gastoComun, loading, error } = useGetGastoComun(selectedEdificio);
  const {
    update,
    loading: updating,
    error: updateError,
  } = useUpdateGastoComun();
  const { triggerRefetch } = useExpensasStore();
  const [openModal, setOpenModal] = useState(false);

  useToastError(error);
  useToastError(updateError);

  if (!selectedEdificio) return null;
  if (loading) return <p>Cargando gasto común…</p>;

  function toDateInputValue(date?: Date | null) {
    return date ? date.toISOString().slice(0, 10) : undefined;
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const rawPayload = {
      monto_gc: Number(formData.get('monto')),
      interes_gc: Number(formData.get('interes')),
      vto1_gc: formData.get('vto1')
        ? new Date(formData.get('vto1') as string)
        : null,
      vto2_gc: formData.get('vto2')
        ? new Date(formData.get('vto2') as string)
        : null,
    };

    const parsed = updateGastoComunSchema.safeParse(rawPayload);

    if (!parsed.success) {
      console.error(parsed.error);
      toast.error('Datos inválidos');
      return;
    }

    const updated = await update(selectedEdificio, parsed.data);

    if (updated) {
      toast.success('Gasto común actualizado');
      triggerRefetch();
    }
  };

  // abrir modal para cargar pdf y presionar enviar
  const handleSend = () => {};

  return (
    <>
      <CardContent>
        <form className='flex flex-col' onSubmit={handleSubmit}>
          <div className='flex flex-col sm:flex-row gap-6 justify-center'>
            <div className='flex items-center gap-2'>
              <Label htmlFor='monto' className='whitespace-nowrap'>
                Monto: $
              </Label>
              <Input
                id='monto'
                name='monto'
                type='number'
                required
                defaultValue={gastoComun?.monto_gc ?? undefined}
              />
            </div>

            <div className='flex items-center gap-2'>
              <Label htmlFor='interes' className='whitespace-nowrap'>
                Interés: %
              </Label>
              <Input
                id='interes'
                name='interes'
                type='number'
                step='0.01'
                required
                defaultValue={gastoComun?.interes_gc ?? undefined}
              />
            </div>
          </div>

          <div className='flex flex-col sm:flex-row gap-6 justify-center mt-3'>
            <div className='flex items-center gap-2'>
              <Label htmlFor='vto1' className='whitespace-nowrap'>
                Vto 1:
              </Label>
              <Input
                id='vto1'
                name='vto1'
                type='date'
                required
                defaultValue={toDateInputValue(gastoComun?.vto1_gc)}
              />
            </div>

            <div className='flex items-center gap-2'>
              <Label htmlFor='vto2' className='whitespace-nowrap'>
                Vto 2:
              </Label>
              <Input
                id='vto2'
                name='vto2'
                type='date'
                defaultValue={toDateInputValue(gastoComun?.vto2_gc)}
                required
              />
            </div>
          </div>

          <div className='flex justify-center w-full mt-4'>
            <Button disabled={updating} type='submit'>
              Guardar
            </Button>
            <Button
              variant={'link'}
              className='ms-2'
              onClick={(e) => {
                e.preventDefault();
                setOpenModal(true);
              }}
            >
              Enviar
            </Button>
          </div>
        </form>
      </CardContent>
      {openModal && <ModalSend onClose={() => setOpenModal(false)} />}
    </>
  );
};

export default FormGastoComun;
