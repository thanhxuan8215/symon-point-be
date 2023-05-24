import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './logger/logger.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { HttpMiddleware } from './shared/middlewares/http.middleware';
import { PointsModule } from './modules/points/points.module';
import { LevelsModule } from './modules/levels/levels.module';
import { GroupsModule } from './modules/groups/groups.module';
import { StoresModule } from './modules/stores/stores.module';
import { KmsModule } from './kms/kms.module';
import entities from './typeorm/entities';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './modules/cron/cron.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: entities,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    LoggerModule,
    AddressesModule,
    PointsModule,
    LevelsModule,
    GroupsModule,
    StoresModule,
    CronModule,
    KmsModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
