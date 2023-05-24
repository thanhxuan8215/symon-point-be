import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Address, Transaction, TransactionLog } from 'src/typeorm/entities';
import {
  AddressType,
  PointLogType,
  TransactionLogType,
  TransactionStatus,
  TransactionType,
} from 'src/typeorm/entities/enums';
import { In, LessThan, MoreThan, Repository } from 'typeorm';
import { PointsService } from '../points/points.service';
import { KmsService } from 'src/kms/kms.service';
import { KmsDataKey } from 'src/typeorm/entities/kms-data-key.entity';
import { ConfigService } from '@nestjs/config';
import { WalletService } from '../wallet/wallet.service';
import { Point } from 'src/typeorm/entities/point.entity';
import { PointLog } from 'src/typeorm/entities/point-log.entity';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(
    private configService: ConfigService,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(TransactionLog)
    private readonly transactionLogRepository: Repository<TransactionLog>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly pointsService: PointsService,
    private readonly kmsService: KmsService,
    private readonly walletService: WalletService,
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
    @InjectRepository(PointLog)
    private readonly pointLogRepository: Repository<PointLog>,
  ) {}
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updatePointCron() {
    await this.updateExpiredPoints();
    const totalPoint = await this.pointsService.getTotalPoint();
    const { secret, address } = await this.addressRepository.findOne({
      where: { type: AddressType.Master },
    });

    const keyId = this.configService.get('KMS_KEY_ID');
    let privateKey = secret.privateKey;
    if (keyId && secret.kmsDataKeyId) {
      const kmsDataKeyRepository =
        this.addressRepository.manager.getRepository(KmsDataKey);
      const kmsDataKey = await kmsDataKeyRepository.findOne({
        where: { id: secret.kmsDataKeyId },
      });
      privateKey = await this.kmsService.decrypt(
        secret.privateKey,
        kmsDataKey.encryptedDataKey,
        kmsDataKey.iv,
      );
    }

    const addressBalance = await this.walletService.getAddressBalance(address);
    let point = 0;
    if (addressBalance) {
      point = +addressBalance.point;
    }
    const diffPoint = totalPoint - point;
    if (!diffPoint) {
      this.logger.log('Point amount unchanged.');
      return;
    }

    const body = {
      amount: diffPoint,
      address: address,
      privateKey,
    };
    const txid = await this.walletService.mint(body);
    const transaction = await this.transactionRepository.save({
      fromAddress: '',
      toAddress: address,
      txid,
      amount: diffPoint,
      fee: 0,
      type: diffPoint > 0 ? TransactionType.Mint : TransactionType.Burn,
      status: TransactionStatus.Submitted,
      blockNumber: null,
      blockHash: null,
      blockTime: null,
      data: null,
    });
    await this.transactionLogRepository.save({
      transactionId: transaction.id,
      status: TransactionLogType.Submitted,
      data: null,
    });
  }

  async updateExpiredPoints(): Promise<void> {
    const now = new Date();
    const points = await this.pointRepository.find({
      where: {
        expireAt: LessThan(now),
        balance: MoreThan(0),
      },
    });
    if (points.length) {
      const pointIds = points.map((point) => point.id);
      await this.pointRepository.update({ id: In(pointIds) }, { balance: 0 });
      const pointLogs = points.map((point) => ({
        pointId: point.id,
        amount: -point.balance,
        balance: 0,
        type: PointLogType.Expired,
        customerId: point.customerId,
      }));
      await this.pointLogRepository.save(pointLogs);
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async verifyTxCron() {
    const submittedTxs = await this.transactionRepository.find({
      where: { status: TransactionStatus.Submitted },
    });
    const latestBlock = await this.walletService.getLatestBlock();
    const confirmedBlock = +this.configService.get('CONFIRMED_BLOCK') || 10;
    for (let index = 0; index < submittedTxs.length; index++) {
      const submittedTx = submittedTxs[index];
      const transaction = await this.walletService.getTransactionByTxid(
        submittedTx.txid,
      );
      this.logger.log('verifyTxCron', submittedTx.txid);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (!transaction) {
        continue;
      }
      if (+latestBlock.height - +transaction.block_height >= confirmedBlock) {
        await this.transactionRepository.update(
          {
            id: submittedTx.id,
          },
          {
            txid: transaction.hash,
            blockNumber: +transaction.block_height,
            blockHash: transaction.block,
            blockTime: new Date(transaction.block_time * 1000),
            fee: +transaction.fees,
            status: TransactionStatus.Confirmed,
          },
        );
        await this.transactionLogRepository.save({
          transactionId: submittedTx.id,
          status: TransactionLogType.Confirmed,
          data: null,
        });
      }
    }
  }
}
