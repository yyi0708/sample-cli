import { Options, OpenAppOptions } from 'open'

export interface IOpen {
  open(path: string, options?: Options): Promise<void>
  openApp(
    target: string | readonly string[],
    options?: OpenAppOptions
  ): Promise<void>
}
