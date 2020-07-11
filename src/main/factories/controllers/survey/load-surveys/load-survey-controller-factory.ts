import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../usecases/decorator/log-controller-decorator-factory'
import { LoadSurveysController } from '../../../../../presentation/controller/survey/load-surveys/load-survey-controller'
import { makeDbLoadSurveys } from '../../../usecases/survey/load-surveys/db-load-survey-factory'

export const loadSurveysControllerFactory = (): Controller => {
  return makeLogControllerDecorator(new LoadSurveysController(makeDbLoadSurveys()))
}
