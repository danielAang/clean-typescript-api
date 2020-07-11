import { Router } from 'express'
import { routesAdapter } from '../adapters/express/express-adapter'
import { addSurveyControllerFactory } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { loadSurveysControllerFactory } from '../factories/controllers/survey/load-surveys/load-survey-controller-factory'
import { adminAuth, auth } from '../middlewares'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, routesAdapter(addSurveyControllerFactory()))
  router.get('/surveys', auth, routesAdapter(loadSurveysControllerFactory()))
}
