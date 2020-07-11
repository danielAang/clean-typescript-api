import { AddSurveyController } from '../../../../../presentation/controller/survey/add-survey/add-survey-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../usecases/decorator/log-controller-decorator-factory'
import { makeDbAddSurvey } from '../../../usecases/survey/add-survey/db-add-survey-factory'
import { addSurveyValidationFactory } from './add-survey-validation-factory'

export const addSurveyControllerFactory = (): Controller => {
  return makeLogControllerDecorator(new AddSurveyController(makeDbAddSurvey(), addSurveyValidationFactory()))
}
