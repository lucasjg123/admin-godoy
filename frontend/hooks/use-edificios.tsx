import { getEdificios } from '@/lib/api/edificio.api';
import { EdificioList } from '@/lib/schemas/edificio.schema';
import { useEffect, useState } from 'react';

export function useEdificios() {
  const [edificios, setEdificios] = useState<EdificioList>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getEdificios()
      .then(setEdificios)
      .catch(() => setError('Error al cargar edificios'))
      .finally(() => setLoading(false));
  }, []);

  return { edificios, loading, error };
}
