import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/encrypter'

interface SutTypes {
  encrypterStub: Encrypter
  dbAddAccount: DbAddAccount
}

const dbAddAccountFactory = (): SutTypes => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('encrypted_value'))
    }
  }

  const encrypterStub = new EncrypterStub()
  const dbAddAccount = new DbAddAccount(encrypterStub)
  return {
    encrypterStub,
    dbAddAccount
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { dbAddAccount, encrypterStub } = dbAddAccountFactory()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await dbAddAccount.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('Should throw if encrypter throws', async () => {
    const { dbAddAccount, encrypterStub } = dbAddAccountFactory()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const accountPromise = dbAddAccount.add(accountData)
    await expect(accountPromise).rejects.toThrow()
  })
})
