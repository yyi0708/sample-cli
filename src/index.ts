#!/usr/bin/env node

import { Command } from 'commander'
import pkg from '@/package.json'
import { CommandLoader } from 'Lib/utils/loader'
import { loadLocalBinCommandLoader, localBinExists } from 'Lib/utils'

const program = new Command()

const bootstrap = async () => {
  program
    .version(pkg.version, '-v, --version', 'Output the current version.')
    .usage('<command> [options]')
    .helpOption('-h, --help', 'Output usage information.')

  if (localBinExists()) {
    const localCommandLoader = loadLocalBinCommandLoader()
    await localCommandLoader.load(program)
  } else {
    await CommandLoader.load(program)
  }

  program.parse(process.argv)

  if (!process.argv.slice(2).length) {
    program.outputHelp()
  }
}

bootstrap()
