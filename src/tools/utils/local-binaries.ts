import { pathExistsSync } from 'fs-extra/esm'
import { join, posix } from 'path'
import { CommandLoader } from './loader'

const localBinPathSegments = [process.cwd(), 'node_modules', 'sample-cli']

export function localBinExists() {
  return pathExistsSync(join(...localBinPathSegments))
}

export function loadLocalBinCommandLoader(): typeof CommandLoader {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const commandsFile = require(posix.join(...localBinPathSegments, 'utils'))
  return commandsFile.CommandLoader
}
