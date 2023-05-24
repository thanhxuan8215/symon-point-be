import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { Group } from './group';
import { Member } from './member';
import { Receive } from './receive';
import { Spent } from './spent';

@Entity('stores')
export class Store extends BaseEntity {
  @Column({
    length: 255,
    default: '',
  })
  name: string;

  @Column({
    default: '',
  })
  outSystemId: string;

  @Column({
    nullable: true,
  })
  descriptions: string;

  @Column({})
  groupId: string;

  @OneToMany(() => Receive, (receive) => receive.store)
  receive: Receive[];

  @OneToMany(() => Spent, (spent) => spent.store)
  spent: Spent[];

  @ManyToOne(() => Group, (group) => group.store)
  group: Group;

  @OneToMany(() => Member, (member) => member.store)
  member: Member[];
}
