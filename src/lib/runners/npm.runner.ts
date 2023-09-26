import { AbstractRunner } from './abstract.runner'
import { injectable } from 'IOC/index'

@injectable()
export class NpmRunner extends AbstractRunner {
  constructor() {
    super('npm')
  }
}
