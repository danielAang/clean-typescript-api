import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-encrypter-adapter'

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const salt: number = 12
    const sut = new BcryptAdapter(12)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
})
