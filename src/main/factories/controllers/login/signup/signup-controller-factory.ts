import { SignupController } from '@/presentation/controller/login/sign-up/signup-controller'
import { Controller } from '@/presentation/protocols'
import { makeDbAddAccount } from '@/main/factories/usecases/account/add-account/db-add-account-factory'
import { makeDbAuthentication } from '@/main/factories/usecases/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '@/main/factories/usecases/decorator/log-controller-decorator-factory'
import { signupValidationFactory } from './signup-validation-factory'

export const signupControllerFactory = (): Controller => {
  return makeLogControllerDecorator(new SignupController(makeDbAddAccount(), signupValidationFactory(), makeDbAuthentication()))
}
