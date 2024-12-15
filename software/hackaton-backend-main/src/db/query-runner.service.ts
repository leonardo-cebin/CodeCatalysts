import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class QueryRunnerService {
  constructor(private dataSource: DataSource) {}

  async getRawData() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const result = await queryRunner.query(`SELECT * FROM coeficientes`);
      return result;
    } finally {
      await queryRunner.release();
    }
  }
}
