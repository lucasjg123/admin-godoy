import {
  DepartamentoList,
  departamentoListSchema,
  DepartamentoSinEdificio,
  departamentoSinEdificioSchema,
} from '../schemas/departamento.schema';
import { api } from './axios';
import { SearchFilters } from '@/types/search.types';

export async function getDepartamentos(
  params?: SearchFilters
): Promise<DepartamentoList> {
  const { data } = await api.get('/departamentos/search', {
    params, // 👈 Axios arma ?nombre=... automáticamente
  });

  const parsed = departamentoListSchema.safeParse(data);

  if (!parsed.success) {
    console.error('Zod schema mismatch:', parsed.error);
    throw new Error('Invalid server response');
  }

  return parsed.data;
}

export async function getDepartamentoById(
  id: number
): Promise<DepartamentoSinEdificio> {
  const { data } = await api.get(`/departamentos/${id}`);
  const parsed = departamentoSinEdificioSchema.safeParse(data);

  if (!parsed.success) {
    console.error('Zod schema mismatch:', parsed.error);
    throw new Error('Invalid server response');
  }

  return parsed.data;
}
