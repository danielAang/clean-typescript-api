import { SignupController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { EmailValidator, AddAccount, AddAccountModel, AccountModel, Validation } from './signup-protocols'
import { HttpRequest } from '../../protocols'
import { ok, serverError, badRequest } from '../../helpers/http-helper'

interface SutTypes {
  signupController: SignupController
  emailValidatorStub: EmailValidator
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

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

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
  const emailValidatorStub = makeEmailValidatorStub()
  const addAccountStub = makeAddAccountStub()
  const validationStub = makeValidationStub()
  const signupController = new SignupController(emailValidatorStub, addAccountStub, validationStub)
  return {
    emailValidatorStub,
    signupController,
    addAccountStub,
    validationStub
  }
}

describe('Signup Controller', () => {
  test('Should return 400 when no name is provided', async () => {
    const { signupController } = signupFactory()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await signupController.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  test('Should return 400 when no email is provided', async () => {
    const { signupController } = signupFactory()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await signupController.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 when no password is provided', async () => {
    const { signupController } = signupFactory()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await signupController.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if no passwordConfirmation is provided', async () => {
    const { signupController } = signupFactory()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password'
      }
    }
    const httpResponse = await signupController.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })

  test('Should return 400 if no passwordConfirmation fails', async () => {
    const { signupController } = signupFactory()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }
    const httpResponse = await signupController.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { signupController, emailValidatorStub } = signupFactory()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await signupController.handle(fakeRequestFactory())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should call email validator with correct email', async () => {
    const { signupController, emailValidatorStub } = signupFactory()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await signupController.handle(fakeRequestFactory())
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { signupController, emailValidatorStub } = signupFactory()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce((email: string) => {
      throw new Error()
    })
    const httpResponse = await signupController.handle(fakeRequestFactory())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

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
})
