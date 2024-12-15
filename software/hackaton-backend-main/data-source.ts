// data-source.ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config(); // Carrega as variáveis de ambiente

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  // FIXME: Check if the entities need to have a condition too
  entities: [path.join(__dirname, '**/*.entity{.ts,.js}')],
  migrations: ['dist/src/migrations/*.js'],
  // migrations:
  // process.env.NODE_ENV === 'production'
  //   ? ['dist/src/migrations/*.js'] // Para produção (compilado)
  //   : ['src/migrations/*.entity.ts'], // Para desenvolvimento (código fonte)
  synchronize: false, // Nunca use synchronize em produção
  logging: true,
});
