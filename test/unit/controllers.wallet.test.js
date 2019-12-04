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


describe('wallet controller unit testing', () => {
  beforeAll(async () => {
    initDB(app)
    email = 'matias.barriosn@gmail.com'
    phone = '+56986698242'
  })
  describe('createWallet unit tests', () => {
    beforeAll(async () => {
      await PrivateKey.deleteMany({})
    })

    it('should store email and phone on the private-key collection', async () => {
      const req = mockRequest({ body: { email, phone } })
      const res = mockResponse()
      await Controller.createWallet(req, res)
      const storedKey = await PrivateKey.findOne({ email, phone })
      expect(storedKey).not.toBeNull()
      expect(storedKey.email).toBe(email)
      expect(storedKey.phone).toBe(phone)
      expect(storedKey.privateKey).toBeDefined()
    })

    it('should not store the same email or phone number twice', async () => {
      // try with the same email and number
      let req = mockRequest({ body: { email, phone } })
      let res = mockResponse()
      await Controller.createWallet(req, res)
      expect(res.status).toBeCalledWith(401)
      expect(res.json).toBeCalledWith({ message: ERROR_MESSAGES.EMAIL_OR_PHONE_ALREADY_REGISTERED })

      // try with the same email but different phone
      req = mockRequest({ body: { email, phone: '0' } })
      res = mockResponse()
      await Controller.createWallet(req, res)
      expect(res.status).toBeCalledWith(401)
      expect(res.json).toBeCalledWith({ message: ERROR_MESSAGES.EMAIL_OR_PHONE_ALREADY_REGISTERED })

      // try with the same phone but different email
      req = mockRequest({ body: { email: 'm', phone } })
      res = mockResponse()
      await Controller.createWallet(req, res)
      expect(res.status).toBeCalledWith(401)
      expect(res.json).toBeCalledWith({ message: ERROR_MESSAGES.EMAIL_OR_PHONE_ALREADY_REGISTERED })
    })

    it('should not store the private key if either email or phone number are not sent', async () => {

    })
  })
  describe('fetchWallet unit tests', () => {
    let req
    let res
    beforeAll(async () => {
      await PrivateKey.deleteMany({})
      req = mockRequest({ body: { email, phone } })
      res = mockResponse()
      // Create a wallet
      await Controller.createWallet(req, res)
    })

    it('should fetch an object with email, phone and private key', async () => {
      // Fetch the wallet
      res = mockResponse()
      await Controller.fetchWallet(req, res)
      expect(res.status).toBeCalledWith(200)
      const response = res.json.mock.calls[0][0]
      expect(response.email).toBe(email)
      expect(response.phone).toBe(phone)
      expect(response.privateKey).toBeDefined()
    })
  })
})
