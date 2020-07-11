import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { Collection } from 'mongodb'

const accountMongoRespositoryFactory = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const makeSut = (): SurveyMongoRepository => {
  return accountMongoRespositoryFactory()
}

let surveyCollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('AddSurveyRepository Interface', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut()
      await sut.add({
        question: 'any_question',
        answers: [
          {
            answer: 'any_answer',
            img: 'any_image'
          },
          {
            answer: 'any_answer'
          }
        ],
        date: new Date()
      })
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('LoadSurveysRepository Interface', () => {
    test('Should load all surveys on success', async () => {
      await surveyCollection.insertMany([
        {
          question: 'any_question',
          answers: [
            {
              answer: 'any_answer',
              img: 'any_image'
            }
          ],
          date: new Date()
        },
        {
          question: 'other_question',
          answers: [
            {
              answer: 'other_answer',
              img: 'other_image'
            }
          ],
          date: new Date()
        }
      ])
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys).toHaveLength(2)
      expect(surveys[0].question).toBe('any_question')
    })
  })
})
