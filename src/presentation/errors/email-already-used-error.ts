export class EmailAlreadyUsedError extends Error {
  constructor () {
    super('This email is already in use')
    this.name = 'InvalidParamError'
  }
}
