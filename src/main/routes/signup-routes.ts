import { Router } from 'express'
import { signupControllerFactory } from '../factories/signup/signup-factory'
import { routesAdapter } from '../adapters/express/express-adapter'

export default (router: Router): void => {
  router.post('/signup', routesAdapter(signupControllerFactory()))
}
