export interface SurveyAnswer {
  img: string
  answer: string
}

export interface AddSurveyModel {
  question: string
  answers: SurveyAnswer[]
}

export interface AddSurvey {
  add (survey: AddSurveyModel): Promise<void>
}
