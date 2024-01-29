import { Command } from 'commander'

import { Commands } from 'Types/command'
import { TYPES, injectable, inject, IQuestion } from 'IOC/index'
import { Message } from 'Tools/ui'
import { getDataSource, Project } from 'Tools/database'

@injectable()
export class CreateCommand implements Commands.ICommand {
  @inject(TYPES.ActionCreate) private action: Actions.IAction
  @inject(TYPES.LibQuestion) private _question: IQuestion
  private _configData: Array<Project> = []

  /**
   * @function 加载命令逻辑
   * @param program 
   */
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
          this._configData = await this.getProjectList()
          
          const inputs: Input[] = []
          const options: Input[] = []

          const { directory } = command
          options.push({ name: 'directory', value: directory })

          const templateItem = this.getTemplateItem(
            project,
            this._configData
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
            const raw = await this.selectProject()

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

  /**
   * @function 获取项目数据库的数据
   * @returns Project 数据
   */
  public async getProjectList(): Promise<Array<Project>> {
    const dataSource = await getDataSource()

    const projects = await dataSource
      .getRepository(Project)
      .createQueryBuilder("project")
      .getMany()
    return projects
  }

  /**
   * @function 根据输入，返回数据项
   * @param name 对比字段
   * @param list 数据列表
   * @returns 数据列
   */
  private getTemplateItem(
    name: string,
    list: Array<Project>
  ): Project | undefined {
    return list.find((item) => item.name === name)
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

    return this._configData?.find((v) => v.name === answers.title)
  }
  /**
   * @function 搜索🔍
   * @param answers 
   * @param input 
   * @returns 
   */
  private searchLink(answers, input = '') {
    const titleList = this._configData?.map((item) => item.name)

    return new Promise((resolve) => {
      setTimeout(() => {
        const result = this._question.fuzzy.filter(input, titleList).map((el) => el.original)

        resolve(result)
      }, Math.random() * 470 + 30)
    })
  }
}
