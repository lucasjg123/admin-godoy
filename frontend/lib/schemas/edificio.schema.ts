import { z } from 'zod';
import { gastoComunSchema } from './gasto-comun.schema';

export const edificioSchema = z.object({
  id_edif: z.number().int(),
  cod_dom: z.number().int(),
  nom_edif: z.string().max(20),
  gastoscomunes: gastoComunSchema.optional(),
});

export const edificioListSchema = z.array(edificioSchema);

export type Edificio = z.infer<typeof edificioSchema>;
export type EdificioList = z.infer<typeof edificioListSchema>;
