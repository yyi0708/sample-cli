import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

export enum MoudleType {
    SNIPPET = "snippet",
    REMOTE = "remote",
    MODULE = "module"
}

@Entity()
export class AsyncModule extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column('varchar', {
        unique: true
    })
    name: string

    @Column("simple-array", {
        nullable: true
    })
    depend: Array<string>

    @Column("simple-array", {
        nullable: true
    })
    dev_depend: Array<string>

    @Column("text", {
        nullable: true,
        default: null
    })
    snippet_code: string

    @Column("simple-array", {
        nullable: true,
        default: null
    })
    snippet_name: string[]

    @Column('varchar', {
        nullable: true,
        default: null
    })
    remote_address: string

    @Column("simple-array", {
        nullable: true,
        default: null
    })
    scripts: string[]

    @Column('varchar', { nullable: true, default: 'module' })
    type: string

    @Column('varchar', { nullable: true, default: '' })
    tips: string

    @Column({ type: 'int', nullable: true })
    createdAt: number;
}