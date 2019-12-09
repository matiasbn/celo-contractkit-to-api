import request from 'supertest'
import debugTest from '../../src/config/debug'
import PrivateKey from '../../src/models/private-key'
import app from '../../src/config/express'
import ERROR_MESSAGES from '../../src/common/error-messages'
import MongoClient from '../../src/config/db'

// Connect to database
// setup database name to connect to different databases per test on mongo

let email
let phone


describe('balance route integration testing', () => {
  beforeAll(async () => {
    const options = { databaseName: 'test-route-balance', appPort: 3006 }
    await new MongoClient(options).getInstance(app)
  })
  it('should not store the private key if either email or phone number are not sent', async () => {

  })
  it('should not fetch the private key if either email or phone number are not sent', async () => {

  })
})
