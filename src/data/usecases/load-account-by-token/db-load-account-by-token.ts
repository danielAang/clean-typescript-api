import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { AccountModel } from '../../../domain/models/account'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async loadByToken (accessToken: string, role?: string): Promise<AccountModel> {
    const decryptedToken = await this.decrypter.decrypt(accessToken)
    if (decryptedToken) {
      await this.loadAccountByTokenRepository.loadByToken(decryptedToken, role)
    }
    return null
  }
}
