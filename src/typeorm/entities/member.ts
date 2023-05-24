import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { Address } from './address.entity';
import { Group } from './group';
import { Store } from './store';

export enum MemberType {
  Store = 'store',
  Group = 'group',
}

@Entity('members')
export class Member extends BaseEntity {
  @Column({
    type: 'enum',
    enum: MemberType,
  })
  type: MemberType;

  @Column({})
  addressId: string;

  @Column({})
  storeId: string;

  @Column({})
  groupId: string;

  @ManyToOne(() => Address, (address) => address.address)
  address: Address;

  @ManyToOne(() => Store, (store) => store.member)
  store: Store;

  @ManyToOne(() => Group, (group) => group.member)
  group: Group;
}
