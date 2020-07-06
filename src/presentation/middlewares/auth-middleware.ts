import { HttpRequest, HttpResponse, Middleware } from '../protocols'
import { ok, forbidden, serverError } from '../helpers/http/http-helper'
import { AccessForbiddenError } from '../errors'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByTokenStub: LoadAccountByToken,
    private readonly role: string
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const account = await this.loadAccountByTokenStub.load(accessToken, this.role)
        if (account) {
          return ok({ accountId: account.id })
        }
      }
      return forbidden(new AccessForbiddenError())
    } catch (error) {
      return serverError(error)
    }
  }
}
