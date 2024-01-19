#!/usr/bin/env node
import 'reflect-metadata'

import { Command } from 'commander'
import pkg from '@/package.json'
import { CommandLoader } from 'Tools/utils/loader'
import { getDataSource, Project, ProjectType } from 'Tools/database'

const program = new Command()

const bootstrap = async () => {
  const AppDataSource = await getDataSource();
  
  const project = new Project()
  project.name = 'vite'
  project.content = 'npm create vite'
  project.type = ProjectType.ORDER

  await AppDataSource.manager.save(project)
  console.log("Photo has been saved. Photo id is", project.id)

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
