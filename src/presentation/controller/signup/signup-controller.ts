import { ok, badRequest, serverError, forbidden } from '../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, AddAccount, Validation } from './signup-controller-protocols'
import { Authentication } from '../login/login-controller-protocols'
import { EmailAlreadyUsedError } from '../../errors'

export class SignupController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation
  private readonly authentication: Authentication

  constructor (addAccount: AddAccount, validation: Validation, authentication: Authentication) {
    this.addAccount = addAccount
    this.validation = validation
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body

      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      if (!account) {
        return forbidden(new EmailAlreadyUsedError())
      }

      const accessToken = await this.authentication.auth({
        email,
        password
      })
      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
