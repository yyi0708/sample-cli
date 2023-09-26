declare namespace Config {
  export type ConfigItem = 'base' | 'create' | 'add' | 'open'
  // 配置文件基础信息
  export type ConfigBaseType = {
    resourceType: 'default' | 'custom'
  }
  export type ConfigCreateType = {
    template: Array<Template.CreateRow>
  }
  export type ConfigAddType = {}
  export type ConfigOpenType = {
    template: Array<Template.RowLink>
  }

  // 配置参数
  export interface UserConfig {
    app: ConfigBaseType
    create?: ConfigCreateType
    add?: ConfigAddType
    open?: ConfigOpenType
  }
  // 可设置env，动态设置配置
  export interface ConfigEnv {
    mode: 'test' | 'serve'
  }
  export type UserConfigFn = (
    env: ConfigEnv
  ) => UserConfig | Promise<UserConfig>
  export type UserConfigExport = UserConfig | Promise<UserConfig> | UserConfigFn

  // 配置文件
  export interface IConfig {
    // 当前目录下，集成配置文件
    currentConfig: string
    read<k extends keyof UserConfig>(key: k): Promise<UserConfig[k]>
    write<k extends keyof UserConfig>(key: k, val: UserConfig[k]): Promise<void>
    list(): Promise<UserConfig>
    // 默认配置文件
    appConfigPath: string
    projectConfigPath: string
    openConfigPath:string
    getConfig<k extends keyof UserConfig>(key: k): Promise<UserConfig[k]>
    rewriteConfig<k extends keyof UserConfig>(key: k, val: UserConfig[k]): Promise<void>
  }
}
