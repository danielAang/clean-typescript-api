import { Router } from 'express'
import { routesAdapter } from '../adapters/express/express-adapter'
import { addSurveyControllerFactory } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'

export default (router: Router): void => {
  router.post('/surveys', routesAdapter(addSurveyControllerFactory()))
}
