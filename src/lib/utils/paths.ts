import { resolve, join } from 'path'
import os from 'os'

export const rootDir = resolve(__dirname, '..', '..')
export const commandRoot = resolve(rootDir, 'src', 'commands')
export const configRoot = resolve(rootDir, 'src', 'config')

// local config file
export const localDir = join(os.homedir(), '.sample-cli')
export const currentDirConfigFile = resolve(__dirname, 'sc.config.json')
export const appConfigFilePath = join(
  os.homedir(),
  '.sample-cli',
  'app.config.json'
)
export const createConfigFilePath = join(
  os.homedir(),
  '.sample-cli',
  'create.config.json'
)
export const openConfigFilePath = join(
  os.homedir(),
  '.sample-cli',
  'open.config.json'
)