import { z } from 'zod';
import { titularRolEnum } from './titularRolEnum.schema';

export const titularSchema = z.object({
  id_tit: z.number().int(),
  nom_tit: z.string().trim().min(1, 'El nombre es obligatorio'),
  ape_tit: z.string().trim().nullable(),
  email_tit: z.email('Email inválido').trim().nullable(),
  more_tit: z.number().int(),
  rol_tit: titularRolEnum,
});
export const createTitularSchema = titularSchema.omit({
  id_tit: true,
});
export type Titular = z.infer<typeof titularSchema>;
export type CreateTitular = z.infer<typeof createTitularSchema>;
export type UpdateTitular = Partial<Titular>;
