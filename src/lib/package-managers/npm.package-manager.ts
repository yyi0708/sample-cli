import { AbstractPackageManager } from './abstract.package-manager'
import { injectable, inject, TYPES, AbstractRunner } from 'IOC/index'
import { Runner } from 'Lib/utils'

@injectable()
export class NpmPackageManager extends AbstractPackageManager {
  constructor(
    @inject(TYPES.LibRunnerType(Runner.NPM)) protected runner: AbstractRunner
  ) {
    super(runner, {
      install: 'install',
      add: 'install',
      update: 'update',
      remove: 'uninstall',
      saveFlag: '--save',
      saveDevFlag: '--save-dev',
      silentFlag: '--silent',
      exec: 'npx'
    })
  }
}
