import { DbAddAccount } from './db-add-account'
import { Encrypter, AccountModel, AddAccountModel, AddAccountRepository } from './db-add-account-protocols'

interface SutTypes {
  encrypterStub: Encrypter
  dbAddAccount: DbAddAccount
  addAccountRepositoryStub: AddAccountRepository
}

const fakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password'
})

const fakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

const dbAddAccountFactory = (): SutTypes => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }

  class AddAccountRepository implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(fakeAccount()))
    }
  }

  const encrypterStub = new EncrypterStub()
  const addAccountRepositoryStub = new AddAccountRepository()
  const dbAddAccount = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  return {
    encrypterStub,
    dbAddAccount,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { dbAddAccount, encrypterStub } = dbAddAccountFactory()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await dbAddAccount.add(fakeAccountData())
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if encrypter throws', async () => {
    const { dbAddAccount, encrypterStub } = dbAddAccountFactory()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountPromise = dbAddAccount.add(fakeAccountData())
    await expect(accountPromise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { dbAddAccount, addAccountRepositoryStub } = dbAddAccountFactory()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await dbAddAccount.add(fakeAccountData())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  test('Should throw if encrypter throws', async () => {
    const { dbAddAccount, addAccountRepositoryStub } = dbAddAccountFactory()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountPromise = dbAddAccount.add(fakeAccountData())
    await expect(accountPromise).rejects.toThrow()
  })

  test('Should return an Account on success', async () => {
    const { dbAddAccount } = dbAddAccountFactory()
    const account = await dbAddAccount.add(fakeAccountData())
    expect(account).toEqual(fakeAccount())
  })
})
