import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KmsModule } from 'src/kms/kms.module';
import {
  Address,
  Receive,
  Transaction,
  TransactionLog,
} from 'src/typeorm/entities';
import { PointLog } from 'src/typeorm/entities/point-log.entity';
import { Point } from 'src/typeorm/entities/point.entity';
import { PointsModule } from '../points/points.module';
import { WalletModule } from '../wallet/wallet.module';
import { CronService } from './cron.service';

@Module({
  providers: [CronService],
  imports: [
    TypeOrmModule.forFeature([
      Receive,
      Address,
      Transaction,
      TransactionLog,
      Point,
      PointLog,
    ]),
    PointsModule,
    KmsModule,
    WalletModule,
  ],
  exports: [CronService],
})
export class CronModule {}
