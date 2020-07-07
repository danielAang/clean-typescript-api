import { loginValidationFactory } from './login-validation-factory'
import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '../../../../../validation/validators'
import { Validation } from '../../../../../presentation/protocols'
import { EmailValidator } from '../../../../../validation/protocols/email-validator'

jest.mock('../../../../../validation/validators/validation-composite')

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('LoginValidationFactory', () => {
  test('Should call ValidationComposite with all validations', () => {
    loginValidationFactory()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidatorStub()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
