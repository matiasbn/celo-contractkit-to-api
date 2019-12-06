import debugTest from '../../src/config/debug'
import Controller from '../../src/controllers/wallet'
import PrivateKey from '../../src/models/private-key'
import ERROR_MESSAGES from '../../src/common/error-messages'
import mockRequest from '../helpers/mock-request'
import mockResponse from '../helpers/mock-response'
import MongoClient from '../../src/config/db'

// Connect to database
// setup database name to connect to different databases per test on mongo
const options = { databaseName: 'test-controller-wallet' }
new MongoClient(options).getInstance()

let email
let phone


describe('wallet controller unit testing', () => {
  beforeAll(async () => {
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
      expect(storedKey.address).toBeDefined()
    })

    it('should not store the same email or phone number twice', async () => {
      // try with the same email and number
      let req = mockRequest({ body: { email, phone } })
      let res = mockResponse()
      await Controller.createWallet(req, res)
      let error = res.error.mock.calls[0]
      expect(error[1]).toBe(401)
      expect(error[0]).toBe(ERROR_MESSAGES.EMAIL_OR_PHONE_ALREADY_REGISTERED)

      // try with the same email but different phone
      req = mockRequest({ body: { email, phone: '0' } })
      res = mockResponse()
      await Controller.createWallet(req, res)
      // eslint-disable-next-line prefer-destructuring
      error = res.error.mock.calls[0]
      expect(error[1]).toBe(401)
      expect(error[0]).toBe(ERROR_MESSAGES.EMAIL_OR_PHONE_ALREADY_REGISTERED)

      // try with the same phone but different email
      req = mockRequest({ body: { email: 'm', phone } })
      res = mockResponse()
      await Controller.createWallet(req, res)
      // eslint-disable-next-line prefer-destructuring
      error = res.error.mock.calls[0]
      expect(error[1]).toBe(401)
      expect(error[0]).toBe(ERROR_MESSAGES.EMAIL_OR_PHONE_ALREADY_REGISTERED)
    })

    it('should return an object with email, phone and address fields when registering', async () => {
      const req = mockRequest({ body: { email: 'matias', phone: '1234' } })
      const res = mockResponse()
      await Controller.createWallet(req, res)
      const response = res.success.mock.calls[0][0]
      expect(response.email).toBe('matias')
      expect(response.phone).toBe('1234')
      expect(response.address).toBeDefined()
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

    it('should fetch an object with email, phone and address', async () => {
      // Fetch the wallet
      res = mockResponse()
      await Controller.fetchWallet(req, res)
      const response = res.success.mock.calls[0][0]
      expect(response.email).toBe(email)
      expect(response.phone).toBe(phone)
      expect(response.address).toBeDefined()
    })

    it('should throw 401 if private key is not present for stated email', async () => {
      // Fetch the wallet
      req = mockRequest({ body: { email: 'matias' } })
      res = mockResponse()
      await Controller.fetchWallet(req, res)
      const error = res.error.mock.calls[0]
      expect(error[1]).toBe(401)
      expect(error[0]).toBe(ERROR_MESSAGES.PRIVATE_KEY_NOT_FOUND)
    })
  })
})
