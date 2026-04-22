import { formatMoney } from '@/lib/formats';

export const MoneyRow = ({
  label,
  value,
}: {
  label: string;
  value: number | null | undefined;
}) => {
  return (
    <div className='flex justify-between w-full'>
      <span>{label}</span>

      <div className='flex min-w-[100px] justify-end gap-1'>
        <span className='w-3 text-right'>$</span>
        <span className='text-right w-full'>{formatMoney(value)}</span>
      </div>
    </div>
  );
};
