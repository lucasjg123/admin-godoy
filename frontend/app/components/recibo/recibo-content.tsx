import ContentLeft from './content/content-left';
import ContentRight from './content/content-right';
import { Titular } from '@/lib/schemas/titulares.schema';

type Props = {
  titular: Titular;
};

const ReciboContent = ({ titular }: Props) => {
  return (
    <div className='grid grid-cols-2 gap-6 mt-4'>
      <ContentLeft titular={titular} />
      <ContentRight titular={titular} />
    </div>
  );
};

export default ReciboContent;
