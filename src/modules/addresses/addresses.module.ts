import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KmsModule } from 'src/kms/kms.module';
import { Address } from 'src/typeorm/entities';
import { WalletModule } from '../wallet/wallet.module';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Address]),
    KmsModule,
    WalletModule
  ],
  controllers: [AddressesController],
  providers: [AddressesService],
  exports: [AddressesService],
})
export class AddressesModule { }
