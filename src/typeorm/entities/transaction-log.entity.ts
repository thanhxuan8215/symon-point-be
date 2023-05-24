import { TransactionLogType } from './enums';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { Transaction } from './transaction.entity';

@Entity('transaction_logs')
export class TransactionLog extends BaseEntity {
  @Column({
    type: 'enum',
    enum: TransactionLogType,
    default: TransactionLogType.Submitted,
  })
  status: TransactionLogType;

  @Column({
    nullable: true,
  })
  data: string;

  @Column({})
  transactionId: string;

  @ManyToOne(() => Transaction, (transaction) => transaction.transactionLog)
  transaction: Transaction;
}
