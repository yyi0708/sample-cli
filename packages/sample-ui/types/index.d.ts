declare type CardType = 'project'| 'module' | 'open' | 'app'

declare interface ShowContent {
    [prop: string]: string
}

// 存储
declare namespace JsonStorage {
    // db opt
    export interface BaseOpt<T> {
        db: any
        filePath: string
        read(): Promise<T | null>;
        write(obj: T): Promise<T | null>;
    }
    // app.config
    export interface AppConfig {
        list(): Promise<Template.ConfigBaseType | null>;
        opt<T extends keyof Template.ConfigBaseType>(filed: T , value: Template.ConfigBaseType[T]): Promise<void>;
    }
    // create.config
    export interface CreateConfig {
        list(): Promise<Template.ConfigCreateType | null>;
        add(item: Template.CreateRow | Template.CreateRow[]): Promise<void>
    }
    // open.config
    export interface OpenConfig {
        list(): Promise<Template.ConfigOpenType | null>;
        add(item: Template.RowLink | Template.RowLink[]): Promise<void>
    }
}

// 数据模版
declare namespace Template {
    // OPEN - 基础语言/框架/工具库/想法/社区
    type BelongType =
      | 'Basic Language'
      | 'Framework'
      | 'Tools Library'
      | 'Idea'
      | 'Community'
      | 'awesome'

    export interface RowLink<T extends BelongType = BelongType> {
      title: string
      submary: string
      doc?: string
      link: string
      belong: Array<T>
    }
  
    // CREATE
    export interface CreateRow {
      name: string
      content: string
      type: 'order' | 'remote'
      tips?: string
      repoType?: 'github' | 'gitlab' | 'bitbucket'
    }

    // 配置文件基础信息
    export type ConfigBaseType = {
        resourceType: 'default' | 'custom' | null
    }
    export type ConfigCreateType = {
        template: Array<Template.CreateRow>
    }
    export type ConfigAddType = {}
    export type ConfigOpenType = {
        template: Array<Template.RowLink>
    }
  }