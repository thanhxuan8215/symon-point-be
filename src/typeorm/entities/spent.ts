import { SpentType } from './enums';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { Address } from './address.entity';
import { SpentDetail } from './spent-detail';
import { Store } from './store';

@Entity('spents')
export class Spent extends BaseEntity {
  @Column({
    type: 'bigint',
  })
  amount: number;

  @Column({
    type: 'enum',
    enum: SpentType,
    default: SpentType.Exchange,
  })
  type: SpentType;

  @Column({})
  addressId: string;

  @Column({})
  storeId: string;

  @OneToMany(() => SpentDetail, (spentDetail) => spentDetail.spent)
  spentDetail: SpentDetail[];

  // @ManyToOne(() => Address, (address) => address.spent)
  // address: Address;

  @ManyToOne(() => Store, (store) => store.receive)
  store: Store;
}
