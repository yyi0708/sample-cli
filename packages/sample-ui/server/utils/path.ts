import { join } from 'path'
import { homedir } from 'os'

export const appConfigFilePath = join(
    homedir(),
    '.sample-cli',
    'app.config.json'
  )
  export const createConfigFilePath = join(
    homedir(),
    '.sample-cli',
    'create.config.json'
  )
  export const openConfigFilePath = join(
    homedir(),
    '.sample-cli',
    'open.config.json'
  )