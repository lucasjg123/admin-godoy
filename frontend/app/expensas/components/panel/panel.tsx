import { Card } from '@/components/ui/card';

import FormGastoComun from './form-gasto-comun';
import { SelectEdificios } from './select-edificios';

const Panel = () => {
  return (
    <Card className='sm:mx-auto sm:max-w-2xl mb-5 max-w-full mx-3'>
      <SelectEdificios />
      <FormGastoComun />
    </Card>
  );
};

export default Panel;
