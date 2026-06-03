import { ExpensaCard } from './card';
import { useEdificioStore } from '@/stores/edificio-store';
import { useExpensas} from '@/hooks/use-expensas';
import { useToastError } from '@/hooks/use-toast-error';

const ExpensaList = () => {
  const selectedEdificio = useEdificioStore((state) => state.selectedEdificio);

  const { expensas, loading, error } = useExpensas(selectedEdificio);
  console.log(expensas);
  // 👉 Side effect SOLO cuando cambia error
  useToastError(error);

  if (!selectedEdificio) return null;

  return (
    <div className='mx-auto grid max-w-5xl grid-cols-1 sm:grid-cols-2 gap-4 justify-items-center'>
      {loading && <p>Cargando...</p>}

      {!loading &&
        expensas.map((exp) => <ExpensaCard key={exp.id_exp} expensa={exp} />)}
    </div>
  );
};

export default ExpensaList;
