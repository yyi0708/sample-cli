import { AbstractRunner } from './abstract.runner'
import { injectable } from 'IOC/index'

@injectable()
export class YarnRunner extends AbstractRunner {
  constructor() {
    super('yarn')
  }
}
