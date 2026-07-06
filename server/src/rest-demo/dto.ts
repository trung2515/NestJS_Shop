import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SqlDemoDto {
  @ApiProperty({
    description: 'Single PostgreSQL statement to run for this REST method.',
    example: 'SELECT id, name, slug, description FROM categories ORDER BY name;',
  })
  @IsString()
  @IsNotEmpty()
  sql: string;
}
