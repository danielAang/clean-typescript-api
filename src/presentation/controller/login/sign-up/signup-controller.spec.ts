import { ServerError, EmailAlreadyUsedError } from '@/presentation/errors'
import { badRequest, ok, serverError, forbidden } from '@/presentation/helpers/http/http-helper'
import { HttpRequest } from '@/presentation/protocols'
import { SignupController } from '@/presentation/controller/login/sign-up/signup-controller'
import { AccountModel, AddAccount, AddAccountModel, Validation } from './signup-controller-protocols'
import { Authentication, AuthenticationModel } from '@/presentation/controller/login/sign-in/login-controller-protocols'

interface SutTypes {
  sut: SignupController
  addAccountStub: AddAccount
  validationStub: Validation
  authentication: Authentication
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

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticationStub()
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const authentication = makeAuthentication()
  const addAccountStub = makeAddAccountStub()
  const validationStub = makeValidationStub()
  const sut = new SignupController(addAccountStub, validationStub, authentication)
  return {
    sut,
    addAccountStub,
    validationStub,
    authentication
  }
}

describe('Signup Controller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(fakeRequestFactory())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async (add: AccountModel) => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle(fakeRequestFactory())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.handle(fakeRequestFactory())
    expect(httpResponse).toEqual(forbidden(new EmailAlreadyUsedError()))
  })

  test('Should return 200 if an valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(fakeRequestFactory())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = fakeRequestFactory()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error('any_field'))
    const httpResponse = await sut.handle(fakeRequestFactory())
    expect(httpResponse).toEqual(badRequest(new Error('any_field')))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authentication } = makeSut()
    const authSpy = jest.spyOn(authentication, 'auth')
    await sut.handle({
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    })
    expect(authSpy).toHaveBeenCalledWith({ email: 'any_email@mail.com', password: 'any_password' })
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authentication } = makeSut()
    jest.spyOn(authentication, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = await sut.handle({
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    })
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
