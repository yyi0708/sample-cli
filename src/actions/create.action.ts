import { injectable, inject, TYPES, IPackageManagerFactory, IReader, AbstractPackageManager } from 'IOC/index'
import { Message } from '@/src/tools/ui'
import { Runner } from '@/src/tools/utils'

@injectable()
export class CreateAction implements Actions.IAction {
  @inject(TYPES.LibPackageManagerFactory) private _packageManagerFactory: IPackageManagerFactory
  @inject(TYPES.LibDownload) private _downloader: Download.IDownlaod
  @inject(TYPES.LibReader) private _reader: IReader

  public async handle(
    inputs?: Input[],
    options?: Input[],
    extraFlags?: string[]
  ): Promise<void> {
    try {
      const name = inputs.find((item) => item.name === 'name')?.value as string

      const type = options.find((item) => item.name === 'type')?.value as string
      const content = options.find((item) => item.name === 'content')
        ?.value as string
      const tips = options.find((item) => item.name === 'tips')?.value as string
      const repoType = options.find((item) => item.name === 'repoType')?.value as string
      const directory = options.find((item) => item.name === 'directory')?.value as string

      if (type === 'order') {
        tips && Message.warn(tips)

        await this._execScripts(content)
      } else if (type === 'remote') {
        const repository = repoType ? `${repoType}:${content}` : content

        const path = await this._downloader.downloadRepo({
          repository,
          destination: directory ?? name
        })

        Message.sucess(path)
      }
    } catch (error) {
      throw error
    }
  }

  private async _execScripts(commandLine: string) {
    try {
      const files = await this._reader.readdir('.')
      let packageManager: AbstractPackageManager

      if (files.findIndex((filename) => filename === 'pnpm-lock.yaml') > -1) {
        packageManager = this._packageManagerFactory(Runner.PNPM)
      } else if (files.findIndex((filename) => filename === 'yarn.lock') > -1) {
        packageManager = this._packageManagerFactory(Runner.YARN)
      } else {
        packageManager = this._packageManagerFactory(Runner.NPM)
      }

      // const packageManager = await this._packageManagerFactory(Runner.NPM)

      // verify command line.
      const flags = ['npm', 'npx', 'pnpm', 'yarn']
      const status = flags.some((item) => commandLine.includes(item))
      if (!status)
        throw new TypeError('The command content format in the template is incorrect！')

      const index = commandLine.indexOf(' ')
      const exec = commandLine.slice(0, index)
      const commandArguments = commandLine.slice(index + 1)
      await packageManager.exec(commandArguments, false, exec)
    } catch (error) {
      throw error
    }
  }
}
