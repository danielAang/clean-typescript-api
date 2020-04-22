import request from 'supertest'
import app from '../config/app'

describe('Signup Route', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Daniel',
        email: 'danielsena04@gmail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})
