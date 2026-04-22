import {
  IsInt,
  IsArray,
  ArrayMinSize,
  IsString,
  MinLength,
  IsPositive,
} from 'class-validator';

export class CreateReciboDto {
  @IsInt()
  id_depto: number;

  @IsInt()
  id_tit: number;

  @IsString()
  @MinLength(4)
  anio: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  meses: string[];

  @IsString()
  @MinLength(5)
  mensaje: string;

  @IsPositive()
  monto: number;
}
