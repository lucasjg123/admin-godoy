import { useFormContext } from 'react-hook-form';
import { ReciboFormValues } from '@/lib/schemas/recibo.schema';
import { Titular } from '@/lib/schemas/titulares.schema';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';

type Props = {
  titular: Titular;
};

const ContentRight = ({ titular }: Props) => {
  const {
    register,
    setFocus,
    formState: { errors },
  } = useFormContext<ReciboFormValues>();

  useEffect(() => {
    setFocus('monto');
  }, [setFocus]);

  return (
    <div className='space-y-4 border p-4 rounded-md'>
      <div>
        <p className='font-medium'>ENVIAR A:</p>
        <p className='mt-2 p-2 border rounded bg-muted'>{titular.email_tit}</p>
      </div>

      <div>
        <label className='text-sm font-medium'>Mensaje de Correo</label>
        <textarea
          {...register('mensaje')}
          className={`w-full border rounded p-2 mt-2 bg-muted ${
            errors.mensaje ? 'border-red-500 focus-visible:ring-red-500' : ''
          }`}
          rows={5}
        />
        {errors.mensaje && (
          <p className='text-sm text-red-500 mt-1'>{errors.mensaje.message}</p>
        )}
      </div>

      <div className='flex items-center gap-2 mb-1'>
        <Label>Monto abonado: $</Label>
        <input
          type='number'
          {...register('monto', { valueAsNumber: true })}
          className={`border p-2 rounded w-32 bg-muted ${
            errors.monto?.message
              ? 'border-red-500 focus-visible:ring-red-500'
              : ''
          }`}
        />
      </div>
      {errors.monto && (
        <p className='text-red-500 text-sm'>{errors.monto.message}</p>
      )}
    </div>
  );
};

export default ContentRight;
