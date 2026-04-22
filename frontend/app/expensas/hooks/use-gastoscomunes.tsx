import {
  getGastoComunByEdificio,
  updateGastoComunByEdificio,
} from '@/lib/api/gasto-comun.api';
import { GastoComun, UpdateGastoComun } from '@/lib/schemas/gasto-comun.schema';
import { useEffect, useState } from 'react';

export function useGetGastoComun(id_edif: number | null) {
  const [gastoComun, setGastoComun] = useState<GastoComun | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id_edif) {
      setGastoComun(null);
      return;
    }

    setLoading(true);
    setError(null);

    getGastoComunByEdificio(id_edif)
      .then(setGastoComun)
      .catch(() => setError('Error al cargar gasto comun'))
      .finally(() => setLoading(false));
  }, [id_edif]);

  return { gastoComun, loading, error };
}

export function useUpdateGastoComun() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (
    id_edif: number,
    payload: UpdateGastoComun // 👈 SOLO ESTO
  ) => {
    setLoading(true);
    setError(null);

    try {
      return await updateGastoComunByEdificio(id_edif, payload);
    } catch {
      setError('Error al actualizar gasto común');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}
