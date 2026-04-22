import { ReciboFormValues } from '../schemas/recibo.schema';
import { api } from './axios';

export async function createRecibo(recibo: ReciboFormValues) {
  const { data } = await api.post('/recibos', recibo, {
    responseType: 'blob',
  });

  return data;
}

export async function sendRecibo(recibo: ReciboFormValues) {
  const { data } = await api.post('/recibos/send', recibo);

  return data;
}
