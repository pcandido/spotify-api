import request from 'supertest'
import app from '@main/config/app'
import { MongoHelper } from '@gateways/helpers/mogodb-helper'
import { Collection } from 'mongodb'


describe('POST /password-recovery', () => {

  const givenRoute = '/password-recovery'
  const givenEmail = 'any@email.com'
  let accountsCollection: Collection

  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
    await accountsCollection.insertOne({
      name: 'any name',
      email: givenEmail,
      password: '$2b$12$BQwxpEG4DiXrJIj7EvTiFOzbRlkctrKB9pgajOmhyqY1uXYfV4mAu',
    })
  })

  it('should return 400 if no email is provided', async () => {
    await request(app)
      .post(givenRoute)
      .send({})
      .expect(400)
  })

})