import {
  QuestionCollection,
  PromptModule,
  createPromptModule,
  Answers
} from 'inquirer'
import inquirerPrompt from 'inquirer-autocomplete-prompt'
import { IQuestion } from './interface'
import { injectable } from 'IOC/index'

@injectable()
export class QuestionAnswers implements IQuestion {
  private _prompt: PromptModule

  constructor() {
    this._prompt = createPromptModule()
    this._prompt.registerPrompt('autocomplete', inquirerPrompt)
  }

  public async getQuestionAnswer(
    questions: QuestionCollection
  ): Promise<Answers> {
    const result = await this._prompt(questions)

    return result
  }
}
