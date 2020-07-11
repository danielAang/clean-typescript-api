import { Router } from 'express'
import { routesAdapter } from '../adapters/express/express-adapter'
import { addSurveyControllerFactory } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { middlewareAdapter } from '../adapters/express/express-middleware-adapter'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'
import { loadSurveysControllerFactory } from '../factories/controllers/survey/load-surveys/load-survey-controller-factory'

export default (router: Router): void => {
  const adminAuth = middlewareAdapter(makeAuthMiddleware('admin'))
  const auth = middlewareAdapter(makeAuthMiddleware())
  router.post('/surveys', adminAuth, routesAdapter(addSurveyControllerFactory()))
  router.get('/surveys', auth, routesAdapter(loadSurveysControllerFactory()))
}
