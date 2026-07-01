import { ExpensaList } from '@/lib/schemas/expensa.schema';
import { create } from 'zustand';

type ExpensasStore = {
   // Cache
  expensas: ExpensaList;
  setExpensas: (expensas: ExpensaList) => void;

  // Refetch
  shouldRefetch: boolean;
  triggerRefetch: () => void;
  consumeRefetch: () => void;

   // Limpiar
  clearExpensas: () => void;
};

export const useExpensasStore = create<ExpensasStore>((set) => ({
  expensas: [],
  setExpensas: (expensas) => set({ expensas }),
  
  shouldRefetch: false,
  triggerRefetch: () => set({ shouldRefetch: true }),
  consumeRefetch: () => set({ shouldRefetch: false }),

  clearExpensas: () => set({ expensas: [] }),
}));
