import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { BigintTransformer } from './bigint-transformer';
import { PointLog } from './point-log.entity';

@Entity('points')
export class Point extends BaseEntity {
  @Column({
    type: 'bigint',
    default: 0,
    transformer: new BigintTransformer()
  })
  balance: number;

  @Column({
    default: '',
  })
  customerId: string;

  @Column({
    type: 'timestamptz',
  })
  expireAt: Date;

  @OneToMany(
    () => PointLog,
    (pointLog) => pointLog.point,
  )
  pointLog: PointLog[];
}
