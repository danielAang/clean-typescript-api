import { Router } from 'express'
import { routesAdapter } from '../adapters/express/express-adapter'
import { signupControllerFactory } from '../factories/signup/signup-factory'
import { loginControllerFactory } from '../factories/login/login-factory'

export default (router: Router): void => {
  router.post('/signup', routesAdapter(signupControllerFactory()))
  router.post('/login', routesAdapter(loginControllerFactory()))
}
