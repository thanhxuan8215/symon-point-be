import { TransactionStatus, TransactionType } from './enums';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { TransactionLog } from './transaction-log.entity';

@Entity('transactions')
export class Transaction extends BaseEntity {
  @Column({
    default: '',
  })
  fromAddress: string;

  @Column({
    default: '',
  })
  toAddress: string;

  @Column({
    nullable: true,
  })
  txid: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  blockNumber: number;

  @Column({
    nullable: true,
  })
  blockHash: string;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  blockTime: Date;

  @Column({
    nullable: true,
  })
  data: string;

  @Column({
    type: 'bigint',
  })
  amount: number;

  @Column({
    type: 'bigint',
  })
  fee: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.Mint,
  })
  type: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    nullable: false,
    default: TransactionStatus.Submitted,
  })
  status: TransactionStatus;

  @OneToMany(
    () => TransactionLog,
    (transactionLog) => transactionLog.transaction,
  )
  transactionLog: TransactionLog[];
}
