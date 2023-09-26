import { Answers, QuestionCollection } from 'inquirer'

export interface ScAnswers extends Answers, Input {}

export interface IQuestion {
  getQuestionAnswer(tips: QuestionCollection): Promise<Answers>
}
