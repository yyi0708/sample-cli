import { injectable, inject, TYPES, IReader } from 'IOC/index'
import { currentDirConfigFile, appConfigFilePath, createConfigFilePath, openConfigFilePath } from 'Lib/utils'

@injectable()
export class UserConfig implements Config.IConfig {
  @inject(TYPES.LibReader) private _fileRead: IReader
  private _localConfig: string = currentDirConfigFile

  public appConfigPath:string = appConfigFilePath
  public projectConfigPath:string = createConfigFilePath
  public openConfigPath:string = openConfigFilePath

  // 当前目录下配置文件的操作
  get currentConfig() {
    return this._localConfig
  }
  set currentConfig(path: string) {
    this._localConfig = path
  }
  public async read<k extends keyof Config.UserConfig>(
    key: k
  ): Promise<Config.UserConfig[k]> {
    const result = await this.list()
    return result[key]
  }
  public async write<k extends keyof Config.UserConfig>(
    key: k,
    val: Config.UserConfig[k]
  ): Promise<void> {
    const result = await this.list()
    result[key] = val

    await this._fileRead.writeJson<Config.UserConfig>(
      this._localConfig,
      result,
      true
    )
  }
  public async list(): Promise<Config.UserConfig> {
    const result = await this._fileRead.readJson<Config.UserConfig>(
      this._localConfig,
      true
    )

    return result
  }

  // 本地默认配置文件
  public async getConfig<k extends keyof Config.UserConfig>(key: k): Promise<Config.UserConfig[k]> {
    switch (key) {
      case 'app':
        return (await this._fileRead.readJson<Config.UserConfig[k]>(
          this.appConfigPath,
          true
        ))
      case 'create':
        return (await this._fileRead.readJson<Config.UserConfig[k]>(
          this.projectConfigPath,
          true
        ))
      case 'open':
        return (await this._fileRead.readJson<Config.UserConfig[k]>(
          this.openConfigPath,
          true
        ))
      default:
        throw new TypeError(`暂不支持${key}类型存储！`)
    }
  }

  public async rewriteConfig<k extends keyof Config.UserConfig>(key: k, val: Config.UserConfig[k]): Promise<void> {
    switch (key) {
      case 'app':
        await this._fileRead.writeJson<Config.UserConfig[k]>(
          this.appConfigPath,
          val,
          true
        )
        break
      case 'create':
        await this._fileRead.writeJson<Config.UserConfig[k]>(
          this.projectConfigPath,
          val,
          true
        )
        break
      case 'open':
        await this._fileRead.writeJson<Config.UserConfig[k]>(
          this.openConfigPath,
          val,
          true
        )
        break
      default:
        throw new TypeError(`暂不支持${key}类型存储！`)
    }
  }

}
