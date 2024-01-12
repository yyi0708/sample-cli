import { AbstractPackageManager } from './abstract.package-manager'
import { injectable, inject, AbstractRunner, TYPES } from 'IOC/index'
import { Runner } from '@/src/tools/utils'

@injectable()
export class PnpmPackageManager extends AbstractPackageManager {
  constructor(
    @inject(TYPES.LibRunnerType(Runner.PNPM)) protected runner: AbstractRunner
  ) {
    super(runner, {
      install: 'install --strict-peer-dependencies=false',
      add: 'install --strict-peer-dependencies=false',
      update: 'update',
      remove: 'uninstall',
      saveFlag: '--save',
      saveDevFlag: '--save-dev',
      silentFlag: '--reporter=silent',
      exec: 'pnpm dlx'
    })
  }
}
