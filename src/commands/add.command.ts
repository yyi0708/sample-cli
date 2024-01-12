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
      .command('add')
      .alias('a')
      .description('Adds support for an external library.')
      .option('-t, --template [template]', 'Input build-in template.')
      .option(
        '-d, --dry-run [dryRun]',
        'Report actions that would be performed without writing out results.'
      )
      .option(
        '-s, --skip-install [skipInstall]',
        'Skip package installation.',
        false
      )
      .option('-p, --project [project]', 'Project in which to generate files.')
      .usage('<library> [options] [library-specific-options]')
      .action(async (command: Record<OptionsType, any>) => {
        try {
          const options: Input[] = []
          const { dryRun, project, skipInstall, template } = command

          options.push({ name: 'template', value: template })
          options.push({ name: 'dry-run', value: !!dryRun })
          options.push({ name: 'skip-install', value: skipInstall })
          options.push({
            name: 'project',
            value: project
          })

          await this.action.handle([], options)
        } catch (error: any) {
          Message.fail('[Error]:' + error.message)
          process.exit(1)
        }
      })
  }
}
