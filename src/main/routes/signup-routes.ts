import { Router } from 'express'
import { signupControllerFactory } from '../factories/signup-factory'
import { routesAdapter } from '../adapters/express-adapter'

export default (router: Router): void => {
  router.post('/signup', routesAdapter(signupControllerFactory()))
}
