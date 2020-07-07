import { Controller } from '../../../../../presentation/protocols'
import { makeDbAddSurveyAccount } from '../../../usecases/survey/add-survey/db-add-survey-factory'
import { makeLogControllerDecorator } from '../../../usecases/decorator/log-controller-decorator-factory'
import { addSurveyValidationFactory } from './add-survey-validation-factory'
import { AddSurveyController } from '../../../../../presentation/controller/survey/add-survey/add-survey-controller'

export const addSurveyControllerFactory = (): Controller => {
  return makeLogControllerDecorator(new AddSurveyController(makeDbAddSurveyAccount(), addSurveyValidationFactory()))
}
