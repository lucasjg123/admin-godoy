import { Prisma } from '@prisma/client';

export type ExpensaPdf = Prisma.expensasGetPayload<{
  include: {
    departamentos: {
      include: {
        departamentos_titulares: {
          include: {
            titulares: true;
          };
        };
        edificios: {
          include: {
            gastoscomunes: true;
          };
        };
      };
    };
  };
}>;
