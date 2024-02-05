import { Command } from 'commander'
import { Commands } from 'Types/command'
import { TYPES, injectable, inject } from 'IOC/index'
import { Message } from '@/src/tools/ui'

type OptionsType = 'dryRun' | 'skipInstall' | 'project' | 'template'

@injectable()
export class AddCommand implements Commands.ICommand {
  constructor(@inject(TYPES.ActionAdd) private action: Actions.IAction) {}
  public load(program: Command): void {
    program
      .command('add [moudle]')
      .alias('a')
      .description('Adds support for an external library.')
      .usage('<library> [options] [library-specific-options]')
      .action(async (moudle: string, command: Record<OptionsType, any>) => {
        try {
          const inputs: Input[] = []
          const options: Input[] = []

          inputs.push({
            name: 'moudle',
            value: moudle
          })

          await this.action.handle(inputs, options)
        } catch (error: any) {
          Message.fail('[Error]:' + error.message)
          process.exit(0)
        }
      })
  }
}
