import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class Link extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true
    })
    title: string

    @Column()
    submary: string

    @Column({
        nullable: true,
        default: null
    })
    doc: string

    @Column()
    link: string

    @Column("simple-array")
    belong: Array<string>

    @Column({ type: 'datetime' })
    createdAt: Date;
}