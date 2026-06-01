import { TDocumentDefinitions, ContentTable } from 'pdfmake/interfaces';
import {
  formatMoney,
  formatPreviousMonth,
  formatShortDate,
} from 'src/utils/formats';
import { ExpensaPdf } from '../types/expensa-pdf';

// helper para filas de dinero
const moneyRow = (
  label: string,
  value: number | null | undefined,
): ContentTable => ({
  table: {
    widths: ['*', 12, 70],
    body: [
      [
        { text: label },
        { text: '$', alignment: 'right' as const },
        {
          text: formatMoney(value),
          alignment: 'right' as const,
          noWrap: true, // 👈 evita salto de línea
        },
      ],
    ],
  },
  layout: 'noBorders',
});

export const buildExpensaTemplate = (
  exp: ExpensaPdf,
): TDocumentDefinitions => ({
  pageSize: 'A7',
  pageOrientation: 'landscape',
  pageMargins: [20, 20, 20, 20],

  content: [
    {
      text: `CONSORCIO EDIFICIO ${exp.departamentos.edificios.nom_edif.toUpperCase()}`,
      bold: true,
      decoration: 'underline',
      margin: [0, 0, 0, 5],
    },
    {
      text: `Ubicación: ${exp.departamentos.piso_depto} ${exp.departamentos.letra_depto}`,
    },
    {
      // 🛡️ Acceso seguro al primer titular
      text: `Titular: ${
        exp.departamentos.departamentos_titulares?.[0]?.titulares 
          ? `${exp.departamentos.departamentos_titulares[0].titulares.nom_tit}, ${exp.departamentos.departamentos_titulares[0].titulares.ape_tit}`
          : ' ' // Texto por defecto si no hay titular
      }`,
      margin: [0, 0, 0, 15],
    },

    {
      text: `EXPENSAS MES ${formatPreviousMonth(
        exp.departamentos.edificios.gastoscomunes?.vto1_gc,
      )}`,
      bold: true,
      decoration: 'underline',
      margin: [0, 0, 0, 0],
    },

    // 💰 filas alineadas
    moneyRow(
      'Expensas Ordinarias',
      exp.departamentos.edificios.gastoscomunes?.monto_gc,
    ),

    moneyRow(`% Participación ${exp.departamentos.porc_depto}`, exp.porcentual_exp),

    {
      text: `${exp.nota_exp ?? ' '}`,
      alignment: 'right' as const,
    },
    {
      text: '',
      margin: [0, 5],
    },

    moneyRow(
      `1 Vto. ${formatShortDate(
        exp.departamentos.edificios.gastoscomunes?.vto1_gc,
      )}`,
      exp.vto1_exp,
    ),

    moneyRow(
      `2 Vto. ${formatShortDate(
        exp.departamentos.edificios.gastoscomunes?.vto2_gc,
      )}`,
      exp.vto2_exp,
    ),

    {
      canvas: [
        {
          type: 'line',
          x1: 0,
          y1: 0,
          x2: 250,
          y2: 0,
          lineWidth: 1,
        },
      ],
      margin: [0, 5, 0, 0],
    },
  ],

  defaultStyle: {
    fontSize: 10,
  },
});
