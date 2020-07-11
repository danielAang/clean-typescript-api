import { LoginController } from '@/presentation/controller/login/sign-in/login-controller'
import { ok, badRequest, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
import { Validation, HttpRequest, Authentication } from '@/presentation/controller/login/sign-in/login-controller-protocols'
import { AuthenticationModel } from '@/domain/usecases/authentication'

type SutTypes = {
  sut: LoginController
  authentication: Authentication
  validation: Validation
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
  const validation = makeValidationStub()
  const sut = new LoginController(authentication, validation)
  return {
    sut,
    authentication,
    validation
  }
}

const makeFakeRequest = (): HttpRequest => {
  return ({
    body: {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  })
}

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authentication } = makeSut()
    const authSpy = jest.spyOn(authentication, 'auth')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'any_email@mail.com', password: 'any_password' })
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authentication } = makeSut()
    jest.spyOn(authentication, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authentication } = makeSut()
    jest.spyOn(authentication, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validation } = makeSut()
    const validateSpy = jest.spyOn(validation, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if validation returns an error', async () => {
    const { sut, validation } = makeSut()
    jest.spyOn(validation, 'validate').mockReturnValueOnce(new Error('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_field')))
  })
})
