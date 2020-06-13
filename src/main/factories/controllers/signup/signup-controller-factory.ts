import { SignupController } from '../../../../presentation/controller/login/sign-up/signup-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeDbAddAccount } from '../../usecases/add-account/db-add-account-factory'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '../../usecases/decorator/log-controller-decorator-factory'
import { signupValidationFactory } from './signup-validation-factory'

export const signupControllerFactory = (): Controller => {
  return makeLogControllerDecorator(new SignupController(makeDbAddAccount(), signupValidationFactory(), makeDbAuthentication()))
}
