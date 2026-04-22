export type ReciboPdfData = {
  anio: string;
  meses: string[];
  monto: number;

  depto: {
    id: number;
    piso: string;
    letra: string;
  };

  edificio: {
    nombre: string;
  };

  titular: {
    nombre: string;
    apellido?: string;
    email?: string;
  };
};
