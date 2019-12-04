import request from 'supertest'
import debugTest from '../src/config/debug'
import Controller from '../src/controllers/wallet'
import PrivateKey from '../src/models/private-key'
import app from '../src/config/express'
import initDB from '../src/config/db'
import mockRequest from './helpers/mock-request'
import mockResponse from './helpers/mock-response'

beforeAll(async () => {
  initDB(app)
  await PrivateKey.deleteMany({})
})

describe('Wallet controller unit tests', () => {
  const email = 'matias.barriosn@gmail.com'
  const phone = '+56986698242'
  const reqObject = { body: { email, phone } }
  const req = mockRequest(reqObject)
  const res = mockResponse()
  it('should store email and phone on the private-key collection', async () => {
    await Controller.createWallet(req, res)
    const storedKey = await PrivateKey.findOne({ email, phone })
    expect(storedKey.email).toBe(email)
    expect(storedKey.phone).toBe(phone)
  })
  it('should not store the same email or phone number twice', async () => {

  })
})
