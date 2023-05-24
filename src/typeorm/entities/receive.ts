import { ReceiveStatus, ReceiveType } from './enums';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { Address } from './address.entity';
import { Group } from './group';
import { SpentDetail } from './spent-detail';
import { Store } from './store';

@Entity('receives')
export class Receive extends BaseEntity {
  @Column({
    type: 'bigint',
    default: 0,
  })
  amount: number;

  @Column({
    type: 'bigint',
    default: 0,
  })
  balance: number;

  @Column({
    type: 'enum',
    enum: ReceiveType,
    default: ReceiveType.Store,
  })
  type: ReceiveType;

  @Column({
    type: 'timestamptz',
  })
  expireAt: Date;

  @Column({
    type: 'enum',
    enum: ReceiveStatus,
    default: ReceiveStatus.Active,
  })
  status: ReceiveStatus;

  @Column({})
  addressId: string;

  @Column({})
  storeId: string;

  @Column({})
  groupId: string;

  // @ManyToOne(() => Address, (address) => address.receive)
  // address: Address;

  @ManyToOne(() => Store, (store) => store.receive)
  store: Store;

  @ManyToOne(() => Group, (group) => group.receive)
  group: Group;

  @OneToMany(() => SpentDetail, (spentDetail) => spentDetail.receive)
  spentDetail: SpentDetail[];
}
