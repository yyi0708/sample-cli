import { Command } from 'commander'
import { Commands } from 'Types/command'
import { TYPES, injectable, inject, IQuestion, IReader } from 'IOC/index'
import { apps } from 'open'
import fuzzy from 'fuzzy'

enum OpenType {
  FILE = 'file',
  LINK = 'link',
  APP = 'app'
}

enum OpenStrategy {
  TEMP = 'templete',
  TOOL = 'tool'
}

type OptionParmas = 'file' | 'source' | 'target' | 'listType' | 'doc'

@injectable()
export class OpenCommand implements Commands.ICommand {
  @inject(TYPES.LibQuestion) private _question: IQuestion
  @inject(TYPES.LibReader) private _reader: IReader
  private _configOpenData: Config.UserConfig['open'] = { template: [] }

  constructor(
    @inject(TYPES.ActionOpen) private action: OpenIAction,
    @inject(TYPES.LibConfig) private _config: Config.IConfig
  ) {
    this.init()
  }
  // 初始化
  private async init() {
    this._configOpenData = await this._config.getConfig('open')
  }

  public load(program: Command): void {
    program
      .command('open')
      .alias('o')
      .description('Quickly open link. Include files,url,app')
      .option('-f, --file [file]', 'Where is config file.')
      .option('-s, --source [source]', 'Open what type of resource.', 'link')
      .option('-t, --target [target]', 'Normal templete urls.')
      .option(
        '-l, --listType [templete]',
        'what way is templete lists show.',
        'search'
      )
      .option('-d, --doc [show doc]', 'what way is templete lists show.')
      .action(async (command: Record<OptionParmas, any>) => {
        try {
          const options: Input[] = []

          // 路径参数有值
          if (command.target) {
            options.push({ name: 'type', value: command.source })
            options.push({ name: 'target', value: command.target })

            await this.action.handle([], options)
          } else {
            // 策略问题：1位模版展示，2则工具打开
            const answers = await this.getQuestionAnswers()

            if (answers.strategy === OpenStrategy.TEMP) {
              const path = await this.getTempleteQuestionAnswers(
                command.listType,
                !!command.doc
              )

              options.push({ name: 'target', value: path })

              await this.action.handle([], options)
            } else {
              options.push({ name: 'type', value: answers.type })
              options.push({ name: 'target', value: answers.target })
              options.push({ name: 'browser', value: answers.browser })

              await this.action.handle([], options)
            }
          }
        } catch (err) {
          throw err
        }
      })
  }

  // 模版、工具的两类问题
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
            apps.chrome,
            apps.edge,
            apps.firefox,
            apps.browser,
            apps.browserPrivate
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

  // 获取当前目录的本地文件
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

  // 模板link问题
  private async getTempleteQuestionAnswers(
    listType = 'search',
    showDoc: boolean
  ) {
    try {
      // TODO: 搜索、列表 inquirer-file-tree-selection
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

      const raw = this._configOpenData.template.find(
        (v) => v.title === answers.title
      )

      return showDoc ? raw.doc : raw.link
    } catch (error) {
      throw error
    }
  }
  // 搜索🔍
  private searchLink(answers, input = '') {
    const titleList = this._configOpenData.template.map((item) => item.title)

    return new Promise((resolve) => {
      setTimeout(() => {
        const result = fuzzy.filter(input, titleList).map((el) => el.original)

        resolve(result)
      }, Math.random() * 470 + 30)
    })
  }
}
