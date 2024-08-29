import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeormconfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'pguser',
  password: 'pgpassword',
  database: 'localhost',
  schema: 'nest_api',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};
