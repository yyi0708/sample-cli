import {
  injectable,
  inject,
  TYPES,
  IQuestion,
  IPackageManagerFactory,
  AbstractPackageManager,
  IReader
} from 'IOC/index'
import {
  Runner
} from 'Tools/utils'
import { Message } from 'Tools/ui'
import { getDataSource, AsyncModule, Like } from 'Tools/database'
import { join } from 'node:path'
import { splitSymbol } from 'Tools/utils'

@injectable()
export class AddAction implements Actions.IAction {
  @inject(TYPES.LibReader) private _reader: IReader
  @inject(TYPES.LibQuestion) private _question: IQuestion
  @inject(TYPES.LibPackageManagerFactory) private _packageManagerFactory: IPackageManagerFactory
  @inject(TYPES.LibDownload) private _downloader: Download.IDownlaod

  private asyncModuleList: AsyncModule[] = []

  public async handle(
    inputs?: Input[],
    options?: Input[],
    extraFlags?: string[]
  ): Promise<void> {
    try {
      const moudle = inputs.find((item) => item.name === 'moudle')?.value as string

      if (moudle) {
        const list = await this.getSupportFunctionListByName(moudle)

        if (list.length) {
          this.asyncModuleList = list
        } else {
          Message.warn(`Oh～ ${moudle} is not found!`)
          process.exit(0)
        }
      } else {
        this.asyncModuleList = await this.getSupportFunctionList()
      }

      // 进入筛选
      const raw = await this.selectProject()
      const { type, depend, dev_depend, name, snippet_code, snippet_name, remote_address, scripts } = raw

      // 获取包管理器
      const packageManagerName = await this.getPackageManagerType()
      const packageManager: AbstractPackageManager = await this._packageManagerFactory(packageManagerName)

      // 根据类型进行额外操作
      if (type === 'module') {
        const isApply = await this._reader.pathExists('package.json')
        if (!isApply) throw new RangeError('package.json is not exist!')

        if (depend && depend.length) await packageManager.addProduction(depend)
        if (dev_depend && dev_depend.length) await packageManager.addDevelopment(dev_depend)

        // 安装代码片段
        if (snippet_code && snippet_name) {
          const content = snippet_code.split(splitSymbol)

          for(let index = 0; index < snippet_name.length; index++) {
            this._reader.writeFile(snippet_name[index], content[index])
          }
        }

        // 下载文件
        if (remote_address) {
          await this._downloader.downloadFile({
            path: join(process.cwd(), name),
            source: remote_address
          })
        }

      } else if (type === 'remote') {
        await this._downloader.downloadFile({
          path: join(process.cwd(), name),
          source: remote_address
        })
      } else if (type === 'snippet') {
        const content = snippet_code.split(splitSymbol)
          
        for(let index = 0; index < snippet_name.length; index++) {
          this._reader.writeFile(snippet_name[index], content[index])
        }
      } else {
        Message.fail('数据源类型错误！')
      }

      // 存在package.json, 命令存储设置
      if (scripts && scripts.length) {
        const isApply = await this._reader.pathExists('package.json')
        if (!isApply) throw new RangeError('package.json is not exist!')

        const json = await this._reader.readJson<Record<string, any>>(
          'package.json'
        )
        const val = Object.values(json.scripts).join()
        if (!val.includes('prettier')) {
          json.scripts[scripts[0]] = scripts[1]
          await this._reader.writeJson('package.json', json)
        }
      }

    } catch (error) {
      throw error
    }
  }

  /**
   * @function 获取模块数据库的数据
   * @returns Project 数据
   */
  public async getSupportFunctionList(): Promise<Array<AsyncModule>> {
    const dataSource = await getDataSource()

    const asyncModuleList = await dataSource
      .getRepository(AsyncModule)
      .createQueryBuilder("asyncModule")
      .getMany()

    return asyncModuleList
  }

  /**
   * @function 模糊查询，获取项目数据库的数据
   * @returns Project 数据
   */
  public async getSupportFunctionListByName(name: string): Promise<Array<AsyncModule> | null> {
    const dataSource = await getDataSource()

    const moudles = await dataSource.manager.findBy(AsyncModule, {
      name: Like(`%${name}%`)
    })
    return moudles
  }

  /**
   * @description 当前路径下，获取包管理器
   * @returns Runner
   */
  private async getPackageManagerType(): Promise<Runner> {
    try {
      const files = await this._reader.readdir('')

      if (files.findIndex((filename) => filename === 'yarn.lock') > -1) {
        return Runner.YARN
      } else if (
        files.findIndex((filename) => filename === 'pnpm-lock.yaml') > -1
      ) {
        return Runner.PNPM
      } else {
        return Runner.NPM
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * @description 获取执行路径的package.json文件是否ESM规范
   * @returns
   */
  private async formatIsESM(): Promise<boolean> {
    try {
      const json = await this._reader.readJson<{ type: string }>('package.json')

      return json.type === 'module'
    } catch (error) {
      throw error
    }
  }

  /**
   * @function 选择项目
   * @returns 
   */
  private async selectProject() {
    const answers = await this._question.getQuestionAnswer([
      {
        type: 'autocomplete',
        name: 'title',
        message: 'Please input your want what word.',
        searchText: 'We are searching the resource for you!',
        emptyText: 'Nothing found!',
        source: this.searchLink.bind(this)
      }
    ])

    return this.asyncModuleList?.find((v) => v.name === answers.title)
  }
  /**
   * @function 搜索🔍
   * @param answers 
   * @param input 
   * @returns 
   */
  private searchLink(answers, input = '') {
    const titleList = this.asyncModuleList?.map((item) => item.name)

    return new Promise((resolve) => {
      setTimeout(() => {
        const result = this._question.fuzzy.filter(input, titleList).map((el) => el.original)

        resolve(result)
      }, Math.random() * 470 + 30)
    })
  }
  
}

