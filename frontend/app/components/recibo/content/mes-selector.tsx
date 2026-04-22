import { useFormContext } from 'react-hook-form';
import { ReciboFormValues } from '@/lib/schemas/recibo.schema';
import { mesesLista } from '@/types/meses';

const MesSelector = () => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ReciboFormValues>();

  const mesesSeleccionados = watch('meses') || [];

  const toggleMes = (mes: string) => {
    const updated = mesesSeleccionados.includes(mes)
      ? mesesSeleccionados.filter((m) => m !== mes)
      : [...mesesSeleccionados, mes];

    setValue('meses', updated, {
      shouldValidate: true, // 👈 CLAVE
      shouldDirty: true,
    });
  };

  const hasError = !!errors.meses;

  return (
    <div>
      <div
        className={`grid grid-cols-2 grid-rows-6 grid-flow-col gap-2 text-sm border p-3 rounded ${
          hasError ? 'border-red-500' : ''
        }`}
      >
        {mesesLista.map((mes) => (
          <label
            key={mes}
            className={`flex items-center gap-2 cursor-pointer `}
          >
            <input
              type='checkbox'
              checked={mesesSeleccionados.includes(mes)}
              onChange={() => toggleMes(mes)}
            />
            {mes}
          </label>
        ))}
      </div>

      {hasError && (
        <p className='text-sm text-red-500 mt-1'>{errors.meses?.message}</p>
      )}
    </div>
  );
};

export default MesSelector;
