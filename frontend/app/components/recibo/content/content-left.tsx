import { useFormContext } from 'react-hook-form';
import MesSelector from './mes-selector';
import { ReciboFormValues } from '@/lib/schemas/recibo.schema';
import { Titular } from '@/lib/schemas/titulares.schema';

type Props = {
  titular: Titular;
};

const ContentLeft = ({ titular }: Props) => {
  const { register, watch, formState: { errors } } = useFormContext<ReciboFormValues>();
  const useCustomPeriodo = watch('useCustomPeriodo');

  return (
    <div className='space-y-4 border p-4 rounded-md'>
      <div>
        <label className='text-sm font-medium'>RECIBO A NOMBRE DE</label>
        <p className='mt-2 p-2 border rounded bg-muted'>
          {titular.nom_tit} {titular.ape_tit}
        </p>
      </div>

      <div>
        <label className='text-sm font-medium'>PERIODO</label>

        <div className='mt-2 border p-3 rounded space-y-3'>
          {!useCustomPeriodo ? (
            <>
              <select
                {...register('anio')}
                className='border p-2 rounded w-full bg-muted'
              >
                <option value='2026'>2026</option>
                <option value='2025'>2025</option>
              </select>

              <MesSelector />
            </>
          ) : null}

          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              {...register('useCustomPeriodo')}
              className='cursor-pointer'
            />
            <label className='text-sm cursor-pointer'>
              Usar período personalizado
            </label>
          </div>

          {useCustomPeriodo && (
            <>
              <input
                type='text'
                {...register('customPeriodo')}
                placeholder='Ej: ENERO 2024'
                className={`border p-2 rounded w-full ${
                  errors.customPeriodo ? 'border-red-500' : ''
                }`}
              />
              {errors.customPeriodo && (
                <p className='text-sm text-red-500'>
                  {errors.customPeriodo.message}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentLeft;
