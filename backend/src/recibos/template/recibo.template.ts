import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { ReciboPdfData } from '../types/recibo-pdf';
import {
  formatMonto,
  formatMeses,
  numeroALetras,
  formatFechaRecibo,
} from '../helpers/formats';

const fecha = formatFechaRecibo().split(' DE ');

export const buildReciboTemplate = (
  data: ReciboPdfData,
): TDocumentDefinitions => ({
  pageSize: 'A5',
  pageOrientation: 'landscape',
  pageMargins: [20, 20, 20, 20],

  content: [
    // LINEA SUPERIOR
    {
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 555, y2: 0, lineWidth: 1 }],
    },

    {
      text: 'RECIBO DE PROPIEDAD HORIZONTAL',
      style: 'titulo',
      margin: [0, 5, 0, 5],
    },

    // LINEA
    {
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 555, y2: 0, lineWidth: 1 }],
      margin: [0, 0, 0, 10],
    },

    {
      columns: [
        {
          width: '*',
          text: [
            { text: 'CONSORCIO: ', bold: true },
            `EDIFICIO ${data.edificio.nombre.toUpperCase()}`,
          ],
        },
      ],
    },
    {
      margin: [0, 5, 0, 10],
      columns: [
        {
          width: '*',
          text: [
            { text: 'DEPARTAMENTO: ', bold: true },
            `${data.depto.piso} "${data.depto.letra}"`,
          ],
        },
        {
          width: 'auto',
          text: [
            { text: 'PERIODO: ', bold: true },
            `${formatMeses(data.meses).toUpperCase()} ${data.anio}`,
          ],
          alignment: 'right',
        },
      ],
    },

    // LINEA
    {
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 555, y2: 0, lineWidth: 1 }],
      margin: [0, 0, 0, 15],
    },

    {
      margin: [0, 5],
      text: [
        { text: 'RECIBI DE: ', bold: true },
        `${data.titular.nombre.toUpperCase()} ${data.titular.apellido?.toUpperCase()}`,
      ],
    },

    {
      margin: [0, 5],
      text: [
        { text: 'LA CANTIDAD DE PESOS: ', bold: true },
        `${numeroALetras(data.monto)} ($ ${formatMonto(data.monto)})`,
      ],
    },

    {
      margin: [0, 5],
      text: [
        {
          text: 'EN PAGO DEL PORCENTUAL QUE LE CORRESPONDE SEGÚN LIQUIDACION: ',
          bold: true,
        },
        `EXPENSAS ${formatMeses(data.meses).toUpperCase()} ${data.anio}.-`,
      ],
    },

    {
      margin: [0, 15],
      text: [
        { text: `${fecha[0]} DE ${fecha[1]} DE `, bold: true },
        { text: fecha[2], bold: true },
      ],
    },

    {
      text: 'ADMINISTRACIÓN GODOY',
      alignment: 'right',
      bold: true,
      margin: [0, 20, 0, 0],
    },

    // LINEA FINAL
    {
      canvas: [{ type: 'line', x1: 0, y1: 10, x2: 555, y2: 10, lineWidth: 1 }],
    },
  ],

  styles: {
    titulo: {
      fontSize: 16,
      bold: true,
      alignment: 'center',
      color: 'red',
    },
  },
});
