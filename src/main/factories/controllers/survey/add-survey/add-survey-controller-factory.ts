import { AddSurveyController } from '@/presentation/controller/survey/add-survey/add-survey-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/usecases/decorator/log-controller-decorator-factory'
import { makeDbAddSurvey } from '@/main/factories/usecases/survey/add-survey/db-add-survey-factory'
import { addSurveyValidationFactory } from './add-survey-validation-factory'

export const addSurveyControllerFactory = (): Controller => {
  return makeLogControllerDecorator(new AddSurveyController(makeDbAddSurvey(), addSurveyValidationFactory()))
}
