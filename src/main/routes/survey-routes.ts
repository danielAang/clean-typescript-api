import { Router } from 'express'
import { routesAdapter } from '@/main/adapters/express/express-adapter'
import { addSurveyControllerFactory } from '@/main/factories/controllers/survey/add-survey/add-survey-controller-factory'
import { loadSurveysControllerFactory } from '@/main/factories/controllers/survey/load-surveys/load-survey-controller-factory'
import { adminAuth, auth } from '@/main/middlewares'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, routesAdapter(addSurveyControllerFactory()))
  router.get('/surveys', auth, routesAdapter(loadSurveysControllerFactory()))
}
