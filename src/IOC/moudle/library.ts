import { ContainerModule, interfaces } from 'inversify'
import { TYPES } from '../types'

import {
    RemoteDownload,
    FileSystemReader,
    IReader,
    IQuestion,
    QuestionAnswers,
    AbstractRunner,
    GitRunner,
    NpmRunner,
    PnpmRunner,
    YarnRunner,
    AbstractPackageManager,
    NpmPackageManager,
    YarnPackageManager,
    PnpmPackageManager,
    IOpen,
    Open,
    CsvFile,
    ICsvType
  } from 'Lib/module'
import { Runner } from '@/src/tools/utils'

export const library = new ContainerModule((bind: interfaces.Bind,) => {
    bind<Download.IDownlaod>(TYPES.LibDownload).to(RemoteDownload)
    bind<IReader>(TYPES.LibReader).to(FileSystemReader)
    // bind<Config.IConfig>(TYPES.LibConfig).to(UserConfig).inSingletonScope()
    bind<IQuestion>(TYPES.LibQuestion).to(QuestionAnswers)

    bind<AbstractRunner>(TYPES.AbstractRunner).to(AbstractRunner)
    bind<AbstractRunner>(`${TYPES.LibRunner}-${Runner.GIT}`).to(GitRunner)
    bind<AbstractRunner>(`${TYPES.LibRunner}-${Runner.NPM}`).to(NpmRunner)
    bind<AbstractRunner>(`${TYPES.LibRunner}-${Runner.YARN}`).to(YarnRunner)
    bind<AbstractRunner>(`${TYPES.LibRunner}-${Runner.PNPM}`).to(PnpmRunner)
    bind<interfaces.Factory<AbstractRunner>>(TYPES.LibRunnerFactory).toFactory<AbstractRunner>((context: interfaces.Context) => {
        return (name: any) => {
        const runner = context.container.get<AbstractRunner>(
            `${TYPES.LibRunner}-${name}`
        )
        return runner
        }
    })
    // package-manger
    bind<AbstractPackageManager>(TYPES.AbstractPackageManager).to(AbstractPackageManager)
    bind<AbstractPackageManager>(TYPES.LibPackageManager).to(NpmPackageManager).whenTargetNamed(Runner.NPM)
    bind<AbstractPackageManager>(TYPES.LibPackageManager).to(YarnPackageManager).whenTargetNamed(Runner.YARN)
    bind<AbstractPackageManager>(TYPES.LibPackageManager).to(PnpmPackageManager).whenTargetNamed(Runner.PNPM)
    bind<interfaces.Factory<AbstractPackageManager>>(
        TYPES.LibPackageManagerFactory
    ).toFactory<AbstractPackageManager>((context: interfaces.Context) => {
        return (name: any) => {
          const packageManager = context.container.getNamed<AbstractPackageManager>(
            TYPES.LibPackageManager,
            name
          )
          return packageManager
        }
      })

    // open
    bind<IOpen>(TYPES.LibOpen).to(Open)

    // csv
    bind<ICsvType>(TYPES.LibCsv).to(CsvFile)
})

export { IOpen, ICsvType }