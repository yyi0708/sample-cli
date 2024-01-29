import { Options, OpenAppOptions, AppName } from 'open'

export interface IOpen {
  apps: Record<AppName, string | readonly string[]>
  open(path: string, options?: Options): Promise<void>
  openApp(
    target: string | readonly string[],
    options?: OpenAppOptions
  ): Promise<void>
}
