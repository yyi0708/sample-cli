import { ProjectDependency, PackageManagerCommands } from './interface'
import {
  inject,
  injectable,
  TYPES,
  IRunnerFactory,
  IReader,
  AbstractRunner
} from 'IOC/index'
import { normalizeToKebabOrSnakeCase } from 'Lib/utils'
import { Message } from 'Lib/ui'
import ora from 'ora'
import { join } from 'path'

@injectable()
export class AbstractPackageManager {
  @inject(TYPES.LibReader) private _fileRead: IReader
  @inject(TYPES.LibRunnerFactory) private _runnerFactory: IRunnerFactory

  constructor(
    protected runner: AbstractRunner,
    protected cli: PackageManagerCommands
  ) {}

  public async install(directory?: string) {
    const spinner = ora({
      spinner: {
        interval: 120,
        frames: ['▹▹▹▹▹', '▸▹▹▹▹', '▹▸▹▹▹', '▹▹▸▹▹', '▹▹▹▸▹', '▹▹▹▹▸']
      },
      text: Message.Package_manager_installation_in_progress
    })

    try {
      spinner.start()
      const commandArgs = `${this.cli.install} ${this.cli.silentFlag}`
      const collect = true
      const normalizedDirectory = directory
        ? normalizeToKebabOrSnakeCase(directory)
        : ''
      await this.runner.run(
        commandArgs,
        collect,
        this.runner.binary,
        join(process.cwd(), normalizedDirectory)
      )
      spinner.succeed()

      Message.sucess('Successfully install project dependencies!')
    } catch (error) {
      const commandToRun = this.runner.rawFullCommand(this.cli.install)
      Message.Package_manager_installation_failed(commandToRun)

      spinner.fail()
    }
  }

  public async version(): Promise<string> {
    const commandArguments = '--version'
    const collect = true
    return this.runner.run(commandArguments, collect) as Promise<string>
  }
  // 添加项目依赖
  public async addProduction(
    dependencies: string[],
    tag: string | string[] = 'latest'
  ) {
    const command: string = [this.cli.add, this.cli.saveFlag]
      .filter((i) => i)
      .join(' ')
    const args: string = dependencies
      .map(
        (dependency, index) =>
          `${dependency}@${typeof tag === 'string' ? tag : tag[index]}`
      )
      .join(' ')
    const spinner = ora({
      spinner: {
        interval: 120,
        frames: ['▹▹▹▹▹', '▸▹▹▹▹', '▹▸▹▹▹', '▹▹▸▹▹', '▹▹▹▸▹', '▹▹▹▹▸']
      },
      text: Message.Package_manager_installation_in_progress
    })
    spinner.start()

    try {
      await this.add(`${command} ${args}`)
      spinner.succeed()
      return true
    } catch {
      spinner.fail()
      return false
    }
  }
  public async addDevelopment(
    dependencies: string[],
    tag: string | string[] = 'latest'
  ) {
    const command: string = [this.cli.add, this.cli.saveDevFlag]
      .filter((i) => i)
      .join(' ')
    const args: string = dependencies
      .map(
        (dependency, index) =>
          `${dependency}@${typeof tag === 'string' ? tag : tag[index]}`
      )
      .join(' ')
    const spinner = ora({
      spinner: {
        interval: 120,
        frames: ['▹▹▹▹▹', '▸▹▹▹▹', '▹▸▹▹▹', '▹▹▸▹▹', '▹▹▹▸▹', '▹▹▹▹▸']
      },
      text: Message.Package_manager_installation_in_progress
    })
    spinner.start()

    try {
      await this.add(`${command} ${args}`)
      spinner.succeed()
      Message.sucess('Installation successful!')
      return true
    } catch {
      spinner.fail()
      Message.fail('Installation failure!')
      return false
    }
  }
  private async add(commandArguments: string) {
    await this.runner.run(commandArguments, true)
  }

  /**
   * @description 获取package.json的生产依赖包
   * @returns ProjectDependency[]
   */
  public async getProduction(): Promise<ProjectDependency[]> {
    const packageJsonContent = await this._fileRead.readJson<
      Record<string, any>
    >('package.json')
    const packageJsonDependencies: any = packageJsonContent.dependencies
    const dependencies = []

    for (const [name, version] of Object.entries(packageJsonDependencies)) {
      dependencies.push({ name, version })
    }

    return dependencies as ProjectDependency[]
  }
  /**
   * @description 获取package.json的开发依赖包
   * @returns ProjectDependency[]
   */
  public async getDevelopment(): Promise<ProjectDependency[]> {
    const packageJsonContent = await this._fileRead.readJson<
      Record<string, any>
    >('package.json')
    const packageJsonDevDependencies: any = packageJsonContent.devDependencies
    const dependencies = []

    for (const [name, version] of Object.entries(packageJsonDevDependencies)) {
      dependencies.push({ name, version })
    }

    return dependencies as ProjectDependency[]
  }

  // 更新依赖
  public async updateProduction(dependencies: string[]) {
    const commandArguments = `${this.cli.update} ${dependencies.join(' ')}`
    await this.update(commandArguments)
  }
  public async updateDevelopment(dependencies: string[]) {
    const commandArguments = `${this.cli.update} ${dependencies.join(' ')}`
    await this.update(commandArguments)
  }
  private async update(commandArguments: string) {
    const collect = true
    await this.runner.run(commandArguments, collect)
  }
  // 重置并更新依赖
  public async upgradeProduction(dependencies: string[], tag: string) {
    await this.deleteProduction(dependencies)
    await this.addProduction(dependencies, tag)
  }
  public async upgradeDevelopment(dependencies: string[], tag: string) {
    await this.deleteDevelopment(dependencies)
    await this.addDevelopment(dependencies, tag)
  }
  // 删除依赖
  public async deleteProduction(dependencies: string[]) {
    const command: string = [this.cli.remove, this.cli.saveFlag]
      .filter((i) => i)
      .join(' ')
    const args: string = dependencies.join(' ')
    await this.delete(`${command} ${args}`)
  }
  public async deleteDevelopment(dependencies: string[]) {
    const commandArguments = `${this.cli.remove} ${
      this.cli.saveDevFlag
    } ${dependencies.join(' ')}`
    await this.delete(commandArguments)
  }
  public async delete(commandArguments: string) {
    const collect = true
    await this.runner.run(commandArguments, collect)
  }

  public get name() {
    return this.runner.binary.toUpperCase()
  }

  // 运行pkg中scripts
  public async run(commandArguments: string) {
    return this.runner.run(`run ${commandArguments}`)
  }
  // 本地项目运行
  public async exec(
    commandArguments: string,
    isRemote = true,
    exe = this.cli.exec
  ) {
    if (isRemote) {
      await this.runner.run(commandArguments, false, exe)
    } else {
      await this.runner.run(commandArguments)
    }
  }
}
