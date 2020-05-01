import { SignupController } from './signup'
import { ServerError } from '../../errors'
import { AddAccount, AddAccountModel, AccountModel, Validation } from './signup-protocols'
import { HttpRequest } from '../../protocols'
import { ok, serverError, badRequest } from '../../helpers/http-helper'

interface SutTypes {
  signupController: SignupController
  addAccountStub: AddAccount
  validationStub: Validation
}

const fakeRequestFactory = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    name: 'any_name',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const fakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeAddAccountStub = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve(fakeAccount()))
    }
  }
  return new AddAccountStub()
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const signupFactory = (): SutTypes => {
  const addAccountStub = makeAddAccountStub()
  const validationStub = makeValidationStub()
  const signupController = new SignupController(addAccountStub, validationStub)
  return {
    signupController,
    addAccountStub,
    validationStub
  }
}

describe('Signup Controller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { signupController, addAccountStub } = signupFactory()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await signupController.handle(fakeRequestFactory())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { signupController, addAccountStub } = signupFactory()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async (add: AccountModel) => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await signupController.handle(fakeRequestFactory())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 200 if an valid data is provided', async () => {
    const { signupController } = signupFactory()
    const httpResponse = await signupController.handle(fakeRequestFactory())
    expect(httpResponse).toEqual(ok(fakeAccount()))
  })

  test('Should call Validation with correct values', async () => {
    const { signupController, validationStub } = signupFactory()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = fakeRequestFactory()
    await signupController.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if validation returns an error', async () => {
    const { signupController, validationStub } = signupFactory()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error('any_field'))
    const httpResponse = await signupController.handle(fakeRequestFactory())
    expect(httpResponse).toEqual(badRequest(new Error('any_field')))
  })
})
