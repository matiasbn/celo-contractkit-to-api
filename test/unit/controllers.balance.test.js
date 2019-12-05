import debugTest from '../../src/config/debug'
import Controller from '../../src/controllers/balance'
import Wallet from '../../src/controllers/wallet'
import PrivateKey from '../../src/models/private-key'
import ERROR_MESSAGES from '../../src/common/error-messages'
import mockRequest from '../helpers/mock-request'
import mockResponse from '../helpers/mock-response'
import MongoClient from '../../src/config/db'

// setup database name to connect to different databases per test on mongo
process.env.DATABASE_NAME = 'test-controller-balance'

// Connect to database
new MongoClient(process.env.DATABASE_NAME).getInstance()


const email = 'matias.barriosn@gmail.com'
const phone = '+56986698242'
let req
let res
let privateKey
describe('balance controller unit testing', () => {
  describe('cusd unit tests', () => {
    beforeAll(async () => {
      await PrivateKey.deleteMany({})
      req = mockRequest({ body: { email, phone } })
      res = mockResponse()
      await Wallet.createWallet(req, res)
      privateKey = await PrivateKey.findOne({ email, phone })
    })
    it('should store a private key correctly', () => {
      expect(privateKey.email).toBe(email)
      expect(privateKey.phone).toBe(phone)
      expect(privateKey.privateKey).toBeDefined()
    })
  })
})
