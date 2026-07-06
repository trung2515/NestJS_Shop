import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

type RestSqlMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const allowedSqlKeywords: Record<RestSqlMethod, string[]> = {
  GET: ['SELECT', 'WITH'],
  POST: ['INSERT'],
  PUT: ['UPDATE'],
  PATCH: ['UPDATE'],
  DELETE: ['DELETE', 'UPDATE'],
};

@Injectable()
export class RestDemoService {
  constructor(private readonly dataSource: DataSource) {}

  async execute(method: RestSqlMethod, sql: string) {
    const normalizedSql = this.normalizeSql(sql);
    this.assertSqlMatchesMethod(method, normalizedSql);

    const data = await this.dataSource.query(normalizedSql);

    return {
      method,
      sql: normalizedSql,
      data,
    };
  }

  private normalizeSql(sql: string) {
    const normalized = sql.trim().replace(/;+\s*$/, '');
    if (!normalized) throw new BadRequestException('SQL is required');
    if (normalized.includes(';')) {
      throw new BadRequestException('Only one SQL statement is allowed');
    }
    if (/--|\/\*/.test(normalized)) {
      throw new BadRequestException('SQL comments are not allowed in this demo');
    }
    return normalized;
  }

  private assertSqlMatchesMethod(method: RestSqlMethod, sql: string) {
    const firstKeyword = sql.match(/^\s*([a-z]+)/i)?.[1]?.toUpperCase();
    if (!firstKeyword || !allowedSqlKeywords[method].includes(firstKeyword)) {
      throw new BadRequestException(
        `${method} demo only accepts SQL starting with: ${allowedSqlKeywords[method].join(', ')}`,
      );
    }
  }
}
