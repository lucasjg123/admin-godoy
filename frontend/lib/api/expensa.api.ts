import { api } from './axios';
import {
  Expensa,
  ExpensaList,
  expensaListSchema,
  expensaSchema,
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

export async function getExpensaByDepto(id_edif: number, id_depto: number): Promise<Expensa> {
  const { data } = await api.get(`/edificios/${id_edif}/expensas/depto/${id_depto}`);

  const parsed = expensaSchema.safeParse(data);

  if (!parsed.success) {
    console.error('Zod schema mismatch:', parsed.error);
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
  file: File,
  id_exp?: number
) {
  const formData = new FormData();
  formData.append('file', file);

  const url = id_exp 
    ? `/edificios/${id_edif}/expensas/${id_exp}/send` 
    : `/edificios/${id_edif}/expensas/send`;

  const { data } = await api.post(
    url,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return data;
}