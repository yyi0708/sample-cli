import { Runner } from '@/src/tools/utils'
import { AbstractPackageManager } from './abstract.package-manager'

export interface PackageManagerCommands {
  install: string
  add: string
  update: string
  remove: string
  saveFlag: string
  saveDevFlag: string
  silentFlag: string
  exec: string
}

export interface ProjectDependency {
  name: string
  version: string
}

export type IPackageManagerFactory = (name: Runner) => AbstractPackageManager
