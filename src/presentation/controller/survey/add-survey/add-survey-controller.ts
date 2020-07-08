import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
  AddSurvey
} from './add-survey-controller-protocols'
import { badRequest, serverError, noContent } from '../../../helpers/http/http-helper'

export class AddSurveyController implements Controller {
  constructor (
    private readonly addSurvey: AddSurvey,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { question, answers } = httpRequest.body
      await this.addSurvey.add({
        question,
        answers
      })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
