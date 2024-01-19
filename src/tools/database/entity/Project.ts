import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

export enum ProjectType {
    ORDER = "order",
    REMOTE = "remote"
}

export type RepoType = 'github' | 'gitlab' | 'bitbucket'

@Entity()
export class Project extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column('varchar', {
        unique: true
    })
    name: string

    @Column('varchar')
    content: string

    @Column({
        type: "enum",
        enum: ProjectType,
        default: ProjectType.REMOTE
    })
    type: ProjectType

    @Column('varchar', {
        nullable: true,
        default: null
    })
    tips: string

    @Column({
        type: "enum",
        enum: ["github", "gitlab", "bitbucket"],
        nullable: true,
        default: "github"
    })
    repoType: RepoType

    @Column({ type: 'datetime' })
    createdAt: Date;
}