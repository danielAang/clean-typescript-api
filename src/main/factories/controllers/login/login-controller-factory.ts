import { LoginController } from '../../../../presentation/controller/login/login-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '../../usecases/decorator/log-controller-decorator-factory'
import { loginValidationFactory } from './login-validation-factory'

export const loginControllerFactory = (): Controller => {
  return makeLogControllerDecorator(new LoginController(makeDbAuthentication(), loginValidationFactory()))
}
