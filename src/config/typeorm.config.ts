import {DataSource, DataSourceOptions} from 'typeorm';
import {Logger} from '@nestjs/common';
import {SnakeNamingStrategy} from 'typeorm-naming-strategies';
import { DB_HOST, DB_PORT, DB_USERNAME, DB_PASS, DB_NAME} from 'src/config/env.config';


export const typeormConfig: DataSourceOptions = {
  type: 'postgres',
  entities: [process.cwd() + '/dist/models/*.entity.{js,ts}'
],
  migrations: [process.cwd() + '/database/migrations/*.entity.{js,ts}'],
  synchronize: true,
  migrationsRun: false,
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASS,
  database: DB_NAME,
  namingStrategy: new SnakeNamingStrategy(),
  extra: {
    // ssl:
    //   process.env.NODE_ENV === 'production' ||
    //   process.env.NODE_ENV === 'staging' ||
    //   process.env.NODE_ENV === 'development',
    ssl: {
      rejectUnauthorized: false // You might need this if you're using a self-signed certificate
    }
  },
  ssl: true,
};

export const AppDataSource = new DataSource(typeormConfig);
 
AppDataSource.initialize().then((r) =>
  Logger.log('[DATABASE] connection successful'),
);
