import {
  IsString,
  IsOptional,
  IsEmail,
  IsInt,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { titulares_rol_tit } from '@prisma/client';

export class CreateTitularDto {
  @IsString()
  @MaxLength(50)
  nom_tit: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  ape_tit?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(50)
  email_tit?: string;

  @IsOptional()
  @IsInt()
  more_tit?: number; // default 0 en Prisma

  @IsEnum(titulares_rol_tit)
  rol_tit: titulares_rol_tit;
}
