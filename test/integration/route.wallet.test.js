import request from 'supertest'
import debugTest from '../../src/config/debug'
import Controller from '../../src/controllers/wallet'
import PrivateKey from '../../src/models/private-key'
import app from '../../src/config/express'
import ERROR_MESSAGES from '../../src/common/error-messages'
import mockRequest from '../helpers/mock-request'
import mockResponse from '../helpers/mock-response'
import MongoClient from '../../src/config/db'

const email = 'matias.barriosn@gmail.com'
const phone = '+56986698242'
describe('wallet route integration testing', () => {
  beforeAll(async () => {
    // Connect to database
    // setup database name to connect to different databases per test on mongo
    const options = { databaseName: 'test-route-wallet', appPort: 3005 }
    await new MongoClient(options).getInstance(app)
  })
  it('should not store the private key if either email or phone number are not sent', async () => {
    const body = { body: { email, phone } }
  })
  it('should not fetch the private key if either email or phone number are not sent', async () => {

  })
})
