import { Command } from 'commander'
import { Commands } from 'Types/command'
import { TYPES, injectable, inject } from 'IOC/index'

@injectable()
export class InfoCommand implements Commands.ICommand {
  constructor(@inject(TYPES.ActionInfo) private action: Actions.IAction) {}
  public load(program: Command): void {
    program
      .command('info')
      .alias('i')
      .description('Display environment details.')
      .action(async () => {
        try {
          await this.action.handle()
        } catch (err) {
          process.exit(1)
        }
      })
  }
}
