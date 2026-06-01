import { formatMoney } from '@/lib/formats';
import React from 'react';

export const MoneyTable = ({
  rows,
}: {
  rows: { label: string; value: React.ReactNode | number | null | undefined }[];
}) => {
  const hasComponent = rows.some(
    (row) => typeof row.value !== 'number' && row.value !== null && row.value !== undefined
  );
  return (
    <div className={`grid grid-cols-[1fr_12px_auto] gap-x-2 w-full items-center ${hasComponent ? 'gap-y-3' : ''   }`}>
      {rows.map((row, i) => {
        const isNumeric = typeof row.value === 'number' || row.value === null || row.value === undefined;
        return(
          <React.Fragment key={i}>
            <span>{row.label}</span>

            <span className='text-center'>$</span>

            <span className='text-right tabular-nums whitespace-nowrap'>
              {isNumeric ? (
                // Si es número, mantenemos tu lógica original
                formatMoney(row.value as number | null | undefined)
              ) : (
                // Si es un Input o JSX, lo renderizamos directo
                row.value
              )}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};
