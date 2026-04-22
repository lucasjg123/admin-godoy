import { z } from 'zod';
import { edificioSchema } from './edificio.schema';
import { departamentoTitularSchema } from './departamento-titular.schema';

export const departamentoSchema = z.object({
  id_depto: z.number().int(),
  piso_depto: z.string(),
  letra_depto: z.string(),
  porc_depto: z.number().nullable(),
  id_edif: z.number().int(),
  edificios: edificioSchema,
  departamentos_titulares: z.array(departamentoTitularSchema),
});

export type Departamento = z.infer<typeof departamentoSchema>;

export const departamentoListSchema = z.array(departamentoSchema);
export type DepartamentoList = z.infer<typeof departamentoListSchema>;

export const departamentoSinEdificioSchema = departamentoSchema.omit({
  edificios: true,
});

export type DepartamentoSinEdificio = z.infer<
  typeof departamentoSinEdificioSchema
>;
