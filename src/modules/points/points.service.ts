import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Receive,
  Spent,
  SpentDetail,
  Member,
  Transaction,
  TransactionLog,
  Address,
} from 'src/typeorm/entities';
import {
  AddressType,
  AppId,
  PointLogType,
  ReceiveStatus,
  ReceiveType,
  SpentType,
  TransactionLogType,
  TransactionStatus,
  TransactionType,
} from 'src/typeorm/entities/enums';
import {
  Between,
  ILike,
  MoreThanOrEqual,
  Repository,
  In,
  LessThan,
  Like,
} from 'typeorm';
import { CancelPointDto } from './dto/cancel-point.dto';
import { GrantPointDto } from './dto/grant-point.dto';
import { ExchangePointDto } from './dto/exchange-point.dto';
import { StoresService } from '../stores/stores.service';
import { GroupsService } from '../groups/groups.service';
import { Point } from 'src/typeorm/entities/point.entity';
import { PointLog } from 'src/typeorm/entities/point-log.entity';
import { SymonPointService } from '../symon-point/symon-point.service';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { convertYYYYMMDDToDate } from 'src/shared/utils';
import { SyncPointDto } from './dto/sync-point.dto';
import { GetPointLogsDto } from './dto/get-point-logs';
import { GetTransactionsDto } from './dto/get-transactions';
import { GetDeviceStatisticalDto } from './dto/get-device-statistical.dto';
import { GetDevicesStatisticalDto } from './dto/get-devices-statistical.dto';
import { GetCustomersStatisticalDto } from './dto/get-customers-statistical.dto';
import { GetCustomerStatisticalDto } from './dto/get-customer-statistical.dto';
import * as moment from 'moment';
import { WalletService } from '../wallet/wallet.service';
import { KmsService } from 'src/kms/kms.service';
import { ConfigService } from '@nestjs/config';
import { KmsDataKey } from 'src/typeorm/entities/kms-data-key.entity';

