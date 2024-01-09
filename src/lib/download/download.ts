import { injectable } from 'IOC/index'
import { ensureFileSync } from 'fs-extra'
import { writeFileSync} from 'node:fs'
import { join } from 'path'
import download from 'download'
import downGitRepo from 'download-git-repo'
// const download = require('download')
// const downGitRepo = require('download-git-repo')
import ora from 'ora'
import { Message } from 'Lib/ui'

@injectable()
export class RemoteDownload implements Download.IDownlaod {
  // download file
  public async downloadFile(obj: {
    source: string
    path?: string
  }): Promise<void | Buffer> {
    try {
      const buffer: Buffer = await download(obj.source)

      if (!obj.path) return buffer
      ensureFileSync(obj.path)
      writeFileSync(obj.path, buffer)
    } catch (error) {
      console.log(error)
    }
  }

  // download multi file
  public async multiFilesDownload(obj: {
    source: string[]
    path?: string[]
  }): Promise<void | Buffer[]> {
    try {
      const buffer: Buffer[] = await Promise.all(
        obj.source.map(async (url, index) => {
          if (obj.path?.[index]) {
            ensureFileSync(obj.path?.[index])
            writeFileSync(obj.path?.[index], await download(url))
          }
          return download(url)
        })
      )

      if (!obj.path || obj.path.length === 0) return buffer
    } catch (error) {
      console.log(error)
    }
  }

  // downlaod git repo
  public async downloadRepo(params: Download.RepoParams): Promise<string> {
      const spinner = ora({
        spinner: {
          interval: 120,
          frames: ['▹▹▹▹▹', '▸▹▹▹▹', '▹▸▹▹▹', '▹▹▸▹▹', '▹▹▹▸▹', '▹▹▹▹▸']
        },
        text: Message.Package_manager_installation_in_progress
      })
      spinner.start()

      const { repository, destination, options } = params
      const path = join(process.cwd(), destination ?? '')

      await new Promise((resolve, reject) => {
        downGitRepo(repository, path, options ?? { clone: false }, err => {
          if (err) return reject(err)
          resolve(null)
        })
      })

      spinner.succeed()

      return path
  }
}
