import open, { openApp, OpenAppOptions, Options } from 'open'
import { IOpen } from './interface'
import { injectable } from 'IOC/index'
import { Message } from '@/src/tools/ui'

@injectable()
export class Open implements IOpen {
  public async open(path: string, options?: Options): Promise<void> {
    await open(path, options)
  }

  public async openApp(
    target: string | readonly string[],
    options?: OpenAppOptions
  ): Promise<void> {
    Message.warn(
      '应用程序名称取决于平台. 详情查看：https://www.npmjs.com/package/open'
    )

    await openApp(target, options)
  }
}
