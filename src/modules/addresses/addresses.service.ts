import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/typeorm/entities';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressType } from 'src/typeorm/entities/enums';
import { KmsService } from 'src/kms/kms.service';
import { ConfigService } from '@nestjs/config';
import { KmsDataKey } from 'src/typeorm/entities/kms-data-key.entity';
import { Repository } from 'typeorm';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class AddressesService {
  private readonly logger = new Logger(AddressesService.name);
  constructor(
    private configService: ConfigService,
    @InjectRepository(Address) private readonly addressRepository: Repository<Address>,
    private readonly kmsService: KmsService,
    private readonly walletService: WalletService
  ) { }

  async findAll(): Promise<Address[]> {
    return this.addressRepository.find({
      select: ['id', 'address', 'type', 'outSystemId']
    });
  }

  async create(createAddressDto: CreateAddressDto): Promise<string> {
    if (createAddressDto.type === AddressType.Master) {
      const isExist = await this.addressRepository.findOne({ where: { type: AddressType.Master } });
      if (isExist) {
        throw new BadRequestException('Must unique a address master');
      }
    }
    const wallet = await this.walletService.createWallet();

    let privateKey = wallet.privateKey;
    let kmsDataKeyId = '';
    const keyId = this.configService.get('KMS_KEY_ID');
    if (keyId) {
      const encryptData = await this.kmsService.encrypt(privateKey, keyId);
      privateKey = encryptData.cipherText;
      const iv = encryptData.iv;

      const encryptedDataKey = encryptData.cipherDataKey;
      const kmsDataKeyRepository = this.addressRepository.manager.getRepository(KmsDataKey);
      const kmsDataKey = await kmsDataKeyRepository.save({ keyId, encryptedDataKey, iv });
      kmsDataKeyId = kmsDataKey.id;
    }

    const secret = { privateKey, kmsDataKeyId };

    await this.addressRepository.save({
      address: wallet.address,
      secret: secret,
      type: createAddressDto.type,
    });
    return wallet.address;
  }

  async findOne(id: string): Promise<Address> {
    const address = await this.addressRepository.findOne({ where: { id }, relations: ['member'] });
    if (!address) {
      throw new HttpException('Address not found', HttpStatus.NOT_FOUND);
    }

    return address;
  }
}
