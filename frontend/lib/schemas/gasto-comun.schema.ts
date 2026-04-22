import { z } from 'zod';

export const gastoComunSchema = z.object({
  id_gc: z.number().int(),
  monto_gc: z.number().nullable().default(0),
  vto1_gc: z.coerce.date().nullable(),
  vto2_gc: z.coerce.date().nullable(),
  id_edif: z.number().int(),
  interes_gc: z.number().nullable(),
});

export type GastoComun = z.infer<typeof gastoComunSchema>;

export const updateGastoComunSchema = gastoComunSchema
  .omit({ id_gc: true }) // el id no se actualiza
  .partial();

export type UpdateGastoComun = z.infer<typeof updateGastoComunSchema>;
