import { SignupController } from '../../../presentation/controller/signup/signup-controller'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { Controller } from '../../../presentation/protocols'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { signupValidationFactory } from './signup-validation-factory'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter'
import env from '../../config/env'

export const signupControllerFactory = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  const addAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const signupController = new SignupController(addAccount, signupValidationFactory(), dbAuthentication)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signupController, logMongoRepository)
}
