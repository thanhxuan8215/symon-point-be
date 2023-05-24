import { Module } from '@nestjs/common';
import { PointsService } from './points.service';
import { PointsController } from './points.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Address,
  Member,
  Receive,
  Spent,
  SpentDetail,
  Transaction,
  TransactionLog,
} from 'src/typeorm/entities';
import { StoresModule } from '../stores/stores.module';
import { GroupsModule } from '../groups/groups.module';
import { AddressesModule } from '../addresses/addresses.module';
import { LevelsModule } from '../levels/levels.module';
import { Point } from 'src/typeorm/entities/point.entity';
import { PointLog } from 'src/typeorm/entities/point-log.entity';
import { SymonPointModule } from '../symon-point/symon-point.module';
import { WalletModule } from '../wallet/wallet.module';
import { KmsModule } from 'src/kms/kms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Receive,
      Spent,
      SpentDetail,
      Member,
      Point,
      PointLog,
      Transaction,
      TransactionLog,
      Address,
    ]),
    PointsModule,
    StoresModule,
    GroupsModule,
    AddressesModule,
    LevelsModule,
    SymonPointModule,
    WalletModule,
    KmsModule,
  ],
  controllers: [PointsController],
  providers: [PointsService],
  exports: [PointsService],
})
export class PointsModule {}
