import { create } from 'zustand';

type ExpensasStore = {
  shouldRefetch: boolean;
  triggerRefetch: () => void;
  consumeRefetch: () => void;
};

export const useExpensasStore = create<ExpensasStore>((set) => ({
  shouldRefetch: false,
  triggerRefetch: () => set({ shouldRefetch: true }),
  consumeRefetch: () => set({ shouldRefetch: false }),
}));
