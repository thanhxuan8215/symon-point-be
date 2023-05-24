import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { Level } from './level';
import { Member } from './member';
import { Receive } from './receive';
import { Store } from './store';

@Entity('groups')
export class Group extends BaseEntity {
    @Column({
        default: '',
    })
    name: string;

    @Column({
        nullable: true,
    })
    parentId: string;

    @Column({
        nullable: true,
    })
    descriptions: string;

    @Column({})
    levelId: string;

    @OneToMany(() => Store, (store) => store.group)
    store: Store[];

    @ManyToOne(() => Level, (level => level.group))
    level: Level;

    @OneToMany(() => Member, (member => member.group))
    member: Member[];

    @OneToMany(() => Receive, (receive) => receive.group)
    receive: Receive[];
}
