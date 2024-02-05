import { Command } from 'commander'

import { Commands } from 'Types/command'
import { TYPES, injectable, inject, IQuestion, IReader, IOpen } from 'IOC/index'
import { getDataSource, Link, Like } from 'Tools/database'
import { Message } from 'Tools/ui'


enum OpenType {
  FILE = 'file',
  LINK = 'link',
  APP = 'app'
}

enum OpenStrategy {
  TEMP = 'templete',
  TOOL = 'tool'
}

type OptionParmas = 'range' | 'direct' | 'browser' | 'link' | 'doc'

@injectable()
export class OpenCommand implements Commands.ICommand {
  @inject(TYPES.LibQuestion) private _question: IQuestion
  @inject(TYPES.LibReader) private _reader: IReader
  @inject(TYPES.ActionOpen) private action: OpenIAction
  @inject(TYPES.LibOpen) private _open: IOpen

  private _configOpenData: Link[] = []


  /**
   * @function 加载命令逻辑
   * @param program 
   */
  public load(program: Command): void {
    program
      .command('open [name]')
      .alias('o')
      .description('Quickly open link.')
      .option('-l, --link [link]', 'Direct open Link.')
      .option('-r, --range [range]', 'Type specific query.')
      .option('-d, --direct [direct]', 'Direct open if it only is one.', true)
      .option('-doc, --doc [doc]', 'Document Links.', true)
      .option('-b, --browser [browser]', 'The support type is google chrome, firefox, edge, and browserPrivate.', 'google chrome')
      .action(async (name: string, command: Record<OptionParmas, any>) => {
        try {
          const { range, direct, browser, link, doc } = command
          let type = OpenType.LINK, target = link

          if (!link) {
            // 输入具体搜索值, 进行模糊搜索，还是权量
            if (name) {
              const list = await this.getLinkListByName(name, range)

              if (list.length) {
                this._configOpenData = list
              } else {
                Message.warn(`Oh～ ${name} is not found!`)
                process.exit(0)
              }
            } else {
              let list = []
              if (range) {
                list = await this.getLinkListByName(name, range)
              } else {
                list = await this.getLinkList()
              }

              if (list.length) {
                this._configOpenData = list
              } else {
                Message.warn(`Oh～ ${range} is not found!`)
                process.exit(0)
              }
            }

            // 若搜索结果存在一个，并且控制变量打开，则直接打开
            if (name && direct && this._configOpenData.length === 1) {
              target = doc ? (this._configOpenData[0].doc || this._configOpenData[0].link) : (this._configOpenData[0].link || this._configOpenData[0].doc)
            } else {
              const raw = await this.selectProject()

              target = doc ? (raw.doc || raw.link) : (raw.link || raw.doc)
            }
          }

          const options: Input[] = []
          options.push({ name: 'type', value: type })
          options.push({ name: 'target', value: target })
          options.push({ name: 'browser', value: browser })

          await this.action.handle([], options)
        } catch (err) {
          throw err
        }
      })
  }

  /**
   * @function 获取链接数据库的数据
   * @returns Link 数据
   */
  public async getLinkList(): Promise<Array<Link>> {
    const dataSource = await getDataSource()

    const links = await dataSource
      .getRepository(Link)
      .createQueryBuilder("link")
      .getMany()

    return links
  }


  /**
   * @function 获取链接数据库的数据
   * @returns Link 数据
   */
  public async getLinkListByName(name: string, type: string): Promise<Array<Link> | null> {
    const dataSource = await getDataSource()

    const param = Object.create({})

    if (type) param.belong = Like(`%${type}%`)
    if (name) param.title = Like(`%${name}%`)

    const links = await dataSource.manager.findBy(Link, param)

    return links
  }


  /**
   * @function 模版、工具的两类问题
   * @returns void
   */
  private async getQuestionAnswers() {
    try {
      const answers = await this._question.getQuestionAnswer([
        {
          type: 'list',
          name: 'strategy',
          message: 'What do you want to do?',
          choices: [
            { name: 'templete lists', value: OpenStrategy.TEMP },
            { name: 'tool support', value: OpenStrategy.TOOL }
          ]
        },
        {
          type: 'list',
          name: 'type',
          message: 'What type would you like to open resource?',
          choices: [
            { name: 'file', value: OpenType.FILE },
            { name: 'url', value: OpenType.LINK },
            { name: 'app', value: OpenType.APP }
          ],
          when: (content) => content.strategy === OpenStrategy.TOOL
        },
        {
          type: 'input',
          name: 'target',
          message: 'Input resource .',
          when: (content) =>
            content.type === OpenType.LINK || content.type === OpenType.APP
        },
        {
          type: 'rawlist',
          name: 'browser',
          message: 'Choose a browser',
          choices: [
            this._open.apps.chrome,
            this._open.apps.edge,
            this._open.apps.firefox,
            this._open.apps.browser
          ],
          when: (content) => content.type === OpenType.LINK
        },
        {
          type: 'rawlist',
          name: 'target',
          message: 'Choose a file',
          choices: async () => {
            return await this.getLocalFile()
          },
          when: (content) => content.type === OpenType.FILE
        }
      ])

      return answers
    } catch (error) {
      throw error
    }
  }

  /**
   * @function 获取当前目录的本地文件
   * @returns void
   */
  private async getLocalFile(path = '.'): Promise<Array<string>> {
    const alls = await this._reader.readdir(path)
    const files = alls
      .map((file) => {
        if (this._reader.isFileSync(file)) return file
        return null
      })
      .filter((file) => file)

    return files
  }

  /**
   * @function 模板link问题
   * @returns void
   */
  private async getTempleteQuestionAnswers(
    listType = 'search',
    showDoc: boolean
  ) {
    try {
      const answers = await this._question.getQuestionAnswer([
        {
          type: 'autocomplete',
          name: 'title',
          message: 'Please input your want to open what word.',
          searchText: 'We are searching the resource for you!',
          emptyText: 'Nothing found!',
          source: this.searchLink.bind(this)
        }
      ])

      const raw = this._configOpenData.find(
        (v) => v.title === answers.title
      )

      return showDoc ? raw.doc : raw.link
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
        message: 'Please input your want to open what word.',
        searchText: 'We are searching the resource for you!',
        emptyText: 'Nothing found!',
        source: this.searchLink.bind(this)
      }
    ])

    return this._configOpenData?.find((v) => v.title === answers.title)
  }
  /**
   * @function 搜索🔍
   * @param answers 
   * @param input 
   * @returns 
   */
  private searchLink(answers, input = '') {
    const titleList = this._configOpenData?.map((item) => item.title)

    return new Promise((resolve) => {
      setTimeout(() => {
        const result = this._question.fuzzy.filter(input, titleList).map((el) => el.original)

        resolve(result)
      }, Math.random() * 470 + 30)
    })
  }

}
