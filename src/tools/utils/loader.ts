import { Command } from 'commander'
import chalk from 'chalk'
import { ERROR_PREFIX } from '../ui'
import { container, TYPES } from 'IOC/index'
import { Commands } from 'Types/command'

export class CommandLoader {
  public static async load(program: Command): Promise<void> {
    container.get<Commands.ICommand>(TYPES.CommandCreate).load(program)
    container.get<Commands.ICommand>(TYPES.CommandAdd).load(program)
    container.get<Commands.ICommand>(TYPES.CommandInfo).load(program)
    container.get<Commands.ICommand>(TYPES.CommandOpen).load(program)
    container.get<Commands.ICommand>(TYPES.CommandConfig).load(program)

    this.handleInvalidCommand(program)
  }

  private static handleInvalidCommand(program: Command) {
    program.on('command:*', () => {
      console.error(
        `\n${ERROR_PREFIX} Invalid command: ${chalk.red('%s')}`,
        program.args.join(' ')
      )
      console.log(
        `See ${chalk.red('--help')} for a list of available commands.\n`
      )
      process.exit(0)
    })
  }
}
