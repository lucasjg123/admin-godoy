import { z } from 'zod';
export const titularRolEnum = z.enum(['INQUILINO', 'PROPIETARIO', 'TITULAR']);
export type TitularRol = z.infer<typeof titularRolEnum>;
