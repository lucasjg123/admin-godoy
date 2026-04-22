import { api } from './axios';
import {
  GastoComun,
  gastoComunSchema,
  UpdateGastoComun,
} from '../schemas/gasto-comun.schema';

export async function getGastoComunByEdificio(
  id_edif: number
): Promise<GastoComun> {
  const { data } = await api.get(`/edificios/${id_edif}/gastos-comunes`);

  const parsed = gastoComunSchema.safeParse(data);

  if (!parsed.success) {
    // 👉 Log interno SOLO para debug
    console.error('Zod schema mismatch:', parsed.error);

    // 👉 Error simple para el front
    throw new Error('Invalid server response');
  }

  return parsed.data;
}

export async function updateGastoComunByEdificio(
  id_edif: number,
  gastoComun: UpdateGastoComun
): Promise<GastoComun> {
  const { data } = await api.patch(
    `/edificios/${id_edif}/gastos-comunes`,
    gastoComun // 👈 ESTE es el body
  );

  const parsed = gastoComunSchema.safeParse(data);

  if (!parsed.success) {
    console.error('Zod schema mismatch:', parsed.error);
    throw new Error('Invalid server response');
  }

  return parsed.data;
}
