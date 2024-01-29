import { injectable, inject, TYPES, IOpen } from 'IOC/index'
import { Message } from '../tools/ui'
import { join } from 'path'

enum OpenType {
  FILE = 'file',
  LINK = 'link',
  APP = 'app'
}

@injectable()
export class OpenAction implements Actions.IAction {
  @inject(TYPES.LibOpen) private _open: IOpen

  // 参数处理
  public async handle(
    inputs?: Input[],
    options?: Input[],
    extraFlags?: string[]
  ): Promise<void> {
    try {
      const type = (options.find((item) => item.name === 'type')?.value ||
        OpenType.LINK) as string
      const target = (options.find((item) => item.name === 'target')?.value ||
        '') as string
      const browser = (options.find((item) => item.name === 'browser')?.value ||
      'google chrome') as unknown as string

      await this.execOpen(type, target, browser)
    } catch (error) {
      throw error
    }
  }

  // 根据类型，进行打开操作
  private async execOpen(
    type: string,
    content: string,
    browser = 'google chrome'
  ): Promise<void> {
    try {
      switch (type) {
        case OpenType.FILE:
          await this._open.open(join(process.cwd(), content), { wait: true })
          break
        case OpenType.LINK:
          await this._open.open(content, {
            app: { name: browser },
            newInstance: false
          })
          break
        case OpenType.APP:
          await this._open.openApp(content)
          break
        default:
          Message.warn('打开类型 格式无效')
      }

      process.exit(1)
    } catch (error: any) {
      Message.fail('[Error]: ' + error.message)
    }
  }
}
