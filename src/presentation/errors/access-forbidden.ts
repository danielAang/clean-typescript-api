export class AccessForbiddenError extends Error {
  constructor () {
    super('Access forbidden')
    this.name = 'AccessForbiddenError'
  }
}
