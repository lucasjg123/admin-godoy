import {
  getDepartamentoById,
  getDepartamentos,
} from '@/lib/api/departamentos.api';
import {
  DepartamentoList,
  DepartamentoSinEdificio,
} from '@/lib/schemas/departamento.schema';
import { SearchFilters } from '@/types/search.types';
import { useEffect, useState } from 'react';

export function useSearchDepartamentos() {
  const [departamentos, setDepartamentos] = useState<DepartamentoList>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (filters: SearchFilters) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getDepartamentos(filters);
      setDepartamentos(data);
    } catch {
      setError('Error al cargar departamentos');
    } finally {
      setLoading(false);
    }
  };

  return { departamentos, loading, error, search };
}

export function useGetDepartamento(id_depto: number) {
  const [departamento, setDepartamento] =
    useState<DepartamentoSinEdificio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartamento = async () => {
    if (!id_depto) {
      setDepartamento(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getDepartamentoById(id_depto);
      setDepartamento(data);
    } catch {
      setError('Error al cargar departamento');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartamento();
  }, [id_depto]);

  return {
    departamento,
    loading,
    error,
    fetchDepartamento, // 👈 esto faltaba
  };
}
