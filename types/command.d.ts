import type { Command } from 'commander'

declare namespace Commands {
  export interface ICommand {
    load(program: Command): void
  }
  export interface ICommandConstructor<T extends ICommand = ICommand> {
    new (action: Actions.IAction): T
  }
}
