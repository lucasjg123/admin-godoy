import { CardHeader, CardTitle } from '@/components/ui/card';
import { Expensa } from '@/lib/schemas/expensa.schema';

const ExpensaHeader = ({ expensa }: { expensa: Expensa }) => {
  return (
    <CardHeader>
      <CardTitle>
        CONSORCIO EDIFICIO{' '}
        {expensa.departamentos.edificios.nom_edif.toUpperCase()}
      </CardTitle>
      <p>
        Ubicación: {expensa.departamentos.piso_depto}{' '}
        {expensa.departamentos.letra_depto}
      </p>
      <p>
        Titular:{' '}
        {expensa.departamentos.departamentos_titulares[0]?.titulares.ape_tit}{' '}
        {expensa.departamentos.departamentos_titulares[0]?.titulares.nom_tit}
      </p>
    </CardHeader>
  );
};

export default ExpensaHeader;
