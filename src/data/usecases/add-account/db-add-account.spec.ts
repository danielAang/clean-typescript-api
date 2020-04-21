import { DbAddAccount } from './db-add-account'

/* interface SutTypes {
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
} */

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    class EncrypterStub {
      async encrypt (value: string): Promise<string> {
        return await new Promise(resolve => resolve('encrypted_value'))
      }
    }

    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })
})
