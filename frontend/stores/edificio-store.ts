import { create } from 'zustand';

type EdificioStore = {
  selectedEdificio: number | null;
  setSelectedEdificio: (id: number) => void;
};

export const useEdificioStore = create<EdificioStore>((set) => ({
  selectedEdificio: null,
  setSelectedEdificio: (id) => set({ selectedEdificio: id }),
}));
