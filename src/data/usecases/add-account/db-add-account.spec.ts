import { DbAddAccount } from './db-add-account'
import { Hasher, AccountModel, AddAccountModel, AddAccountRepository } from './db-add-account-protocols'

interface SutTypes {
  hasherStub: Hasher
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
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }

  class AddAccountRepository implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve(fakeAccount()))
    }
  }

  const hasherStub = new HasherStub()
  const addAccountRepositoryStub = new AddAccountRepository()
  const dbAddAccount = new DbAddAccount(hasherStub, addAccountRepositoryStub)
  return {
    hasherStub,
    dbAddAccount,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { dbAddAccount, hasherStub } = dbAddAccountFactory()
    const encryptSpy = jest.spyOn(hasherStub, 'hash')
    await dbAddAccount.add(fakeAccountData())
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if encrypter throws', async () => {
    const { dbAddAccount, hasherStub } = dbAddAccountFactory()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
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