@Injectable()
export class PointsService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Receive)
    private readonly receiveRepository: Repository<Receive>,
    @InjectRepository(Spent)
    private readonly spentRepository: Repository<Spent>,
    @InjectRepository(SpentDetail)
    private readonly spentDetailRepository: Repository<SpentDetail>,
    private readonly storesService: StoresService,
    private readonly groupsService: GroupsService,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(PointLog)
    private readonly pointLogRepository: Repository<PointLog>,
    private readonly symonPointService: SymonPointService,
    private readonly walletService: WalletService,
    @InjectRepository(TransactionLog)
    private readonly transactionLogRepository: Repository<TransactionLog>,
    private readonly kmsService: KmsService,
  ) {}

  async syncPoint(syncPointDto: SyncPointDto): Promise<HttpStatus> {
    const point = await this.pointRepository.findOne({
      where: { customerId: syncPointDto.customerId },
    });
    if (!point) {
      throw new NotFoundException('customerId');
    }
    const data = await this.symonPointService.inquiryPoint(
      syncPointDto.customerId,
    );
    if (!data || data.status !== 0) {
      throw new BadRequestException('Inquiry point failed');
    }
    const balanceDb = point.balance;
    const balanceNode = +data.pbalance;
    if (balanceDb !== balanceNode) {
      await this.pointRepository.update(
        {
          customerId: syncPointDto.customerId,
        },
        { balance: balanceNode },
      );
      await this.pointLogRepository.save({
        pointId: point.id,
        amount: balanceNode - balanceDb,
        balance: balanceNode,
        type: PointLogType.Sync,
      });
    }
    return HttpStatus.OK;
  }

  async createPoint(createPointDto: CreatePointDto): Promise<HttpStatus> {
    let point = await this.pointRepository.findOne({
      where: { customerId: createPointDto.customerId },
    });
    if (point) {
      return HttpStatus.OK;
    }

    const data = await this.symonPointService.inquiryPoint(
      createPointDto.customerId,
    );
    if (!data || data.status !== 0) {
      throw new BadRequestException('Inquiry point failed');
    }

    const expireAt = convertYYYYMMDDToDate(data.estimate.toString());
    const balance = data.pbalance;
    point = await this.pointRepository.save({
      customerId: createPointDto.customerId,
      balance,
      expireAt,
    });

    await this.pointLogRepository.save({
      pointId: point.id,
      amount: balance,
      balance,
      type: PointLogType.Init,
      appId: AppId.Manage,
      customerId: createPointDto.customerId,
    });
    return HttpStatus.OK;
  }

  async updatePoint(updatePointDto: UpdatePointDto): Promise<HttpStatus> {
    // Now we just handle for Kameiten and Symon Manage app
    if (![AppId.Kameiten, AppId.Manage].includes(updatePointDto.appId)) {
      return HttpStatus.OK;
    }
    const deviceId = updatePointDto.deviceId;
    let point = await this.pointRepository.findOne({
      where: { customerId: updatePointDto.customerId },
    });
    let amount = updatePointDto.amount;
    if (
      [
        PointLogType.Cansel,
        PointLogType.Detach,
        PointLogType.Exchange,
      ].includes(updatePointDto.type)
    ) {
      amount = -updatePointDto.amount;
    }
    if (!point) {
      const data = await this.symonPointService.inquiryPoint(
        updatePointDto.customerId,
      );
      if (!data || data.status !== 0) {
        throw new BadRequestException('Inquiry point failed');
      }
      const expireAt = convertYYYYMMDDToDate(data.estimate.toString());
      const balance = data.pbalance;
      point = await this.pointRepository.save({
        customerId: updatePointDto.customerId,
        balance: balance != 0 ? balance : amount,
        expireAt,
      });
      await this.pointLogRepository.save({
        pointId: point.id,
        amount: balance != 0 ? balance - amount : 0,
        balance: balance != 0 ? balance - amount : 0,
        type: PointLogType.Init,
        deviceId,
        appId: updatePointDto.appId,
        customerId: updatePointDto.customerId,
      });
      await this.pointLogRepository.save({
        pointId: point.id,
        amount: amount,
        balance: balance != 0 ? balance : amount,
        type: updatePointDto.type,
        deviceId,
        appId: updatePointDto.appId,
        customerId: updatePointDto.customerId,
      });
      return HttpStatus.OK;
    }

    const balance = point.balance + amount;
    await this.pointRepository.update(
      {
        customerId: updatePointDto.customerId,
      },
      { balance },
    );

    await this.pointLogRepository.save({
      pointId: point.id,
      amount,
      balance,
      type: updatePointDto.type,
      deviceId,
      appId: updatePointDto.appId,
      customerId: updatePointDto.customerId,
    });

    return HttpStatus.OK;
  }

  async getTotalPoint(): Promise<number> {
    const pointHistories = await this.pointRepository.find();
    if (!pointHistories.length) {
      return 0;
    }
    return pointHistories.reduce((acc, obj) => {
      return acc + obj.balance;
    }, 0);
  }

  async getPoint(addressId?: string): Promise<number> {
    const receiveHistories = await this.receiveRepository.find({
      where: {
        addressId: addressId,
        status: ReceiveStatus.Active,
        expireAt: MoreThanOrEqual(new Date()),
      },
      order: { expireAt: 'ASC' },
    });
    if (!receiveHistories.length) {
      return 0;
    }

    // Check point available
    const pointAvailable = receiveHistories.reduce((acc, obj) => {
      return acc + obj.balance;
    }, 0);
    return pointAvailable;
  }

  async cancelPoint(cancelPointDto: CancelPointDto): Promise<HttpStatus> {
    const receive = await this.receiveRepository.findOne({
      where: { id: cancelPointDto.receiveId },
    });
    if (!receive) {
      throw new NotFoundException('receiveId');
    }
    // Cancel point
    await this.receiveRepository.save({
      id: receive.id,
      balance: 0,
      status: ReceiveStatus.Cancel,
    });
    return HttpStatus.OK;
  }

  async exchangePoint(exchangePointDto: ExchangePointDto): Promise<HttpStatus> {
    if (!exchangePointDto.id) {
      throw new NotFoundException('storeId/groupId error');
    }
    let storeInfo = undefined;
    let groupInfo = undefined;
    switch (exchangePointDto.type) {
      case ReceiveType.Store:
        storeInfo = await this.storesService.findOne(exchangePointDto.id);
        break;
      case ReceiveType.Group:
        groupInfo = await this.groupsService.findOne(exchangePointDto.id);
        break;
      default:
        throw new NotFoundException('id_not_found');
    }
    if (!storeInfo && !groupInfo) {
      throw new NotFoundException('id_not_found');
    }
    const member = await this.memberRepository.findOne({
      where: {
        addressId: exchangePointDto.addressId,
        storeId: storeInfo ? storeInfo.id : undefined,
        groupId: groupInfo ? groupInfo.id : undefined,
      },
    });
    if (!member) {
      throw new NotFoundException('member_not_include_store_group');
    }

    // Receives histories
    const receiveHistories = await this.receiveRepository.find({
      where: {
        addressId: exchangePointDto.addressId,
        expireAt: MoreThanOrEqual(new Date()),
      },
      order: { expireAt: 'ASC' },
    });
    if (!receiveHistories.length) {
      throw new NotFoundException('expire point');
    }

    // Check point available
    const pointAvailable = await this.getPoint(exchangePointDto.addressId);
    const exchangeAmount = exchangePointDto.amount;
    // Check point
    if (exchangeAmount > pointAvailable) {
      throw new BadRequestException('not enough points');
    }
    const spent = await this.spentRepository.save({
      storeId: storeInfo.id,
      addressId: exchangePointDto.addressId,
      amount: exchangeAmount,
      type: SpentType.Exchange,
    });
    let amountTmp = exchangeAmount;
    for (let index = 0; index < receiveHistories.length; index++) {
      const receive = receiveHistories[index];
      const receiveBalance = +receive.balance;
      const receiveAmount = +receive.amount;
      if (exchangeAmount > receiveBalance) {
        if (receiveAmount - amountTmp < 0) {
          amountTmp = Math.abs(receiveBalance - amountTmp);
          await this.spentDetailRepository.save({
            spent,
            receive,
            amount: receiveBalance,
          });
          await this.receiveRepository.save({
            id: receive.id,
            balance: 0,
          });
        } else {
          await this.spentDetailRepository.save({
            spent,
            receive,
            amount: amountTmp,
          });
          await this.receiveRepository.save({
            id: receive.id,
            balance: receiveBalance - amountTmp,
          });
          break;
        }
      } else {
        if (index === 0) {
          await this.spentDetailRepository.save({
            spent,
            receive,
            amount: exchangeAmount,
          });
        } else {
          await this.spentDetailRepository.save({
            spent,
            receive,
            amount: receiveBalance - exchangeAmount,
          });
        }
        await this.receiveRepository.save({
          id: receive.id,
          balance: receiveBalance - exchangeAmount,
        });
        break;
      }
    }
    return HttpStatus.OK;
  }

  async grantPoint(grantPointDto: GrantPointDto): Promise<HttpStatus> {
    let storeInfo = undefined;
    let groupInfo = undefined;
    switch (grantPointDto.type) {
      case ReceiveType.Store:
        storeInfo = await this.storesService.findOne(grantPointDto.id);
        break;
      case ReceiveType.Group:
        groupInfo = await this.groupsService.findOne(grantPointDto.id);
        break;
      default:
        throw new NotFoundException('id_not_found');
    }
    if (!storeInfo && !groupInfo) {
      throw new NotFoundException('id_not_found');
    }
    const member = await this.memberRepository.findOne({
      where: {
        addressId: grantPointDto.addressId,
        storeId: storeInfo ? storeInfo.id : undefined,
        groupId: groupInfo ? groupInfo.id : undefined,
      },
    });
    if (!member) {
      throw new NotFoundException('member_not_include_store_group');
    }
    groupInfo = await this.groupsService.findOne(
      member.store?.groupId || member.group?.id,
    );
    const levelInfo = groupInfo.level;
    const days = levelInfo.expire;
    const expireAt = new Date();
    // Calc expire
    expireAt.setDate(expireAt.getDate() + days);
    await this.receiveRepository.save({
      storeId: storeInfo?.id,
      groupId: groupInfo?.id,
      addressId: grantPointDto.addressId,
      type: grantPointDto.type,
      amount: grantPointDto.amount,
      balance: +grantPointDto.amount,
      expireAt,
      status: ReceiveStatus.Active,
    });
    return HttpStatus.OK;
  }

  async getPointLogs(queries: GetPointLogsDto) {
    const [pointLogs, count] = await this.pointLogRepository.findAndCount({
      where: {
        point: {
          customerId: queries.customerId && ILike(`%${queries.customerId}%`),
        },
        appId: queries.appId,
        deviceId: queries.deviceId && ILike(`%${queries.deviceId}%`),
        type: queries.type,
        createdAt:
          queries.startTime &&
          queries.endTime &&
          Between(queries.startTime, queries.endTime),
      },
      relations: ['point'],
      select: {
        point: {
          id: true,
          customerId: true,
          balance: true,
          expireAt: true,
        },
        amount: true,
        appId: true,
        balance: true,
        createdAt: true,
        deviceId: true,
        type: true,
        id: true,
      },
      take: +queries.limit,
      skip: +queries.offset,
      order: {
        createdAt: 'DESC',
      },
    });

    return { pointLogs, count };
  }

  async getAllPointLogs() {
    const pointLogs = await this.pointLogRepository.find({
      relations: ['point'],
      select: {
        point: {
          id: true,
          customerId: true,
          balance: true,
          expireAt: true,
        },
        amount: true,
        appId: true,
        balance: true,
        createdAt: true,
        deviceId: true,
        type: true,
        id: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return pointLogs;
  }

  async getTransactions(queries: GetTransactionsDto) {
    const [transactions, count] = await this.transactionRepository.findAndCount(
      {
        where: {
          txid: queries.txHash && ILike(`%${queries.txHash}%`),
          type: queries.type,
          status: queries.status,
          blockTime:
            queries.startTime &&
            queries.endTime &&
            Between(queries.startTime, queries.endTime),
        },
        take: +queries.limit,
        skip: +queries.offset,
        order: {
          blockTime: 'DESC',
        },
      },
    );
    return { count, transactions };
  }

  async getAllTransactions() {
    const transactions = await this.transactionRepository.find({
      order: {
        blockTime: 'DESC',
      },
    });
    return transactions;
  }

  async getDevicesStatistical(queries: GetDevicesStatisticalDto) {
    const devicesBuilder =
      this.pointLogRepository.createQueryBuilder('pointLog');
    const countBuilder = this.pointLogRepository.createQueryBuilder('pointLog');
    if (queries.deviceId) {
      devicesBuilder.where('pointLog.deviceId like :deviceId', {
        deviceId: `%${queries.deviceId}%`,
      });
      countBuilder.where('pointLog.deviceId like :deviceId', {
        deviceId: `%${queries.deviceId}%`,
      });
    }

    if (queries.startTime && queries.endTime) {
      devicesBuilder
        .andWhere('"createdAt" >= :startTime', {
          startTime: queries.startTime.toISOString(),
        })
        .andWhere('"createdAt" <= :endTime', {
          endTime: queries.endTime.toISOString(),
        });
      countBuilder
        .andWhere('"createdAt" >= :startTime', {
          startTime: queries.startTime.toISOString(),
        })
        .andWhere('"createdAt" <= :endTime', {
          endTime: queries.endTime.toISOString(),
        });
    }

    devicesBuilder
      .select('pointLog.deviceId', 'deviceId')
      .distinct(true)
      .skip(queries.offset)
      .take(queries.limit);

    const devices = await devicesBuilder.getRawMany();
    const deviceIds = devices.map((p) => p.deviceId);

    const { count } = await countBuilder
      .select('COUNT(DISTINCT("deviceId"))', 'count')
      .getRawOne();

    const results = await this.generateDevicesStatistical(deviceIds);

    return { results, count };
  }

  async getAllDevicesStatistical() {
    const devicesBuilder =
      this.pointLogRepository.createQueryBuilder('pointLog');

    devicesBuilder.select('pointLog.deviceId', 'deviceId').distinct(true);

    const devices = await devicesBuilder.getRawMany();
    const deviceIds = devices.map((p) => p.deviceId);

    const results = await this.generateDevicesStatistical(deviceIds);

    return results;
  }

  async generateDevicesStatistical(deviceIds: string[]) {
    const pointLogs = await this.pointLogRepository.find({
      where: {
        deviceId: In(deviceIds),
      },
      select: {
        deviceId: true,
        amount: true,
        type: true,
      },
    });

    const results = deviceIds.map((deviceId) => {
      const devicePointLogs = pointLogs.filter(
        (pl) => pl.deviceId === deviceId,
      );
      const result = {};
      result['deviceId'] = deviceId;
      Object.values(PointLogType).forEach((value) => {
        const tmpPointLogs = devicePointLogs.filter((pl) => pl.type === value);
        result[value] = tmpPointLogs.reduce(
          (sum, item) => sum + +item.amount,
          0,
        );
      });
      result['total'] = devicePointLogs.reduce(
        (sum, item) => sum + +item.amount,
        0,
      );
      return result;
    });

    return results;
  }

  async getDeviceStatistical(queries: GetDeviceStatisticalDto) {
    const customersBuilder = this.pointLogRepository
      .createQueryBuilder('pointLog')
      .where('pointLog.deviceId = :deviceId', { deviceId: queries.deviceId });
    const countBuilder = this.pointLogRepository
      .createQueryBuilder('pointLog')
      .where('pointLog.deviceId = :deviceId', { deviceId: queries.deviceId });
    if (queries.customerId) {
      customersBuilder.andWhere('pointLog.customerId like :customerId', {
        customerId: `%${queries.customerId}%`,
      });
      countBuilder.andWhere('pointLog.customerId like :customerId', {
        customerId: `%${queries.customerId}%`,
      });
    }

    customersBuilder
      .select('pointLog.customerId', 'customerId')
      .distinct(true)
      .skip(queries.offset)
      .take(queries.limit);

    const customers = await customersBuilder.getRawMany();
    const customerIds = customers.map((p) => p.customerId);

    const { count } = await countBuilder
      .select('COUNT(DISTINCT("customerId"))', 'count')
      .getRawOne();

    const pointLogs = await this.pointLogRepository.find({
      where: {
        customerId: In(customerIds),
        deviceId: queries.deviceId,
      },
      select: {
        customerId: true,
        amount: true,
        type: true,
      },
    });

    const results = customerIds.map((customerId) => {
      const customerPointLogs = pointLogs.filter(
        (pl) => pl.customerId === customerId,
      );
      const result = {};
      result['customerId'] = customerId;
      Object.values(PointLogType).forEach((value) => {
        const tmpPointLogs = customerPointLogs.filter(
          (pl) => pl.type === value,
        );
        result[value] = tmpPointLogs.reduce(
          (sum, item) => sum + +item.amount,
          0,
        );
      });
      result['total'] = customerPointLogs.reduce(
        (sum, item) => sum + +item.amount,
        0,
      );
      return result;
    });

    return { results, count };
  }

  async getCustomersStatistical(queries: GetCustomersStatisticalDto) {
    const customersBuilder =
      this.pointLogRepository.createQueryBuilder('pointLog');
    const countBuilder = this.pointLogRepository.createQueryBuilder('pointLog');
    if (queries.customerId) {
      customersBuilder.where('pointLog.customerId like :customerId', {
        customerId: `%${queries.customerId}%`,
      });
      countBuilder.where('pointLog.customerId like :customerId', {
        customerId: `%${queries.customerId}%`,
      });
    }

    if (queries.startTime && queries.endTime) {
      customersBuilder
        .andWhere('"createdAt" >= :startTime', {
          startTime: queries.startTime.toISOString(),
        })
        .andWhere('"createdAt" <= :endTime', {
          endTime: queries.endTime.toISOString(),
        });
      countBuilder
        .andWhere('"createdAt" >= :startTime', {
          startTime: queries.startTime.toISOString(),
        })
        .andWhere('"createdAt" <= :endTime', {
          endTime: queries.endTime.toISOString(),
        });
    }

    customersBuilder
      .select('pointLog.customerId', 'customerId')
      .distinct(true)
      .skip(queries.offset)
      .take(queries.limit);

    const customers = await customersBuilder.getRawMany();
    const customerIds = customers.map((p) => p.customerId);

    const { count } = await countBuilder
      .select('COUNT(DISTINCT("customerId"))', 'count')
      .getRawOne();

    const results = await this.generateCustomersStatistical(customerIds);

    return { results, count };
  }

  async getAllCustomersStatistical() {
    const customers = await this.pointLogRepository
      .createQueryBuilder('pointLog')
      .select('pointLog.customerId', 'customerId')
      .distinct(true)
      .getRawMany();

    const customerIds = customers.map((p) => p.customerId);

    const results = await this.generateCustomersStatistical(customerIds);

    return results;
  }

  async generateCustomersStatistical(customerIds: string[]) {
    const pointLogs = await this.pointLogRepository.find({
      where: {
        customerId: In(customerIds),
      },
      select: {
        customerId: true,
        amount: true,
        type: true,
      },
    });

    const results = customerIds.map((customerId) => {
      const customerPointLogs = pointLogs.filter(
        (pl) => pl.customerId === customerId,
      );
      const result = {};
      result['customerId'] = customerId;
      Object.values(PointLogType).forEach((value) => {
        const tmpPointLogs = customerPointLogs.filter(
          (pl) => pl.type === value,
        );
        result[value] = tmpPointLogs.reduce(
          (sum, item) => sum + +item.amount,
          0,
        );
      });
      result['total'] = customerPointLogs.reduce(
        (sum, item) => sum + +item.amount,
        0,
      );
      return result;
    });

    return results;
  }

  async getCustomerStatistical(
    customerId: string,
    queries: GetCustomerStatisticalDto,
  ) {
    const devicesBuilder = this.pointLogRepository
      .createQueryBuilder('pointLog')
      .where('pointLog.customerId = :customerId', { customerId });
    const countBuilder = this.pointLogRepository
      .createQueryBuilder('pointLog')
      .where('pointLog.customerId = :customerId', { customerId });
    if (queries.deviceId) {
      devicesBuilder.andWhere('pointLog.deviceId like :deviceId', {
        deviceId: `%${queries.deviceId}%`,
      });
      countBuilder.andWhere('pointLog.deviceId like :deviceId', {
        deviceId: `%${queries.deviceId}%`,
      });
    }

    devicesBuilder
      .select('pointLog.deviceId', 'deviceId')
      .distinct(true)
      .skip(queries.offset)
      .take(queries.limit);

    const devices = await devicesBuilder.getRawMany();
    const deviceIds = devices.map((p) => p.deviceId);

    const { count } = await countBuilder
      .select('COUNT(DISTINCT("deviceId"))', 'count')
      .getRawOne();

    const pointLogs = await this.pointLogRepository.find({
      where: {
        deviceId: In(deviceIds),
        customerId,
      },
      relations: ['point'],
      select: {
        deviceId: true,
        amount: true,
        type: true,
      },
    });

    const results = deviceIds.map((deviceId) => {
      const devicePointLogs = pointLogs.filter(
        (pl) => pl.deviceId === deviceId,
      );
      const result = {};
      result['deviceId'] = deviceId;
      Object.values(PointLogType).forEach((value) => {
        const tmpPointLogs = devicePointLogs.filter((pl) => pl.type === value);
        result[value] = tmpPointLogs.reduce(
          (sum, item) => sum + +item.amount,
          0,
        );
      });
      result['total'] = devicePointLogs.reduce(
        (sum, item) => sum + +item.amount,
        0,
      );
      return result;
    });

    return { results, count };
  }

  async createTransactions(
    fromDate: string,
    toDate: string,
    ignoreIndex: string,
  ) {
    const now = moment(fromDate),
      dates = [];
    while (now.isSameOrBefore(toDate)) {
      dates.push(now.format('yyyy-MM-DD') + 'T00:00:00.000Z');
      now.add(1, 'days');
    }

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

    let oldPoint = 0;
    for (let index = 0; index < dates.length; index++) {
      const date = dates[index];
      console.log('Date', dates[index]);
      const toDate = new Date(date);
      const pointLogs = await this.pointLogRepository.find({
        where: {
          createdAt: Between(new Date('2023-01-01'), toDate),
          customerId: Like(`${55}%`),
        },
        order: { createdAt: 'DESC' },
      });
      const customerIds = [];
      pointLogs.forEach((pl) => {
        if (!customerIds.some((id) => id === pl.customerId)) {
          customerIds.push(pl.customerId);
        }
      });
      const actualPointLogs = [];
      customerIds.forEach((id) => {
        const tmpPointLogs = pointLogs
          .filter((pl) => pl.customerId === id)
          .sort((a, b) => {
            if (a.createdAt < b.createdAt) {
              return 1;
            }
            if (a.createdAt > b.createdAt) {
              return -1;
            }
            return 0;
          });
        if (tmpPointLogs.length < 1) {
          console.log('Error1:', id);
        }
        actualPointLogs.push(tmpPointLogs[0]);
      });
      if (actualPointLogs.length !== customerIds.length) {
        console.log('Error2:', actualPointLogs.length, customerIds.length);
      }

      const totalPoint = actualPointLogs.reduce((acc, obj) => {
        return acc + +obj.balance;
      }, 0);
      // console.log(totalPoint, JSON.stringify(actualPointLogs));
      const amount = totalPoint - oldPoint;
      console.log(totalPoint, amount, toDate, actualPointLogs.length);
      oldPoint = totalPoint;

      if (amount !== 0 && index > +ignoreIndex) {
        const body = {
          amount,
          address: address,
          privateKey,
        };
        await new Promise((resolve) => setTimeout(resolve, 60000));
        const txid = await this.walletService.mint(body);
        const transaction = await this.transactionRepository.save({
          fromAddress: '',
          toAddress: address,
          txid,
          amount,
          fee: 0,
          type: amount > 0 ? TransactionType.Mint : TransactionType.Burn,
          status: TransactionStatus.Submitted,
          blockNumber: null,
          blockHash: null,
          blockTime: null,
          data: null,
          createdAt: toDate,
          updatedAt: toDate,
        });
        await this.transactionLogRepository.save({
          transactionId: transaction.id,
          status: TransactionLogType.Submitted,
          data: null,
          createdAt: toDate,
          updatedAt: toDate,
        });
      }
    }

    return this.getTotalPoint();
  }
}
