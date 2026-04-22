import { Card } from '@/components/ui/card';
import { Expensa } from '@/lib/schemas/expensa.schema';
import ExpensaHeader from './header';
import ExpensaContent from './content';
import ExpensaFooter from './footer';

export function ExpensaCard({ expensa }: { expensa: Expensa }) {
  return (
    <Card className='w-full max-w-sm mb-5'>
      <ExpensaHeader expensa={expensa} />
      <ExpensaContent expensa={expensa} />
      <ExpensaFooter expensa={expensa} />
    </Card>
  );
}
