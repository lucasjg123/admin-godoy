export interface Vencimiento {
  fecha: string | null;
  monto: number | null;
}

export interface ExpensaCupon {
  edificio: string | null;
  ubicacion: string | null;
  titular: string | null;
  periodo: string | null;
  monto_gc: number | null;
  porcentaje_participacion: number | null;
  monto: number | null;
  adeuda: string | null;
  vto_1: Vencimiento | null;
  vto_2: Vencimiento | null;
}