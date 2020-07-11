export interface SurveyModel {
  id: string
  question: string
  answers: SurveyAnswerModel[]
  date: Date
}

export interface SurveyAnswerModel {
  img?: string
  answer: string
}
