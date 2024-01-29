import { injectable, inject, TYPES, IReader } from 'IOC/index'
import { sqlitePath } from 'Tools/utils'
import { DataSource, getDataSource } from 'Tools/database'

@injectable()
export class UserConfig implements Config.IConfig {
  @inject(TYPES.LibReader) private _fileRead: IReader

  public dataBasePath:string = sqlitePath
  public dataSource:DataSource

  public async getDb(): Promise<DataSource> {
    return await getDataSource()
  }

  // 本地默认配置文件
  public async getConfig<k extends keyof Config.UserConfig>(key: k): Promise<Config.UserConfig[k]> {
    switch (key) {
      case 'app':
        return (await this._fileRead.readJson<Config.UserConfig[k]>(
          '',
          true
        ))
      case 'create':
        return (await this._fileRead.readJson<Config.UserConfig[k]>(
          '',
          true
        ))
      case 'open':
        return (await this._fileRead.readJson<Config.UserConfig[k]>(
          '',
          true
        ))
      default:
        throw new TypeError(`暂不支持${key}类型存储！`)
    }
  }

}
