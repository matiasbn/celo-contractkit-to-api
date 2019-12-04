import request from 'supertest'
import debugTest from '../../src/config/debug'
import Controller from '../../src/controllers/wallet'
import PrivateKey from '../../src/models/private-key'
import app from '../../src/config/express'
import initDB from '../../src/config/db'
import ERROR_MESSAGES from '../../src/common/error-messages'
import mockRequest from '../helpers/mock-request'
import mockResponse from '../helpers/mock-response'

let email
let phone


describe('wallet route integration testing', () => {
  it('should not store the private key if either email or phone number are not sent', async () => {

  })
})
