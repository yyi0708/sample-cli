import { ContainerModule, interfaces } from 'inversify'
import { TYPES } from '../types'

import { CreateAction, AddAction, OpenAction, InfoAction } from 'Actions/index'

export const actions = new ContainerModule((bind: interfaces.Bind,) => {
    bind<Actions.IAction>(TYPES.ActionAdd).to(AddAction)
    bind<Actions.IAction>(TYPES.ActionCreate).to(CreateAction)
    bind<Actions.IAction>(TYPES.ActionOpen).to(OpenAction)
    bind<Actions.IAction>(TYPES.ActionInfo).to(InfoAction)
})