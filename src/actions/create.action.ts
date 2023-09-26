import { injectable, inject, TYPES, IPackageManagerFactory } from 'IOC/index'
import { Message } from 'Lib/ui'
import { Runner } from 'Lib/utils'

@injectable()
export class CreateAction implements Actions.IAction {
  @inject(TYPES.LibPackageManagerFactory) private _packageManagerFactory: IPackageManagerFactory
  @inject(TYPES.LibDownload) private _downloader: Download.IDownlaod

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
      const packageManager = await this._packageManagerFactory(Runner.NPM)

      // verify command line.
      const flags = ['npm', 'npx']
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
