import request from 'supertest'
import app from '../config/app'
import env from '../config/env'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('POST /surveys', () => {
    test('Should return http 403 on addSurvey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [
            {
              answer: 'Answer 1',
              img: 'http://image-name.com'
            },
            {
              answer: 'Answer 1'
            }
          ]
        })
        .expect(403)
    })

    test('Should return http 204 on addSurvey with valid accessToken', async () => {
      const res = await accountCollection.insertOne({
        name: 'Daniel',
        email: 'danielsena04@gmail.com',
        password: '123',
        role: 'admin'
      })
      const id = res.ops[0]._id
      const token = sign({ id }, env.jwtSecret)
      await accountCollection.updateOne(
        { _id: id },
        { $set: { accessToken: token } }
      )

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', token)
        .send({
          question: 'Question',
          answers: [
            {
              answer: 'Answer 1',
              img: 'http://image-name.com'
            },
            {
              answer: 'Answer 1'
            }
          ]
        })
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return http 403 on loadSurvey without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })
  })
})
