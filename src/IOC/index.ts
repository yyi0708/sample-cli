import { Container, interfaces } from 'inversify'
import { TYPES } from './types'
export { injectable, inject } from 'inversify'

import { commands, actions, library } from './moudle'


// 创建依赖注入容器
const container = new Container({
  skipBaseClassChecks: true
})

container.load(commands, actions, library)

// 导出容器和类型别名
export { container, TYPES }

// interface
export {
  IReader,
  IQuestion,
  AbstractRunner,
  IRunnerFactory,
  AbstractPackageManager,
  IPackageManagerFactory,
  IOpen,
  ICsvType
} from 'Lib/module'
