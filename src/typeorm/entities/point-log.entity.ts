import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { AppId, PointLogType } from './enums';
import { Point } from './point.entity';

@Entity('point_logs')
export class PointLog extends BaseEntity {
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

  @Column({})
  pointId: string;

  @Column({
    type: 'enum',
    enum: PointLogType,
  })
  type: PointLogType;

  @Column({
    default: '',
  })
  deviceId: string;

  @Column({
    default: '',
  })
  customerId: string;

  @Column({
    default: null,
    type: 'enum',
    enum: AppId,
  })
  appId: AppId;

  @ManyToOne(() => Point, (point) => point.pointLog)
  point: Point;
}
