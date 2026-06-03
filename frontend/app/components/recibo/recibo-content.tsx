import { Departamento } from '@/lib/schemas/departamento.schema';
import ContentLeft from './content/content-left';
import ContentRight from './content/content-right';

type Props = {
  depto: Departamento;
};

const ReciboContent = ({ depto }: Props) => {
  return (
    <div className='grid grid-cols-2 gap-6 mt-4'>
      <ContentLeft titular={depto.departamentos_titulares[0].titulares} />
      <ContentRight titular={depto.departamentos_titulares[0].titulares} id_depto={depto.id_depto} id_edif={depto.id_edif} />
    </div>
  );
};

export default ReciboContent;
