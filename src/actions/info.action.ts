import {
  inject,
  injectable,
  TYPES,
  IReader,
  IPackageManagerFactory,
  AbstractPackageManager
} from 'IOC/index'
import osName from 'os-name'
import { platform, release } from 'os'
import { join } from 'path'
import { Message } from '@/src/tools/ui'
import { Runner } from '@/src/tools/utils'
// const cfonts = require('cfonts')
import cfonts from 'cfonts'

@injectable()
export class InfoAction implements Actions.IAction {
  @inject(TYPES.LibReader) private _reader: IReader
  @inject(TYPES.LibPackageManagerFactory)
  private _packageManagerFactory: IPackageManagerFactory

  public async handle(
    inputs?: Input[],
    options?: Input[],
    extraFlags?: string[]
  ): Promise<void> {
    this.displayBanner()
    await Promise.allSettled([
      this.displaySystemInformation(),
      this.displayPackageManagerVersion()
    ])
  }

  private displayBanner() {
    cfonts.say('Sample-cli!', {
      font: 'pallet', // define the font face
      align: 'left', // define text alignment
      colors: ['red', '#333'], // define all colors
      lineHeight: 0.5,
      gradient: true
    })
  }

  private async displaySystemInformation(): Promise<void> {
    Message.chalk({
      msg: {
        text: '[System Information]',
        color: 'green'
      }
    })

    await this.displayCliVersion()

    Message.chalk({
      prefix: {
        text: 'OS Version     :',
        color: 'blue'
      },
      msg: {
        text: osName(platform(), release()),
        color: 'yellow'
      }
    })

    Message.chalk({
      prefix: {
        text: 'NodeJS Version :',
        color: 'blue'
      },
      msg: {
        text: process.version,
        color: 'yellow'
      }
    })
  }

  private async displayPackageManagerVersion(): Promise<void> {
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

      Message.chalk({
        prefix: {
          text: `${packageManager.name} Version :`,
          color: 'blue'
        },
        msg: {
          text: await packageManager.version(),
          color: 'yellow'
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  private async displayCliVersion(): Promise<void> {
    const pkg = await this._reader.readJson<Record<string, any>>(
      join(process.cwd(), 'package.json'),
      true
    )

    Message.chalk({
      prefix: {
        text: '[SC Version]:',
        color: 'blue'
      },
      msg: {
        text: pkg.version,
        color: 'yellow'
      }
    })
  }
}
