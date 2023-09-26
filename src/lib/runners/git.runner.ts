import { AbstractRunner } from './abstract.runner'
import { injectable } from 'IOC/index'

@injectable()
export class GitRunner extends AbstractRunner {
  constructor() {
    super('git')
  }
}
