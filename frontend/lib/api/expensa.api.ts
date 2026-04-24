import { api } from './axios';
import {
  ExpensaList,
  expensaListSchema,
  ExpensaUpdate,
  expensaUpdateSchema,
} from '../schemas/expensa.schema';

export async function getExpensasByEdificio(
  id_edif: number
): Promise<ExpensaList> {
  const { data } = await api.get(`/edificios/${id_edif}/expensas`);

  const parsed = expensaListSchema.safeParse(data);

  if (!parsed.success) {
    // 👉 Log interno SOLO para debug
    console.error('Zod schema mismatch:', parsed.error);

    // 👉 Error simple para el front
    throw new Error('Invalid server response');
  }

  return parsed.data;
}

export async function updateExpensas(
  id_edif: number,
  id_exp: number,
  expensa: ExpensaUpdate
): Promise<ExpensaUpdate> {
  const { data } = await api.patch(
    `/edificios/${id_edif}/expensas/${id_exp}`,
    expensa
  );

  const parsed = expensaUpdateSchema.safeParse(data);

  if (!parsed.success) {
    console.error('Zod schema mismatch:', parsed.error);
    throw new Error('Invalid server response');
  }

  return parsed.data;
}

export async function sendExpensas(
  id_edif: number,
  file: File
) {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post(
    `/edificios/${id_edif}/expensas/send`,
    formData
  );

  return data;
}