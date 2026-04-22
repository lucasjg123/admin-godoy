import { z } from 'zod';

export const reciboSchema = z.object({
  id_depto: z.number(),
  id_tit: z.number(),
  anio: z.string().min(4),
  meses: z.array(z.string()).min(1, 'Seleccioná al menos un mes'),
  mensaje: z.string().min(5, 'Escribir cuerpo del correo'),
  monto: z
    .number('Debe ingresar un monto')
    .positive('El monto debe ser mayor a 0'),
});

// edificio
// depto

export type ReciboFormValues = z.infer<typeof reciboSchema>;
