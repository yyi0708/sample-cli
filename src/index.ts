#!/usr/bin/env node

import { Command } from 'commander'
import pkg from '@/package.json'
import { CommandLoader } from '@/src/tools/utils/loader'

const program = new Command()

const bootstrap = async () => {
  program
    .version(pkg.version, '-v, --version', 'Output the current version.')
    .usage('<command> [options]')
    .helpOption('-h, --help', 'Output usage information.')

  await CommandLoader.load(program)

  program.parse(process.argv)

  if (!process.argv.slice(2).length) {
    program.outputHelp()
  }
}

bootstrap()
