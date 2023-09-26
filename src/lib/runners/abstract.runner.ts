import { SpawnOptions, ChildProcess } from 'child_process'
import { spawn } from 'cross-spawn'
import { Message } from 'Lib/ui'
import { Runner } from 'Lib/utils'
import { injectable } from 'IOC/index'

@injectable()
export class AbstractRunner {
  constructor(public binary: string, protected args: string[] = []) {}

  public async run(
    command: string,
    collect = false,
    binary = this.binary,
    cwd: string = process.cwd()
  ): Promise<null | string> {
    const args: string[] = [command]
    const options: SpawnOptions = {
      cwd,
      stdio: collect ? 'pipe' : 'inherit',
      shell: true
    }
    return new Promise<null | string>((resolve, reject) => {
      const child: ChildProcess = spawn(
        `${binary}`,
        [...this.args, ...args],
        options
      )
      if (collect) {
        child.stdout!.on('data', (data) =>
          resolve(data.toString().replace(/\r\n|\n/, ''))
        )
      }
      child.on('close', (code) => {
        if (code === 0) {
          resolve(null)
        } else {
          Message.Runner_execution_error(`${this.binary} ${command}`)
          reject()
        }
      })
    })
  }

  /**
   * @param command
   * @returns The entire command that will be ran when calling `run(command)`.
   */
  public rawFullCommand(command: string): string {
    const commandArgs: string[] = [...this.args, command]
    return `${this.binary} ${commandArgs.join(' ')}`
  }
}

export type IRunnerFactory = (name: Runner) => AbstractRunner
