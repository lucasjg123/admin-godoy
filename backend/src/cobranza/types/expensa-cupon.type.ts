export interface Vencimiento {
  fecha: string | null;
  monto: number | null;
}

export interface ExpensaCupon {
  edificio: string | null;
  ubicacion: string | null;
  titular: string | null;
  periodo: string | null;
  expensas_ordinarias_total: number | null;
  porcentaje_participacion: number | null;
  expensas_ordinarias_monto: number | null;
  adeuda: string | null;
  vencimiento_1: Vencimiento | null;
  vencimiento_2: Vencimiento | null;
}