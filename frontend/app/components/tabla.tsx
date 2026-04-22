'use client';
import { CardContent } from '@/components/ui/card';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Departamento } from '@/lib/schemas/departamento.schema';

type TablaProps = {
  data: Departamento[];
  loading: boolean;
  selected: Departamento | null;
  onRowClick: (depto: Departamento) => void;
  onRadioSelect: (depto: Departamento) => void;
};

const Tabla = ({ data, selected, onRowClick, onRadioSelect }: TablaProps) => {
  return (
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Edificio</TableHead>
            <TableHead>Piso</TableHead>
            <TableHead>Letra</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellido</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((depto) => {
            const titular = depto.departamentos_titulares[0]?.titulares;

            return (
              <TableRow
                key={depto.id_depto}
                onClick={() => onRowClick(depto)}
                className={`cursor-pointer hover:bg-muted/50 ${
                  selected?.id_depto === depto.id_depto ? 'bg-muted' : ''
                }`}
              >
                <TableCell>
                  <input
                    type='radio'
                    checked={selected?.id_depto === depto.id_depto}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => onRadioSelect(depto)}
                    className='h-4 w-4 appearance-none rounded-full border border-muted-foreground bg-background cursor-pointer relative checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition'
                  />
                </TableCell>
                <TableCell>{depto.edificios.nom_edif}</TableCell>
                <TableCell>{depto.piso_depto}</TableCell>
                <TableCell>{depto.letra_depto}</TableCell>
                <TableCell>{titular?.nom_tit}</TableCell>
                <TableCell>{titular?.ape_tit}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </CardContent>
  );
};

export default Tabla;
