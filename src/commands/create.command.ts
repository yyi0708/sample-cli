import { Command } from 'commander'
import { Commands } from 'Types/command'
import { TYPES, injectable, inject, IQuestion } from 'IOC/index'
import { Message } from 'Lib/ui'
import fuzzy from 'fuzzy'

@injectable()
export class CreateCommand implements Commands.ICommand {
  @inject(TYPES.LibConfig) private _config: Config.IConfig
  @inject(TYPES.ActionCreate) private action: Actions.IAction
  @inject(TYPES.LibQuestion) private _question: IQuestion
  private _configData: Config.UserConfig['create']

  public load(program: Command): void {
    program
      .command('create <project>')
      .alias('c')
      .description('create application.')
      .option(
        '-dir, --directory [directory]',
        'Specify the destination directory'
      )
      .action(async (project: string, command: Record<string, any>) => {
        try {
          const inputs: Input[] = []
          const options: Input[] = []
          this._configData = await this._config.getConfig('create')

          const { directory } = command
          options.push({ name: 'directory', value: directory })

          const templateItem = this._getTemplateItem(
            project,
            this._configData.template
          )

          if (templateItem) {
            const { name, type, content, tips } = templateItem

            inputs.push({ name: 'name', value: name })
            options.push({ name: 'type', value: type })
            options.push({ name: 'content', value: content })
            options.push({ name: 'tips', value: tips })
          } else {
            Message.warn(
              `Oh～ ${project} is not found, Please select from the items below`
            )
            const raw = await this._selectProject()

            const { name, type, content, tips } = raw
            inputs.push({ name: 'name', value: name })
            options.push({ name: 'type', value: type })
            options.push({ name: 'content', value: content })
            options.push({ name: 'tips', value: tips })
          }

          await this.action.handle(inputs, options)
        } catch (err) {
          process.exit(1)
        }
      })
  }

  private _getTemplateItem(
    name: string,
    list: Config.UserConfig['create']['template']
  ): Template.CreateRow | undefined {
    return list.find((item) => item.name === name)
  }
  // 选择项目
  private async _selectProject() {
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

    return this._configData?.template.find((v) => v.name === answers.title)
  }
  // 搜索🔍
  private searchLink(answers, input = '') {
    const titleList = this._configData?.template.map((item) => item.name)

    return new Promise((resolve) => {
      setTimeout(() => {
        const result = fuzzy.filter(input, titleList).map((el) => el.original)

        resolve(result)
      }, Math.random() * 470 + 30)
    })
  }
}
