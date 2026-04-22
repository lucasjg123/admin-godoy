import {
  CreateTitular,
  Titular,
  titularSchema,
  UpdateTitular,
} from '../schemas/titulares.schema';
import { api } from './axios';

export async function updateTitular(
  id_tit: number,
  titular: UpdateTitular
): Promise<Titular> {
  const { data } = await api.patch(`/titulares/${id_tit}`, titular);

  const parsed = titularSchema.safeParse(data);

  if (!parsed.success) {
    // 👉 Log interno SOLO para debug
    console.error('Zod schema mismatch:', parsed.error);

    // 👉 Error simple para el front
    throw new Error('Invalid server response');
  }

  return parsed.data;
}

export async function createTitular(
  id_depto: number,
  titular: CreateTitular
): Promise<Titular> {
  const { data } = await api.post(
    `/departamentos/${id_depto}/titulares`,
    titular
  );
  const parsed = titularSchema.safeParse(data);

  if (!parsed.success) {
    // 👉 Log interno SOLO para debug
    console.error('Zod schema mismatch:', parsed.error);

    // 👉 Error simple para el front
    throw new Error('Invalid server response');
  }

  return parsed.data;
}

export async function removeTitular(
  id_depto: number,
  id_tit: number
): Promise<void> {
  const { data } = await api.delete(
    `/departamentos/${id_depto}/titulares/${id_tit}`
  );
  return data;
}
