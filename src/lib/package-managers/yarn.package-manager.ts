import { AbstractPackageManager } from './abstract.package-manager'
import { injectable, inject, AbstractRunner, TYPES } from 'IOC/index'
import { Runner } from 'Lib/utils'

@injectable()
export class YarnPackageManager extends AbstractPackageManager {
  constructor(
    @inject(TYPES.LibRunnerType(Runner.YARN)) protected runner: AbstractRunner
  ) {
    super(runner, {
      install: 'install',
      add: 'add',
      update: 'upgrade',
      remove: 'remove',
      saveFlag: '',
      saveDevFlag: '-D',
      silentFlag: '--silent',
      exec: 'yarn dlx --yarn2'
    })
  }
}
