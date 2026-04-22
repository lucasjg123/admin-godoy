import {
  IsNumber,
  IsOptional,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';

export class CreateGastoComunDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  monto_gc?: number;

  @IsOptional()
  @IsDateString()
  vto1_gc?: string;

  @IsOptional()
  @IsDateString()
  vto2_gc?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  interes_gc?: number;

  @IsInt()
  id_edif: number;
}
