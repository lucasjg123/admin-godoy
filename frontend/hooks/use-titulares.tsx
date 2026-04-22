import {
  createTitular,
  removeTitular,
  updateTitular,
} from '@/lib/api/titulares.api';
import { CreateTitular, UpdateTitular } from '@/lib/schemas/titulares.schema';
import { useState } from 'react';

export function useCreateTitular() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (id_depto: number, titular: CreateTitular) => {
    setLoading(true);
    setError(null);
    try {
      return await createTitular(id_depto, titular);
    } catch (err) {
      setError('Error al crear titular');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

export function useUpdateTitular() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (id_tit: number, titular: UpdateTitular) => {
    setLoading(true);
    setError(null);
    try {
      return await updateTitular(id_tit, titular);
    } catch (err) {
      setError('Error al actualizar titular');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

export function useRemoveTitular() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (id_depto: number, id_tit: number) => {
    try {
      setLoading(true);
      setError(null);
      return await removeTitular(id_depto, id_tit);
    } catch (err) {
      setError('Error al eliminar titular');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}
