import { getExpensaByDepto, getExpensasByEdificio, sendExpensas, updateExpensas } from '@/lib/api/expensa.api';
import { ExpensaList, ExpensaUpdate } from '@/lib/schemas/expensa.schema';
import { useExpensasStore } from '@/stores/expensa-store';
import { useEffect, useState } from 'react';

export function useExpensas(id_edif: number | null) {
  const { shouldRefetch, consumeRefetch } = useExpensasStore();

  const [expensas, setExpensas] = useState<ExpensaList>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpensas = async () => {
    if (!id_edif) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getExpensasByEdificio(id_edif);
      setExpensas(data);
    } catch {
      setError('Error al cargar expensas');
    } finally {
      setLoading(false);
      consumeRefetch(); // 👈 limpiar flag
    }
  };

  useEffect(() => {
    fetchExpensas();
  }, [id_edif, shouldRefetch]);

  return { expensas, loading, error };
}

export function useExpensa(id_edif: number , id_exp: number ) {
  const [expensa, setExpensa] = useState<ExpensaList[0] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpensa = async () => {
    if (!id_exp) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getExpensaByDepto(id_edif, id_exp);
      setExpensa(data);
    } catch {
      setError('Error al cargar expensa');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpensa();
  }, [id_exp]);

  return { expensa, loading, error };
}

export function useUpdateExpensa() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (
    id_edif: number,
    id_exp: number,
    payload: ExpensaUpdate // 👈 SOLO ESTO
  ) => {
    setLoading(true);
    setError(null);

    try {
      return await updateExpensas(id_edif, id_exp, payload);
    } catch {
      setError('Error al actualizar expensa');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

export function useSendExpensas() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async (id_edif: number, file: File, id_exp?: number) => {
    setLoading(true);
    setError(null);

    try {
      const res = await sendExpensas(id_edif, file, id_exp);
      return res;
    } catch (e) {
      setError('Error al enviar expensas');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { send, loading, error };
}