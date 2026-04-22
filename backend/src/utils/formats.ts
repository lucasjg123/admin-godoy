export const formatMoney = (valor: number | null | undefined) => {
  if (valor === null || valor === undefined) return '0,00';

  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
};

const shortDateFormatter = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
  timeZone: 'UTC', // 🔥 esto es la clave
});

export const formatShortDate = (fecha?: string | Date | null) =>
  fecha ? shortDateFormatter.format(new Date(fecha)) : '';

export const formatPreviousMonth = (fecha?: string | Date | null) => {
  if (!fecha) return '';

  const date = new Date(fecha);

  // usar UTC para evitar cambio de día
  const utcDate = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1),
  );

  utcDate.setUTCMonth(utcDate.getUTCMonth() - 1);

  const mes = String(utcDate.getUTCMonth() + 1).padStart(2, '0');
  const año = utcDate.getUTCFullYear();

  return `${mes}/${año}`;
};

export const moneyColumn = (value: number | null) => ({
  columns: [
    {
      text: '$',
      width: 10,
      alignment: 'right',
    },
    {
      text: formatMoney(value),
      alignment: 'right',
    },
  ],
  columnGap: 2,
});
