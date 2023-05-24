import { AddressType } from './enums';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { Member } from './member';
import { Receive } from './receive';
import { Spent } from './spent';
import { Secret } from 'src/shared/interfaces/secret.interface';

@Entity('addresses')
export class Address extends BaseEntity {
  @Column({
    length: 255,
    nullable: false,
    default: '',
  })
  address: string;

  @Column({
    type: 'enum',
    enum: AddressType,
    default: AddressType.Normal,
  })
  type: AddressType;

  @Column({
    nullable: false,
    default: '',
  })
  outSystemId: string;

  @Column({
    type: 'jsonb',
    default: '{}',
  })
  secret: Secret;

  // @OneToMany(() => Receive, (receive) => receive.address)
  // receive: Receive[];

  // @OneToMany(() => Spent, (spent) => spent.address)
  // spent: Spent[];

  // @OneToMany(() => Member, (member) => member.address)
  // member: Member[];
}
