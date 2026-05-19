import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  brand: string;

  @IsString()
  description: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  price: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsArray()
  imageUrls?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateProductDto extends CreateProductDto {}
