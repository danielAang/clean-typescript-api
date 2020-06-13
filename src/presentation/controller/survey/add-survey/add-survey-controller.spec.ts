import { AddSurveyController } from './add-survey-controller'
import { HttpRequest } from './add-survey-controller-protocols'
import { Validation } from '../../../protocols'

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

describe('AddSurvey Controller', () => {
  test('Should call Validation with correct values', async () => {
    class ValidationStub implements Validation {
      validate (input: any): Error {
        return null
      }
    }
    const validationStub = new ValidationStub()
    const validationSpy = jest.spyOn(validationStub, 'validate')
    const sut = new AddSurveyController(validationStub)
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(validationSpy).toHaveBeenCalledWith(request.body)
  })
})
