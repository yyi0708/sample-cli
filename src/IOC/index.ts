import 'reflect-metadata'
import { Container, interfaces } from 'inversify'
import { TYPES } from './types'
export { injectable, inject } from 'inversify'

import { AddAction, CreateAction, InfoAction, OpenAction } from '@/src/actions'
import {
  AddCommand,
  CreateCommand,
  InfoCommand,
  OpenCommand
} from '@/src/commands'
import {
  RemoteDownload,
  UserConfig,
  FileSystemReader,
  IReader,
  IQuestion,
  QuestionAnswers,
  AbstractRunner,
  IRunnerFactory,
  GitRunner,
  NpmRunner,
  PnpmRunner,
  YarnRunner,
  AbstractPackageManager,
  NpmPackageManager,
  YarnPackageManager,
  PnpmPackageManager,
  IPackageManagerFactory,
  IOpen,
  Open
} from 'Lib/module'
import { Commands } from 'Types/command'
import { Runner } from 'Lib/utils'

// 创建依赖注入容器
const container = new Container({
  skipBaseClassChecks: true
})

// action
container.bind<Actions.IAction>(TYPES.ActionCreate).to(CreateAction)
container.bind<Actions.IAction>(TYPES.ActionAdd).to(AddAction)
container.bind<Actions.IAction>(TYPES.ActionInfo).to(InfoAction)
container.bind<Actions.IAction>(TYPES.ActionOpen).to(OpenAction)

// command
container.bind<Commands.ICommand>(TYPES.CommandCreate).to(CreateCommand)
container.bind<Commands.ICommand>(TYPES.CommandAdd).to(AddCommand)
container.bind<Commands.ICommand>(TYPES.CommandInfo).to(InfoCommand)
container.bind<Commands.ICommand>(TYPES.CommandOpen).to(OpenCommand)

// lib
container.bind<Download.IDownlaod>(TYPES.LibDownload).to(RemoteDownload)
container.bind<IReader>(TYPES.LibReader).to(FileSystemReader)
container
  .bind<Config.IConfig>(TYPES.LibConfig)
  .to(UserConfig)
  .inSingletonScope()
// container.bind<Config.IConfig>(TYPES.LibConfig).toConstantValue(new UserConfig())
container.bind<IQuestion>(TYPES.LibQuestion).to(QuestionAnswers)
// runner
container.bind<AbstractRunner>(TYPES.AbstractRunner).to(AbstractRunner)
container.bind<AbstractRunner>(`${TYPES.LibRunner}-${Runner.GIT}`).to(GitRunner)
container.bind<AbstractRunner>(`${TYPES.LibRunner}-${Runner.NPM}`).to(NpmRunner)
container
  .bind<AbstractRunner>(`${TYPES.LibRunner}-${Runner.YARN}`)
  .to(YarnRunner)
container
  .bind<AbstractRunner>(`${TYPES.LibRunner}-${Runner.PNPM}`)
  .to(PnpmRunner)
container
  .bind<interfaces.Factory<AbstractRunner>>(TYPES.LibRunnerFactory)
  .toFactory<AbstractRunner>((context: interfaces.Context) => {
    return (name: any) => {
      const runner = context.container.get<AbstractRunner>(
        `${TYPES.LibRunner}-${name}`
      )
      return runner
    }
  })
// package-manger
container
  .bind<AbstractPackageManager>(TYPES.AbstractPackageManager)
  .to(AbstractPackageManager)
container
  .bind<AbstractPackageManager>(TYPES.LibPackageManager)
  .to(NpmPackageManager)
  .whenTargetNamed(Runner.NPM)
container
  .bind<AbstractPackageManager>(TYPES.LibPackageManager)
  .to(YarnPackageManager)
  .whenTargetNamed(Runner.YARN)
container
  .bind<AbstractPackageManager>(TYPES.LibPackageManager)
  .to(PnpmPackageManager)
  .whenTargetNamed(Runner.PNPM)
container
  .bind<interfaces.Factory<AbstractPackageManager>>(
    TYPES.LibPackageManagerFactory
  )
  .toFactory<AbstractPackageManager>((context: interfaces.Context) => {
    return (name: any) => {
      const packageManager = context.container.getNamed<AbstractPackageManager>(
        TYPES.LibPackageManager,
        name
      )
      return packageManager
    }
  })
// open
container.bind<IOpen>(TYPES.LibOpen).to(Open)

export { container, TYPES }

// interface
export {
  IReader,
  IQuestion,
  AbstractRunner,
  IRunnerFactory,
  AbstractPackageManager,
  IPackageManagerFactory,
  IOpen
}
