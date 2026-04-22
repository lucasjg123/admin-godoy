import { formatMoney } from '@/lib/formats';
import React from 'react';

export const MoneyTable = ({
  rows,
}: {
  rows: { label: string; value: number | null | undefined }[];
}) => {
  return (
    <div className='grid grid-cols-[1fr_12px_auto] gap-x-2 w-full'>
      {rows.map((row, i) => (
        <React.Fragment key={i}>
          <span>{row.label}</span>

          <span className='text-center'>$</span>

          <span className='text-right tabular-nums whitespace-nowrap'>
            {formatMoney(row.value)}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};
