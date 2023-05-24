import { LevelType } from './enums';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { Group } from './group';

@Entity('levels')
export class Level extends BaseEntity {
  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  descriptions: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  expire: number;

  @Column({
    type: 'enum',
    enum: LevelType,
    default: LevelType.Symon,
  })
  order: LevelType;

  @OneToMany(() => Group, (group) => group.level)
  group: Group[];
}
