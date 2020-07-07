import { Router } from 'express'
import { routesAdapter } from '../adapters/express/express-adapter'
import { signupControllerFactory } from '../factories/controllers/login/signup/signup-controller-factory'
import { loginControllerFactory } from '../factories/controllers/login/login/login-controller-factory'

export default (router: Router): void => {
  router.post('/signup', routesAdapter(signupControllerFactory()))
  router.post('/login', routesAdapter(loginControllerFactory()))
}
