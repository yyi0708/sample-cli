import { ContainerModule, interfaces } from 'inversify'
import { Commands } from 'Types/command'
import { TYPES } from '../types'

import {
    CreateCommand,
    AddCommand,
    InfoCommand,
    OpenCommand,
    ConfigCommand
  } from 'Commands/index'

export const commands = new ContainerModule((bind: interfaces.Bind,) => {
    bind<Commands.ICommand>(TYPES.CommandCreate).to(CreateCommand)
    bind<Commands.ICommand>(TYPES.CommandAdd).to(AddCommand)
    bind<Commands.ICommand>(TYPES.CommandInfo).to(InfoCommand)
    bind<Commands.ICommand>(TYPES.CommandOpen).to(OpenCommand)
    bind<Commands.ICommand>(TYPES.CommandConfig).to(ConfigCommand)
})
