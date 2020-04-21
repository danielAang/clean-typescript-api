import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-encrypter-adapter'

const salt: number = 12

const bcryptAdapterFactory = (): BcryptAdapter => {
  const sut = new BcryptAdapter(salt)
  return sut
}

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const sut = bcryptAdapterFactory()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const sut = bcryptAdapterFactory()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async (value, salt) => {
      return new Promise(resolve => resolve('hash'))
    })
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash')
  })

  test('Should throw if bcrypt throws', async () => {
    const sut = bcryptAdapterFactory()
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.encrypt('any_value')
    await expect(promise).rejects.toThrow()
  })
})
