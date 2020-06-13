import { AddSurveyController } from './add-survey-controller'
import { HttpRequest } from './add-survey-controller-protocols'
import { Validation } from '../../../protocols'

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
}

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      question: 'any_question',
      answers: [
        {
          img: 'any_image',
          answer: 'any_answer'
        }
      ]
    }
  }
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
  const validationStub = makeValidationStub()
  const sut = new AddSurveyController(validationStub)
  return {
    sut,
    validationStub
  }
}

describe('AddSurvey Controller', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validationSpy = jest.spyOn(validationStub, 'validate')
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(validationSpy).toHaveBeenCalledWith(request.body)
  })
})
