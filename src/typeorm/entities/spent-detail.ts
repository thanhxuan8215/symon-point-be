import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { Receive } from './receive';
import { Spent } from './spent';

@Entity('spent_details')
export class SpentDetail extends BaseEntity {
  @Column({
    type: 'bigint',
  })
  amount: number;

  @Column({})
  spentId: string;

  @Column({})
  receiveId: string;

  @ManyToOne(() => Spent, (spent) => spent.spentDetail)
  spent: Spent;

  @ManyToOne(() => Receive, (receive) => receive.spentDetail)
  receive: Receive;
}
