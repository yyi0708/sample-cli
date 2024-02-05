import { resolve, join } from 'path'
import os from 'os'

// local config file
export const localDir = join(os.homedir(), 'sample-cli')
export const currentDirConfigFile = resolve(process.cwd(), 'sc.config.json')

export const appConfigFilePath = join(
  os.homedir(),
  'sample-cli',
  'app.config.json'
)

export const sqlitePath = join(
  os.homedir(),
  'sample-cli',
  'sample-cli.db'
)