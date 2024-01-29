#!/usr/bin/env node
import 'reflect-metadata'

import { Command } from 'commander'
import pkg from '@/package.json'
import { CommandLoader } from 'Tools/utils/loader'
import { getDataSource, AsyncModule } from 'Tools/database'

const program = new Command()

const bootstrap = async () => {
  // const AppDataSource = await getDataSource();

  // const AppDataSource1 = await getDataSource();

  // const asyncModule = new AsyncModule()
  // asyncModule.name = 'Jest'
  // asyncModule.snippet_code = `import type {Config} from 'jest';

  // const config: Config = {
  //   verbose: true,
  // };
  
  // export default config;
  // `
  // asyncModule.snippet_name = 'jest.config.ts'
  // asyncModule.type = 'module'
  // asyncModule.depend = ['jest',
  // 'ts-jest',
  // '@types/jest',
  // '@types/node',
  // 'ts-node']

  // await AppDataSource.manager.save([asyncModule])
  // console.log("Photo has been saved. Photo id is", asyncModule.id)

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
