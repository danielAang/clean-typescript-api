import { Validation } from '../../presentation/protocols/validation'
import { InvalidParamError } from '../../presentation/errors'

export class CompareFieldValidation implements Validation {
  private readonly fieldName: string
  private readonly fieldToBeCompared: string

  constructor (fieldName: string, fieldToBeCompared: string) {
    this.fieldName = fieldName
    this.fieldToBeCompared = fieldToBeCompared
  }

  validate (input: any): Error {
    if (input[this.fieldName] !== input[this.fieldToBeCompared]) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
