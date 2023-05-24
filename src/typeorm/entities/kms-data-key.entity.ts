import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base-entity';

@Entity('kms_data_keys')
export class KmsDataKey extends BaseEntity {
  @Column()
  keyId: string;

  @Column()
  encryptedDataKey: string;

  @Column()
  iv: string;
}
