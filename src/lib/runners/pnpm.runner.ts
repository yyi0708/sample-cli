import { AbstractRunner } from './abstract.runner'
import { injectable } from 'IOC/index'

@injectable()
export class PnpmRunner extends AbstractRunner {
  constructor() {
    super('pnpm')
  }
}
