import { titularSchema } from './titulares.schema';
import z from 'zod';

export const departamentoTitularSchema = z.object({
  titulares: titularSchema,
});

export type DepartamentoTitular = z.infer<typeof departamentoTitularSchema>;
