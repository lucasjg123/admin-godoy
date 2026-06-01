import { z } from 'zod';
import { departamentoSchema } from './departamento.schema';

export const expensaSchema = z.object({
  id_exp: z.number().int(),
  vto1_exp: z.number().nullable(),
  vto2_exp: z.number().nullable(),
  porcentual_exp: z.number().nullable(),
  id_depto: z.number().int(),
  nota_exp: z.string().nullable(),
  departamentos: departamentoSchema,
});

export const expensaListSchema = z.array(expensaSchema);
export const expensaUpdateSchema = expensaSchema
  .omit({ id_exp: true }) // el id no se actualiza
  .partial();

export type ExpensaUpdate = z.infer<typeof expensaUpdateSchema>;
export type Expensa = z.infer<typeof expensaSchema>;
export type ExpensaList = z.infer<typeof expensaListSchema>;
