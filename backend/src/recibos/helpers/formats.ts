// fomatea monto con miles(.) y (,)
export function formatMonto(monto: number) {
  return monto.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// formatea meses con (, - y)
export function formatMeses(meses: string[]) {
  if (meses.length === 1) return meses[0];

  if (meses.length === 2) {
    return `${meses[0]} Y ${meses[1]}`;
  }

  const last = meses[meses.length - 1];
  const first = meses.slice(0, -1).join(', ');

  return `${first} Y ${last}`;
}

export function numeroALetras(value: number, plus = false): string {
  value = Math.trunc(value);
  let text = '';

  if (value === 0) text = 'CERO';
  else if (value === 1 && !plus) text = 'UNO';
  else if (value === 1 && plus) text = 'UN';
  else if (value === 2) text = 'DOS';
  else if (value === 3) text = 'TRES';
  else if (value === 4) text = 'CUATRO';
  else if (value === 5) text = 'CINCO';
  else if (value === 6) text = 'SEIS';
  else if (value === 7) text = 'SIETE';
  else if (value === 8) text = 'OCHO';
  else if (value === 9) text = 'NUEVE';
  else if (value === 10) text = 'DIEZ';
  else if (value === 11) text = 'ONCE';
  else if (value === 12) text = 'DOCE';
  else if (value === 13) text = 'TRECE';
  else if (value === 14) text = 'CATORCE';
  else if (value === 15) text = 'QUINCE';
  else if (value < 20) text = 'DIECI' + numeroALetras(value - 10);
  else if (value === 20) text = 'VEINTE';
  else if (value < 30) text = 'VEINTI' + numeroALetras(value - 20, plus);
  else if (value === 30) text = 'TREINTA';
  else if (value === 40) text = 'CUARENTA';
  else if (value === 50) text = 'CINCUENTA';
  else if (value === 60) text = 'SESENTA';
  else if (value === 70) text = 'SETENTA';
  else if (value === 80) text = 'OCHENTA';
  else if (value === 90) text = 'NOVENTA';
  else if (value < 100)
    text =
      numeroALetras(Math.trunc(value / 10) * 10) +
      ' Y ' +
      numeroALetras(value % 10, plus);
  else if (value === 100) text = 'CIEN';
  else if (value < 200) text = 'CIENTO ' + numeroALetras(value - 100);
  else if ([200, 300, 400, 600, 800].includes(value))
    text = numeroALetras(Math.trunc(value / 100)) + 'CIENTOS';
  else if (value === 500) text = 'QUINIENTOS';
  else if (value === 700) text = 'SETECIENTOS';
  else if (value === 900) text = 'NOVECIENTOS';
  else if (value < 1000)
    text =
      numeroALetras(Math.trunc(value / 100) * 100) +
      ' ' +
      numeroALetras(value % 100, plus);
  else if (value === 1000) text = 'MIL';
  else if (value < 2000) text = 'MIL ' + numeroALetras(value % 1000);
  else if (value < 1000000) {
    text = numeroALetras(Math.trunc(value / 1000), true) + ' MIL';
    if (value % 1000 > 0) text += ' ' + numeroALetras(value % 1000);
  } else if (value === 1000000) text = 'UN MILLON';
  else if (value < 2000000)
    text = 'UN MILLON ' + numeroALetras(value % 1000000);
  else if (value < 1000000000000) {
    text = numeroALetras(Math.trunc(value / 1000000)) + ' MILLONES';
    const remainder = value % 1000000;
    if (remainder > 0) text += ' ' + numeroALetras(remainder);
  } else if (value === 1000000000000) text = 'UN BILLON';
  else if (value < 2000000000000)
    text =
      'UN BILLON ' +
      numeroALetras(value - Math.trunc(value / 1000000000000) * 1000000000000);
  else {
    text = numeroALetras(Math.trunc(value / 1000000000000)) + ' BILLONES';
    const remainder = value - Math.trunc(value / 1000000000000) * 1000000000000;
    if (remainder > 0) text += ' ' + numeroALetras(remainder);
  }

  return text;
}

export function formatFechaRecibo(): string {
  const fecha = new Date();

  const dia = fecha.getDate();
  const anio = fecha.getFullYear();

  const meses = [
    'ENERO',
    'FEBRERO',
    'MARZO',
    'ABRIL',
    'MAYO',
    'JUNIO',
    'JULIO',
    'AGOSTO',
    'SEPTIEMBRE',
    'OCTUBRE',
    'NOVIEMBRE',
    'DICIEMBRE',
  ];

  const mes = meses[fecha.getMonth()];

  return `CÓRDOBA, ${dia} DE ${mes} DE ${anio}`;
}
