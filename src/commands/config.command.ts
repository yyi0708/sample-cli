import { Command } from 'commander'
import { Commands } from 'Types/command'
import { TYPES, injectable, inject, IQuestion } from 'IOC/index'
import { TempleteType, StrategyOptions } from 'Tools/utils'
import { join, extname } from 'node:path'
import { homedir } from 'node:os'

type OptionParmas = 'force'

@injectable()
export class ConfigCommand implements Commands.ICommand {
    @inject(TYPES.LibQuestion) private _question: IQuestion

    constructor(@inject(TYPES.ActionConfig) private action: Actions.IAction) {}

    public load(program: Command): void {
        program
        .command('config')
        .description('Config center.')
        .option('-f, --force [force]', 'If a name exists, force a replacement.', false)
        .action(async (command: Record<OptionParmas, any>) => {
            try {
                const { force } = command

                const answers = await this.getQuestionAnswers()

                const inputs: Input[] = []
                const options: Input[] = []

                inputs.push({ name: 'type', value: answers.type })
                inputs.push({ name: 'strategy', value: answers.strategy })
                inputs.push({ name: 'path', value: answers.path })
                options.push({ name: 'force', value: force })

                await this.action.handle(inputs, options)
            } catch (err) {
                process.exit(0)
            }
        })
    }

    /**
     * @function 问题流程
     * @returns void
     */
    private async getQuestionAnswers() {
        try {
            const answers = await this._question.getQuestionAnswer([
            {
                type: 'list',
                name: 'type',
                message: 'What type do you want to select?',
                choices: [
                    { name: '项目模版', value: TempleteType.PROJECT },
                    { name: '快捷链接', value: TempleteType.LINK },
                    { name: '增量模块', value: TempleteType.ASYNCMOUDLE },
                ]
            },
            {
                type: 'list',
                name: 'strategy',
                message: 'Do you want to import bulk?',
                choices: [
                    { name: '模版', value: StrategyOptions.TEMPLETE },
                    { name: '导入', value: StrategyOptions.IMPORT },
                    { name: '导出', value: StrategyOptions.EXPORT }
                ]
            },
            {
                type: 'input',
                name: 'path',
                message: 'Please enter the file path.',
                askAnswered: true,
                // default: join(homedir(), 'Desktop', 'demo.csv'),
                validate: function (input) {
                    if (input && extname(input) === '.csv') return true
                }
            },
            ])

            return answers
        } catch (error) {
            throw error
        }
    }
}
