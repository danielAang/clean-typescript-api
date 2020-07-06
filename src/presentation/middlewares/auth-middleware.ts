import { HttpRequest, HttpResponse, Middleware } from '../protocols'
import { ok, forbidden } from '../helpers/http/http-helper'
import { AccessForbiddenError } from '../errors'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByTokenStub: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (accessToken) {
      const account = await this.loadAccountByTokenStub.load(accessToken)
      if (account) {
        return ok({ accountId: account.id })
      }
    }
    return forbidden(new AccessForbiddenError())
  }
}
