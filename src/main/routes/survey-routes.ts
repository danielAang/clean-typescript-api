import { Router } from 'express'
import { routesAdapter } from '../adapters/express/express-adapter'
import { addSurveyControllerFactory } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { middlewareAdapter } from '../adapters/express/express-middleware-adapter'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export default (router: Router): void => {
  const adminAuth = middlewareAdapter(makeAuthMiddleware('admin'))
  router.post('/surveys', adminAuth, routesAdapter(addSurveyControllerFactory()))
}
