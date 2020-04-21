import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-encrypter-adapter'

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const salt: number = 12
    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const salt: number = 12
    const sut = new BcryptAdapter(salt)
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async (value, salt) => {
      return new Promise(resolve => resolve('hash'))
    })
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash')
  })
})
