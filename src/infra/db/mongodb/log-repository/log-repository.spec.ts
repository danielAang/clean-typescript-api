import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'
import { LogMongoRepository } from './log-repository'

describe('Log Mongo Repository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should create an error log on success', async () => {
    const sut = new LogMongoRepository()
    await sut.logError('any_error')
    const countErrors = await errorCollection.countDocuments()
    expect(countErrors).toBe(1)
  })
})
