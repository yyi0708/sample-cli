import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

export enum ProjectType {
    ORDER = "order",
    REMOTE = "remote"
}

export enum RepoType {
    GIT = "github",
    GITLAB = "gitlab",
    BITBUCKET = "bitbucket"
}

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

    @Column('varchar')
    type: string

    @Column('varchar', {
        nullable: true,
        default: null
    })
    tips: string

    @Column('varchar', {
        nullable: true,
        default: null
    })
    repoType: string

    @Column({ type: 'int', nullable: true })
    createdAt: number;
}