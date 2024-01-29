import { Answers, QuestionCollection } from 'inquirer'
import fuzzy from 'fuzzy'

export interface ScAnswers extends Answers, Input {}

export interface IQuestion {
  fuzzy: typeof fuzzy
  getQuestionAnswer(tips: QuestionCollection): Promise<Answers>
}
