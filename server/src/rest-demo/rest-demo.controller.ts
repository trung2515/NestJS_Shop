import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/public.decorator';
import { SqlDemoDto } from './dto';
import { RestDemoService } from './rest-demo.service';

const sqlExamples = {
  get: [
    'SELECT p.id, p.name, p.brand, p.price, p.stock, c.name AS category',
    'FROM products p',
    'JOIN categories c ON c.id = p."categoryId"',
    'WHERE p."isActive" = true',
    'ORDER BY p.price DESC',
    'LIMIT 5',
  ].join(' '),
  post: [
    'INSERT INTO products (name, slug, brand, description, price, stock, "isActive", "categoryId", "createdAt", "updatedAt")',
    "SELECT 'Learning API Backpack', 'learning-api-backpack', 'NestShop',",
    "'Created by the POST SQL demo', 59.99, 20, true, c.id, NOW(), NOW()",
    'FROM categories c',
    'ORDER BY c.name',
    'LIMIT 1',
    'RETURNING id, name, slug, price, stock',
  ].join(' '),
  put: [
    'UPDATE products',
    "SET name = 'Learning API Backpack Pro',",
    "description = 'Replaced by the PUT SQL demo',",
    'price = 79.99, stock = 30, "updatedAt" = NOW()',
    "WHERE slug = 'learning-api-backpack'",
    'RETURNING id, name, slug, description, price, stock',
  ].join(' '),
  patch: [
    'UPDATE products',
    'SET stock = stock - 1, "updatedAt" = NOW()',
    "WHERE slug = 'learning-api-backpack' AND stock > 0",
    'RETURNING id, name, slug, stock',
  ].join(' '),
  delete: [
    'UPDATE products',
    'SET "isActive" = false, "updatedAt" = NOW()',
    "WHERE slug = 'learning-api-backpack'",
    'RETURNING id, name, slug, "isActive", "updatedAt"',
  ].join(' '),
};

@Public()
@ApiTags('REST API SQL Demo')
@Controller('rest-api-demo')
export class RestDemoController {
  constructor(private readonly restDemo: RestDemoService) {}

  @Post('get')
  @ApiOperation({ summary: 'Demo REST GET: run SELECT SQL and return rows from PostgreSQL' })
  @ApiBody({ type: SqlDemoDto, examples: { default: { value: { sql: sqlExamples.get } } } })
  get(@Body() dto: SqlDemoDto) {
    return this.restDemo.execute('GET', dto.sql);
  }

  @Post('post')
  @ApiOperation({ summary: 'Demo REST POST: run INSERT SQL and return created data' })
  @ApiBody({ type: SqlDemoDto, examples: { default: { value: { sql: sqlExamples.post } } } })
  post(@Body() dto: SqlDemoDto) {
    return this.restDemo.execute('POST', dto.sql);
  }

  @Post('put')
  @ApiOperation({ summary: 'Demo REST PUT: run UPDATE SQL as a full replacement' })
  @ApiBody({ type: SqlDemoDto, examples: { default: { value: { sql: sqlExamples.put } } } })
  put(@Body() dto: SqlDemoDto) {
    return this.restDemo.execute('PUT', dto.sql);
  }

  @Post('patch')
  @ApiOperation({ summary: 'Demo REST PATCH: run UPDATE SQL as a partial change' })
  @ApiBody({ type: SqlDemoDto, examples: { default: { value: { sql: sqlExamples.patch } } } })
  patch(@Body() dto: SqlDemoDto) {
    return this.restDemo.execute('PATCH', dto.sql);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Demo REST DELETE: run DELETE SQL and return deleted data' })
  @ApiBody({ type: SqlDemoDto, examples: { default: { value: { sql: sqlExamples.delete } } } })
  delete(@Body() dto: SqlDemoDto) {
    return this.restDemo.execute('DELETE', dto.sql);
  }
}
