import { Button } from '@/components/ui/button';
import { CardAction, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchFilters } from '@/types/search.types';
import { useEffect, useRef, useState } from 'react';

import { useEdificios } from '@/hooks/use-edificios';

type MenuProps = {
  onSearch: (filters: SearchFilters) => void;
  onClickPanel: () => void;
  dialogOpen: boolean;
};

const Menu = ({ onSearch, onClickPanel, dialogOpen }: MenuProps) => {
  const { edificios, error, loading } = useEdificios();
  const [filters, setFilters] = useState<SearchFilters>({
    nombre: '',
    apellido: '',
    id_edif: undefined,
  });
  const apellidoRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    onSearch(filters);
  };
  const handleClear = () => {
    setFilters({
      nombre: '',
      apellido: '',
      id_edif: undefined,
    });
  };

  useEffect(() => {
    if (!dialogOpen) {
      apellidoRef.current?.focus();
    }
  }, [dialogOpen]);

  return (
    <CardHeader className='flex'>
      <Input
        className='w-44'
        placeholder='Nombre'
        value={filters.nombre}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            nombre: e.target.value,
          }))
        }
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearch();
        }}
      />
      <Input
        ref={apellidoRef}
        className='w-44'
        placeholder='Apellido'
        value={filters.apellido}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            apellido: e.target.value,
          }))
        }
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearch();
        }}
      />
      <Select
        value={filters.id_edif?.toString() ?? ''}
        onValueChange={(value) =>
          setFilters((prev) => ({
            ...prev,
            id_edif: Number(value),
          }))
        }
      >
        <SelectTrigger className='w-full max-w-48'>
          <SelectValue placeholder='Edificio' />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Edificios</SelectLabel>

            {edificios.map((edificio) => (
              <SelectItem
                key={edificio.id_edif}
                value={edificio.id_edif.toString()}
              >
                {edificio.nom_edif}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <CardAction>
        <Button onClick={handleSearch} className='me-3'>
          Buscar
        </Button>
        <Button className='me-3' onClick={() => onClickPanel()}>
          Panel
        </Button>
        <Button onClick={handleClear}>Limpiar</Button>
      </CardAction>
    </CardHeader>
  );
};

export default Menu;
