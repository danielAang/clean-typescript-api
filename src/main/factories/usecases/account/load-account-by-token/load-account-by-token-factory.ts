import env from '@/main/config/env'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { DbLoadAccountByToken } from '@/data/usecases/load-account-by-token/db-load-account-by-token'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter'
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'

export const makeLoadAccountByToken = (): LoadAccountByToken => {
  const accountMongoRepository = new AccountMongoRepository()
  const decrypter = new JwtAdapter(env.jwtSecret)
  const loadAccountByToken = new DbLoadAccountByToken(decrypter, accountMongoRepository)
  return loadAccountByToken
}
