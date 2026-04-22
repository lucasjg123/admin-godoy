import { CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEdificioStore } from '@/stores/edificio-store';
import { useEdificios } from '@/hooks/use-edificios';
import { useToastError } from '@/hooks/use-toast-error';

export const SelectEdificios = () => {
  const selectedEdificio = useEdificioStore((state) => state.selectedEdificio);
  const setSelectedEdificio = useEdificioStore(
    (state) => state.setSelectedEdificio
  );
  const { edificios, error } = useEdificios();
  useToastError(error);

  return (
    <CardHeader className='flex items-center justify-center'>
      <Label>Edificio:</Label>
      <Select
        value={selectedEdificio?.toString()}
        onValueChange={(v) => setSelectedEdificio(Number(v))}
      >
        <SelectTrigger className='w-full max-w-48'>
          <SelectValue placeholder='Seleccionar Edificio' />
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
    </CardHeader>
  );
};
