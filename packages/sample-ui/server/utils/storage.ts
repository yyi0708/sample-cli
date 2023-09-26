import { JSONFile } from 'lowdb/node'
import { Low } from 'lowdb'
import { appConfigFilePath, createConfigFilePath, openConfigFilePath } from '@/server/utils'

// @ts-ignore
class BaseStorage<T> implements JsonStorage.BaseOpt<T>  {
    private db: Low<T>

    constructor(public filePath: string, public defaultData: T) {
        const adapter = new JSONFile<T>(this.filePath)
        const db = new Low<T>(adapter, this.defaultData)
        this.db = db
    }

    protected async read(): Promise<T | null> {
        await this.db.read()
        return this.db.data
    }

    protected async write(data: T): Promise<T | null> {
        await this.db.read()
        this.db.data = data
        await this.db.write()

        return data
    }
}

// app.config.json
export class AppStorage extends BaseStorage<Template.ConfigBaseType> implements JsonStorage.AppConfig {
    constructor() {
        super(appConfigFilePath, { resourceType: null })
    }

    public async list(): Promise<Template.ConfigBaseType | null> {
        return this.read()
    }
    // change app config
    public async opt<T extends keyof Template.ConfigBaseType>(filed: T , value: Template.ConfigBaseType[T]): Promise<void> {
        const config = (await this.list())!

        config[filed] = value
        
        await this.write(config)
    }
}

// create.config.json
export class ProjectStorage extends BaseStorage<Template.ConfigCreateType> implements JsonStorage.CreateConfig {
    constructor() {
        super(createConfigFilePath, { template: [] })
    }

    public async list(): Promise<Template.ConfigCreateType | null> {
        return this.read()
    }

    public async add(target: Template.CreateRow | Template.CreateRow[]): Promise<void> {
        const { template } = (await this.list())!

        if(Array.isArray(target)) {
            target.forEach(item => {
                const index = template.findIndex(v => v.name === item.name)
                // 若无，则添加
                if (index === -1) {
                    template.push(item)
                }
            })
        } else {
            const index = template.findIndex(v => v.name === target.name)
            if (index === -1) {
                template.push(target)
            }
        }

       await this.write({
        template
       })
    }
}

// open.config.json
export class OpenStorage extends BaseStorage<Template.ConfigOpenType> implements JsonStorage.OpenConfig {
    constructor() {
        super(openConfigFilePath, { template: [] })
    }

    public async list(): Promise<Template.ConfigOpenType | null> {
        return this.read()
    }

    public async add(target: Template.RowLink<Template.BelongType> | Template.RowLink<Template.BelongType>[]): Promise<void> {
        const { template } = (await this.list())!

        if(Array.isArray(target)) {
            target.forEach(item => {
                const index = template.findIndex(v => v.title === item.title)
                // 若无，则添加
                if (index === -1) {
                    template.push(item)
                }
            })
        } else {
            const index = template.findIndex(v => v.title === target.title)
            if (index === -1) {
                template.push(target)
            }
        }

       await this.write({
        template
       })
    }
}