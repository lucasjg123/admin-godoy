import { EdificioList, edificioListSchema } from '../schemas/edificio.schema';
import { api } from './axios';

export async function getEdificios(): Promise<EdificioList> {
  const { data } = await api.get(`/edificios`);

  const parsed = edificioListSchema.safeParse(data);

  if (!parsed.success) {
    // 👉 Log interno SOLO para debug
    console.error('Zod schema mismatch:', parsed.error);

    // 👉 Error simple para el front
    throw new Error('Invalid server response');
  }

  return parsed.data;
}
