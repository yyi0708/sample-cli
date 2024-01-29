import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class Link extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column('varchar', {
        unique: true
    })
    title: string

    @Column('varchar')
    submary: string

    @Column('varchar', {
        nullable: true,
        default: null
    })
    doc: string

    @Column('varchar')
    link: string

    @Column("simple-array")
    belong: Array<string>

    @Column({ type: 'int', nullable: true })
    createdAt: number;
}